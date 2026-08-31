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
        <p>{english ? "A real Rosales outdoor-kitchen transformation. Move the control to compare the masonry in progress with the completed cooking and gathering space." : "Una transformación real de cocina exterior de Rosales. Mueva el control para comparar la mampostería en proceso con el espacio terminado para cocinar y convivir."}</p>
        <div className="transformation-facts" aria-label={english ? "Project phases" : "Fases del proyecto"}>
          <div><span>01</span><strong>{english ? "Masonry base" : "Base de mampostería"}</strong></div>
          <div><span>02</span><strong>{english ? "Stone & finish" : "Piedra y acabado"}</strong></div>
          <div><span>03</span><strong>{english ? "Outdoor kitchen" : "Cocina exterior"}</strong></div>
        </div>
        {!compact && <Link href="/projects/" className="text-link">{t.explore}<ArrowRight size={16} /></Link>}
      </div>
      <figure className="transformation-figure">
        <div className="comparison-stage" style={stageStyle}>
          <img className="comparison-image" src={assets.outdoorKitchenAfter} alt={english ? "Completed outdoor kitchen with stone masonry by Rosales" : "Cocina exterior terminada con mampostería de piedra por Rosales"} loading="lazy" decoding="async" />
          <img className="comparison-image comparison-before" src={assets.outdoorKitchenBefore} alt={english ? "Outdoor kitchen masonry in progress before the Rosales finish work" : "Mampostería de cocina exterior en proceso antes de los acabados de Rosales"} loading="lazy" decoding="async" />
          <div className="comparison-divider" aria-hidden="true"><span><GripVertical size={18} /></span></div>
          <span className="comparison-label comparison-label-before">{english ? "Before · masonry in progress" : "Antes · mampostería en proceso"}</span>
          <span className="comparison-label comparison-label-after">{english ? "After · completed kitchen" : "Después · cocina terminada"}</span>
        </div>
        <figcaption>
          <label htmlFor={rangeId}><MoveHorizontal size={16} />{english ? "Drag to reveal each stage" : "Arrastre para revelar cada etapa"}</label>
          <input id={rangeId} type="range" min="0" max="100" value={split} onChange={event => setSplit(Number(event.target.value))} aria-valuetext={english ? `${split}% masonry in progress, ${100 - split}% completed kitchen` : `${split}% mampostería en proceso, ${100 - split}% cocina terminada`} />
          <output aria-live="polite">{split}% / {100 - split}%</output>
        </figcaption>
      </figure>
    </div>
  </section>;
}
