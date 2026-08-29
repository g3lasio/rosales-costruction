import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LeadPrimeWidget } from "@/components/LeadPrimeWidget";
import { SiteLayout } from "@/components/SiteLayout";
import { LocaleProvider } from "@/contexts/LocaleContext";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ServicePage from "./pages/ServicePage";
import ServicesPage from "./pages/ServicesPage";
import { AboutPage, AreasPage, ContactPage, PrivacyPage, ProjectsPage, ReviewsPage, TermsPage } from "./pages/InformationPages";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/services"} component={ServicesPage} />
      <Route path={"/services/"} component={ServicesPage} />
      <Route path={"/services/:slug"} component={ServicePage} />
      <Route path={"/services/:slug/"} component={ServicePage} />
      <Route path={"/projects"} component={ProjectsPage} />
      <Route path={"/projects/"} component={ProjectsPage} />
      <Route path={"/gallery"} component={ProjectsPage} />
      <Route path={"/gallery/"} component={ProjectsPage} />
      <Route path={"/about"} component={AboutPage} />
      <Route path={"/about/"} component={AboutPage} />
      <Route path={"/areas-we-serve"} component={AreasPage} />
      <Route path={"/areas-we-serve/"} component={AreasPage} />
      <Route path={"/reviews"} component={ReviewsPage} />
      <Route path={"/reviews/"} component={ReviewsPage} />
      <Route path={"/contact"} component={ContactPage} />
      <Route path={"/contact/"} component={ContactPage} />
      <Route path={"/privacy"} component={PrivacyPage} />
      <Route path={"/privacy/"} component={PrivacyPage} />
      <Route path={"/privacy-policy"} component={PrivacyPage} />
      <Route path={"/privacy-policy/"} component={PrivacyPage} />
      <Route path={"/terms"} component={TermsPage} />
      <Route path={"/terms/"} component={TermsPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LocaleProvider>
          <TooltipProvider>
            <SiteLayout><Router /></SiteLayout>
            <LeadPrimeWidget />
            <Toaster />
          </TooltipProvider>
        </LocaleProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
