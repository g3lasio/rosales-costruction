#!/usr/bin/env node
// Generates the branded interim images committed under client/public/images.
//
// These are NOT the site's real photography: they keep every /images/* URL
// responding 200 with a dignified, on-brand tile until scripts/fetch-assets.mjs
// hydrates the real Rosales project photos. Each generated file carries the
// trailing marker "rosales-placeholder" so fetch-assets can tell them apart
// from real photography and replace them safely.
//
//   node scripts/generate-placeholders.mjs           # fill missing files only
//   node scripts/generate-placeholders.mjs --force   # regenerate placeholders too

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "client", "public", "images");
const MARKER = Buffer.from("rosales-placeholder");
const force = process.argv.includes("--force");

// Brand palette (brand-spec.md)
const PINE = "#17231A";
const GREEN = "#5E8B52";
const LIMESTONE = "#F2EEE5";
const CLAY = "#9D5036";

const SIZES = {
  "paver-driveway-hero-2026.webp": { w: 1920, h: 1280 },
  "landscape-path-planting-2026.webp": { w: 1280, h: 1600 },
  "garden-walkway-2026.webp": { w: 1280, h: 1600 },
  "outdoor-kitchen-before-2026.webp": { w: 1600, h: 900 },
  "outdoor-kitchen-after-2026.webp": { w: 1600, h: 900 },
};
const DEFAULT_SIZE = { w: 1600, h: 1200 };

const PHOTOS = [
  { file: "paver-driveway-hero-2026.webp", en: "Paver driveway & landscaped entry", es: "Entrada de adoquín y paisajismo" },
  { file: "synthetic-turf-garden-2026.webp", en: "Synthetic turf & stepping stones", es: "Césped sintético y losas" },
  { file: "granite-retaining-wall-2026.webp", en: "Stone retaining wall", es: "Muro de contención de piedra" },
  { file: "concrete-patio-process-2026.webp", en: "Concrete patio in progress", es: "Patio de concreto en proceso" },
  { file: "block-retaining-wall-2026.webp", en: "Block retaining wall", es: "Muro de contención de bloque" },
  { file: "flagstone-patio-2026.webp", en: "Flagstone patio", es: "Patio de flagstone" },
  { file: "outdoor-kitchen-masonry-2026.webp", en: "Outdoor kitchen & masonry", es: "Cocina exterior y mampostería" },
  { file: "wood-deck-steps-2026.webp", en: "Deck & entry steps", es: "Deck y escalones de acceso" },
  { file: "wood-fence-2026.webp", en: "Wood fence", es: "Cerca de madera" },
  { file: "landscape-path-planting-2026.webp", en: "Landscape path & planting", es: "Sendero y plantación" },
  { file: "drainage-trench-2026.webp", en: "Drainage in progress", es: "Drenaje en proceso" },
  { file: "garden-walkway-2026.webp", en: "Garden walkway", es: "Sendero de jardín" },
  { file: "outdoor-kitchen-before-2026.webp", en: "Before · masonry in progress", es: "Antes · mampostería en proceso", tone: CLAY },
  { file: "outdoor-kitchen-after-2026.webp", en: "After · completed kitchen", es: "Después · cocina terminada", tone: GREEN },
];

const esc = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function photoSvg({ w, h, en, es, tone = GREEN }) {
  en = esc(en);
  es = esc(es);
  const cx = w / 2;
  const cy = h * 0.34;
  const inset = Math.round(Math.min(w, h) * 0.035);
  const small = Math.min(w, h);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1d2c20"/>
      <stop offset="1" stop-color="${PINE}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <circle cx="${w * 0.82}" cy="${h * 0.24}" r="${small * 0.16}" fill="none" stroke="${LIMESTONE}" stroke-opacity="0.10" stroke-width="1.5"/>
  <path d="M0 ${h * 0.74} C ${w * 0.22} ${h * 0.66}, ${w * 0.4} ${h * 0.8}, ${w * 0.62} ${h * 0.74} S ${w * 0.9} ${h * 0.64}, ${w} ${h * 0.7} V ${h} H 0 Z" fill="${tone}" fill-opacity="0.16"/>
  <path d="M0 ${h * 0.84} C ${w * 0.28} ${h * 0.76}, ${w * 0.52} ${h * 0.9}, ${w * 0.74} ${h * 0.84} S ${w * 0.92} ${h * 0.78}, ${w} ${h * 0.82} V ${h} H 0 Z" fill="${tone}" fill-opacity="0.22"/>
  <rect x="${inset}" y="${inset}" width="${w - inset * 2}" height="${h - inset * 2}" fill="none" stroke="${LIMESTONE}" stroke-opacity="0.28" stroke-width="1.5"/>
  <circle cx="${cx}" cy="${cy}" r="${small * 0.085}" fill="none" stroke="${LIMESTONE}" stroke-opacity="0.35" stroke-width="2"/>
  <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-family="serif" font-size="${small * 0.085}" fill="${LIMESTONE}" fill-opacity="0.7">R</text>
  <text x="${cx}" y="${cy + small * 0.145}" text-anchor="middle" font-family="sans-serif" font-size="${small * 0.021}" letter-spacing="${small * 0.008}" fill="#A8CC9C" fill-opacity="0.55">ROSALES LANDSCAPING &amp; CONSTRUCTION</text>
  <text x="${inset * 1.9}" y="${h - inset * 2.9}" font-family="serif" font-size="${small * 0.042}" fill="${LIMESTONE}">${en}</text>
  <text x="${inset * 1.9}" y="${h - inset * 1.9}" font-family="sans-serif" font-size="${small * 0.023}" fill="${LIMESTONE}" fill-opacity="0.66">${es}</text>
  <text x="${w - inset * 1.6}" y="${h - inset * 1.6}" text-anchor="end" font-family="sans-serif" font-size="${small * 0.014}" fill="${LIMESTONE}" fill-opacity="0.4">placeholder · pnpm fetch:assets</text>
</svg>`;
}

function logoSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="304" viewBox="0 0 640 304">
  <text x="320" y="148" text-anchor="middle" font-family="serif" font-size="100" letter-spacing="4" fill="#3f6136">ROSALES</text>
  <rect x="120" y="182" width="400" height="2" fill="${CLAY}"/>
  <text x="320" y="228" text-anchor="middle" font-family="sans-serif" font-size="21" letter-spacing="5" fill="${PINE}">LANDSCAPING &amp; CONSTRUCTION</text>
</svg>`;
}

async function writeAsset(file, svg, format) {
  const target = path.join(OUT_DIR, file);
  const exists = fs.existsSync(target);
  if (exists && !fs.readFileSync(target).includes(MARKER)) {
    console.log(`· keeping real photography: ${file}`);
    return;
  }
  if (exists && !force) {
    console.log(`· placeholder already present: ${file}`);
    return;
  }
  const input = Buffer.from(svg);
  const image = sharp(input, { density: 96 });
  const buffer = format === "png"
    ? await image.png({ compressionLevel: 9 }).toBuffer()
    : await image.webp({ quality: 72 }).toBuffer();
  fs.writeFileSync(target, Buffer.concat([buffer, MARKER]));
  console.log(`✓ generated ${file} (${Math.round((buffer.length + MARKER.length) / 1024)} KB)`);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
await writeAsset("rosales-logo.png", logoSvg(), "png");
for (const photo of PHOTOS) {
  const size = SIZES[photo.file] || DEFAULT_SIZE;
  await writeAsset(photo.file, photoSvg({ ...size, ...photo }), "webp");
}
console.log("Done. Placeholders carry the 'rosales-placeholder' marker and are replaced by pnpm fetch:assets.");
