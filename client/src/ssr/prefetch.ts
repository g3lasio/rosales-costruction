import { services } from "@/lib/site-content";

export type HeadMeta = { title: string; description: string; canonicalPath?: string; ogImage?: string; ogImageAlt?: string; ogType?: "website" | "article"; noindex?: boolean; notFound?: boolean };
const site = "Rosales Landscaping & Construction";
const description = "Rosales Landscaping & Construction creates considered outdoor spaces across Napa, Vallejo, and the North Bay.";
const standard: Record<string, HeadMeta> = {
  "/": { title: `${site} | Landscaping & Outdoor Construction`, description, canonicalPath: "/", ogImage: "/manus-storage/244_Pavers-e1763091483640_ac92b920.jpg", ogImageAlt: "Rosales paver driveway and landscaped entry" },
  "/services": { title: `Outdoor Construction Services | ${site}`, description: "Explore landscaping, pavers, concrete, retaining walls, turf, fences, drainage, decks, stonework, and driveway services.", canonicalPath: "/services" },
  "/projects": { title: `Projects | ${site}`, description: "Explore a selection of real Rosales landscaping and outdoor construction projects.", canonicalPath: "/projects", ogImage: "/manus-storage/211_7579fa85-a37e-4d88-99fb-a8337440db8a_b7ce47b9.webp", ogImageAlt: "Rosales outdoor kitchen and masonry project" },
  "/about": { title: `About Rosales | ${site}`, description: "Learn about Rosales Landscaping & Construction, a licensed California C-27 contractor serving the North Bay.", canonicalPath: "/about" },
  "/areas-we-serve": { title: `Areas We Serve | ${site}`, description: "Rosales serves Napa, Vallejo, Fairfield, Concord, Richmond, San Pablo, Benicia, and surrounding North Bay communities.", canonicalPath: "/areas-we-serve" },
  "/reviews": { title: `Reviews | ${site}`, description: "Read public reviews and see where to find Rosales Landscaping & Construction online.", canonicalPath: "/reviews" },
  "/contact": { title: `Contact | ${site}`, description: "Contact Rosales Landscaping & Construction to discuss an outdoor project in the North Bay.", canonicalPath: "/contact" },
  "/privacy": { title: `Privacy Policy | ${site}`, description: "How Rosales handles information submitted through this website.", canonicalPath: "/privacy" },
};

export function prefetchForPath(url: string): HeadMeta {
  let path = url.split("?")[0] || "/";
  try { path = decodeURI(path); } catch { /* keep raw path */ }
  const clean = path.replace(/\/+$/, "") || "/";
  if (standard[clean]) return standard[clean];
  const match = clean.match(/^\/services\/([^/]+)$/);
  if (match) {
    const service = services.find(item => item.slug === match[1]);
    if (service) return { title: `${service.name.en} | ${site}`, description: service.summary.en, canonicalPath: `/services/${service.slug}`, ogImage: service.image, ogImageAlt: service.alt.en };
  }
  return { title: site, description, notFound: true };
}
