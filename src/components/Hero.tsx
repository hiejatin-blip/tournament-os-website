import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Play, Trophy, GitBranch, Gauge, Zap } from "lucide-react";
import { Button, LiveDot } from "./ui";
import NumberTicker from "@/components/magic/number-ticker";
import ShimmerButton from "@/components/magic/shimmer-button";
import { fireConfetti } from "@/components/magic/confetti";
import FlowField from "@/components/ui-lib/kokonutui/backgrounds/flow-field";
import { LampEffect } from "@/components/aceternity/lamp-effect";
import { MacbookScroll } from "@/components/aceternity/macbook-scroll";
import { heroStats, liveMatches } from "@/lib/data";
import { ease } from "@/shared/motion/motion-tokens";
import { cn } from "@/lib/utils";

/* ============================================================================
   HERO — "Competition, on autopilot."
   ----------------------------------------------------------------------------
   NO BOOT. The page opens straight into the lamp-lit headline — entrance
   choreography fires on mount. Creative layer: holographic gradient on the
   headline, drifting gradient orbs, confetti on the primary CTA, live match
   chips, floating stat chips, and the MacBook product demo.
   ============================================================================ */

const STAT_ICONS = [Trophy, GitBranch, Gauge, Zap] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: ease.emphasized } },
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [confettiFired, setConfettiFired] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0.35]);

  function deploy() {
    if (!confettiFired) {
      setConfettiFired(true);
      fireConfetti({ particleCount: 220, origin: { x: 0.5, y: 0.4 } });
    }
    document.querySelector("#cta")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section id="top" ref={ref} className="relative overflow-hidden pt-16 sm:pt-20">
      {/* Layer 1 — FlowField ambient particles */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <FlowField theme="ocean" density="sparse"><></></FlowField>
      </div>
      {/* Layer 2 — grid + noise texture */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-grid opacity-20 mask-fade-b" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-noise" />
      {/* Layer 3 — drifting gradient orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
        <div className="animate-drift absolute -left-40 top-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="animate-drift-slow absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-amber-500/[0.07] blur-[110px]" />
        <div className="animate-drift absolute bottom-40 left-1/3 h-72 w-72 rounded-full bg-violet-500/[0.06] blur-[100px] [animation-delay:-8s]" />
      </div>

      <motion.div style={{ opacity: heroOpacity }} className="relative z-10">
        {/* ============ LAMP HEADLINE — instant entrance ============ */}
        <motion.div initial="hidden" animate="show" variants={container}>
          <LampEffect>
            {/* Broadcast-style live chip */}
            <motion.div variants={item} className="flex justify-center">
              <span className="group inline-flex items-center gap-2.5 rounded-full glass px-3.5 py-1.5 transition-colors hover:border-cyan-400/25">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300">
                  WinterCup 2026 · Quarterfinals live
                </span>
              </span>
            </motion.div>

            {/* Headline — holographic animated gradient on the second line */}
            <motion.h1
              variants={item}
              className="mt-8 max-w-5xl text-center font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.2rem]"
            >
              <span className="block text-gradient">Competition,</span>
              <span className="block">
                <span className="text-gradient-holo">on autopilot.</span>
              </span>
            </motion.h1>

            {/* Pipeline strip */}
            <motion.p variants={item} className="mt-6 font-mono text-[11px] uppercase tracking-[0.24em] text-mid sm:text-xs">
              Registration <span className="text-cyan-300">→</span> Seeding{" "}
              <span className="text-cyan-300">→</span> Brackets{" "}
              <span className="text-cyan-300">→</span> Live Ops{" "}
              <span className="text-cyan-300">→</span> Results
            </motion.p>

            <motion.p
              variants={item}
              className="mx-auto mt-6 max-w-2xl text-balance text-center text-base leading-relaxed text-mid sm:text-lg"
            >
              Tournament OS automates the entire lifecycle of competitive play — so your staff run
              the event, not the logistics.
            </motion.p>

            {/* CTAs — primary fires confetti */}
            <motion.div variants={item} className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
              <ShimmerButton onClick={deploy} className="h-12 px-8 text-[15px]">
                Deploy Tournament OS <ArrowRight className="h-4 w-4" />
              </ShimmerButton>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => document.querySelector("#demo")?.scrollIntoView({ behavior: "smooth" })}
                icon={Play}
              >
                Watch the demo
              </Button>
            </motion.div>

            {/* Live match chips */}
            <motion.div variants={item} className="mt-12 flex flex-wrap items-center justify-center gap-2">
              {liveMatches.map((m) => (
                <span
                  key={m.a + m.b}
                  className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] px-3.5 py-1.5 backdrop-blur transition-colors hover:border-cyan-400/25"
                >
                  <LiveDot className="scale-75" color="bg-rose-400" />
                  <span className="font-mono text-[11px] text-hi">{m.a}</span>
                  <span className="font-mono text-[10px] text-lo">vs</span>
                  <span className="font-mono text-[11px] text-mid">{m.b}</span>
                  <span className="rounded border border-white/8 px-1.5 py-px font-mono text-[10px] text-cyan-300">{m.score}</span>
                </span>
              ))}
            </motion.div>
          </LampEffect>
        </motion.div>

        {/* ============ FLOATING STAT CHIPS ============ */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
          className="relative z-10 mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-3 px-5 sm:px-8 md:grid-cols-4"
        >
          {heroStats.map((s, i) => {
            const Icon = STAT_ICONS[i % STAT_ICONS.length];
            return (
              <motion.div
                key={s.label}
                variants={item}
                className="group flex items-center gap-4 rounded-2xl glass-card px-5 py-4 transition-transform duration-500 hover:-translate-y-1"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 transition-all duration-500 group-hover:glow-cyan">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <div className="font-display text-2xl font-bold text-hi tabular-nums">
                    {s.prefix}<NumberTicker value={s.value} decimalPlaces={s.decimals ?? 0} />{s.suffix}
                  </div>
                  <p className="truncate text-xs text-mid">{s.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ============ MACBOOK DEMO ============ */}
        <div id="demo" className="relative z-10 mt-6 scroll-mt-20">
          <MacbookScroll
            src="/macbook-dashboard.jpg"
            title="One control surface for the whole operation."
          />
        </div>
      </motion.div>
    </section>
  );
}

