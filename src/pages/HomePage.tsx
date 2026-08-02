import { Hero } from "../components/Hero";
import { TrustBar } from "../components/TrustBar";
import { Paradigm } from "../components/Paradigm";
import { SystemCore } from "../components/SystemCore";
import { AutomationCore } from "../components/AutomationCore";
import { Lifecycle } from "../components/Lifecycle";
import { Modules } from "../components/Modules";
import { Analytics } from "../components/Analytics";
import { Testimonials } from "../components/Testimonials";
import { Pricing as PricingSection } from "../components/Pricing";
import { FAQ } from "../components/FAQ";
import { CTA } from "../components/CTA";
import { InteractiveSim } from "../components/InteractiveSim";
import { SectionSeam } from "../components/ui";
import { ExploreTeaser } from "../components/site/ExploreTeaser";
import { CompareSection } from "../components/CompareSection";
import { HowItWorks } from "../components/HowItWorks";
import { GlobeBand } from "../components/GlobeBand";
import { ScrollBasedVelocity } from "../components/magic/scroll-based-velocity";
import { IntegrationsOrbit } from "../components/IntegrationsOrbit";

/* Below-fold sections get content-visibility for scroll perf (Phase 4) */
const SECTION_CLS = "section [content-visibility:auto] [contain-intrinsic-size:auto_800px]";

export function HomePage() {
  return (
    <>
      <Hero />
      <div className={SECTION_CLS}><TrustBar /></div>
      <div className={SECTION_CLS}><Paradigm /></div>
      <SectionSeam label="engine" />
      <div className={SECTION_CLS}><SystemCore /></div>
      <div className={SECTION_CLS}><InteractiveSim /></div>
      <div className={SECTION_CLS}><AutomationCore /></div>
      <div className={SECTION_CLS}><HowItWorks /></div>
      <SectionSeam label="lifecycle" />
      <div className={SECTION_CLS}><Lifecycle /></div>
      <div className={SECTION_CLS}><Modules /></div>
      <div className={SECTION_CLS}><Analytics /></div>
      <div className={SECTION_CLS}><IntegrationsOrbit /></div>
      <div className={SECTION_CLS}><GlobeBand /></div>
      <div className={SECTION_CLS}><ExploreTeaser /></div>
      <div className={SECTION_CLS}><CompareSection /></div>
      {/* Velocity statement band */}
      <ScrollBasedVelocity text="COMPETITION · ON AUTOPILOT" className="text-hi/80" />
      <SectionSeam label="proof" />
      <div className={SECTION_CLS}><Testimonials /></div>
      <div className={SECTION_CLS}><PricingSection /></div>
      <div className={SECTION_CLS}><FAQ /></div>
      <div className={SECTION_CLS}><CTA /></div>
    </>
  );
}
