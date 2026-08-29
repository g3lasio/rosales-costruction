import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { spawn, type ChildProcess } from "node:child_process";
import path from "node:path";

const runIntegration = process.env.RUN_SSR_INTEGRATION === "true";
const root = path.resolve(import.meta.dirname, "..");
let child: ChildProcess | undefined;
let baseUrl = "";

describe.skipIf(!runIntegration)("production SSR output", () => {
  beforeAll(async () => {
    const port = 4317;
    baseUrl = `http://127.0.0.1:${port}`;
    child = spawn(process.execPath, ["dist/index.js"], {
      cwd: root,
      env: { ...process.env, NODE_ENV: "production", PORT: String(port) },
      stdio: "ignore",
    });
    for (let attempt = 0; attempt < 20; attempt += 1) {
      try {
        const response = await fetch(`${baseUrl}/`);
        if (response.ok) return;
      } catch {
        // The production process may need a moment to initialize.
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    throw new Error("Production SSR process did not become ready");
  }, 10_000);

  afterAll(() => {
    child?.kill("SIGTERM");
  });

  it("serves a real route with the public layout and compiled stylesheet", async () => {
    const response = await fetch(`${baseUrl}/terms`);
    const html = await response.text();
    expect(response.status).toBe(200);
    expect(html).toContain('class="site-shell"');
    expect(html).toMatch(/<link[^>]+rel="stylesheet"/);
    expect(html).toContain("Straightforward terms for a straightforward start");
  });
});
