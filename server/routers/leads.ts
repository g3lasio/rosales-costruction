import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { deliverLeadPrimeEstimate } from "../services/leadprime";

export const estimateInput = z.object({
  name: z.string().trim().min(2).max(255),
  phone: z.string().trim().max(60).optional(),
  email: z.string().trim().email().max(320).optional().or(z.literal("")),
  address: z.string().trim().max(500).optional(),
  city: z.string().trim().max(120).optional(),
  service: z.string().trim().max(120).optional(),
  timeline: z.string().trim().max(120).optional(),
  message: z.string().trim().max(5000).optional(),
  consent: z.boolean().default(false),
  consentText: z.string().trim().max(1000).optional(),
  pageUrl: z.string().url().max(500),
  startedAt: z.number().int().positive(),
  website: z.string().max(0).optional(),
  utm: z.object({
    utm_source: z.string().max(250).optional(),
    utm_medium: z.string().max(250).optional(),
    utm_campaign: z.string().max(250).optional(),
    utm_content: z.string().max(250).optional(),
    utm_term: z.string().max(250).optional(),
  }).optional(),
}).superRefine((value, ctx) => {
  if (!value.phone && !value.email) {
    ctx.addIssue({ code: "custom", path: ["phone"], message: "Please provide a phone number or email address." });
  }
});

export const leadRouter = router({
  submitEstimate: publicProcedure.input(estimateInput).mutation(async ({ input }) => {
    if (input.website) return { success: true, accepted: true };
    if (Date.now() - input.startedAt < 1200) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Please take a moment and try again." });
    }

    try {
      const result = await deliverLeadPrimeEstimate(
        {
          name: input.name,
          phone: input.phone,
          email: input.email || undefined,
          address: input.address,
          city: input.city,
          service: input.service,
          timeline: input.timeline,
          message: input.message,
          consent: input.consent,
          consentText: input.consentText,
          pageUrl: input.pageUrl,
          utm: input.utm,
        },
        {
          webhookUrl: process.env.LEADPRIME_WEBHOOK_URL || "",
          hmacSecret: process.env.LEADPRIME_WEBHOOK_HMAC_SECRET,
        },
      );
      return { success: true, leadId: result.leadId };
    } catch (error) {
      console.error("[Lead form] Delivery failed", error instanceof Error ? error.message : "unknown error");
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "We couldn’t send your request. Please call us at (707) 738-1746." });
    }
  }),
});
