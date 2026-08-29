import { describe, expect, it } from "vitest";
import { cssFailurePage, ensureProductionStyles } from "./vite";

describe("production stylesheet guard", () => {
  it("accepts SSR HTML that already links a stylesheet", () => {
    const result = ensureProductionStyles('<head><link rel="stylesheet" href="/assets/site.css"></head>', "/tmp/missing-assets");
    expect(result.ok).toBe(true);
    expect(result.template).toContain("site.css");
  });

  it("injects the compiled stylesheet when the link is missing", () => {
    const result = ensureProductionStyles("<html><head></head></html>", "/home/ubuntu/rosales-premium-website/dist/public");
    expect(result.ok).toBe(true);
    expect(result.template).toMatch(/rel="stylesheet"/);
  });

  it("returns a visible branded maintenance state when no CSS asset exists", () => {
    const result = ensureProductionStyles("<html><head></head></html>", "/tmp/rosales-no-css");
    expect(result.ok).toBe(false);
    expect(cssFailurePage()).toContain("We are preparing the next view of your landscape");
    expect(cssFailurePage()).toContain("(707) 738-1746");
  });
});
