import { useEffect } from "react";
import { siteUrl } from "@/lib/site-content";

type SeoProps = { title: string; description: string; path: string; image?: string; schema?: Record<string, unknown> };
function setMeta(selector: string, content: string) {
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    const attribute = selector.includes("property") ? "property" : "name";
    const value = selector.match(/(?:name|property)='([^']+)'/)?.[1] || "description";
    tag.setAttribute(attribute, value);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

export function Seo({ title, description, path, image, schema }: SeoProps) {
  useEffect(() => {
    document.title = `${title} | Rosales Landscaping & Construction`;
    const canonical = `${siteUrl}${path}`;
    setMeta("meta[name='description']", description);
    setMeta("meta[property='og:title']", title);
    setMeta("meta[property='og:description']", description);
    setMeta("meta[property='og:url']", canonical);
    if (image) setMeta("meta[property='og:image']", image.startsWith("/") ? `${siteUrl}${image}` : image);
    let link = document.head.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = canonical;
    const id = "rosales-jsonld";
    document.getElementById(id)?.remove();
    if (schema) {
      const script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }
    return () => document.getElementById(id)?.remove();
  }, [title, description, path, image, schema]);
  return null;
}
