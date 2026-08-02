import { useState } from "react";
import { ease } from "@/shared/motion/motion-tokens";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, Radio, Users, Users2, Trophy, ClipboardList, ShieldCheck,
  CheckSquare, AlertTriangle, Cpu, Server, Zap, Play, Pause, Flag,
  Eye, ArrowUpRight, Gauge as GaugeIcon, Signal, UserPlus, Swords,
} from "lucide-react";
import { DashboardCrumb } from "@/app/layouts/DashboardLayout";
import {
  useLiveTelemetry, useLiveFeed, relTime, fmtClock, type LiveEvent, type LiveMatch,
} from "./liveData";
import { MetricTile, ConsolePanel, StatusDot, stateLabel, Sparkline } from "./widgets";
import { InsightsMini } from "@/features/ai";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fireConfetti } from "@/components/magic/confetti";
import { toast } from "sonner";
import { cn } from "@/lib/utils";


const kindMeta: Record<LiveEvent["kind"], { icon: any; color: string }> = {
  register: { icon: UserPlus, color: "text-cyan-300" },
  team: { icon: Users2, color: "text-emerald-300" },
  match_start: { icon: Play, color: "text-cyan-300" },
  match_end: { icon: Flag, color: "text-emerald-300" },
  verify: { icon: ShieldCheck, color: "text-emerald-300" },
  checkin: { icon: CheckSquare, color: "text-amber-300" },
  publish: { icon: Trophy, color: "text-cyan-300" },
  mod: { icon: AlertTriangle, color: "text-amber-300" },
  automation: { icon: Zap, color: "text-violet-300" },
  bot: { icon: Cpu, color: "text-cyan-300" },
  scheduler: { icon: Radio, color: "text-cyan-300" },
  alert: { icon: AlertTriangle, color: "text-rose-300" },
};

const sevBorder: Record<LiveEvent["severity"], string> = {
  info: "border-l-white/15", success: "border-l-emerald-400/60",
  warning: "border-l-amber-400/60", critical: "border-l-rose-500/70",
};

export function LiveOpsCenter() {
  const t = useLiveTelemetry(2000);
  const feed = useLiveFeed(40);
  const [selectedMatch, setSelectedMatch] = useState<LiveMatch | null>(null);
  const [feedFilter, setFeedFilter] = useState<"all" | "critical">("all");

  const shownFeed = feedFilter === "critical" ? feed.filter((e) => e.severity === "critical" || e.severity === "warning") : feed;

  return (
    <div className="min-h-full">
      {/* Command header — characteristic opener, not a generic hero */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/8 pb-5">
        <div>
          <DashboardCrumb trail={["Organizer", "Live Ops"]} />
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-2xl font-bold uppercase tracking-[0.1em] text-hi sm:text-3xl">
              Operations Center
            </h1>
            <span className="flex items-center gap-1.5 rounded-md border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />All systems nominal
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-lo">// real-time telemetry · refresh 2000ms · websocket:connected</p>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-mid">
          <Signal className="h-4 w-4 text-emerald-400" />
          <span>{t.playersOnline.toLocaleString()} online</span>
          <span className="text-white/20">·</span>
          <span className="text-cyan-300">{t.apiRps.toLocaleString()} rps</span>
        </div>
      </div>

      {/* Metric grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        <MetricTile icon={Server} label="Active Guilds" value={t.activeGuilds} tone="cyan" />
        <MetricTile icon={Trophy} label="Live Tournaments" value={t.activeTournaments} tone="cyan" live />
        <MetricTile icon={UserPlus} label="Registrations" value={t.liveRegistrations} tone="emerald" spark={t.throughputHistory.slice(-16).map((x) => x / 40)} live />
        <MetricTile icon={Users} label="Players Online" value={t.playersOnline} tone="cyan" live />
        <MetricTile icon={Users2} label="Teams Online" value={t.teamsOnline} tone="violet" live />
        <MetricTile icon={Swords} label="Live Matches" value={t.liveMatches} tone="rose" live />
        <MetricTile icon={ClipboardList} label="Pending Reviews" value={t.pendingReviews} tone="amber" />
        <MetricTile icon={ShieldCheck} label="Verification Queue" value={t.verificationQueue} tone="amber" live />
        <MetricTile icon={CheckSquare} label="Check-in Queue" value={t.checkinQueue} tone="amber" live />
        <MetricTile icon={AlertTriangle} label="System Alerts" value={t.systemAlerts} tone={t.systemAlerts > 0 ? "rose" : "emerald"} />
        <MetricTile icon={Cpu} label="Bot Latency" value={`${t.botPing}ms`} tone="emerald" spark={t.latencyHistory.slice(-16)} live />
        <MetricTile icon={Zap} label="Cmd Success" value={`${t.commandSuccess}%`} tone="emerald" />
      </div>

      {/* Main console grid */}
      <div className="mt-4 grid gap-3 xl:grid-cols-[1.4fr_1fr]">
        {/* Left column: match monitor + throughput */}
        <div className="flex flex-col gap-3">
          <ConsolePanel title="Real-Time Match Monitor" icon={Activity} live right={<span className="font-mono text-[10px] text-lo">{t.matches.filter((m) => m.state === "live").length} live · {t.matches.length} total</span>}>
            <div className="divide-y divide-white/5">
              {t.matches.map((m) => <MatchRow key={m.id} m={m} onSelect={() => setSelectedMatch(m)} />)}
            </div>
          </ConsolePanel>

          <ConsolePanel title="API Throughput" icon={GaugeIcon} right={<span className="font-mono text-[10px] text-cyan-300">{t.apiRps.toLocaleString()} req/s</span>}>
            <div className="p-4">
              <Sparkline data={t.throughputHistory} color="#22d3ee" height={80} />
              <div className="mt-2 flex justify-between font-mono text-[10px] text-lo">
                <span>-80s</span><span>P50 {t.latencyHistory[t.latencyHistory.length - 1]}ms</span><span>now</span>
              </div>
            </div>
          </ConsolePanel>

          <InsightsMini />
        </div>

        {/* Right column: system status rail + live feed */}
        <div className="flex flex-col gap-3">
          <ConsolePanel title="System Status" icon={Server} right={<Link to="/app/admin/monitoring" className="font-mono text-[10px] text-cyan-300 hover:text-cyan-200">Full health →</Link>}>
            <div className="grid grid-cols-1 gap-px bg-white/5 sm:grid-cols-2">
              {t.services.map((s) => {
                const meta = stateLabel(s.state);
                return (
                  <div key={s.id} className="flex items-center justify-between bg-void-900/60 px-3.5 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <StatusDot state={s.state} />
                      <span className="font-mono text-[11px] text-hi">{s.name}</span>
                    </div>
                    <div className="text-right">
                      <p className={cn("font-mono text-[9px] uppercase tracking-wider", meta.text)}>{meta.label}</p>
                      <p className="font-mono text-[9px] text-lo">{s.latency}ms</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ConsolePanel>

          <ConsolePanel
            title="Live Event Feed" icon={Radio} live className="min-h-[380px]"
            right={
              <div className="flex gap-1">
                {(["all", "critical"] as const).map((f) => (
                  <button key={f} onClick={() => setFeedFilter(f)} className={cn("rounded px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider transition-colors", feedFilter === f ? "bg-cyan-400/15 text-cyan-300" : "text-lo hover:text-hi")}>{f}</button>
                ))}
              </div>
            }
          >
            <div className="h-full overflow-y-auto no-scrollbar">
              <AnimatePresence initial={false}>
                {shownFeed.map((e) => {
                  const meta = kindMeta[e.kind];
                  const Icon = meta.icon;
                  return (
                    <motion.div
                      key={e.id}
                      layout
                      initial={{ opacity: 0, x: -12, backgroundColor: "rgba(34,211,238,0.08)" }}
                      animate={{ opacity: 1, x: 0, backgroundColor: "rgba(0,0,0,0)" }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: ease.emphasized }}
                      className={cn("flex items-start gap-2.5 border-b border-l-2 border-white/4 px-3.5 py-2.5", sevBorder[e.severity])}
                    >
                      <Icon className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", meta.color)} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] text-hi">{e.message}</p>
                        <p className="font-mono text-[10px] text-lo">{e.actor} · {e.guild}</p>
                      </div>
                      <span className="shrink-0 font-mono text-[10px] text-lo">{relTime(e.ts)}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </ConsolePanel>
        </div>
      </div>

      {/* Match control panel — shadcn Sheet (focus trap + escape + aria) */}
      <Sheet open={!!selectedMatch} onOpenChange={(o) => { if (!o) setSelectedMatch(null); }}>
        <SheetContent side="right" className="w-[92%] max-w-md border-l border-white/10 bg-void-900/95 p-0 backdrop-blur-xl sm:w-full">
          {selectedMatch && <MatchControlPanel m={selectedMatch} onClose={() => setSelectedMatch(null)} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ------------------------------------------------------------------ match row */
function MatchRow({ m, onSelect }: { m: LiveMatch; onSelect: () => void }) {
  const stateStyle = {
    live: "border-rose-400/40 bg-rose-500/10 text-rose-300",
    paused: "border-amber-400/40 bg-amber-500/10 text-amber-300",
    pending: "border-white/15 bg-white/5 text-mid",
    delayed: "border-rose-400/40 bg-rose-500/10 text-rose-300",
  }[m.state];
  return (
    <button onClick={onSelect} className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.03]">
      <span className="font-mono text-[11px] text-lo">{m.id}</span>
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-hi">{m.a}</span>
          <span className="font-mono text-cyan-300 tabular-nums">{m.scoreA}</span>
          <span className="text-lo">–</span>
          <span className="font-mono text-cyan-300 tabular-nums">{m.scoreB}</span>
          <span className="font-medium text-mid">{m.b}</span>
        </div>
        <p className="font-mono text-[10px] text-lo">{m.round} · {m.map} {m.state === "live" && `· ${fmtClock(m.clock)}`}</p>
      </div>
      <div className="flex items-center gap-2.5">
        {m.viewers > 0 && <span className="hidden items-center gap-1 font-mono text-[10px] text-lo sm:flex"><Eye className="h-3 w-3" />{(m.viewers / 1000).toFixed(1)}k</span>}
        <span className={cn("rounded-md border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider", stateStyle)}>
          {m.state === "live" && <span className="mr-1 inline-block h-1 w-1 animate-pulse rounded-full bg-rose-400 align-middle" />}{m.state}
        </span>
        <ArrowUpRight className="h-3.5 w-3.5 text-lo" />
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ match control panel */
function MatchControlPanel({ m, onClose }: { m: LiveMatch; onClose: () => void }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const actions = [
    { icon: Play, label: "Start Match", tone: "text-emerald-300" },
    { icon: Pause, label: "Pause Match", tone: "text-amber-300" },
    { icon: Flag, label: "Force Finish", tone: "text-rose-300" },
    { icon: Users, label: "Assign Referee", tone: "text-cyan-300" },
    { icon: Radio, label: "Assign Stream", tone: "text-cyan-300" },
    { icon: Eye, label: "Assign Observer", tone: "text-cyan-300" },
    { icon: ShieldCheck, label: "Resolve Dispute", tone: "text-amber-300" },
    { icon: AlertTriangle, label: "Emergency Override", tone: "text-rose-300" },
  ];
  return (
    <>
      <SheetHeader className="border-b border-white/8 px-5 py-4 text-left">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">Match Control · {m.id}</p>
        <SheetTitle className="font-display text-lg font-bold text-hi">{m.round}</SheetTitle>
      </SheetHeader>

        <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
          {/* Score control */}
          <div className="space-y-2">
            {[{ name: m.a, score: m.scoreA, lead: m.scoreA >= m.scoreB }, { name: m.b, score: m.scoreB, lead: m.scoreB > m.scoreA }].map((side) => (
              <div key={side.name} className={cn("flex items-center justify-between rounded-xl border bg-void-950/50 px-4 py-3", side.lead ? "border-cyan-400/25" : "border-white/6")}>
                <span className="text-sm font-medium text-hi">{side.name}</span>
                <div className="flex items-center gap-1.5">
                  <button className="grid h-7 w-7 place-items-center rounded-md border border-white/10 text-lo hover:text-hi">−</button>
                  <span className="w-8 text-center font-mono text-lg font-bold text-cyan-300 tabular-nums">{side.score}</span>
                  <button className="grid h-7 w-7 place-items-center rounded-md border border-white/10 text-lo hover:text-hi">+</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-white/6 bg-void-950/40 p-3 text-center">
            <div><p className="font-mono text-[9px] uppercase text-lo">Map</p><p className="mt-0.5 text-sm text-hi">{m.map}</p></div>
            <div><p className="font-mono text-[9px] uppercase text-lo">Clock</p><p className="mt-0.5 font-mono text-sm text-cyan-300">{fmtClock(m.clock)}</p></div>
            <div><p className="font-mono text-[9px] uppercase text-lo">Viewers</p><p className="mt-0.5 text-sm text-hi">{(m.viewers / 1000).toFixed(1)}k</p></div>
          </div>

          {/* Actions */}
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-lo">Match Actions</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {actions.map((a) => (
              <button key={a.label} className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-3 text-left text-sm text-hi transition-colors hover:border-cyan-400/25 hover:bg-white/[0.05]">
                <a.icon className={cn("h-4 w-4 shrink-0", a.tone)} />
                <span className="text-[13px]">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        <footer className="border-t border-white/8 p-4">
          <button
            onClick={() => setConfirmOpen(true)}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 py-3 text-sm font-semibold text-void-950 transition-transform hover:scale-[1.01]"
          >
            Record Result & Advance Bracket
          </button>
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogContent className="border-white/10 bg-void-900/95 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="text-hi">Advance {m.a} vs {m.b}?</DialogTitle>
                <DialogDescription className="text-mid">
                  The winner advances to the next round. Bracket, standings, and Discord
                  threads update automatically.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-mid hover:bg-white/[0.04] hover:text-hi"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setConfirmOpen(false);
                    onClose();
                    fireConfetti({ particleCount: 160, origin: { x: 0.5, y: 0.4 } });
                    toast.success(`Result recorded — bracket advanced`);
                  }}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-void-950 hover:scale-[1.01]"
                >
                  Record & Advance
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </footer>
    </>
  );
}