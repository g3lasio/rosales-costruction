import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function readTree(directory: string): string {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) return readTree(file);
    return /\.(ts|tsx|css|html)$/u.test(entry.name) ? [fs.readFileSync(file, "utf8")] : [];
  }).join("\n");
}

describe("LeadPrime secret boundary", () => {
  it("keeps the private webhook variable out of client source", () => {
    const clientSource = readTree(path.resolve(import.meta.dirname, "../client/src"));
    expect(clientSource).not.toContain("LEADPRIME_WEBHOOK_URL");
    expect(clientSource).not.toMatch(/wh_[a-f0-9]{40,}/i);
  });

  it("reads the webhook variable only from server-side routing", () => {
    const router = fs.readFileSync(path.resolve(import.meta.dirname, "routers/leads.ts"), "utf8");
    expect(router).toContain("process.env.LEADPRIME_WEBHOOK_URL");
  });
});
