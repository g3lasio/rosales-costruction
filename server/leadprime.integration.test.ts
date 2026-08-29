import { describe, expect, it } from "vitest";

const webhookUrl = process.env.LEADPRIME_WEBHOOK_URL;

async function submitSyntheticLead(sequence: number) {
  if (!webhookUrl) {
    throw new Error("LEADPRIME_WEBHOOK_URL is not configured");
  }

  const timestamp = new Date().toISOString();
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: `TEST ONLY — Rosales website webhook validation ${sequence}`,
      service: "integration_test",
      message: `Synthetic, non-customer validation lead ${sequence}. Do not contact. Created at ${timestamp}.`,
      page_url: "https://rosaleslandscapingandconstruction.com/integration-test",
      utm_source: "automated_test",
      utm_medium: "integration",
      utm_campaign: "rosales_webhook_validation",
      consent: false,
    }),
  });

  const payload = await response.json().catch(() => null);
  return { response, payload };
}

const describeLive = process.env.LEADPRIME_LIVE_TESTS === "true" ? describe : describe.skip;

describeLive("LeadPrime webhook credential", () => {
  it("accepts synthetic lead one without customer contact information", async () => {
    const { response, payload } = await submitSyntheticLead(1);

    expect(response.status).toBe(201);
    expect(payload).toMatchObject({ success: true });
    expect(payload?.leadId).toEqual(expect.any(String));
  }, 20_000);

  it("accepts synthetic lead two without customer contact information", async () => {
    const { response, payload } = await submitSyntheticLead(2);

    expect(response.status).toBe(201);
    expect(payload).toMatchObject({ success: true });
    expect(payload?.leadId).toEqual(expect.any(String));
  }, 20_000);
});
