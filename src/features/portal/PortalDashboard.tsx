import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Trophy, Users, CheckSquare, Bell, BarChart3, Settings,
  ShieldCheck, Calendar, Cpu, GitBranch, MessageSquare, Server, Key, Activity,
  UserCheck, FileText, ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { LiveDot, Stagger, StaggerItem } from "@/components/ui";
import { StatCard } from "@/components/ui/kit/StatCard";
import { AnimatedList } from "@/components/magic/animated-list";
import { DashboardCrumb } from "@/app/layouts/DashboardLayout";
import type { PortalRole } from "@/shared/config/navigation";
import { cn } from "@/lib/utils";

/* ============================================================================
   PortalDashboard — role overviews. Stats are now NUMERIC and rendered via
   StatCard (activity ring + NumberTicker). Panels use AnimatedList.
   ============================================================================ */

type Stat = {
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  percent?: number;
  delta?: string;
};

type Cfg = {
  title: string;
  subtitle: string;
  stats: Stat[];
  panels: { title: string; rows: { label: string; value: string; tone?: "ok" | "live" | "warn" }[] }[];
  shortcuts: { icon: LucideIcon; label: string }[];
};

const configs: Record<PortalRole, Cfg> = {
  player: {
    title: "Welcome back, Phantom",
    subtitle: "Here's what's happening across your competitive career.",
    stats: [
      { label: "Active tournaments", value: 3 },
      { label: "Career rating", value: 2847, delta: "+42" },
      { label: "Win rate", value: 81, suffix: "%", percent: 0.81 },
      { label: "Titles", value: 14 },
    ],
    panels: [
      { title: "Upcoming matches", rows: [{ label: "QF vs Nexus Prime", value: "in 12m", tone: "live" }, { label: "R16 vs Orbit.gg", value: "18:30", tone: "ok" }, { label: "Group vs Meridian", value: "Tomorrow", tone: "ok" }] },
      { title: "Check-in status", rows: [{ label: "WinterCup 2026", value: "Checked in", tone: "ok" }, { label: "Apex Circuit S7", value: "Opens 17:00", tone: "warn" }] },
    ],
    shortcuts: [{ icon: Trophy, label: "My Tournaments" }, { icon: Users, label: "My Teams" }, { icon: CheckSquare, label: "Check-ins" }, { icon: BarChart3, label: "Statistics" }],
  },
  organizer: {
    title: "Organizer overview",
    subtitle: "Every event you're running, in one command surface.",
    stats: [
      { label: "Live tournaments", value: 12 },
      { label: "Players managed", value: 8940, delta: "+312" },
      { label: "Matches today", value: 184 },
      { label: "Automation rate", value: 100, suffix: "%", percent: 1 },
    ],
    panels: [
      { title: "Live operations", rows: [{ label: "WinterCup 2026 · QF", value: "3 live", tone: "live" }, { label: "Orbit Open · Check-in", value: "41/64", tone: "ok" }, { label: "Nexus Q · Seeding", value: "Auto", tone: "ok" }] },
      { title: "Action center", rows: [{ label: "2 disputes pending", value: "Review", tone: "warn" }, { label: "Bracket seeded", value: "Auto", tone: "ok" }, { label: "128 channels provisioned", value: "Done", tone: "ok" }] },
    ],
    shortcuts: [{ icon: Trophy, label: "New Tournament" }, { icon: Cpu, label: "Automation" }, { icon: GitBranch, label: "Live Brackets" }, { icon: BarChart3, label: "Analytics" }],
  },
  admin: {
    title: "Platform administration",
    subtitle: "Total oversight across guilds, users, and system health.",
    stats: [
      { label: "Active guilds", value: 24180 },
      { label: "Monthly events", value: 48.2, decimals: 1, suffix: "K", delta: "+8%" },
      { label: "Uptime", value: 99.99, decimals: 2, suffix: "%", percent: 0.9999 },
      { label: "API calls / day", value: 42, suffix: "M" },
    ],
    panels: [
      { title: "System health", rows: [{ label: "Automation engine", value: "Operational", tone: "ok" }, { label: "Edge · 28 regions", value: "Healthy", tone: "ok" }, { label: "P50 latency", value: "38ms", tone: "ok" }] },
      { title: "Recent audit log", rows: [{ label: "Role updated · staff.admin", value: "2m ago", tone: "ok" }, { label: "API key rotated", value: "1h ago", tone: "ok" }, { label: "Guild verified · Vanta", value: "3h ago", tone: "ok" }] },
    ],
    shortcuts: [{ icon: Server, label: "Guilds" }, { icon: UserCheck, label: "Users" }, { icon: Key, label: "API Keys" }, { icon: Activity, label: "Monitoring" }],
  },
};

const toneStyles = { ok: "text-emerald-400", live: "text-rose-300", warn: "text-amber-300" } as const;
const roleLabel: Record<PortalRole, string> = { player: "Player", organizer: "Organizer", admin: "Admin" };

export function PortalDashboard({ role }: { role: PortalRole }) {
  const c = configs[role];
  return (
    <div>
      <DashboardCrumb trail={[roleLabel[role], "Dashboard"]} />
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-hi sm:text-3xl">{c.title}</h1>
        <p className="mt-1 text-sm text-mid">{c.subtitle}</p>
      </div>

      {(role === "organizer" || role === "admin") && (
        <Link
          to={role === "admin" ? "/app/admin/monitoring" : "/app/organizer/live"}
          className="group mb-4 flex items-center justify-between overflow-hidden rounded-2xl border border-cyan-400/25 bg-gradient-to-r from-cyan-500/10 via-void-900/40 to-transparent p-5 transition-colors hover:border-cyan-400/50"
        >
          <div className="flex items-center gap-4">
            <span className="relative grid h-12 w-12 place-items-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
              <Activity className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-rose-400" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-rose-400" />
            </span>
            <div>
              <p className="font-mono text-sm font-bold uppercase tracking-[0.12em] text-hi">{role === "admin" ? "System Health" : "Live Operations Center"}</p>
              <p className="mt-0.5 text-xs text-mid">{role === "admin" ? "Real-time infrastructure monitoring" : "Real-time mission control · matches, feed, bot telemetry"}</p>
            </div>
          </div>
          <span className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-cyan-300">Enter <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
        </Link>
      )}

      <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {c.stats.map((s) => (
          <StaggerItem key={s.label} className="h-full">
            <StatCard {...s} className="h-full" />
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {c.panels.map((p) => (
            <div key={p.title} className="rounded-2xl glass-card p-5">
              <p className="mb-3 text-sm font-semibold text-hi">{p.title}</p>
              <AnimatedList
                items={p.rows}
                itemKey={(r) => (r as { label: string }).label}
                render={(r) => {
                  const row = r as { label: string; value: string; tone?: "ok" | "live" | "warn" };
                  return (
                    <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.01] px-3 py-2.5">
                      <span className="flex items-center gap-2 text-sm text-mid">
                        {row.tone === "live" && <LiveDot color="bg-rose-400" className="scale-75" />}
                        {row.label}
                      </span>
                      <span className={cn("font-mono text-xs", row.tone ? toneStyles[row.tone] : "text-mid")}>{row.value}</span>
                    </div>
                  );
                }}
              />
            </div>
          ))}
        </div>
        <div className="rounded-2xl glass-card p-5">
          <p className="mb-3 text-sm font-semibold text-hi">Quick actions</p>
          <div className="grid grid-cols-2 gap-2">
            {c.shortcuts.map((s) => (
              <button key={s.label} className="flex flex-col items-start gap-2 rounded-xl border border-white/6 bg-white/[0.02] p-3 text-left transition-colors hover:border-cyan-400/25 hover:bg-white/[0.04]">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/8 bg-void-800 text-cyan-300"><s.icon className="h-4 w-4" /></span>
                <span className="text-xs font-medium text-hi">{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
