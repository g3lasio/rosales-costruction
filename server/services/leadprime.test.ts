import { describe, expect, it, vi } from "vitest";
import { buildLeadPrimePayload, deliverLeadPrimeEstimate } from "./leadprime";

describe("LeadPrime form delivery", () => {
  const estimate = {
    name: "Website test lead",
    phone: "7075550101",
    service: "pavers",
    message: "This is a unit-test payload.",
    consent: false,
    pageUrl: "https://rosaleslandscapingandconstruction.com/pavers/?utm_source=google",
    utm: { utm_source: "google", utm_campaign: "napa_pavers" },
  };

  it("maps service, page, and campaign attribution without exposing a credential", () => {
    expect(buildLeadPrimePayload(estimate)).toMatchObject({
      name: "Website test lead",
      service: "pavers",
      page_url: estimate.pageUrl,
      utm_source: "google",
      utm_campaign: "napa_pavers",
      source: "website_form",
    });
  });

  it("delivers a server-side payload with no secret in the request body", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, leadId: "test_123" }), { status: 201 }));
    const result = await deliverLeadPrimeEstimate(estimate, { webhookUrl: "https://example.test/webhook-secret", fetcher });

    expect(result).toEqual({ success: true, leadId: "test_123" });
    expect(fetcher).toHaveBeenCalledWith("https://example.test/webhook-secret", expect.objectContaining({ method: "POST" }));
    const sentBody = String(fetcher.mock.calls[0]?.[1]?.body);
    expect(sentBody).not.toContain("webhook-secret");
  });
});
