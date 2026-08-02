import { useRef } from "react";
import { useIsMobile } from "@/shared/hooks/useIsMobile";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { SectionHeading } from "./ui";
import { lifecycle, automationLog } from "@/lib/data";
import { cn } from "@/lib/utils";

/* ============================================================================
   LIFECYCLE — "The Bracket That Draws Itself"
   ----------------------------------------------------------------------------
   A sticky stage where an SVG flow/bracket draws itself as you scroll, and
   the 8 lifecycle stages light up in sequence as the draw passes them.
   Below the draw, the real automation log types itself out progressively.

   - 200vh runway · sticky stage · spring-smoothed progress
   - serpentine path: Create → Register → Verify → Check-in → Seed → Bracket
     → Go Live → Resolve
   - each node glows when the draw reaches it; log lines appear in step
   - reduced motion → static fully-drawn state
   ============================================================================ */

/* node positions on a 100×100 field, serpentine flow */
const POS = [
  { x: 22, y: 18 }, // Create
  { x: 22, y: 38 }, // Register
  { x: 22, y: 58 }, // Verify
  { x: 22, y: 78 }, // Check-in
  { x: 78, y: 78 }, // Seed
  { x: 78, y: 58 }, // Bracket
  { x: 78, y: 38 }, // Go Live
  { x: 78, y: 18 }, // Resolve
];

/* serpentine polyline through the nodes (rounded joins via stroke props) */
const SIMPLE_PATH = POS.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

const N = lifecycle.length;

function StageNode({
  index,
  progress,
}: {
  index: number;
  progress: ReturnType<typeof useSpring>;
}) {
  const p = POS[index];
  const Icon = lifecycle[index].icon;
  const start = (index / N) * 0.85 + 0.05;
  const end = ((index + 1) / N) * 0.85 + 0.05;

  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  const scale = useTransform(progress, [start, end], [0.8, 1]);
  const glow = useTransform(progress, [start, end], [0, 1]);

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${p.x}%`, top: `${p.y}%`, opacity, scale }}
    >
      <motion.div
        style={{ boxShadow: useTransform(glow, (g) => `0 0 ${14 + g * 18}px ${g * 6}px rgba(34,211,238,${0.15 + g * 0.5})`) }}
        className="grid h-12 w-12 place-items-center rounded-xl border border-cyan-400/30 bg-void-800 text-cyan-300 sm:h-14 sm:w-14"
      >
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
      </motion.div>
      <span className="mt-1.5 block whitespace-nowrap text-center font-mono text-[9px] uppercase tracking-wider text-cyan-300/80 sm:text-[10px]">
        {lifecycle[index].title}
      </span>
    </motion.div>
  );
}

export function Lifecycle() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(reduce || isMobile ? 1 : scrollYProgress, { stiffness: 60, damping: 20 });

  const pathLength = useTransform(progress, [0.05, 0.9], [0, 1]);
  /* how many log lines are revealed */
  const logCount = useTransform(progress, [0.15, 0.95], [1, automationLog.length]);
  const logOpacity = useTransform(progress, [0.05, 0.15], [0, 1]);

  return (
    <section id="lifecycle" ref={ref} style={{ height: reduce || isMobile ? undefined : "200vh" }} className="relative">
      {/* MOBILE: vertical stage list — same 8 stages, no 200vh draw */}
      {isMobile && (
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <div className="mb-6 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-300">The lifecycle</span>
            <h2 className="mt-2 font-display text-2xl font-bold text-hi">From creation to <span className="text-gradient-cyan">resolution.</span></h2>
          </div>
          <div className="space-y-3">
            {lifecycle.map((s, i) => (
              <div key={s.title} className="flex items-center gap-4 rounded-2xl glass-card p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
                  <s.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-hi">{s.title}</p>
                  <p className="truncate text-xs text-mid">{s.desc}</p>
                </div>
                <span className="ml-auto font-mono text-[10px] text-lo/60">{String(i + 1).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STICKY STAGE */}
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-5 sm:px-8">
        {/* ambient */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[70vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.05] blur-[130px] blur-orb blur-orb" />
          <div className="absolute inset-0 bg-grid opacity-[0.08] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000,transparent)]" />
        </div>

        {/* headline (fades as the draw takes over) */}
        <motion.div
          style={{ opacity: useTransform(progress, [0, 0.15], [1, 0]) }}
          className="relative z-10 mb-4 text-center"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-300">
            The lifecycle
          </span>
          <h2 className="mt-2 max-w-2xl text-balance font-display text-2xl font-bold text-hi sm:text-4xl">
            Watch a tournament <span className="text-gradient-cyan">draw itself.</span>
          </h2>
        </motion.div>

        {/* DRAWING STAGE */}
        <div className="relative z-10 aspect-[16/9] w-full max-w-4xl sm:aspect-[2/1]">
          {/* the path */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
            <path
              d={SIMPLE_PATH}
              fill="none"
              stroke="rgba(34,211,238,0.12)"
              strokeWidth="0.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2 2"
            />
            <motion.path
              d={SIMPLE_PATH}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ pathLength }}
              className="drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]"
            />
            {/* traveling pulse head */}
            <motion.circle
              r="1.3"
              fill="#a5f3fc"
              style={{
                opacity: useTransform(progress, [0.05, 0.1, 0.85, 0.95], [0, 1, 1, 0]),
                offsetDistance: useTransform(progress, [0.05, 0.95], ["0%", "100%"]),
                offsetPath: `path("${SIMPLE_PATH}")`,
              }}
            />
          </svg>

          {/* nodes */}
          {lifecycle.map((_, i) => (
            <StageNode key={i} index={i} progress={progress} />
          ))}

          {/* start / end markers */}
          <span className="absolute -bottom-4 left-[16%] font-mono text-[9px] uppercase tracking-wider text-lo">
            start
          </span>
          <span className="absolute -bottom-4 right-[16%] font-mono text-[9px] uppercase tracking-wider text-cyan-300/70">
            resolved
          </span>
        </div>

        {/* AUTOMATION LOG — types out in step with the draw */}
        <motion.div
          style={{ opacity: logOpacity }}
          className="relative z-10 mt-8 w-full max-w-xl rounded-xl border border-white/8 bg-void-950/70 p-3.5 backdrop-blur"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-mid">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
              automation log
            </span>
            <span className="font-mono text-[9px] text-lo">realtime</span>
          </div>
          <div className="space-y-1 font-mono text-[11px] leading-relaxed">
            {automationLog.map((l, i) => (
              <motion.div
                key={l.t + l.msg}
                initial={false}
                className="flex gap-2"
                style={{ opacity: useTransform(logCount, (n) => (i < Math.max(1, Math.round(n)) ? 1 : 0.12)) }}
              >
                <span className="shrink-0 text-lo">{l.t}</span>
                <span className="text-cyan-400/60">›</span>
                <span className={cn(l.tag === "live" ? "font-semibold text-cyan-300" : "text-mid")}>{l.msg}</span>
              </motion.div>
            ))}
            <span className="inline-block h-3 w-1.5 animate-pulse bg-cyan-400 align-middle" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
