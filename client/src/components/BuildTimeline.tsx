import { useState } from "react";
import { ArrowRight, ClipboardCheck, Construction, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { assets, copy } from "@/lib/site-content";
import { useLocale } from "@/contexts/LocaleContext";

type Stage = {
  number: string;
  icon: typeof ClipboardCheck;
  image: string;
  alt: { en: string; es: string };
  label: { en: string; es: string };
  title: { en: string; es: string };
  body: { en: string; es: string };
  note: { en: string; es: string };
};

const stages: Stage[] = [
  { number: "01", icon: ClipboardCheck, image: assets.frontApproachBefore, alt: { en: "Prepared front approach before concrete-path installation", es: "Acceso frontal preparado antes de instalar un sendero de concreto" }, label: { en: "Prepare", es: "Preparar" }, title: { en: "Read the site first.", es: "Primero, entender el terreno." }, body: { en: "We begin by discussing the intended use and reviewing access, surface conditions, grade, materials, and the best way to approach the work.", es: "Comenzamos hablando del uso previsto y revisando acceso, condiciones de la superficie, niveles, materiales y la mejor forma de abordar el trabajo." }, note: { en: "Scope · site conditions · approach", es: "Alcance · condiciones · enfoque" } },
  { number: "02", icon: Construction, image: assets.concrete, alt: { en: "Rosales crew completing concrete work", es: "Equipo de Rosales realizando trabajo de concreto" }, label: { en: "Build", es: "Construir" }, title: { en: "Make every layer count.", es: "Que cada capa cuente." }, body: { en: "The work takes shape through deliberate preparation, clean transitions, material coordination, and steady communication around the active project.", es: "El trabajo toma forma mediante preparación intencional, transiciones limpias, coordinación de materiales y comunicación constante durante el proyecto." }, note: { en: "Preparation · execution · coordination", es: "Preparación · ejecución · coordinación" } },
  { number: "03", icon: Sparkles, image: assets.frontApproachAfter, alt: { en: "Finished Rosales concrete front path", es: "Sendero frontal de concreto terminado por Rosales" }, label: { en: "Deliver", es: "Entregar" }, title: { en: "Leave the space ready to live in.", es: "Dejar el espacio listo para vivir." }, body: { en: "The final walk-through is about the finished surfaces, edges, and transitions—and how the completed space supports daily life outside.", es: "La revisión final se centra en superficies, bordes y transiciones terminadas, y en cómo el espacio completo acompaña la vida diaria al aire libre." }, note: { en: "Finished surfaces · walkthrough · next steps", es: "Superficies terminadas · recorrido · próximos pasos" } },
];

export function BuildTimeline() {
  const { locale } = useLocale();
  const t = copy[locale];
  const [active, setActive] = useState(0);
  const stage = stages[active];
  const Icon = stage.icon;

  return <section className="build-timeline" aria-labelledby="build-timeline-title">
    <div className="container">
      <div className="timeline-header"><div><span className="eyebrow">{locale === "en" ? "The Rosales build sequence" : "La secuencia de construcción Rosales"}</span><h2 id="build-timeline-title">{locale === "en" ? <>From first look<br />to <em>final walk-through.</em></> : <>De la primera vista<br />al <em>recorrido final.</em></>}</h2></div><p>{locale === "en" ? "Move through the field sequence to see how a conversation becomes a space with purpose." : "Recorra la secuencia de campo para ver cómo una conversación se convierte en un espacio con propósito."}</p></div>
      <div className="timeline-shell">
        <div className="timeline-steps" role="tablist" aria-label={locale === "en" ? "Project stages" : "Etapas del proyecto"} aria-orientation="vertical">
          {stages.map((item, index) => { const ItemIcon = item.icon; const isActive = index === active; return <button key={item.number} role="tab" aria-selected={isActive} aria-controls="timeline-stage-panel" id={`timeline-tab-${index}`} className={`timeline-step ${isActive ? "is-active" : ""}`} onClick={() => setActive(index)}><span className="timeline-index">{item.number}</span><span className="timeline-step-icon"><ItemIcon size={18} /></span><span><small>{item.label[locale]}</small><strong>{item.title[locale]}</strong></span><ArrowRight className="timeline-arrow" size={17} /></button>; })}
        </div>
        <article id="timeline-stage-panel" className="timeline-stage" role="tabpanel" aria-labelledby={`timeline-tab-${active}`} tabIndex={0}>
          <div className="timeline-photo-stack" aria-hidden="true"><span /><span /><img src={stage.image} alt="" /></div>
          <div className="timeline-stage-copy"><div className="timeline-stage-kicker"><Icon size={17} /><span>{stage.number} / 03 · {stage.label[locale]}</span></div><h3>{stage.title[locale]}</h3><p>{stage.body[locale]}</p><div className="timeline-stage-note">{stage.note[locale]}</div><Link href="/contact/#estimate" className="text-link">{t.estimate}<ArrowRight size={16} /></Link></div>
        </article>
      </div>
      <div className="timeline-footer"><p>{locale === "en" ? "Every project begins with a conversation about the site, the scope, and what the finished space needs to do." : "Cada proyecto comienza con una conversación sobre el terreno, el alcance y lo que el espacio terminado debe lograr."}</p><Link href="/projects/" className="text-link">{t.explore}<ArrowRight size={16} /></Link></div>
    </div>
  </section>;
}
