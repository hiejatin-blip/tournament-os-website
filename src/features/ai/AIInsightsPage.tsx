import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles, Lightbulb, Radar, Zap, ArrowUpRight, Check, X,
  ShieldCheck, TrendingUp, AlertTriangle,
} from "lucide-react";
import { DashboardCrumb } from "@/app/layouts/DashboardLayout";
import { ConsolePanel } from "@/features/liveops/widgets";
import {
  generateInsights, generatePredictions, generateRecommendations,
  generateSmartAlerts, relTime,
  type Insight, type Prediction, type Recommendation, type SmartAlert,
} from "./aiEngine";
import { useCopilot } from "./AICopilotPanel";
import { cn } from "@/lib/utils";

const catColor: Record<Insight["category"], string> = {
  operations: "text-cyan-300 border-cyan-400/25 bg-cyan-400/5",
  registration: "text-emerald-300 border-emerald-400/25 bg-emerald-400/5",
  scheduling: "text-amber-300 border-amber-400/25 bg-amber-400/5",
  verification: "text-amber-300 border-amber-400/25 bg-amber-400/5",
  automation: "text-violet-300 border-violet-400/25 bg-violet-400/5",
  growth: "text-emerald-300 border-emerald-400/25 bg-emerald-400/5",
  risk: "text-rose-300 border-rose-400/25 bg-rose-400/5",
};

const confBar: Record<Insight["confidence"], { pct: number; color: string; label: string }> = {
  high: { pct: 92, color: "bg-emerald-400", label: "HIGH" },
  medium: { pct: 68, color: "bg-amber-400", label: "MEDIUM" },
  low: { pct: 40, color: "bg-rose-400", label: "LOW" },
};

const severityRing: Record<SmartAlert["severity"], string> = {
  info: "border-l-cyan-400", success: "border-l-emerald-400",
  warning: "border-l-amber-400", critical: "border-l-rose-500",
};

export function AIInsightsPage() {
  const [insights] = useState<Insight[]>(() => generateInsights());
  const [predictions] = useState<Prediction[]>(() => generatePredictions());
  const [recommendations, setRecs] = useState<Recommendation[]>(() => generateRecommendations());
  const [alerts, setAlerts] = useState<SmartAlert[]>(() => generateSmartAlerts());
  const { setOpen } = useCopilot();

  function decide(id: string, approved: boolean) {
    setRecs((prev) => prev.map((r) => r.id === id ? { ...r, approved } : r));
  }

  function dismissAlert(id: string) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div>
      {/* Header — signature AI aesthetic */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/8 pb-5">
        <div>
          <DashboardCrumb trail={["Organizer", "AI Insights"]} />
          <div className="flex items-center gap-3">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-cyan-400/25 bg-gradient-to-br from-cyan-500/20 to-violet-500/15 text-cyan-300">
              <Sparkles className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            </span>
            <h1 className="font-mono text-2xl font-bold uppercase tracking-[0.1em] text-hi sm:text-3xl">Intelligence Layer</h1>
            <span className="rounded-md border border-cyan-400/30 bg-cyan-500/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan-300">Beta</span>
          </div>
          <p className="mt-1 font-mono text-xs text-lo">// model: tos-copilot-v1 · confidence-scored · organizer-in-the-loop</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-cyan-400/25 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 px-4 py-2.5 text-sm text-cyan-300 transition-colors hover:border-cyan-400/50"
        >
          <Sparkles className="h-4 w-4" /> Ask Copilot
          <kbd className="rounded border border-cyan-400/20 bg-void-950/60 px-1.5 font-mono text-[10px]">⌘I</kbd>
        </button>
      </div>

      {/* Top row — Predictions */}
      <ConsolePanel title="Predictive Insights" icon={Radar} live className="mb-4">
        <div className="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
          {predictions.map((p) => (
            <div key={p.id} className="bg-void-900/60 p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-lo">{p.label}</span>
                <ConfidenceChip conf={p.confidence} />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold text-hi tabular-nums">{p.value}</span>
                {p.delta && <span className="font-mono text-[11px] text-cyan-300">{p.delta}</span>}
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-mid">{p.detail}</p>
            </div>
          ))}
        </div>
      </ConsolePanel>

      {/* Two column: Insights + Recommendations */}
      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        {/* Left column — proactive insights + smart alerts */}
        <div className="flex flex-col gap-4">
          <ConsolePanel title="Proactive Insights" icon={Lightbulb} right={<span className="font-mono text-[10px] text-lo">{insights.length} active</span>}>
            <div className="divide-y divide-white/5">
              {insights.map((i) => (
                <motion.div key={i.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3 px-4 py-3.5">
                  <span className={cn("mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border font-mono text-[9px] uppercase tracking-wider", catColor[i.category])}>
                    {i.category.slice(0, 3)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-hi">{i.title}</p>
                      {i.metric && <span className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-cyan-300">{i.metric}</span>}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-mid">{i.body}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <ConfidenceBar conf={i.confidence} />
                      <span className="font-mono text-[10px] text-lo">{relTime(i.ts)}</span>
                      {i.actionLabel && (
                        <button className="ml-auto flex items-center gap-1 rounded-md border border-cyan-400/25 bg-cyan-400/5 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan-300 hover:border-cyan-400/50">
                          {i.actionLabel} <ArrowUpRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ConsolePanel>

          <ConsolePanel title="Smart Alerts" icon={AlertTriangle} live right={<span className="font-mono text-[10px] text-lo">{alerts.length} open</span>}>
            <div className="divide-y divide-white/5">
              <AnimatePresence>
                {alerts.map((a) => (
                  <motion.div key={a.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: 24 }} className={cn("flex items-start gap-3 border-l-2 px-4 py-3", severityRing[a.severity])}>
                    <SeverityIcon sev={a.severity} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-hi">{a.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-mid">{a.body}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <ConfidenceBar conf={a.confidence} />
                        <span className="font-mono text-[10px] text-lo">{relTime(a.ts)}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      {a.action && (
                        a.action.to
                          ? <Link to={a.action.to} className="flex items-center gap-1 rounded-md border border-cyan-400/25 bg-cyan-400/5 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan-300 hover:border-cyan-400/50">{a.action.label}<ArrowUpRight className="h-3 w-3" /></Link>
                          : <button className="flex items-center gap-1 rounded-md border border-cyan-400/25 bg-cyan-400/5 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan-300 hover:border-cyan-400/50">{a.action.label}</button>
                      )}
                      <button onClick={() => dismissAlert(a.id)} className="font-mono text-[10px] text-lo hover:text-hi">dismiss</button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ConsolePanel>
        </div>

        {/* Right column — recommendations */}
        <ConsolePanel title="Recommendations" icon={Zap} right={<span className="font-mono text-[10px] text-lo">organizer approval required</span>}>
          <div className="divide-y divide-white/5">
            {recommendations.map((r) => (
              <motion.div key={r.id} layout className="p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-violet-400/25 bg-violet-400/5 text-violet-300">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-hi">{r.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-mid">{r.reason}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className={cn("rounded-md border px-1.5 py-0.5 font-mono text-[9px] uppercase", r.impact === "high" ? "border-cyan-400/30 text-cyan-300" : r.impact === "medium" ? "border-amber-400/30 text-amber-300" : "border-white/10 text-mid")}>impact · {r.impact}</span>
                      <span className={cn("rounded-md border px-1.5 py-0.5 font-mono text-[9px] uppercase", r.effort === "low" ? "border-emerald-400/30 text-emerald-300" : r.effort === "medium" ? "border-amber-400/30 text-amber-300" : "border-rose-400/30 text-rose-300")}>effort · {r.effort}</span>
                      <span className="rounded-md border border-white/10 px-1.5 py-0.5 font-mono text-[9px] uppercase text-mid">{r.category}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-end gap-2">
                  {r.approved === undefined ? (
                    <>
                      <button onClick={() => decide(r.id, false)} className="flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.02] px-2.5 py-1 text-xs text-mid hover:border-rose-400/30 hover:text-rose-300"><X className="h-3 w-3" /> Skip</button>
                      <button onClick={() => decide(r.id, true)} className="flex items-center gap-1 rounded-md border border-cyan-400/25 bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-300 hover:border-cyan-400/50"><Check className="h-3 w-3" /> Approve</button>
                    </>
                  ) : r.approved ? (
                    <span className="flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 font-mono text-[10px] text-emerald-300"><Check className="h-3 w-3" /> APPROVED</span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 font-mono text-[10px] text-lo">SKIPPED</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </ConsolePanel>
      </div>
    </div>
  );
}

function ConfidenceChip({ conf }: { conf: Insight["confidence"] }) {
  const c = confBar[conf];
  return <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-lo"><span className={cn("h-1.5 w-1.5 rounded-full", c.color)} />{c.label}</span>;
}

function ConfidenceBar({ conf }: { conf: Insight["confidence"] }) {
  const c = confBar[conf];
  return (
    <span className="flex items-center gap-1.5">
      <span className="font-mono text-[9px] uppercase tracking-wider text-lo">CONF</span>
      <span className="relative h-1 w-16 rounded-full bg-white/8">
        <span className={cn("absolute inset-y-0 left-0 rounded-full", c.color)} style={{ width: `${c.pct}%` }} />
      </span>
    </span>
  );
}

function SeverityIcon({ sev }: { sev: SmartAlert["severity"] }) {
  const map = {
    info: { icon: Sparkles, color: "text-cyan-300" },
    success: { icon: ShieldCheck, color: "text-emerald-300" },
    warning: { icon: AlertTriangle, color: "text-amber-300" },
    critical: { icon: AlertTriangle, color: "text-rose-300" },
  } as const;
  const { icon: Icon, color } = map[sev];
  return <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", color)} />;
}

/* ------------------------------------------------------------------ EMBEDDED WIDGETS (reusable elsewhere) */
export function InsightsMini() {
  const insights = generateInsights().slice(0, 3);
  const { setOpen } = useCopilot();
  return (
    <ConsolePanel title="AI Insights" icon={Lightbulb} right={<button onClick={() => setOpen(true)} className="font-mono text-[10px] text-cyan-300 hover:text-cyan-200">Ask Copilot →</button>}>
      <div className="divide-y divide-white/5">
        {insights.map((i) => (
          <div key={i.id} className="flex items-start gap-3 px-4 py-3">
            <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-300" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-hi">{i.title}</p>
              <p className="mt-0.5 text-[11px] text-mid line-clamp-2">{i.body}</p>
            </div>
            <ConfidenceChip conf={i.confidence} />
          </div>
        ))}
      </div>
    </ConsolePanel>
  );
}
