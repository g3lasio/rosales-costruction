import { publicProcedure, router } from "../_core/trpc";

export const siteRouter = router({
  widgetConfig: publicProcedure.query(() => ({
    embedToken: process.env.LEADPRIME_EMBED_TOKEN || null,
    agentName: "Rosales Project Assistant",
  })),
});
