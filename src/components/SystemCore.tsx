import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Cpu } from "lucide-react";

/* ============================================================================
   SystemCore — the engine visual, rebuilt WITHOUT three.js.
   A pure-CSS animated core: rotating orbital rings, orbiting node chips,
   pulsing energy field. Lightweight, GPU-composited, reduced-motion aware.
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
      <div className="absolute inset-[12%] rounded-full bg-cyan-500/[0.07] blur-3xl" />
      <div className="absolute inset-[6%] rounded-full border border-white/[0.06] animate-spin-slow" />
      <div className="absolute inset-[18%] rounded-full border border-dashed border-cyan-400/20 animate-spin-slow [animation-direction:reverse] [animation-duration:28s]" />
      <div className="absolute inset-[30%] rounded-full border border-white/[0.05]" />

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

  return (
    <section id="engine" ref={ref} className="relative overflow-hidden py-24 sm:py-32">
      {/* ambient — the orbit core floats BEHIND the type */}
      <motion.div
        style={{ rotateZ }}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[1.7] opacity-30 blur-[2px]"
      >
        <CoreVisual />
      </motion.div>

      <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-300/80">
          The engine
        </p>
        <p className="mt-8 font-display text-6xl font-bold leading-none tracking-tight text-hi sm:text-8xl">
          38<span className="text-hi/40">ms</span>
        </p>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.24em] text-mid">
          event to reaction, every system
        </p>

        <p className="mx-auto mt-8 max-w-2xl text-balance text-base leading-relaxed text-mid sm:text-lg">
          Registration, verification, brackets, scheduling, and live ops run on one event loop.
          A check-in updates the bracket; the bracket updates Discord; Discord updates the standings —{" "}
          <span className="text-hi">in the same tick.</span>
        </p>

        <div className="mx-auto mt-12 max-w-xl divide-y divide-white/6 border-y border-white/6">
          {[
            { k: "Event loop", v: "6-core orchestrator" },
            { k: "Pipeline", v: "zero-copy dispatch" },
            { k: "Latency", v: "~38ms p50" },
            { k: "Edge regions", v: "28" },
            { k: "Audit trail", v: "append-only log" },
          ].map((row) => (
            <div key={row.k} className="flex items-baseline justify-between py-3.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-lo">{row.k}</span>
              <span className="text-sm font-medium text-hi">{row.v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
