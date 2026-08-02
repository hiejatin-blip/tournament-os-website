import { Hero } from "../components/Hero";
import { TrustBar } from "../components/TrustBar";
import { Paradigm } from "../components/Paradigm";
import { SystemCore } from "../components/SystemCore";
import { AutomationCore } from "../components/AutomationCore";
import { Lifecycle } from "../components/Lifecycle";
import { Modules } from "../components/Modules";
import { ZoomSection } from "../components/ZoomSection";
import { Analytics } from "../components/Analytics";
import { DiscordIntegration } from "../components/DiscordIntegration";
import { Testimonials } from "../components/Testimonials";
import { Pricing as PricingSection } from "../components/Pricing";
import { FAQ } from "../components/FAQ";
import { CTA } from "../components/CTA";
import { InteractiveSim } from "../components/InteractiveSim";
import { SectionSeam } from "../components/ui";
import { ExploreTeaser } from "../components/site/ExploreTeaser";
import { CompareSection } from "../components/CompareSection";
import { HowItWorks } from "../components/HowItWorks";
import { IntegrationsOrbit } from "../components/IntegrationsOrbit";

/* Below-fold sections get content-visibility for scroll perf (Phase 4) */
const SECTION_CLS = "section [content-visibility:auto] [contain-intrinsic-size:auto_800px]";

export function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Paradigm />
      <SectionSeam label="engine" />
      <SystemCore />
      <InteractiveSim />
      <div className={SECTION_CLS}><AutomationCore /></div>
      <div className={SECTION_CLS}><HowItWorks /></div>
      <SectionSeam label="lifecycle" />
      <div className={SECTION_CLS}><Lifecycle /></div>
      <ZoomSection id="modules-zoom" rotate={2}>
        <Modules />
      </ZoomSection>
      <div className={SECTION_CLS}><Analytics /></div>
      <div className={SECTION_CLS}><IntegrationsOrbit /></div>
      <ExploreTeaser />
      <CompareSection />
      <SectionSeam label="proof" />
      <ZoomSection id="testimonials-zoom" rotate={1.8}>
        <Testimonials />
      </ZoomSection>
      <PricingSection />
      <FAQ />
      <CTA />
    </>
  );
}
