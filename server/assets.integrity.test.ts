import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { assets } from "@/lib/site-content";
import { legacyAssetRedirects } from "./assetRedirects";

const root = path.resolve(import.meta.dirname, "..");
const clientSrc = path.join(root, "client", "src");
const publicDir = path.join(root, "client", "public");

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

describe("production asset integrity", () => {
  it("references no /manus-storage/ path anywhere in the client source", () => {
    const offenders = walk(clientSrc).filter(file => fs.readFileSync(file, "utf-8").includes("manus-storage"));
    expect(offenders).toEqual([]);
  });

  it("keeps index.html free of unreplaced %VITE_% placeholders", () => {
    const html = fs.readFileSync(path.join(root, "client", "index.html"), "utf-8");
    expect(html).not.toMatch(/%VITE_/);
  });

  it("serves every referenced asset from client/public/images", () => {
    for (const [name, url] of Object.entries(assets)) {
      expect(url, `assets.${name} must be a local /images path`).toMatch(/^\/images\//);
      const file = path.join(publicDir, url.replace(/^\//, ""));
      expect(fs.existsSync(file), `${url} referenced by assets.${name} is missing on disk`).toBe(true);
      expect(fs.statSync(file).size, `${url} must not be an empty file`).toBeGreaterThan(1024);
    }
  });

  it("redirects every legacy /manus-storage key to an existing image", () => {
    expect(Object.keys(legacyAssetRedirects)).toHaveLength(15);
    for (const [key, target] of Object.entries(legacyAssetRedirects)) {
      expect(target).toMatch(/^\/images\//);
      const file = path.join(publicDir, target.replace(/^\//, ""));
      expect(fs.existsSync(file), `redirect target ${target} for ${key} is missing on disk`).toBe(true);
    }
  });

  it("keeps the legacy redirect map aligned with the recovery manifest", () => {
    const manifest = JSON.parse(fs.readFileSync(path.join(root, "scripts", "asset-manifest.json"), "utf-8")) as {
      assets: { file: string; manusKey: string }[];
    };
    expect(manifest.assets).toHaveLength(15);
    for (const entry of manifest.assets) {
      expect(legacyAssetRedirects[entry.manusKey], `manifest key ${entry.manusKey} must have a redirect`).toBe(`/images/${entry.file}`);
    }
  });
});
