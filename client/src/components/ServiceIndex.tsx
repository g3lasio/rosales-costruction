import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { Service, services } from "@/lib/site-content";
import { useLocale } from "@/contexts/LocaleContext";

export function ServiceIndex({ limit, featured }: { limit?: number; featured?: string[] }) {
  const { locale } = useLocale();
  const items = featured ? services.filter(service => featured.includes(service.slug)) : services;
  return <div className="service-index">{items.slice(0, limit).map((service: Service, index) => <Link href={`/services/${service.slug}/`} key={service.slug} className={`service-card service-${index % 4}`}><div className="service-card-image"><img src={service.image} alt={service.alt[locale]} loading="lazy" /></div><div className="service-card-body"><span className="eyebrow">0{String(index + 1)}</span><h3>{service.name[locale]}</h3><p>{service.summary[locale]}</p><span className="service-arrow"><ArrowUpRight size={20} /></span></div></Link>)}</div>;
}
