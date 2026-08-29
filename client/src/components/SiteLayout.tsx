import { ReactNode, useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { assets, copy, email, navItems, phone, phoneHref, socialLinks } from "@/lib/site-content";
import { useLocale } from "@/contexts/LocaleContext";

export function scrollToEstimate() {
  const target = document.getElementById("estimate");
  if (target) window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
}

function openLeadPrimeChat() {
  const button = document.getElementById("lp-widget-btn");
  if (button) button.click(); else window.dispatchEvent(new Event("leadprime:unavailable"));
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const { locale, setLocale } = useLocale();
  const t = copy[locale];
  const [open, setOpen] = useState(false);
  const [chatUnavailable, setChatUnavailable] = useState(false);
  const [location] = useLocation();
  useEffect(() => { setOpen(false); window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, [location]);
  useEffect(() => {
    const showFallback = () => setChatUnavailable(true);
    window.addEventListener("leadprime:unavailable", showFallback);
    return () => window.removeEventListener("leadprime:unavailable", showFallback);
  }, []);

  return <div className="site-shell">
    <a className="skip-link" href="#main">{locale === "en" ? "Skip to content" : "Saltar al contenido"}</a>
    <div className="utility-bar"><div className="container utility-inner"><span>{t.license}</span><span>{t.serviceArea}</span><a href={phoneHref}><Phone size={14} /> {phone}</a></div></div>
    <header className="site-header"><div className="container nav-row">
      <Link href="/" className="brand" aria-label="Rosales Landscaping & Construction home"><img src={assets.logo} alt="Rosales Landscaping & Construction Inc" /></Link>
      <nav className="desktop-nav" aria-label={t.navLabel}>{navItems.map(item => <Link key={item.href} href={item.href} className={location === item.href || (item.href !== "/" && location.startsWith(item.href)) ? "active" : ""}>{t[item.key]}</Link>)}</nav>
      <div className="nav-actions"><div className="language-toggle" role="group" aria-label={t.language}><button onClick={() => setLocale("en")} aria-pressed={locale === "en"}>EN</button><span>/</span><button onClick={() => setLocale("es")} aria-pressed={locale === "es"}>ES</button></div><Link className="button button-primary header-cta" href="/contact/#estimate">{t.estimate}</Link><button className="mobile-menu-button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? t.close : t.menu}>{open ? <X /> : <Menu />}</button></div>
    </div>{open && <nav id="mobile-nav" className="mobile-nav" aria-label={t.navLabel}>{navItems.map(item => <Link key={item.href} href={item.href}>{t[item.key]}</Link>)}<Link className="button button-primary" href="/contact/#estimate">{t.estimate}</Link></nav>}</header>
    <main id="main">{children}</main>
    {chatUnavailable && <aside className="chat-fallback" role="status"><div><strong>{locale === "en" ? "Our project chat is temporarily unavailable." : "El chat de proyectos no está disponible temporalmente."}</strong><span>{locale === "en" ? "Call us for immediate assistance." : "Llámenos para recibir ayuda inmediata."}</span></div><a href={phoneHref}>{phone}</a><button onClick={() => setChatUnavailable(false)} aria-label={t.close}>×</button></aside>}
    <footer className="site-footer"><div className="container footer-grid"><div><img className="footer-logo" src={assets.logo} alt="Rosales Landscaping & Construction Inc" /><p>{locale === "en" ? "Crafting lasting outdoor spaces across Napa, Vallejo, and the North Bay." : "Creamos espacios exteriores duraderos en Napa, Vallejo y North Bay."}</p></div><div><span className="footer-label">{locale === "en" ? "Explore" : "Explorar"}</span>{navItems.slice(1).map(item => <Link key={item.href} href={item.href}>{t[item.key]}</Link>)}</div><div><span className="footer-label">{locale === "en" ? "Start your project" : "Comience su proyecto"}</span><a href={phoneHref}>{phone}</a><a href={`mailto:${email}`}>{email}</a><Link className="footer-button" href="/contact/#estimate">{t.estimate} →</Link></div><div><span className="footer-label">{locale === "en" ? "Follow our work" : "Siga nuestro trabajo"}</span><div className="social-links">{socialLinks.map(link => <a key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label}</a>)}</div><button className="footer-button" onClick={openLeadPrimeChat}>{t.chat} →</button></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Rosales Landscaping & Construction Inc.</span><Link href="/privacy/">{locale === "en" ? "Privacy" : "Privacidad"}</Link><span>{t.license}</span></div></footer>
  </div>;
}
