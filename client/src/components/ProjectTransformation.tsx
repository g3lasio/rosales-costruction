import { CSSProperties, useId, useState } from "react";
import { ArrowRight, GripVertical, MoveHorizontal } from "lucide-react";
import { Link } from "wouter";
import { assets, copy } from "@/lib/site-content";
import { useLocale } from "@/contexts/LocaleContext";

export function ProjectTransformation({ compact = false }: { compact?: boolean }) {
  const { locale } = useLocale();
  const english = locale === "en";
  const t = copy[locale];
  const [split, setSplit] = useState(52);
  const rangeId = useId();
  const stageStyle = { "--comparison-split": `${split}%` } as CSSProperties;

  return <section className={`transformation-section ${compact ? "transformation-compact" : ""}`} aria-labelledby="transformation-heading">
    <div className="container transformation-layout">
      <div className="transformation-heading">
        <span className="eyebrow">{english ? "Project transformation" : "Transformación de proyecto"}</span>
        <h2 id="transformation-heading">{english ? <>See the <em>site change.</em></> : <>Vea cómo <em>cambia el sitio.</em></>}</h2>
        <p>{english ? "A real Rosales front-approach sequence. Move the control to inspect the prepared site and the completed concrete path at your own pace." : "Una secuencia real de acceso frontal de Rosales. Mueva el control para observar el sitio preparado y el sendero de concreto terminado a su propio ritmo."}</p>
        <div className="transformation-facts" aria-label={english ? "Project phases" : "Fases del proyecto"}>
          <div><span>01</span><strong>{english ? "Site prep" : "Preparación"}</strong></div>
          <div><span>02</span><strong>{english ? "Layout" : "Trazado"}</strong></div>
          <div><span>03</span><strong>{english ? "Finished path" : "Sendero terminado"}</strong></div>
        </div>
        {!compact && <Link href="/projects/" className="text-link">{t.explore}<ArrowRight size={16} /></Link>}
      </div>
      <figure className="transformation-figure">
        <div className="comparison-stage" style={stageStyle}>
          <img className="comparison-image" src={assets.frontApproachAfter} alt={english ? "Completed concrete front path at a Rosales project" : "Sendero frontal de concreto terminado en un proyecto de Rosales"} />
          <img className="comparison-image comparison-before" src={assets.frontApproachBefore} alt={english ? "Prepared front approach before Rosales concrete path installation" : "Acceso frontal preparado antes de la instalación del sendero de concreto por Rosales"} />
          <div className="comparison-divider" aria-hidden="true"><span><GripVertical size={18} /></span></div>
          <span className="comparison-label comparison-label-before">{english ? "Before · prepared site" : "Antes · sitio preparado"}</span>
          <span className="comparison-label comparison-label-after">{english ? "After · finished path" : "Después · sendero terminado"}</span>
        </div>
        <figcaption>
          <label htmlFor={rangeId}><MoveHorizontal size={16} />{english ? "Drag to reveal each stage" : "Arrastre para revelar cada etapa"}</label>
          <input id={rangeId} type="range" min="0" max="100" value={split} onChange={event => setSplit(Number(event.target.value))} aria-valuetext={english ? `${split}% prepared site, ${100 - split}% finished path` : `${split}% sitio preparado, ${100 - split}% sendero terminado`} />
          <output aria-live="polite">{split}% / {100 - split}%</output>
        </figcaption>
      </figure>
    </div>
  </section>;
}
