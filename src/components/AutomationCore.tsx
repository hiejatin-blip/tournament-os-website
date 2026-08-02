import { motion } from "framer-motion";
import { Users, ShieldCheck, CalendarClock, Gauge, GitBranch, BellRing, Cpu, Terminal } from "lucide-react";
import { SectionHeading, Reveal } from "./ui";
import { automationLog, capabilities } from "@/lib/data";
import { cn } from "@/lib/utils";

/* ============================================================================
   AutomationCore — the pipeline, rebuilt with ANIMATED BEAMS.
   Energy pulses travel between the six stages (Register → Verify → Check-in
   → Seed → Bracket → Notify) around the core, showing automation in motion.
   ============================================================================ */

const nodes = [
  { icon: Users, label: "Register" },
  { icon: ShieldCheck, label: "Verify" },
  { icon: CalendarClock, label: "Check-in" },
  { icon: Gauge, label: "Seed" },
  { icon: GitBranch, label: "Bracket" },
  { icon: BellRing, label: "Notify" },
];
const R = 39;
const pos = nodes.map((n, i) => {
  const a = (-90 + i * 60) * (Math.PI / 180);
  return { ...n, x: 50 + R * Math.cos(a), y: 50 + R * Math.sin(a) };
});
const tagC: Record<string, string> = { init: "text-lo", ok: "text-cyan-300", info: "text-amber-300", discord: "text-amber-300", live: "text-cyan-300" };

/* Animated energy pulse along an edge — pure CSS, decor-gated */
function Beam({ from, to, delay = 0, duration = 2.4 }: { from: { x: number; y: number }; to: { x: number; y: number }; delay?: number; duration?: number }) {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden>
      <defs>
        <linearGradient id={`beam-${from.x}-${from.y}-${to.x}-${to.y}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(34,211,238,0)" />
          <stop offset="50%" stopColor="rgba(34,211,238,0.9)" />
          <stop offset="100%" stopColor="rgba(34,211,238,0)" />
        </linearGradient>
      </defs>
      <line
        x1={from.x} y1={from.y} x2={to.x} y2={to.y}
        stroke={`url(#beam-${from.x}-${from.y}-${to.x}-${to.y})`}
        strokeWidth="0.6"
        strokeDasharray="2 2"
        className="decor"
        style={{ animation: `beamPulse ${duration}s ease-in-out ${delay}s infinite` }}
      />
      <circle r="1.1" fill="#a5f3fc" className="decor" style={{ animation: `beamDot ${duration}s ease-in-out ${delay}s infinite`, offsetPath: `path("M ${from.x} ${from.y} L ${to.x} ${to.y}")` } as React.CSSProperties} />
    </svg>
  );
}

function Engine() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[440px]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        {pos.map((n) => (
          <line key={n.label} x1="50" y1="50" x2={n.x} y2={n.y} stroke="rgba(34,211,238,0.12)" strokeWidth="0.4" strokeDasharray="2 2" />
        ))}
      </svg>
      {/* animated beams between consecutive stages */}
      {pos.map((n, i) => (
        <Beam key={n.label} from={{ x: 50, y: 50 }} to={{ x: n.x, y: n.y }} delay={i * 0.4} />
      ))}

      <div className="absolute left-1/2 top-1/2 h-[44%] w-[44%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/8 animate-spin-slow" />
      <div className="absolute left-1/2 top-1/2 h-[66%] w-[66%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" style={{ animation: "spin-slow 38s linear infinite reverse" }} />
      <div className="absolute left-1/2 top-1/2 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/4" />

      {pos.map((n, i) => (
        <div key={n.label} className="absolute" style={{ left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%,-50%)" }}>
          <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.08, duration: 0.6 }} className="flex flex-col items-center gap-1.5">
            <div className="grid h-12 w-12 place-items-center rounded-xl border border-white/8 bg-void-800 elev-2" style={{ animation: `float-y ${5 + (i % 3)}s ease-in-out ${i * 0.4}s infinite` }}>
              <n.icon className="h-5 w-5 text-cyan-300" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-mid">{n.label}</span>
          </motion.div>
        </div>
      ))}

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative grid h-24 w-24 place-items-center rounded-full border border-cyan-400/30 bg-void-900 glow-cyan">
          <div className="absolute inset-0 animate-pulse-ring rounded-full" />
          <Cpu className="h-7 w-7 text-cyan-400" />
          <span className="absolute -bottom-5 font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-300">core</span>
        </div>
      </div>
    </div>
  );
}

function Log() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-void-950/80 elev-2">
      <div className="flex items-center justify-between border-b border-white/6 bg-white/[0.02] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-cyan-400" />
          <span className="font-mono text-[11px] tracking-wide text-mid">automation-engine · stream</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-lo">realtime</span>
      </div>
      <div className="space-y-1.5 p-4 font-mono text-[12px] leading-relaxed sm:text-[13px]">
        {automationLog.map((l, i) => {
          const live = l.tag === "live";
          return (
            <motion.div key={l.t} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.12 }} className={cn("flex gap-3", live && "rounded-md bg-cyan-400/10 px-2 py-1")}>
              <span className="shrink-0 text-lo">{l.t}</span>
              <span className="text-cyan-400/60">›</span>
              <span className={cn(live ? "font-semibold text-cyan-300" : tagC[l.tag])}>{l.msg}</span>
            </motion.div>
          );
        })}
        <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 2 }} className="inline-block h-3.5 w-2 animate-pulse bg-cyan-400 align-middle" />
      </div>
    </div>
  );
}

export function AutomationCore() {
  return (
    <section id="automation" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(34,211,238,0.05),transparent_55%)]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Automation engine"
          title={<>The pipeline <span className="text-gradient-cyan">runs itself.</span></>}
          description="Watch the energy flow — every registration, check-in, and score ripples through the engine automatically."
        />
        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
          <Engine />
          <div className="space-y-6">
            <Log />
            <div className="flex flex-wrap gap-2">
              {capabilities.map((c) => (
                <span key={c.label} className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] px-3 py-1.5 text-xs text-mid transition-colors hover:border-cyan-400/25 hover:text-hi">
                  <c.icon className="h-3.5 w-3.5 text-cyan-300" />
                  {c.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
