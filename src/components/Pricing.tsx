import { motion } from "framer-motion";
import { Check, ArrowRight, Minus } from "lucide-react";
import { ParallaxSection, SectionHeading, Button, Stagger, StaggerItem, spotlightHandlers } from "./ui";
import { pricingTiers } from "@/lib/data";
import BorderBeam from "@/components/magic/border-beam";
import { cn } from "@/lib/utils";

/* ============================================================================
   Pricing — 3 tiers + a real compare table (the single most useful pricing
   element: feature rows × 3 tiers, check/dash per cell).
   ============================================================================ */

const COMPARE_ROWS: { feature: string; values: [boolean, boolean, boolean] }[] = [
  { feature: "Players per event", values: [true, true, true] },
  { feature: "Concurrent events", values: [false, true, true] },
  { feature: "Single & double elimination", values: [true, true, true] },
  { feature: "Swiss & round-robin formats", values: [false, true, true] },
  { feature: "Automated registration & check-in", values: [true, true, true] },
  { feature: "Verification & anti-smurf", values: [false, true, true] },
  { feature: "Custom branding & domains", values: [false, true, true] },
  { feature: "Staff console & role-based access", values: [false, true, true] },
  { feature: "API & webhooks", values: [false, false, true] },
  { feature: "SSO / SAML & SOC 2 controls", values: [false, false, true] },
  { feature: "Dedicated success manager", values: [false, false, true] },
];

export function Pricing() {
  return (
    <ParallaxSection id="pricing" className="relative py-20 sm:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-[0.05] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000,transparent)]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="Pricing" title={<>Start free. <span className="text-hi">Scale past 1,024 slots.</span></>} description="Transparent plans that grow with you." />

        <Stagger className="mt-14 grid items-stretch gap-5 lg:grid-cols-3">
          {pricingTiers.map((t) => (
            <StaggerItem key={t.name} className="h-full">
              <div
                {...spotlightHandlers}
                className={cn(
                  "spotlight group relative flex h-full flex-col overflow-hidden rounded-3xl border p-7 transition-all duration-500 hover:-translate-y-1.5",
                  t.featured ? "conic-border border-cyan-400/35 bg-gradient-to-b from-cyan-400/[0.06] to-transparent elev-3 lg:-mt-4" : "border-white/6 bg-white/[0.02] hover:border-cyan-400/25",
                )}
              >
                {t.featured && (
                  <>
                    <BorderBeam size={220} duration={8} />
                    <span className="absolute right-5 top-5 rounded-full border border-cyan-400/35 bg-cyan-400/12 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300">Most popular</span>
                  </>
                )}
                <span className="relative grid h-11 w-11 place-items-center rounded-xl border border-white/8 bg-void-800 text-cyan-300 transition-all duration-500 group-hover:border-cyan-400/40">
                  <t.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-hi">{t.name}</h3>
                <p className="mt-1 text-sm text-mid">{t.tagline}</p>
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-display text-4xl font-bold text-hi transition-colors group-hover:text-cyan-100">{t.price}</span>
                  <span className="text-sm text-lo">/ {t.cadence}</span>
                </div>
                <Button variant={t.featured ? "primary" : "outline"} size="md" href="#cta" iconRight={ArrowRight} className="mt-6 w-full" magnetic={false}>{t.cta}</Button>
                <ul className="mt-7 space-y-3 border-t border-white/6 pt-6">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-mid">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Compare table — real feature × tier matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
          className="mt-14 overflow-hidden rounded-2xl border border-white/6"
        >
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-6 border-b border-white/6 bg-white/[0.02] px-5 py-3.5 sm:px-7">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-lo">Compare plans</span>
            {pricingTiers.map((t) => (
              <span key={t.name} className={cn("w-16 text-center font-mono text-[11px] uppercase tracking-wider sm:w-20", t.featured ? "text-cyan-300" : "text-mid")}>
                {t.name}
              </span>
            ))}
          </div>
          {COMPARE_ROWS.map((row, i) => (
            <div
              key={row.feature}
              className={cn(
                "grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-6 px-5 py-3 sm:px-7",
                i % 2 === 1 && "bg-white/[0.01]",
              )}
            >
              <span className="text-sm text-mid">{row.feature}</span>
              {row.values.map((v, vi) => (
                <span key={vi} className={cn("grid w-16 place-items-center sm:w-20", vi === 1 && "text-cyan-300")}>
                  {v ? <Check className="h-4 w-4 text-cyan-300" /> : <Minus className="h-4 w-4 text-white/15" />}
                </span>
              ))}
            </div>
          ))}
        </motion.div>

        <p className="mt-8 text-center text-sm text-lo">Every plan includes automated registration, check-ins, brackets &amp; Discord integration.</p>
      </div>
    </ParallaxSection>
  );
}
