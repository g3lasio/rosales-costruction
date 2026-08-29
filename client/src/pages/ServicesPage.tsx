import { Seo } from "@/components/Seo";
import { ServiceIndex } from "@/components/ServiceIndex";
import { useLocale } from "@/contexts/LocaleContext";

export default function ServicesPage() {
  const { locale } = useLocale();
  const english = locale === "en";
  return <><Seo title={english ? "Outdoor construction services" : "Servicios de construcción exterior"} description={english ? "Explore Rosales landscaping, pavers, concrete, retaining walls, turf, fencing, drainage, decks, stonework, and driveway services." : "Conozca los servicios de paisajismo, adoquines, concreto, muros, césped, cercas, drenaje, decks, piedra y entradas de Rosales."} path="/services/" />
    <section className="page-intro"><div className="container"><span className="eyebrow">{english ? "What we build" : "Lo que construimos"}</span><h1>{english ? "Every exterior surface has a purpose." : "Cada superficie exterior tiene un propósito."}</h1><p>{english ? "Explore the materials, systems, and spaces Rosales brings together to make a property feel more considered, useful, and lasting." : "Explore los materiales, sistemas y espacios que Rosales integra para que una propiedad se sienta más cuidada, útil y duradera."}</p></div></section><section className="section top-less"><div className="container"><ServiceIndex /></div></section>
  </>;
}
