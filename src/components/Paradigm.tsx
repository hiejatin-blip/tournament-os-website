import { useRef } from "react";
import { useIsMobile } from "@/shared/hooks/useIsMobile";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import {
  FileSpreadsheet, MessageSquare, CalendarX, Scale, Tv, Shuffle, Ghost, BatteryLow,
  ClipboardList, ShieldCheck, CalendarCheck, Gauge, GitBranch, BellRing, Trophy, BarChart3,
  Cpu, ArrowRight, Check, X,
} from "lucide-react";
import { SectionHeading } from "./ui";
import { pains, gains } from "@/lib/data";
import { cn } from "@/lib/utils";

/* ============================================================================
   PARADIGM — "Entropy → Engine"
   ----------------------------------------------------------------------------
   A sticky scroll narrative: a field of chaotic nodes (spreadsheets, DMs,
   missed check-ins, disputes, smurfs, burnout…) physically reassembles
   itself into the clean automated pipeline ring around a glowing core as the
   user scrolls. The scroll IS the story: chaos → order, rose → cyan,
   tangled lines → clean beams.

   - 250vh runway, sticky stage
   - 8 chaos nodes at scattered positions → 8 pipeline nodes on a ring
   - cross-fade rose/cyan layers per node, jittered rotation straightens
   - messy star lines dissolve; center→node beams draw in
   - reduced motion: renders the final ordered state statically
   ============================================================================ */

const CHAOS = [
  { icon: FileSpreadsheet, label: "Spreadsheets", x: 12, y: 16, r: -14 },
  { icon: MessageSquare, label: "DM chains", x: 86, y: 14, r: 11 },
  { icon: CalendarX, label: "Missed check-ins", x: 82, y: 78, r: -9 },
  { icon: Scale, label: "Disputes", x: 10, y: 74, r: 16 },
  { icon: Tv, label: "Stream conflicts", x: 50, y: 6, r: 8 },
  { icon: Shuffle, label: "Manual seeding", x: 94, y: 46, r: -18 },
  { icon: Ghost, label: "Smurfs", x: 6, y: 48, r: 12 },
  { icon: BatteryLow, label: "Burnout", x: 50, y: 94, r: -11 },
];

const ORDER = [
  { icon: ClipboardList, label: "Registration", a: -90 },
  { icon: ShieldCheck, label: "Verification", a: -45 },
  { icon: CalendarCheck, label: "Check-in", a: 0 },
  { icon: Gauge, label: "Seeding", a: 45 },
  { icon: GitBranch, label: "Brackets", a: 90 },
  { icon: BellRing, label: "Notify", a: 135 },
  { icon: Trophy, label: "Results", a: 180 },
  { icon: BarChart3, label: "Analytics", a: 225 },
];

/* ring radius in % of stage */
const R = 33;
const orderedPos = ORDER.map((n) => ({
  x: 50 + R * Math.cos((n.a * Math.PI) / 180),
  y: 50 + R * Math.sin((n.a * Math.PI) / 180),
}));

/* messy star edges between chaos nodes (indices) */
const CHAOS_EDGES = [
  [0, 3], [1, 4], [2, 5], [3, 6], [4, 7], [5, 0], [6, 1], [7, 2], [0, 5], [2, 7],
];

const STAGE_H = 250;

function MorphStage({ progress }: { progress: ReturnType<typeof useSpring> }) {
  return (
    <div className="relative mx-auto aspect-[16/10] w-full max-w-4xl sm:aspect-square sm:max-w-[640px]">
      {/* ---- CHAOS EDGES (dissolve) ---- */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        {CHAOS_EDGES.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={CHAOS[a].x} y1={CHAOS[a].y} x2={CHAOS[b].x} y2={CHAOS[b].y}
            stroke="#fb7185"
            strokeWidth="0.35"
            strokeDasharray="1 2.5"
            style={{ opacity: useTransform(progress, [0, 0.35], [0.5, 0]) }}
          />
        ))}
        {/* ---- ORDER BEAMS (draw in) ---- */}
        {ORDER.map((n, i) => (
          <motion.path
            key={`beam-${i}`}
            d={`M 50 50 L ${orderedPos[i].x} ${orderedPos[i].y}`}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="0.6"
            strokeLinecap="round"
            style={{
              opacity: useTransform(progress, [0.55, 0.8], [0, 0.85]),
              pathLength: useTransform(progress, [0.55, 0.95], [0, 1]),
            }}
          />
        ))}
      </svg>

      {/* ---- NODES ---- */}
      {CHAOS.map((c, i) => {
        const o = orderedPos[i];
        const OrderIcon = ORDER[i].icon;
        return (
          <motion.div
            key={c.label}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: useTransform(progress, [0, 1], [`${c.x}%`, `${o.x}%`]),
              top: useTransform(progress, [0, 1], [`${c.y}%`, `${o.y}%`]),
              rotate: useTransform(progress, [0, 1], [c.r, 0]),
            }}
          >
            {/* chaos layer (fades out) */}
            <motion.div
              className="flex flex-col items-center gap-1.5"
              style={{ opacity: useTransform(progress, [0, 0.45], [1, 0]) }}
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl border border-rose-400/30 bg-rose-500/10 text-rose-300 shadow-[0_0_20px_-8px_rgba(251,113,133,0.5)]">
                <c.icon className="h-5 w-5" />
              </span>
              <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-wider text-rose-300/70">
                {c.label}
              </span>
            </motion.div>
            {/* order layer (fades in) */}
            <motion.div
              className="flex flex-col items-center gap-1.5"
              style={{ opacity: useTransform(progress, [0.5, 0.8], [0, 1]) }}
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl border border-cyan-400/30 bg-void-800 text-cyan-300 shadow-[0_0_24px_-8px_rgba(34,211,238,0.7)]">
                {OrderIcon && <OrderIcon className="h-5 w-5" />}
              </span>
              <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-wider text-cyan-300/80">
                {ORDER[i].label}
              </span>
            </motion.div>
          </motion.div>
        );
      })}

      {/* ---- CORE ---- */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          scale: useTransform(progress, [0.45, 0.7], [0, 1]),
          opacity: useTransform(progress, [0.4, 0.65], [0, 1]),
        }}
      >
        <div className="relative grid h-24 w-24 place-items-center rounded-full border border-cyan-400/40 bg-void-900 shadow-[0_0_70px_-10px_rgba(34,211,238,0.8)]">
          <div className="absolute inset-0 animate-pulse-ring rounded-full" />
          <Cpu className="h-8 w-8 text-cyan-300" />
        </div>
      </motion.div>

      {/* ---- PROGRESS LINE ---- */}
      <div className="absolute -bottom-6 left-1/2 h-px w-48 -translate-x-1/2 overflow-hidden bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-rose-400 to-cyan-400"
          style={{ width: useTransform(progress, [0, 1], ["0%", "100%"]) }}
        />
      </div>
    </div>
  );
}

export function Paradigm() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(reduce || isMobile ? 1 : scrollYProgress, { stiffness: 70, damping: 22 });

  /* badge swap */
  const oldOpacity = useTransform(progress, [0, 0.3], [1, 0]);
  const newOpacity = useTransform(progress, [0.45, 0.75], [0, 1]);

  return (
    <section id="paradigm" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The paradigm shift"
          title={<>From spreadsheet chaos to <span className="text-gradient-cyan">an engine that runs itself.</span></>}
          description="Scroll. Watch the mess reassemble into a machine."
        />
      </div>

      {/* STICKY MORPH */}
      <div ref={ref} style={{ height: reduce || isMobile ? undefined : `${STAGE_H}vh` }} className="relative">
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
          {/* ambient */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[60vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/[0.06] blur-[120px] blur-orb blur-orb" />
            <div className="absolute inset-0 bg-grid opacity-[0.08] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000,transparent)]" />
          </div>

          {/* badge swap */}
          <div className="relative z-10 mb-6 flex h-8 items-center">
            <motion.span
              style={{ opacity: oldOpacity }}
              className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-rose-300"
            >
              The old way
            </motion.span>
            <motion.span
              style={{ opacity: newOpacity }}
              className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-300 shadow-[0_0_24px_-6px_rgba(34,211,238,0.6)]"
            >
              The Tournament OS way
            </motion.span>
          </div>

          <MorphStage progress={progress} />

          <p className="relative z-10 mt-10 font-mono text-[10px] uppercase tracking-[0.22em] text-lo">
            <span className="text-rose-300/70">chaos</span>
            <span className="mx-2 text-white/20">→</span>
            <span className="text-cyan-300/80">automated</span>
          </p>
        </div>
      </div>

      {/* MOBILE: compact ordered pipeline (features stay, no 250vh runway) */}
      {isMobile && (
        <div className="mx-auto mt-10 max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {ORDER.map((n) => {
              const Icon = n.icon;
              return (
                <div key={n.label} className="flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.05] px-3 py-2.5">
                  <Icon className="h-4 w-4 shrink-0 text-cyan-300" />
                  <span className="truncate font-mono text-[9px] uppercase tracking-wider text-cyan-200/80">{n.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WHAT YOU LEAVE BEHIND / WHAT YOU GET */}
      <div className="mx-auto mt-24 grid max-w-7xl gap-5 px-5 sm:px-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/6 bg-white/[0.015] p-7 sm:p-9">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-rose-500/30 bg-rose-500/10"><X className="h-4 w-4 text-rose-400" /></span>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-lo">Leave behind</p>
          </div>
          <div className="mt-6 space-y-4">
            {pains.map((p) => (
              <div key={p.title} className="flex gap-3.5 opacity-75">
                <p.icon className="mt-0.5 h-5 w-5 shrink-0 text-rose-400/60" />
                <div>
                  <p className="text-sm font-medium text-mid line-through decoration-rose-400/30">{p.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-mid/70">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-b from-cyan-400/[0.06] to-transparent p-7 sm:p-9">
          <div className="pointer-events-none absolute -top-16 right-0 h-40 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-cyan-400/40 bg-cyan-400/15"><Check className="h-4 w-4 text-cyan-300" /></span>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300/80">Get</p>
          </div>
          <div className="mt-6 space-y-3">
            {gains.map((g) => (
              <div key={g} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 backdrop-blur transition-colors hover:border-cyan-400/20">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cyan-400/15"><Check className="h-3 w-3 text-cyan-300" /></span>
                <p className="text-sm font-medium leading-relaxed text-hi">{g}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-300/80">
            The engine runs it <ArrowRight className="h-3.5 w-3.5" />
          </p>
        </div>
      </div>
    </section>
  );
}
