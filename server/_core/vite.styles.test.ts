import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { cssFailurePage, ensureProductionStyles } from "./vite";

const fixtureDist = fs.mkdtempSync(path.join(os.tmpdir(), "rosales-dist-"));
fs.mkdirSync(path.join(fixtureDist, "assets"));
fs.writeFileSync(path.join(fixtureDist, "assets", "index-test.css"), "body{margin:0}");
afterAll(() => fs.rmSync(fixtureDist, { recursive: true, force: true }));

describe("production stylesheet guard", () => {
  it("accepts SSR HTML that already links a stylesheet", () => {
    const result = ensureProductionStyles('<head><link rel="stylesheet" href="/assets/site.css"></head>', "/tmp/missing-assets");
    expect(result.ok).toBe(true);
    expect(result.template).toContain("site.css");
  });

  it("injects the compiled stylesheet when the link is missing", () => {
    const result = ensureProductionStyles("<html><head></head></html>", fixtureDist);
    expect(result.ok).toBe(true);
    expect(result.template).toMatch(/rel="stylesheet"/);
    expect(result.template).toContain("index-test.css");
  });

  it("returns a visible branded maintenance state when no CSS asset exists", () => {
    const result = ensureProductionStyles("<html><head></head></html>", "/tmp/rosales-no-css");
    expect(result.ok).toBe(false);
    expect(cssFailurePage()).toContain("We are preparing the next view of your landscape");
    expect(cssFailurePage()).toContain("(707) 738-1746");
  });
});
