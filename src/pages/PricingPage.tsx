import { Check, ArrowRight } from "lucide-react";
import { PageHeader } from "../components/site/PageHeader";
import { PageSection, CTABand } from "../components/site/blocks";
import { Button, Stagger, StaggerItem , spotlightHandlers } from "../components/ui";
import { pricingTiers, faqs } from "@/lib/data";
import BorderBeam from "@/components/magic/border-beam";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export function PricingPage() {
  return (
    <>
      <PageHeader eyebrow="Pricing" title={<>Start free. Scale to a <span className="text-gradient-cyan">global organization.</span></>} description="Transparent plans that grow with you — from your first community bracket to worldwide championship circuits." />

      <PageSection>
        <Stagger className="grid items-stretch gap-5 lg:grid-cols-3">
          {pricingTiers.map((t) => (
            <StaggerItem key={t.name} className="h-full">
              <div
                {...spotlightHandlers}
                className={cn("spotlight group relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 transition-all duration-500 hover:-translate-y-1.5", t.featured ? "border-cyan-400/35 bg-gradient-to-b from-cyan-400/[0.06] to-transparent elev-3 lg:-mt-4" : "border-white/6 bg-white/[0.02] hover:border-cyan-400/25")}
              >
                {t.featured && <>
                  <BorderBeam size={220} duration={8} />
                  <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-40 -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl animate-breathe" />
                  <span className="absolute right-5 top-5 rounded-full border border-cyan-400/35 bg-cyan-400/12 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300">Most popular</span>
                </>}
                <span className="relative grid h-11 w-11 place-items-center rounded-xl border border-white/8 bg-void-800 text-cyan-300 transition-all duration-500 group-hover:glow-cyan group-hover:scale-105"><t.icon className="h-5 w-5" /></span>
                <h3 className="mt-5 text-lg font-semibold text-hi">{t.name}</h3>
                <p className="mt-1 text-sm text-mid">{t.tagline}</p>
                <div className="mt-5 flex items-baseline gap-1.5"><span className="font-display text-4xl font-bold text-hi group-hover:text-cyan-100">{t.price}</span><span className="text-sm text-lo">/ {t.cadence}</span></div>
                <Button variant={t.featured ? "primary" : "outline"} size="md" href="/login" iconRight={ArrowRight} className="mt-6 w-full" magnetic={false}>{t.cta}</Button>
                <ul className="mt-7 space-y-3 border-t border-white/6 pt-6">{t.features.map((f) => (<li key={f} className="flex items-start gap-2.5 text-sm text-mid"><Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />{f}</li>))}</ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-8 text-center text-sm text-lo">Every plan includes automated registration, check-ins, brackets &amp; Discord integration.</p>
      </PageSection>

      <PageSection eyebrow="Questions" heading="Pricing FAQ">
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="rounded-2xl glass-card px-2">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-white/6">
                <AccordionTrigger className="px-3 text-left text-[15px] font-medium text-hi hover:text-cyan-100 sm:text-base">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-5 text-sm leading-relaxed text-mid">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </PageSection>

      <CTABand />
    </>
  );
}
