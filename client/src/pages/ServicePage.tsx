import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Link, useParams } from "wouter";
import { EstimateForm } from "@/components/EstimateForm";
import { Seo } from "@/components/Seo";
import { ServiceIndex } from "@/components/ServiceIndex";
import { copy, services } from "@/lib/site-content";
import { useLocale } from "@/contexts/LocaleContext";
import NotFound from "./NotFound";

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const service = services.find(item => item.slug === slug);
  const { locale } = useLocale();
  if (!service) return <NotFound />;
  const t = copy[locale];
  const other = services.filter(item => item.slug !== service.slug).slice(0, 3).map(item => item.slug);
  return <><Seo title={service.name[locale]} description={service.summary[locale]} path={`/services/${service.slug}/`} image={service.image} schema={{ "@context": "https://schema.org", "@type": "Service", name: service.name[locale], description: service.summary[locale], provider: { "@type": "HomeAndConstructionBusiness", name: "Rosales Landscaping & Construction Inc" }, areaServed: ["Napa", "Vallejo", "North Bay"] }} />
    <section className="service-hero"><div className="service-hero-image"><img src={service.image} alt={service.alt[locale]} /></div><div className="container service-hero-content"><Link href="/services/" className="back-link"><ArrowLeft size={16} /> {t.back}</Link><span className="eyebrow">{service.eyebrow[locale]}</span><h1>{service.title[locale]}</h1><p>{service.summary[locale]}</p><a className="button button-primary" href="#estimate">{t.estimate}<ArrowRight size={16} /></a></div></section>
    <section className="section service-detail"><div className="container two-column"><div><span className="eyebrow">{locale === "en" ? "The Rosales approach" : "El enfoque Rosales"}</span><h2>{locale === "en" ? "Made for the way your property lives." : "Hecho para la forma en que vive su propiedad."}</h2></div><div><p className="large-copy">{service.details[locale]}</p><ul className="check-list">{service.bullets[locale].map(item => <li key={item}><Check size={17} />{item}</li>)}</ul></div></div></section>
    <section className="section muted-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">{locale === "en" ? "More capabilities" : "Más capacidades"}</span><h2>{locale === "en" ? "See what else we build." : "Vea qué más construimos."}</h2></div><Link href="/services/" className="text-link">{t.back}<ArrowRight size={16} /></Link></div><ServiceIndex featured={other} /></div></section>
    <section id="estimate" className="section estimate-section"><div className="container estimate-layout"><div className="estimate-intro"><span className="eyebrow">{locale === "en" ? "Begin with a conversation" : "Comience con una conversación"}</span><h2>{locale === "en" ? "Let’s shape the next chapter of your outdoor space." : "Demos forma al próximo capítulo de su espacio exterior."}</h2><p>{locale === "en" ? "Tell us the scope, the site, and the ideas you have in mind. The right work begins with the right questions." : "Cuéntenos el alcance, el espacio y las ideas que tiene en mente. El trabajo correcto comienza con las preguntas correctas."}</p></div><EstimateForm defaultService={service.slug} /></div></section>
  </>;
}
