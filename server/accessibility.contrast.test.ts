import { describe, expect, it } from "vitest";

function luminance(hex: string) {
  const values = hex.replace("#", "").match(/.{2}/g)!.map(value => parseInt(value, 16) / 255).map(value => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * values[0] + 0.7152 * values[1] + 0.0722 * values[2];
}

function contrast(foreground: string, background: string) {
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

describe("Rosales accessibility color pairs", () => {
  it("keeps small UI text at or above WCAG AA contrast", () => {
    expect(contrast("#FFFFFF", "#47793E")).toBeGreaterThanOrEqual(4.5);
    expect(contrast("#FFFFFF", "#9D5036")).toBeGreaterThanOrEqual(4.5);
    expect(contrast("#FFFFFF", "#17231A")).toBeGreaterThanOrEqual(4.5);
    expect(contrast("#1E271F", "#F2EEE5")).toBeGreaterThanOrEqual(4.5);
  });
});
