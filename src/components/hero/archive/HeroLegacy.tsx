import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button, LiveDot } from "../../ui";
import NumberTicker from "@/components/magic/number-ticker";
import ShimmerButton from "@/components/magic/shimmer-button";
import FlowField from "@/components/ui-lib/kokonutui/backgrounds/flow-field";
import { BootSequence } from "@/components/archive/boot/BootSequence";
import { LampEffect } from "@/components/aceternity/lamp-effect";
import { MacbookScroll } from "@/components/aceternity/macbook-scroll";
import { heroStats } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ease } from "@/shared/motion/motion-tokens";

/* Word-by-word reveal (kept from the original hero) */
function WordReveal({ text, className, delay = 0, stagger = 0.07 }: { text: string; className?: string; delay?: number; stagger?: number }) {
  return (
    <span className={cn("inline-flex flex-wrap", className)}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="overflow-hidden px-[0.1em]">
          <motion.span className="inline-block" initial={{ y: "120%", rotateZ: 4 }} animate={{ y: 0, rotateZ: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 20, delay: delay + i * stagger }}
          >{w}</motion.span>
        </span>
      ))}
    </span>
  );
}

/* ============================================================================
   Hero — LampEffect headline (centered) + stats band + MacbookScroll demo.
   The old side-by-side tilt console is replaced by the MacBook (per the
   redesign direction); the separate DashboardShowcase section on Home was
   removed since the demo now lives here.
   ============================================================================ */
export function Hero() {
  return (
    <>
      <BootSequence onDone={() => {}} />
      <section id="top" className="relative overflow-hidden pt-20 sm:pt-24">
        {/* Layer 1 — FlowField (pure-canvas particle flow, no CDN dependency) */}
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
          <FlowField theme="ocean" density="sparse"><></></FlowField>
        </div>
        {/* Layer 2 — Grid + noise */}
        <div className="pointer-events-none absolute inset-0 z-[2] bg-grid opacity-20 mask-fade-b" />
        <div className="pointer-events-none absolute inset-0 z-[2] bg-noise" />

        {/* Lamp headline — content is centered over the beam */}
        <LampEffect className="relative z-10 pt-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="flex justify-center">
            <span className="group inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 transition-colors hover:border-cyan-400/25">
              <LiveDot />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300">v4.2 · all systems operational</span>
              <span className="ml-1 h-3 w-px bg-white/10" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-lo">not a bot</span>
            </span>
          </motion.div>

          <h1 className="mt-7 max-w-5xl text-center text-balance text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.2rem]">
            <span className="block"><WordReveal text="The operating system" delay={0.25} /></span>
            <span className="mt-2 block"><WordReveal text="for" delay={0.6} className="text-mid" />{" "}<span className="text-gradient-cyan text-glow-cyan"><WordReveal text="competitive" delay={0.7} /></span>{" "}<WordReveal text="tournaments." delay={0.9} /></span>
          </h1>

          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }} className="mx-auto mt-6 max-w-xl text-center text-base leading-relaxed text-mid sm:text-lg">
            Tournament OS automates the entire lifecycle — registration, verification, brackets, scheduling, and live match operations — so your staff can run the event, not the logistics.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.35 }} className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <ShimmerButton
              onClick={() => { document.querySelector("#cta")?.scrollIntoView({ behavior: "smooth" }); }}
              className="h-11 px-7 text-[15px]"
            >
              Deploy Tournament OS <ArrowRight className="h-4 w-4" />
            </ShimmerButton>
            <Button variant="secondary" size="lg" href="#automation" icon={Play}>Watch it run</Button>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-5 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-lo">
            No credit card · Deploys in minutes · SOC 2 ready
          </motion.p>
        </LampEffect>

        {/* Stats band */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: ease.emphasized }}
          className="relative z-10 mx-auto -mt-16 grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/6 bg-white/[0.02] px-5 sm:px-8 md:grid-cols-4"
        >
          {heroStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.08, ease: ease.emphasized }}
              className="group/stat relative bg-void-900/50 p-5 backdrop-blur transition-colors duration-500 hover:bg-void-850/70 sm:p-6"
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent transition-transform duration-500 group-hover/stat:scale-x-100" />
              <div className="text-center font-display text-3xl font-bold text-hi transition-colors group-hover/stat:text-cyan-200 sm:text-4xl">
                {s.prefix}<NumberTicker value={s.value} decimalPlaces={s.decimals ?? 0} />{s.suffix}
              </div>
              <p className="mt-1.5 text-center text-xs text-mid sm:text-sm">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* MacBook product demo — scrolls the real dashboard */}
        <div className="relative z-10 mt-4">
          <MacbookScroll
            src="/macbook-dashboard.jpg"
            title="One control surface for the whole operation."
          />
        </div>
      </section>
    </>
  );
}
