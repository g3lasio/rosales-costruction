import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { Link } from "wouter";
import { copy, services } from "@/lib/site-content";
import { trpc } from "@/lib/trpc";
import { useLocale } from "@/contexts/LocaleContext";

export function EstimateForm({ defaultService }: { defaultService?: string }) {
  const { locale } = useLocale();
  const t = copy[locale];
  const [startedAt] = useState(() => Date.now());
  const [success, setSuccess] = useState(false);
  const [contactError, setContactError] = useState("");
  const mutation = trpc.lead.submitEstimate.useMutation({ onSuccess: () => setSuccess(true) });
  const options = useMemo(() => services.map(service => ({ value: service.slug, label: service.name[locale] })), [locale]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const phone = String(form.get("phone") || "").trim();
    const email = String(form.get("email") || "").trim();
    if (!phone && !email) { setContactError(t.required); return; }
    setContactError("");
    const params = new URLSearchParams(window.location.search);
    mutation.mutate({
      name: String(form.get("name") || ""), phone, email,
      address: String(form.get("address") || ""), city: String(form.get("city") || ""),
      service: String(form.get("service") || ""), timeline: String(form.get("timeline") || ""),
      message: String(form.get("message") || ""), consent: form.get("consent") === "on", consentText: t.consent,
      pageUrl: window.location.href, startedAt, website: String(form.get("website") || ""),
      utm: Object.fromEntries(["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].map(key => [key, params.get(key) || undefined])),
    });
  }

  if (success) return <div className="form-success" role="status"><CheckCircle2 size={28} /><div><strong>{t.successTitle}</strong><p>{t.successText}</p></div></div>;
  return <form className="estimate-form" onSubmit={submit} noValidate>
    <div className="form-heading"><span className="eyebrow">{locale === "en" ? "Start a conversation" : "Inicie una conversación"}</span><h2>{t.formTitle}</h2><p>{t.formText}</p></div>
    <div className="form-grid"><label>{t.fullName}<input name="name" required autoComplete="name" /></label><label>{t.phone}<input name="phone" type="tel" autoComplete="tel" /></label><label>{t.email}<input name="email" type="email" autoComplete="email" /></label><label>{t.city}<input name="city" autoComplete="address-level2" /></label><label className="wide">{t.address}<input name="address" autoComplete="street-address" /></label><label>{t.service}<select name="service" defaultValue={defaultService || ""}><option value="">{locale === "en" ? "Choose a service" : "Seleccione un servicio"}</option>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label><label>{t.timeline}<select name="timeline" defaultValue=""><option value="">{locale === "en" ? "Select timing" : "Seleccione un plazo"}</option><option value="as_soon_as_possible">{locale === "en" ? "As soon as possible" : "Lo antes posible"}</option><option value="within_1_month">{locale === "en" ? "Within 1 month" : "En 1 mes"}</option><option value="1_to_3_months">{locale === "en" ? "1–3 months" : "1–3 meses"}</option><option value="planning">{locale === "en" ? "I’m planning ahead" : "Estoy planificando"}</option></select></label><label className="wide">{t.message}<textarea name="message" rows={4} placeholder={locale === "en" ? "Scope, materials, measurements, or any details that will help." : "Alcance, materiales, medidas o cualquier detalle que ayude."} /></label></div>
    <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="consent"><input name="consent" type="checkbox" /><span>{t.consent}</span></label>
    {contactError && <p className="form-error" role="alert">{contactError}</p>}{mutation.error && <p className="form-error" role="alert">{t.error}</p>}
    <button className="button button-primary" type="submit" disabled={mutation.isPending}>{mutation.isPending ? <><LoaderCircle size={17} className="spin" /> {t.sending}</> : t.submit}</button>
    <p className="form-privacy">{t.privacyNote} <Link href="/privacy/">{locale === "en" ? "Privacy policy" : "Política de privacidad"}</Link>.</p>
  </form>;
}
