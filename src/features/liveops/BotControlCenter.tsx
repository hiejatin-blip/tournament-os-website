import {
  Cpu, Activity, Server, Zap, RefreshCw, Power, Terminal, Layers,
  CheckCircle2, Clock, Boxes,
} from "lucide-react";
import { DashboardCrumb } from "@/app/layouts/DashboardLayout";
import { Button } from "@/components/ui";
import { useLiveTelemetry, type ServiceState } from "./liveData";
import { Gauge, ConsolePanel, StatusDot, Sparkline } from "./widgets";
import { cn } from "@/lib/utils";

export function BotControlCenter() {
  const t = useLiveTelemetry(1800);
  const shards = Array.from({ length: 16 }, (_, i) => ({
    id: i, ping: 8 + Math.round(Math.abs(Math.sin(i + t.botPing)) * 30),
    guilds: 1400 + Math.round(Math.abs(Math.cos(i)) * 200),
    state: (i === 7 ? "syncing" : "operational") as ServiceState,
  }));

  const workers = [
    { name: "match.orchestrator", jobs: t.backgroundJobs, state: "operational" as const },
    { name: "notification.dispatch", jobs: 42, state: "operational" as const },
    { name: "bracket.compute", jobs: 3, state: "operational" as const },
    { name: "verification.scan", jobs: t.verificationQueue, state: "operational" as const },
    { name: "scheduler.tick", jobs: t.schedulerQueue, state: "syncing" as const },
    { name: "export.pipeline", jobs: 0, state: "operational" as const },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/8 pb-5">
        <div>
          <DashboardCrumb trail={["Organizer", "Bot Control"]} />
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-2xl font-bold uppercase tracking-[0.1em] text-hi sm:text-3xl">Bot Command Center</h1>
            <span className="flex items-center gap-1.5 rounded-md border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />Online
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-lo">// tournament-os-bot v4.2.1 · 16 shards · {t.activeGuilds.toLocaleString()} guilds</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" icon={RefreshCw}>Force Sync</Button>
          <Button variant="outline" size="sm" icon={Power}>Restart Bot</Button>
        </div>
      </div>

      {/* Gauges */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/8 bg-void-900/40 p-4 backdrop-blur"><Gauge value={t.botCpu} label="CPU Usage" color="#22d3ee" /></div>
        <div className="rounded-xl border border-white/8 bg-void-900/40 p-4 backdrop-blur"><Gauge value={t.botMemory} label="Memory" color="#a78bfa" /></div>
        <div className="rounded-xl border border-white/8 bg-void-900/40 p-4 backdrop-blur"><Gauge value={t.commandSuccess} label="Cmd Success" color="#34d399" /></div>
        <div className="rounded-xl border border-white/8 bg-void-900/40 p-4 backdrop-blur"><Gauge value={Math.min(100, t.botPing * 2)} label="Latency" unit="ms" color="#fbbf24" /></div>
      </div>

      {/* Latency + throughput sparklines */}
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <ConsolePanel title="Gateway Latency" icon={Activity} right={<span className="font-mono text-[10px] text-cyan-300">{t.botPing}ms</span>}>
          <div className="p-4"><Sparkline data={t.latencyHistory} color="#22d3ee" height={70} /></div>
        </ConsolePanel>
        <ConsolePanel title="Command Throughput" icon={Zap} right={<span className="font-mono text-[10px] text-emerald-300">{t.apiRps.toLocaleString()}/s</span>}>
          <div className="p-4"><Sparkline data={t.throughputHistory} color="#34d399" height={70} /></div>
        </ConsolePanel>
      </div>

      {/* Shards */}
      <div className="mt-3">
        <ConsolePanel title="Shard Status" icon={Layers} right={<span className="font-mono text-[10px] text-lo">16 shards · 1 syncing</span>}>
          <div className="grid grid-cols-2 gap-px bg-white/5 sm:grid-cols-4 lg:grid-cols-8">
            {shards.map((s) => (
              <div key={s.id} className="bg-void-900/60 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-lo">#{String(s.id).padStart(2, "0")}</span>
                  <StatusDot state={s.state} />
                </div>
                <p className="mt-1.5 font-mono text-sm font-bold text-hi tabular-nums">{s.ping}ms</p>
                <p className="font-mono text-[9px] text-lo">{s.guilds} guilds</p>
              </div>
            ))}
          </div>
        </ConsolePanel>
      </div>

      {/* Workers + jobs */}
      <div className="mt-3 grid gap-3 lg:grid-cols-[1.3fr_1fr]">
        <ConsolePanel title="Background Workers" icon={Boxes}>
          <div className="divide-y divide-white/5">
            {workers.map((w) => (
              <div key={w.name} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <StatusDot state={w.state} />
                  <span className="font-mono text-[12px] text-hi">{w.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[10px] text-lo">{w.jobs} jobs</span>
                  <span className={cn("font-mono text-[9px] uppercase tracking-wider", w.state === "syncing" ? "text-cyan-300" : "text-emerald-300")}>{w.state}</span>
                </div>
              </div>
            ))}
          </div>
        </ConsolePanel>

        <ConsolePanel title="Scheduler Queue" icon={Clock} right={<span className="font-mono text-[10px] text-amber-300">{t.schedulerQueue} queued</span>}>
          <div className="divide-y divide-white/5">
            {[
              { job: "check-in.close · WinterCup", eta: "in 4m", icon: Clock },
              { job: "reminder.dispatch · Apex S7", eta: "in 12m", icon: Zap },
              { job: "bracket.seed · Orbit Open", eta: "in 40m", icon: Layers },
              { job: "report.generate · Pulse", eta: "in 1h", icon: Terminal },
            ].map((j) => (
              <div key={j.job} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <j.icon className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="font-mono text-[11px] text-hi">{j.job}</span>
                </div>
                <span className="font-mono text-[10px] text-lo">{j.eta}</span>
              </div>
            ))}
          </div>
        </ConsolePanel>
      </div>

      {/* Command log */}
      <div className="mt-3">
        <ConsolePanel title="Command Execution Log" icon={Terminal} live>
          <div className="max-h-56 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed no-scrollbar">
            {[
              { t: "08:42:01", c: "guild.sync", r: "24180 guilds reconciled", ok: true },
              { t: "08:41:55", c: "match.start M-14", r: "thread provisioned · 3 roles assigned", ok: true },
              { t: "08:41:40", c: "verify.batch", r: "42 players cleared · 0 flagged", ok: true },
              { t: "08:41:12", c: "shard.reconnect #07", r: "reconnecting…", ok: false },
              { t: "08:40:58", c: "checkin.close", r: "256/256 confirmed", ok: true },
              { t: "08:40:30", c: "automation.tick", r: "bracket advanced · QF → SF", ok: true },
            ].map((l, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-lo">{l.t}</span>
                <span className="text-cyan-300">›</span>
                <span className="text-hi">{l.c}</span>
                <span className="text-white/20">—</span>
                <span className={l.ok ? "text-emerald-400/80" : "text-amber-300"}>{l.r}</span>
                {l.ok ? <CheckCircle2 className="ml-auto h-3 w-3 shrink-0 text-emerald-400/60" /> : <RefreshCw className="ml-auto h-3 w-3 shrink-0 animate-spin text-amber-400/60" />}
              </div>
            ))}
          </div>
        </ConsolePanel>
      </div>
    </div>
  );
}

export function SystemHealth() {
  const t = useLiveTelemetry(2000);
  return (
    <div>
      <div className="mb-6 border-b border-white/8 pb-5">
        <DashboardCrumb trail={["Admin", "System Health"]} />
        <div className="flex items-center gap-3">
          <h1 className="font-mono text-2xl font-bold uppercase tracking-[0.1em] text-hi sm:text-3xl">System Health</h1>
          <span className="flex items-center gap-1.5 rounded-md border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />99.99% uptime
          </span>
        </div>
        <p className="mt-1 font-mono text-xs text-lo">// infrastructure monitoring · 28 edge regions · P50 {t.latencyHistory[t.latencyHistory.length - 1]}ms</p>
      </div>

      {/* Service grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {t.services.map((s) => {
          const tone = s.state === "operational" ? "border-emerald-400/15" : s.state === "syncing" ? "border-cyan-400/15" : s.state === "degraded" ? "border-amber-400/15" : "border-rose-400/15";
          return (
            <div key={s.id} className={cn("rounded-xl border bg-void-900/40 p-4 backdrop-blur", tone)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><Server className="h-4 w-4 text-lo" /><span className="text-sm font-medium text-hi">{s.name}</span></div>
                <StatusDot state={s.state} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div><p className="font-mono text-[9px] uppercase text-lo">Latency</p><p className="font-mono text-sm font-bold text-hi">{s.latency}ms</p></div>
                <div><p className="font-mono text-[9px] uppercase text-lo">Uptime</p><p className="font-mono text-sm font-bold text-emerald-300">{s.uptime}%</p></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Latency graphs */}
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <ConsolePanel title="Global Latency" icon={Activity}>
          <div className="p-4"><Sparkline data={t.latencyHistory} color="#22d3ee" height={90} /></div>
        </ConsolePanel>
        <ConsolePanel title="Request Volume" icon={Cpu}>
          <div className="p-4"><Sparkline data={t.throughputHistory} color="#a78bfa" height={90} /></div>
        </ConsolePanel>
      </div>
    </div>
  );
}
