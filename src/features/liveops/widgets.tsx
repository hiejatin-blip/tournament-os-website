import { memo } from "react";
import { ease } from "@/shared/motion/motion-tokens";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { AnimatedNumber } from "@/shared/motion/motion";
import { cn } from "@/lib/utils";
import type { ServiceState } from "./liveData";


/* ============================================================ Sparkline (memoized) */
export const Sparkline = memo(function Sparkline({ data, color = "#22d3ee", height = 40, fill = true }: {
  data: number[]; color?: string; height?: number; fill?: boolean;
}) {
  if (data.length < 2) return <div style={{ height }} />;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 100;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, height - ((v - min) / range) * height]);
  const line = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const area = `${line} L${w},${height} L0,${height} Z`;
  const gid = `spark-${color.replace("#", "")}`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.35" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gid})`} />}
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="1.8" fill={color} vectorEffect="non-scaling-stroke" />
    </svg>
  );
});

/* ============================================================ Radial gauge */
export function Gauge({ value, label, unit = "%", color = "#22d3ee", danger = 85 }: {
  value: number; label: string; unit?: string; color?: string; danger?: number;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  const r = 42, c = 2 * Math.PI * r;
  const stroke = value >= danger ? "#f43f5e" : value >= danger - 20 ? "#fbbf24" : color;
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
          <motion.circle
            cx="50" cy="50" r={r} fill="none" stroke={stroke} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c - (clamped / 100) * c }}
            transition={{ duration: 0.8, ease: ease.emphasized }}
            style={{ filter: `drop-shadow(0 0 6px ${stroke}66)` }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <span className="font-mono text-xl font-bold text-hi tabular-nums">{Math.round(value)}</span>
            <span className="font-mono text-[10px] text-lo">{unit}</span>
          </div>
        </div>
      </div>
      <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-lo">{label}</span>
    </div>
  );
}

/* ============================================================ Status dot */
const stateColors: Record<ServiceState, { dot: string; text: string; label: string }> = {
  operational: { dot: "bg-emerald-400", text: "text-emerald-300", label: "OPERATIONAL" },
  degraded: { dot: "bg-amber-400", text: "text-amber-300", label: "DEGRADED" },
  down: { dot: "bg-rose-500", text: "text-rose-300", label: "DOWN" },
  syncing: { dot: "bg-cyan-400", text: "text-cyan-300", label: "SYNCING" },
};

export function StatusDot({ state, pulse = true }: { state: ServiceState; pulse?: boolean }) {
  const s = stateColors[state];
  return (
    <span className="relative inline-flex h-2 w-2">
      {pulse && state !== "down" && <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", s.dot)} />}
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", s.dot)} />
    </span>
  );
}

export function stateLabel(state: ServiceState) { return stateColors[state]; }

/* ============================================================ Live metric tile (memoized) */
export const MetricTile = memo(function MetricTile({ icon: Icon, label, value, delta, tone = "cyan", spark, live }: {
  icon: LucideIcon; label: string; value: string | number; delta?: string;
  tone?: "cyan" | "amber" | "rose" | "emerald" | "violet"; spark?: number[]; live?: boolean;
}) {
  const tones = {
    cyan: "text-cyan-300 border-cyan-400/15", amber: "text-amber-300 border-amber-400/15",
    rose: "text-rose-300 border-rose-400/15", emerald: "text-emerald-300 border-emerald-400/15",
    violet: "text-violet-300 border-violet-400/15",
  };
  const sparkColor = { cyan: "#22d3ee", amber: "#fbbf24", rose: "#f43f5e", emerald: "#34d399", violet: "#a78bfa" }[tone];
  return (
    <div className={cn("mo-lift group relative overflow-hidden rounded-xl border bg-void-900/40 p-4 backdrop-blur", tones[tone])}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4", tones[tone].split(" ")[0])} />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-lo">{label}</span>
        </div>
        {live && <span className="flex items-center gap-1 font-mono text-[9px] text-emerald-400"><span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />LIVE</span>}
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div>
          <span className="block font-mono text-2xl font-bold text-hi tabular-nums">
            {typeof value === "number"
              ? <AnimatedNumber value={value} />
              : value}
          </span>
          {delta && <span className="font-mono text-[10px] text-emerald-400">{delta}</span>}
        </div>
        {spark && <div className="w-20 shrink-0"><Sparkline data={spark} color={sparkColor} height={28} /></div>}
      </div>
    </div>
  );
});

/* ============================================================ Console panel frame */
export function ConsolePanel({ title, icon: Icon, right, children, className, live }: {
  title: string; icon?: LucideIcon; right?: React.ReactNode; children: React.ReactNode; className?: string; live?: boolean;
}) {
  return (
    <section className={cn("flex min-h-0 flex-col overflow-hidden rounded-xl border border-white/8 bg-void-900/40 backdrop-blur", className)}>
      <header className="flex shrink-0 items-center justify-between border-b border-white/8 bg-white/[0.02] px-4 py-2.5">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-3.5 w-3.5 text-cyan-400" />}
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-mid">{title}</h3>
          {live && <span className="flex items-center gap-1 font-mono text-[9px] text-emerald-400"><span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />LIVE</span>}
        </div>
        {right}
      </header>
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </section>
  );
}