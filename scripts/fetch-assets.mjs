#!/usr/bin/env node
// Hydrates client/public/images with the real Rosales project photography.
//
// The photos were never committed to Git: the previous dev environment served
// them from /manus-storage/*, which does not exist on Railway. This script
// recovers each file from the first source that works, optimizes it for the
// web, and writes it to client/public/images under the exact name the site
// references. Run it from a machine with normal internet access:
//
//   pnpm fetch:assets                       # try every automatic source
//   pnpm fetch:assets --from-dir ~/fotos    # also look in a local folder
//   pnpm fetch:assets --check               # only report which files are real
//
// Sources, in order:
//   1. --from-dir <folder>: a local folder (searched recursively) containing
//      the files by final name, Manus key, or original WordPress name.
//   2. Manus/Forge storage, when BUILT_IN_FORGE_API_URL and
//      BUILT_IN_FORGE_API_KEY are set in the environment (the values from the
//      previous dev environment still work).
//   3. The public media library of the legacy WordPress site
//      (override with WP_ORIGIN, default https://rosaleslandscapingandconstruction.com).
//
// A committed placeholder is replaced whenever a real photo is recovered;
// placeholders carry the marker string below so real photography is never
// overwritten or misreported.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "client", "public", "images");
const MANIFEST = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "asset-manifest.json"), "utf-8"));
const PLACEHOLDER_MARKER = Buffer.from("rosales-placeholder");
const WP_ORIGIN = (process.env.WP_ORIGIN || "https://rosaleslandscapingandconstruction.com").replace(/\/+$/, "");

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const fromDirIndex = args.indexOf("--from-dir");
const fromDir = fromDirIndex !== -1 ? path.resolve(args[fromDirIndex + 1] || ".") : null;

function isPlaceholder(filePath) {
  if (!fs.existsSync(filePath)) return false;
  return fs.readFileSync(filePath).includes(PLACEHOLDER_MARKER);
}

function listFilesRecursive(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFilesRecursive(full));
    else out.push(full);
  }
  return out;
}

async function fetchBuffer(url, headers = {}) {
  const resp = await fetch(url, { headers, redirect: "follow" });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
  const buf = Buffer.from(await resp.arrayBuffer());
  if (buf.length < 1024) throw new Error(`Suspiciously small response (${buf.length} bytes) from ${url}`);
  return buf;
}

function findInLocalDir(asset) {
  if (!fromDir || !fs.existsSync(fromDir)) return null;
  const wanted = new Set([asset.file, asset.manusKey, asset.originalFile].map(name => name.toLowerCase()));
  const hit = listFilesRecursive(fromDir).find(file => wanted.has(path.basename(file).toLowerCase()));
  if (!hit) return null;
  return { buffer: fs.readFileSync(hit), source: `local file ${hit}` };
}

async function fetchFromForge(asset) {
  const forgeUrl = (process.env.BUILT_IN_FORGE_API_URL || "").replace(/\/+$/, "");
  const forgeKey = process.env.BUILT_IN_FORGE_API_KEY || "";
  if (!forgeUrl || !forgeKey) return null;
  const presign = new URL("v1/storage/presign/get", forgeUrl + "/");
  presign.searchParams.set("path", asset.manusKey);
  const resp = await fetch(presign, { headers: { Authorization: `Bearer ${forgeKey}` } });
  if (!resp.ok) throw new Error(`Forge presign failed: HTTP ${resp.status}`);
  const { url } = await resp.json();
  if (!url) throw new Error("Forge returned an empty signed URL");
  return { buffer: await fetchBuffer(url), source: "Manus/Forge storage" };
}

let wpMediaCache = null;
async function loadWordPressMedia() {
  if (wpMediaCache) return wpMediaCache;
  const media = [];
  for (let page = 1; page <= 10; page++) {
    const url = `${WP_ORIGIN}/wp-json/wp/v2/media?per_page=100&page=${page}&_fields=source_url`;
    const resp = await fetch(url, { headers: { Accept: "application/json" } });
    if (!resp.ok) break;
    const batch = await resp.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    media.push(...batch.map(item => item.source_url).filter(Boolean));
    if (batch.length < 100) break;
  }
  wpMediaCache = media;
  return media;
}

async function fetchFromWordPress(asset) {
  const wantedStem = asset.originalFile.replace(/\.[a-z0-9]+$/i, "").toLowerCase();
  const media = await loadWordPressMedia().catch(() => []);
  const match = media.find(url => {
    const stem = decodeURIComponent(path.basename(new URL(url).pathname)).replace(/\.[a-z0-9]+$/i, "").replace(/-scaled$/, "").toLowerCase();
    return stem === wantedStem;
  });
  if (!match) return null;
  return { buffer: await fetchBuffer(match), source: `WordPress media ${match}` };
}

async function optimize(buffer, asset) {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.warn(`  ! sharp is not installed (pnpm add -D sharp); saving ${asset.file} without optimization`);
    return buffer;
  }
  const image = sharp(buffer, { failOn: "none" }).rotate().resize({ width: asset.maxWidth, withoutEnlargement: true });
  if (asset.format === "png") return image.png({ compressionLevel: 9 }).toBuffer();
  return image.webp({ quality: 80 }).toBuffer();
}

async function recover(asset) {
  const attempts = [
    () => findInLocalDir(asset),
    () => fetchFromForge(asset),
    () => fetchFromWordPress(asset),
  ];
  for (const attempt of attempts) {
    try {
      const result = await attempt();
      if (result) return result;
    } catch (error) {
      console.warn(`  ! ${error instanceof Error ? error.message : error}`);
    }
  }
  return null;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const pending = [];
  const real = [];

  for (const asset of MANIFEST.assets) {
    const target = path.join(OUT_DIR, asset.file);
    if (fs.existsSync(target) && !isPlaceholder(target)) {
      real.push(asset.file);
      continue;
    }
    pending.push(asset);
  }

  console.log(`Assets with real photography already in place: ${real.length}/${MANIFEST.assets.length}`);
  if (checkOnly || pending.length === 0) {
    for (const asset of pending) console.log(`  · pending: ${asset.file} (${asset.label})`);
    process.exit(pending.length === 0 ? 0 : 1);
  }

  let failures = 0;
  for (const asset of pending) {
    console.log(`Recovering ${asset.file} — ${asset.label}`);
    const result = await recover(asset);
    if (!result) {
      failures++;
      console.error(`  ✗ no source available for ${asset.file}`);
      continue;
    }
    const optimized = await optimize(result.buffer, asset);
    fs.writeFileSync(path.join(OUT_DIR, asset.file), optimized);
    console.log(`  ✓ saved from ${result.source} (${Math.round(optimized.length / 1024)} KB)`);
  }

  if (failures > 0) {
    console.error(`\n${failures} asset(s) could not be recovered automatically.`);
    console.error("Provide the missing photos in a folder and re-run with: pnpm fetch:assets --from-dir <folder>");
    process.exit(1);
  }
  console.log("\nAll assets hydrated. Commit client/public/images so production serves the real photography.");
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
