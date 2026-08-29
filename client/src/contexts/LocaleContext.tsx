import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/site-content";

type LocaleValue = { locale: Locale; setLocale: (locale: Locale) => void };
const LocaleContext = createContext<LocaleValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const setLocale = (next: Locale) => setLocaleState(next);

  useEffect(() => {
    const stored = localStorage.getItem("rosales-locale");
    if (stored === "es" && locale !== "es") {
      setLocaleState("es");
      return;
    }
    localStorage.setItem("rosales-locale", locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale }), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
}
