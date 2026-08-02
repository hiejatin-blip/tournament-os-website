import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionHeading, Stagger, StaggerItem } from "./ui";
import { Cpu, Network, Zap, Globe2 } from "lucide-react";

/* ============================================================================
   SystemCore — the engine visual, rebuilt WITHOUT three.js.
   A pure-CSS animated core: rotating orbital rings, orbiting node chips,
   pulsing energy field. Lightweight, GPU-composited, reduced-motion aware.
   The old WebGL icosahedron (Scene3D.tsx) is archived — no longer needed.
   ============================================================================ */

const NODES = [
  { label: "check-in", angle: 0 },
  { label: "seed", angle: 60 },
  { label: "bracket", angle: 120 },
  { label: "notify", angle: 180 },
  { label: "score", angle: 240 },
  { label: "advance", angle: 300 },
];

function CoreVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[440px]" aria-hidden>
      {/* glow field */}
      <div className="absolute inset-[12%] rounded-full bg-cyan-500/[0.07] blur-3xl animate-breathe" />

      {/* rings */}
      <div className="absolute inset-[6%] rounded-full border border-white/[0.06] animate-spin-slow" />
      <div className="absolute inset-[18%] rounded-full border border-dashed border-cyan-400/20 animate-spin-slow [animation-direction:reverse] [animation-duration:28s]" />
      <div className="absolute inset-[30%] rounded-full border border-white/[0.05]" />

      {/* orbiting nodes */}
      {NODES.map((n) => (
        <div
          key={n.label}
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `translate(-50%,-50%) rotate(${n.angle}deg) translateX(190px) rotate(-${n.angle}deg)`,
          }}
        >
          <div className="flex flex-col items-center gap-1.5">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/8 bg-void-800 text-[9px] font-bold uppercase tracking-wider text-cyan-300 shadow-[0_0_20px_-6px_rgba(34,211,238,0.5)]">
              {n.label}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/70" />
          </div>
        </div>
      ))}

      {/* core */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative grid h-28 w-28 place-items-center rounded-full border border-cyan-400/30 bg-void-900 shadow-[0_0_60px_-10px_rgba(34,211,238,0.6)]">
          <div className="absolute inset-0 animate-pulse-ring rounded-full" />
          <Cpu className="h-8 w-8 text-cyan-300" />
          <span className="absolute -bottom-5 font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-300/80">
            core
          </span>
        </div>
      </div>
    </div>
  );
}

export function SystemCore() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateZ = useTransform(scrollYProgress, [0, 0.5, 1], [4, 0, -4]);

  const specs = [
    { icon: Cpu, label: "6-core orchestrator", value: "realtime" },
    { icon: Network, label: "Event-driven pipeline", value: "zero-copy" },
    { icon: Zap, label: "Sub-50ms latency", value: "~38ms" },
    { icon: Globe2, label: "28 edge regions", value: "global" },
  ];

  return (
    <section id="engine" ref={ref} className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.05),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The engine"
          title={<>One core. <span className="text-gradient-cyan">Every system.</span></>}
          description="Registration, verification, brackets, scheduling, and live ops run on a single event-driven core — so nothing ever drifts out of sync."
        />

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
          <motion.div style={{ rotateZ }} className="order-2 lg:order-1">
            <CoreVisual />
          </motion.div>

          <div className="order-1 lg:order-2">
            <Stagger className="grid gap-4 sm:grid-cols-2">
              {specs.map((s) => (
                <StaggerItem key={s.label} className="h-full">
                  <div className="mo-lift group h-full rounded-2xl glass-card p-5">
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 transition-transform duration-500 group-hover:scale-110">
                      <s.icon className="h-5 w-5" />
                    </span>
                    <p className="mt-4 text-sm font-semibold text-hi">{s.label}</p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-cyan-300/80">{s.value}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <p className="mt-6 text-sm leading-relaxed text-mid">
              Every action fires a typed event that ripples through dependent systems instantly —
              check-ins update brackets, results update standings, standings update Discord, all in lockstep.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
