import { describe, expect, it } from "vitest";
import { estimateInput } from "./leads";

const validInput = {
  name: "Morgan Test",
  phone: "707-555-0101",
  pageUrl: "https://rosaleslandscapingandconstruction.com/contact?utm_source=test",
  startedAt: Date.now() - 5000,
};

describe("estimate form validation", () => {
  it("requires a meaningful name and at least one contact method", () => {
    expect(() => estimateInput.parse({ ...validInput, name: "A" })).toThrow();
    expect(() => estimateInput.parse({ ...validInput, phone: undefined, email: "" })).toThrow("phone number or email address");
  });

  it("accepts optional SMS consent and attribution without requiring consent", () => {
    const result = estimateInput.parse({ ...validInput, consent: false, utm: { utm_source: "google", utm_campaign: "napa_pavers" } });
    expect(result.consent).toBe(false);
    expect(result.utm?.utm_campaign).toBe("napa_pavers");
  });

  it("limits the honeypot field to an empty value", () => {
    expect(() => estimateInput.parse({ ...validInput, website: "bot content" })).toThrow();
    expect(estimateInput.parse({ ...validInput, website: "" }).website).toBe("");
  });
});
