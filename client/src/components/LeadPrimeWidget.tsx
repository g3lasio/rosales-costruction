import { useEffect } from "react";
import { trpc } from "@/lib/trpc";

export function LeadPrimeWidget() {
  const { data } = trpc.site.widgetConfig.useQuery(undefined, { staleTime: Infinity, retry: 1 });
  useEffect(() => {
    if (!data?.embedToken || document.getElementById("leadprime-embed")) return;
    const script = document.createElement("script");
    script.id = "leadprime-embed";
    script.src = "https://leadprime.chyrris.com/api/widget/embed.js";
    script.async = true;
    script.dataset.token = data.embedToken;
    script.dataset.agentName = data.agentName;
    script.dataset.lang = "auto";
    script.dataset.color = "#47793E";
    script.dataset.theme = "light";
    script.dataset.position = "bottom-right";
    script.onerror = () => window.dispatchEvent(new Event("leadprime:unavailable"));
    script.onload = () => window.setTimeout(() => {
      if (!document.getElementById("lp-widget-btn")) window.dispatchEvent(new Event("leadprime:unavailable"));
    }, 1600);
    document.body.appendChild(script);
  }, [data]);
  return null;
}
