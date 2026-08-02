import { ease } from "@/shared/motion/motion-tokens";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Users, Trophy, Clock, Zap, Server,
  Calendar, Download, Sparkles, GitCompareArrows,
} from "lucide-react";
import { DashboardCrumb } from "@/app/layouts/DashboardLayout";
import { ConsolePanel, Sparkline } from "@/features/liveops/widgets";
import { generateAnalytics, type Series } from "./aiEngine";
import { InsightsMini } from "./AIInsightsPage";
import { cn } from "@/lib/utils";

const RANGES = ["7d", "30d", "90d", "12m", "All"] as const;
type Range = (typeof RANGES)[number];

/* ------------------------------------------------------------------ chart helpers */
function BarChart({ data, color = "#22d3ee", height = 120 }: { data: number[]; color?: string; height?: number }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((v, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${(v / max) * 100}%` }}
          transition={{ duration: 0.7, delay: i * 0.02, ease: ease.emphasized }}
          className="flex-1 rounded-t"
          style={{ background: `linear-gradient(180deg, ${color} 0%, ${color}44 100%)`, minHeight: 2 }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ metric card with delta + sparkline */
function AnalyticsCard({ icon: Icon, series, tone = "cyan" }: { icon: any; series: Series; tone?: "cyan" | "violet" | "emerald" | "amber" }) {
  const last = series.data[series.data.length - 1];
  const first = series.data[0];
  const delta = last - first;
  const pct = first !== 0 ? ((delta / first) * 100).toFixed(1) : "—";
  const rising = delta >= 0;
  const toneMap = { cyan: "text-cyan-300", violet: "text-violet-300", emerald: "text-emerald-300", amber: "text-amber-300" };
  return (
    <div className="rounded-xl border border-white/8 bg-void-900/40 p-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4", toneMap[tone])} />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-lo">{series.label}</span>
        </div>
        <span className={cn("font-mono text-[10px]", rising ? "text-emerald-400" : "text-rose-400")}>{rising ? "▲" : "▼"} {Math.abs(Number(pct))}%</span>
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-2xl font-bold text-hi tabular-nums">{last.toLocaleString()}</p>
          {series.hint && <p className="font-mono text-[10px] text-lo">{series.hint}</p>}
        </div>
        <div className="w-24 shrink-0"><Sparkline data={series.data} color={series.color} height={32} /></div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ page */
export function AdvancedAnalytics() {
  const a = useMemo(() => generateAnalytics(), []);
  const [range, setRange] = useState<Range>("30d");
  const [compare, setCompare] = useState(false);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/8 pb-5">
        <div>
          <DashboardCrumb trail={["Organizer", "Advanced Analytics"]} />
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-2xl font-bold uppercase tracking-[0.1em] text-hi sm:text-3xl">Advanced Analytics</h1>
            <span className="flex items-center gap-1.5 rounded-md border border-cyan-400/30 bg-cyan-500/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan-300">
              <Sparkles className="h-3 w-3" /> Intelligence layer
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-lo">// growth · retention · attendance · performance · utilization</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 rounded-lg border border-white/8 bg-white/[0.02] p-1">
            {RANGES.map((r) => (
              <button key={r} onClick={() => setRange(r)} className={cn("rounded px-2.5 py-1 font-mono text-[11px] transition-colors", range === r ? "bg-cyan-400/15 text-cyan-300" : "text-mid hover:text-hi")}>{r}</button>
            ))}
          </div>
          <button onClick={() => setCompare((v) => !v)} className={cn("flex items-center gap-1.5 rounded-lg border px-3 py-2 font-mono text-[11px] transition-colors", compare ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300" : "border-white/8 bg-white/[0.02] text-mid hover:text-hi")}>
            <GitCompareArrows className="h-3.5 w-3.5" /> Compare
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2 font-mono text-[11px] text-mid hover:text-hi">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      {/* Top row — 4 headline metrics */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard icon={Trophy} series={a.tournamentGrowth} tone="violet" />
        <AnalyticsCard icon={Users} series={a.playerRetention} tone="emerald" />
        <AnalyticsCard icon={TrendingUp} series={a.registrationTrend} tone="cyan" />
        <AnalyticsCard icon={Zap} series={a.automationEff} tone="emerald" />
      </div>

      {/* Peak hours + trend charts */}
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <ConsolePanel title="Peak Activity Hours (UTC)" icon={Clock} right={<span className="font-mono text-[10px] text-lo">Last {range}</span>}>
          <div className="p-5">
            <BarChart data={a.peakHours.data} color={a.peakHours.color} height={140} />
            <div className="mt-2 flex justify-between font-mono text-[10px] text-lo">
              {["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"].map((h) => <span key={h}>{h}</span>)}
            </div>
            <p className="mt-3 flex items-center gap-2 rounded-md border border-cyan-400/25 bg-cyan-400/5 px-3 py-2 text-xs text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" /> AI: peak concurrency lands at 14:00 UTC (84% of daily peak) — align major broadcasts here.
            </p>
          </div>
        </ConsolePanel>

        <InsightsMini />
      </div>

      {/* Growth grid */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <TrendPanel title="Guild Growth" series={a.guildGrowth} icon={Server} />
        <TrendPanel title="Check-in Rate" series={a.checkinRate} icon={Users} />
        <TrendPanel title="Completion Rate" series={a.completionRate} icon={Trophy} />
      </div>

      {/* Performance grid */}
      <div className="mt-4 grid gap-4 lg:grid-cols-4">
        <TrendPanel title="Moderator Performance" series={a.modPerformance} icon={Users} compact />
        <TrendPanel title="Organizer Performance" series={a.orgPerformance} icon={Trophy} compact />
        <TrendPanel title="Match Duration" series={a.matchDuration} icon={Clock} compact />
        <TrendPanel title="System Utilization" series={a.systemUtilization} icon={Server} compact />
      </div>

      {/* Historical comparison strip */}
      <div className="mt-4">
        <ConsolePanel title="Historical Comparison" icon={Calendar} right={<span className="font-mono text-[10px] text-lo">This period vs. previous</span>}>
          <div className="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: "Registrations", cur: "1,284", prev: "1,102", delta: "+16.5%" },
              { label: "Tournaments run", cur: "42", prev: "38", delta: "+10.5%" },
              { label: "Avg attendance", cur: "88%", prev: "84%", delta: "+4pp" },
              { label: "Disputes filed", cur: "9", prev: "14", delta: "-35.7%" },
              { label: "Automation rate", cur: "97%", prev: "94%", delta: "+3pp" },
              { label: "Avg match length", cur: "32m", prev: "34m", delta: "-2m" },
            ].map((c) => (
              <div key={c.label} className="bg-void-900/60 p-4">
                <p className="font-mono text-[9px] uppercase tracking-wider text-lo">{c.label}</p>
                <p className="mt-1 font-mono text-lg font-bold text-hi tabular-nums">{c.cur}</p>
                <p className="mt-0.5 font-mono text-[10px] text-emerald-400">{c.delta} vs {c.prev}</p>
              </div>
            ))}
          </div>
        </ConsolePanel>
      </div>
    </div>
  );
}

function TrendPanel({ title, series, icon: Icon, compact }: { title: string; series: Series; icon: any; compact?: boolean }) {
  const last = series.data[series.data.length - 1];
  return (
    <ConsolePanel title={title} icon={Icon}>
      <div className="p-4">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="font-mono text-2xl font-bold text-hi tabular-nums">{last.toLocaleString()}</span>
          {series.hint && <span className="font-mono text-[10px] text-lo">{series.hint}</span>}
        </div>
        <Sparkline data={series.data} color={series.color} height={compact ? 40 : 60} />
      </div>
    </ConsolePanel>
  );
}