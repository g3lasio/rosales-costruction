# Rosales Landscaping & Construction

Premium, bilingual (English/Spanish) contractor website for Rosales Landscaping & Construction. The public site uses server-side rendering for crawler-visible content and metadata, real Rosales project photography, and LeadPrime for estimate intake and the AI project-assistant chat.

## What is included

The public experience includes dedicated pages for landscaping, pavers, concrete, retaining walls, synthetic turf, fences and gates, drainage and irrigation, decks, stonework, and driveways. The language preference defaults to English and persists when a visitor switches to Spanish. All service pages, calls to action, estimate form copy, metadata, and structured data use the active locale.

Estimate requests are submitted to a server-side LeadPrime proxy. The browser never receives the LeadPrime webhook credential. The official LeadPrime Embed Kit chat is loaded with its approved runtime token and provides a visible phone fallback if the widget is unavailable.

## Local development

Use Node 22 or later and pnpm.

```bash
pnpm install
pnpm dev
```

Run the complete quality suite with:

```bash
pnpm test
pnpm check
pnpm build
```

The two live LeadPrime validation tests are intentionally skipped in routine commands. Run them only when a deliberate synthetic CRM test is approved:

```bash
LEADPRIME_LIVE_TESTS=true pnpm vitest run server/leadprime.integration.test.ts
```

These tests create clearly marked synthetic leads and must not be added to normal CI.

## Environment variables

Copy `.env.example` for local development or configure the equivalent variables in Railway. Never commit a populated `.env` file.

| Variable | Required | Purpose |
|---|---|---|
| `LEADPRIME_WEBHOOK_URL` | Yes | Private server-side LeadPrime destination for estimate requests. |
| `LEADPRIME_EMBED_TOKEN` | Yes | Runtime identifier for the official LeadPrime Embed Kit. |
| `LEADPRIME_WEBHOOK_HMAC_SECRET` | Conditional | Used only if the LeadPrime webhook requires signature verification. |
| `CANONICAL_ORIGIN` | Yes in production | Public origin, normally `https://rosaleslandscapingandconstruction.com`. |
| `SITE_NAME` | Yes in production | `Rosales Landscaping & Construction`. |

## Production images

Every image the site references lives in `client/public/images/` and is served from `/images/...`. The repository ships lightweight branded placeholders (marked internally with `rosales-placeholder`), and `pnpm build` runs `fetch-assets --best-effort` first, so a deploy machine with internet access (Railway) recovers and bakes in the real photography automatically. To pin the real photos in Git instead, hydrate them once from any machine with normal internet access:

```bash
pnpm fetch:assets            # recovers, optimizes, and writes the 15 real photos
pnpm fetch:assets --check    # reports which files are real photography (expect 15/15)
```

The recovery sources and final filenames are declared in `scripts/asset-manifest.json`; `scripts/fetch-assets.mjs` tries a local folder (`--from-dir`), the previous Manus/Forge storage (via `BUILT_IN_FORGE_API_URL`/`KEY`), and the legacy WordPress media library, in that order. Placeholders are regenerated with `node scripts/generate-placeholders.mjs`. Real photography is never overwritten. Legacy `/manus-storage/*` URLs answer with a 301 to the new `/images/...` locations (`server/assetRedirects.ts`), and `server/assets.integrity.test.ts` keeps the references, redirects, and manifest aligned.

See [`docs/production-repair-2026-08.md`](docs/production-repair-2026-08.md) for the full repair and validation report.

## Railway deployment

Connect this private repository in Railway, add the environment variables above, set the build command to `pnpm build`, and set the start command to `pnpm start`. Do not hardcode a port: Railway supplies `PORT`, which the server reads automatically.

After deployment, check the home page, one service page, `/sitemap.xml`, `/robots.txt`, `/llms.txt`, both legacy redirects, the language switch, the LeadPrime chat bubble, and a consented internal estimate submission. Confirm that the resulting lead appears in LeadPrime.

Additional operational detail is in [`docs/integration-and-deployment-plan.md`](docs/integration-and-deployment-plan.md), and the migration mapping is in [`docs/legacy-url-matrix.md`](docs/legacy-url-matrix.md).
