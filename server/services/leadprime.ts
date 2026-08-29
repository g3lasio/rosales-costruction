import crypto from "node:crypto";

export type LeadPrimeEstimate = {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  service?: string;
  timeline?: string;
  message?: string;
  consent: boolean;
  consentText?: string;
  pageUrl: string;
  utm?: Record<string, string | undefined>;
};

type LeadPrimeResult = { leadId?: string; success: boolean };

type DeliveryOptions = {
  webhookUrl: string;
  hmacSecret?: string;
  fetcher?: typeof fetch;
};

function compact(value?: string) {
  return value?.trim().slice(0, 5000) || undefined;
}

export function buildLeadPrimePayload(lead: LeadPrimeEstimate) {
  return {
    name: lead.name.trim().slice(0, 255),
    phone: compact(lead.phone),
    email: compact(lead.email),
    address: compact(lead.address),
    city: compact(lead.city),
    service: compact(lead.service),
    timeline: compact(lead.timeline),
    message: compact(lead.message),
    consent: lead.consent,
    consent_text: lead.consent ? compact(lead.consentText) : undefined,
    page_url: lead.pageUrl.slice(0, 500),
    utm_source: compact(lead.utm?.utm_source),
    utm_medium: compact(lead.utm?.utm_medium),
    utm_campaign: compact(lead.utm?.utm_campaign),
    utm_content: compact(lead.utm?.utm_content),
    utm_term: compact(lead.utm?.utm_term),
    source: "website_form",
  };
}

export async function deliverLeadPrimeEstimate(
  lead: LeadPrimeEstimate,
  options: DeliveryOptions,
): Promise<LeadPrimeResult> {
  if (!options.webhookUrl) throw new Error("LeadPrime webhook is not configured");

  const body = JSON.stringify(buildLeadPrimePayload(lead));
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.hmacSecret) {
    headers["X-LeadPrime-Signature"] = crypto.createHmac("sha256", options.hmacSecret).update(body).digest("hex");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await (options.fetcher ?? fetch)(options.webhookUrl, {
      method: "POST",
      headers,
      body,
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.success) {
      throw new Error(`LeadPrime webhook delivery failed (${response.status})`);
    }
    return { success: true, leadId: payload.leadId };
  } finally {
    clearTimeout(timeout);
  }
}
