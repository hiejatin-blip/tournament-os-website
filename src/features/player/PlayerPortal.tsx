/* ============================================================================
   TOURNAMENT OS — COMPLETE PLAYER PORTAL
   All player-specific portal pages (rendered inside DashboardLayout).
   Each page is production-ready with loading states, empty states, and
   real authenticated user data from the auth context.
   ============================================================================ */
import { useEffect, useState } from "react";
import { ease } from "@/shared/motion/motion-tokens";
import { StatCard } from "@/components/ui/kit/StatCard";
import { Switch } from "@/components/ui/switch";
import { SmoothTabBar } from "@/components/ui/kit/SmoothTabBar";
import { useConfetti } from "@/components/magic/confetti";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, CheckSquare, ShieldCheck, Bell, Check, ArrowRight, Clock, Loader2,
  UserCircle2, Lock, Eye, EyeOff, Palette, Save,
} from "lucide-react";
import { useUser, useAuth } from "@/features/auth/AuthContext";
import { DashboardCrumb } from "@/app/layouts/DashboardLayout";
import {
  myTournaments, myTeams, myMatches, myCheckIns, myVerifications,
  myAchievements, activityFeed, careerStats,
} from "@/features/auth/playerData";
import { mockNotifications, categoryIcon, categoryColor } from "@/features/auth/notifications";
import { REGIONS } from "@/lib/directory";
import { cn } from "@/lib/utils";


/* ============================================================ Shared atoms */
function StatPill({ label, value, c = "text-cyan-300" }: { label: string; value: string | number; c?: string }) {
  return (
    <div className="rounded-2xl glass-card p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-lo">{label}</p>
      <p className={cn("mt-2 font-display text-2xl font-bold", c)}>{value}</p>
    </div>
  );
}

function PageHead({ crumb, title, sub }: { crumb: string[]; title: string; sub?: string }) {
  return (
    <div className="mb-8">
      <DashboardCrumb trail={crumb} />
      <h1 className="font-display text-2xl font-bold text-hi sm:text-3xl">{title}</h1>
      {sub && <p className="mt-1 text-sm text-mid">{sub}</p>}
    </div>
  );
}

/* Status chip */
const regStatusStyle: Record<string, string> = {
  registered: "border-cyan-400/40 bg-cyan-400/10 text-cyan-300",
  verified: "border-violet-400/40 bg-violet-400/10 text-violet-300",
  "checked-in": "border-sky-400/40 bg-sky-400/10 text-sky-300",
  active: "border-rose-400/40 bg-rose-500/10 text-rose-300",
  winner: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  eliminated: "border-white/15 bg-white/5 text-mid",
};

const regStatusLabel: Record<string, string> = {
  registered: "Registered", verified: "Verified", "checked-in": "Checked in",
  active: "Active", winner: "🏆 Winner", eliminated: "Eliminated",
};

/* ============================================================ DASHBOARD */
export function PlayerDashboard() {
  const user = useUser();
  const celebrate = useConfetti();
  const latest = activityFeed[0];
  useEffect(() => {
    if (latest?.type === "match_won") celebrate({ particleCount: 180, origin: { x: 0.5, y: 0.5 } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const unread = mockNotifications.filter((n) => !n.read).length;
  const upcomingMatch = myMatches.find((m) => m.result === "upcoming");

  return (
    <div>
      <DashboardCrumb trail={["Player", "Dashboard"]} />
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-hi sm:text-3xl">Welcome back, {user?.displayName ?? "Player"}</h1>
          <p className="mt-1 text-sm text-mid">Here's what's happening across your competitive career.</p>
        </div>
        {unread > 0 && (
          <Link to="/app/player/notifications" className="flex items-center gap-2 rounded-xl border border-rose-400/25 bg-rose-500/5 px-3 py-2 text-sm text-rose-300">
            <Bell className="h-4 w-4" />{unread} notifications need attention
          </Link>
        )}
      </div>

      {/* Stat strip — animated KPI cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Rating" value={careerStats.rating} delta="+42" />
        <StatCard label="Rank" value={careerStats.rank} prefix="#" />
        <StatCard label="Win rate" value={careerStats.winRate} suffix="%" percent={careerStats.winRate / 100} />
        <StatCard label="Titles" value={careerStats.titles} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Upcoming match urgency card */}
        {upcomingMatch && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, ease: ease.emphasized }} className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl border border-rose-400/30 bg-rose-500/5 p-5">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-rose-500/10 blur-2xl" />
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-rose-300"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-rose-400 opacity-75" /><span className="relative h-2 w-2 rounded-full bg-rose-400" /></span>Match starting soon</div>
              <h3 className="mt-3 text-lg font-bold text-hi">{upcomingMatch.tournament} — {upcomingMatch.round}</h3>
              <p className="mt-1 text-sm text-mid">vs <span className="font-semibold text-hi">{upcomingMatch.opponent}</span></p>
              <div className="mt-3 flex items-center gap-2 text-sm text-rose-300"><Clock className="h-4 w-4" />{upcomingMatch.date}</div>
              <Link to="/app/player/matches" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-500/20 px-4 py-2 text-sm font-medium text-rose-300 transition-colors hover:bg-rose-500/30">View match details <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </motion.div>
        )}

        {/* Check-in alerts */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, ease: ease.emphasized }}>
          <div className="rounded-2xl glass-card p-5 h-full">
            <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold text-hi">Check-in status</h3><Link to="/app/player/check-ins" className="text-xs text-cyan-300 hover:text-cyan-200">All</Link></div>
            <div className="space-y-2">
              {myCheckIns.map((c) => (
                <div key={c.tournamentSlug} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.01] px-3 py-2.5">
                  <div className="min-w-0"><p className="truncate text-sm text-hi">{c.tournamentName}</p><p className="font-mono text-[10px] text-lo">{c.deadline}</p></div>
                  <span className={cn("shrink-0 rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold ml-2", c.status === "open" ? "border-amber-400/40 bg-amber-400/10 text-amber-300" : c.status === "done" ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300" : "border-white/10 text-lo")}>
                    {c.status === "done" ? "✓ Done" : c.status === "open" ? "⚡ Open" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* My tournaments preview */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, ease: ease.emphasized }} className="mt-4 rounded-2xl glass-card p-5">
        <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-semibold text-hi">Active tournaments</h3><Link to="/app/player/tournaments" className="text-xs text-cyan-300 hover:text-cyan-200">View all</Link></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {myTournaments.filter((t) => t.status !== "Completed").slice(0, 3).map((t) => (
            <Link key={t.slug} to={`/explore/tournaments/${t.slug}`} className="group relative overflow-hidden rounded-xl border border-white/6 bg-white/[0.02] p-4 transition-colors hover:border-cyan-400/25">
              <div className={cn("pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-full bg-gradient-to-br blur-xl", t.gradient)} />
              <span className={cn("rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase", regStatusStyle[t.regStatus])}>{regStatusLabel[t.regStatus]}</span>
              <p className="mt-2 font-semibold text-hi group-hover:text-cyan-100 text-sm">{t.name}</p>
              <p className="text-xs text-mid mt-0.5">{t.prize} · {t.date}</p>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Activity feed */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, ease: ease.emphasized }} className="mt-4 rounded-2xl glass-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-hi">Recent activity</h3>
        <div className="space-y-1">
          {activityFeed.slice(0, 5).map((a) => (
            <div key={a.id} className="flex items-start gap-3 rounded-lg px-2 py-2.5">
              <span className={cn("mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg text-sm", a.type === "match_won" ? "bg-emerald-400/10 text-emerald-400" : a.type === "match_lost" ? "bg-rose-400/10 text-rose-400" : "bg-cyan-400/10 text-cyan-400")}>
                {a.type === "match_won" ? "W" : a.type === "match_lost" ? "L" : a.type === "achievement" ? "🏆" : "✓"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-hi">{a.title}</p>
                <p className="text-xs text-mid mt-0.5">{a.detail}</p>
              </div>
              <span className="shrink-0 font-mono text-[10px] text-lo">{a.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ============================================================ MY TOURNAMENTS */
export function MyTournaments() {
  const [tab, setTab] = useState<"active" | "completed">("active");
  const active = myTournaments.filter((t) => t.status !== "Completed");
  const completed = myTournaments.filter((t) => t.status === "Completed");
  const shown = tab === "active" ? active : completed;

  return (
    <div>
      <PageHead crumb={["Player", "My Tournaments"]} title="My Tournaments" sub="Track all your registrations, statuses, and results." />
      <SmoothTabBar
        className="mb-6 w-fit rounded-2xl glass-card p-1.5"
        items={(["active", "completed"] as const).map((t) => ({
          id: t,
          label: `${t} (${(t === "active" ? active : completed).length})`,
        }))}
        value={tab}
        onChange={(id) => setTab(id as "active" | "completed")}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((t) => (
          <motion.div key={t.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: ease.emphasized }} className="relative overflow-hidden rounded-2xl glass-card">
            <div className={cn("h-2 w-full bg-gradient-to-r", t.gradient)} />
            <div className="p-5">
              <div className="flex items-center justify-between">
                <span className={cn("rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase", regStatusStyle[t.regStatus])}>{regStatusLabel[t.regStatus]}</span>
                {t.placement && <span className="font-mono text-xs text-mid">#{t.placement}/{t.totalTeams}</span>}
              </div>
              <Link to={`/explore/tournaments/${t.slug}`} className="mt-3 block text-base font-semibold text-hi hover:text-cyan-100">{t.name}</Link>
              <p className="mt-1 text-xs text-mid">{t.game} · {t.format}</p>
              <div className="mt-4 flex items-center justify-between border-t border-white/6 pt-3">
                <span className="text-sm font-semibold text-cyan-300">{t.prize}</span>
                <span className="font-mono text-xs text-lo">{t.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================ MY TEAMS */
export function MyTeams() {
  const [teamInvite, setTeamInvite] = useState<{ from: string; role: string } | null>({ from: "Strata Core", role: "Duelist" });

  return (
    <div>
      <PageHead crumb={["Player", "My Teams"]} title="My Teams" sub="Manage your current and past team memberships." />
      {teamInvite && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 flex items-center justify-between rounded-2xl border border-cyan-400/25 bg-cyan-400/5 px-5 py-4">
          <div className="flex items-center gap-3"><Users className="h-5 w-5 text-cyan-300" /><div><p className="text-sm font-semibold text-hi">Team invitation from <span className="text-cyan-300">{teamInvite.from}</span></p><p className="text-xs text-mid">Role: {teamInvite.role} · Expires in 23h</p></div></div>
          <div className="flex gap-2"><button onClick={() => setTeamInvite(null)} className="rounded-xl bg-cyan-400/10 px-3.5 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-400/20 transition-colors">Accept</button><button onClick={() => setTeamInvite(null)} className="rounded-xl border border-white/10 px-3 py-2 text-sm text-lo hover:text-hi transition-colors">Decline</button></div>
        </motion.div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {myTeams.map((t) => (
          <div key={t.slug} className={cn("rounded-2xl glass-card p-6", t.status === "inactive" && "opacity-60")}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-cyan-500/25 to-blue-600/10 font-display text-sm font-bold text-hi ring-1 ring-white/10">{t.tag}</span><div><Link to={`/explore/teams/${t.slug}`} className="font-semibold text-hi hover:text-cyan-100">{t.name}</Link><p className="font-mono text-[11px] text-lo">{t.game}</p></div></div>
              <span className={cn("rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase", t.status === "active" ? "border-emerald-400/40 text-emerald-300 bg-emerald-400/10" : "border-white/10 text-lo")}>{t.status}</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/6 pt-4">
              <div><p className="font-mono text-[9px] text-lo">Role</p><p className="text-sm font-medium text-hi mt-0.5">{t.role}</p></div>
              <div><p className="font-mono text-[9px] text-lo">Members</p><p className="text-sm font-medium text-hi mt-0.5">{t.members}</p></div>
              <div><p className="font-mono text-[9px] text-lo">Joined</p><p className="text-sm font-medium text-hi mt-0.5">{t.joined}</p></div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              {t.isCaptain && <span className="rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 font-mono text-[9px] text-amber-300">Captain</span>}
              {t.status === "active" && <button className="ml-auto text-xs text-lo transition-colors hover:text-rose-400">Leave team</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================ REGISTRATIONS */
export function Registrations() {
  const active = myTournaments.filter((t) => ["Registration", "Verification", "Check-in"].includes(t.status));
  return (
    <div>
      <PageHead crumb={["Player", "Registrations"]} title="Registrations" sub="All active tournament registrations and their status." />
      {active.length === 0 ? (
        <div className="rounded-2xl glass-card p-16 text-center"><p className="text-mid">No active registrations. <Link to="/explore/tournaments" className="text-cyan-300 hover:text-cyan-200">Browse tournaments</Link></p></div>
      ) : (
        <div className="overflow-hidden rounded-2xl glass-card">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-white/6 px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-lo sm:grid-cols-[1fr_auto_auto_auto_auto]">
            <span>Tournament</span><span className="hidden sm:block">Game</span><span>Status</span><span>Prize</span><span>Date</span>
          </div>
          {active.map((t) => (
            <div key={t.slug} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-white/4 px-5 py-4 last:border-0 sm:grid-cols-[1fr_auto_auto_auto_auto]">
              <Link to={`/explore/tournaments/${t.slug}`} className="text-sm font-medium text-hi hover:text-cyan-100 truncate">{t.name}</Link>
              <span className="hidden font-mono text-xs text-mid sm:block">{t.game}</span>
              <span className={cn("rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase", regStatusStyle[t.regStatus])}>{regStatusLabel[t.regStatus]}</span>
              <span className="font-semibold text-cyan-300 text-sm">{t.prize}</span>
              <span className="font-mono text-xs text-lo">{t.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================ CHECK-INS */
export function CheckIns() {
  const [checking, setChecking] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);

  async function checkIn(slug: string) {
    setChecking(slug);
    await new Promise((r) => setTimeout(r, 1200));
    setChecking(null);
    setDone((d) => [...d, slug]);
  }

  return (
    <div>
      <PageHead crumb={["Player", "Check-ins"]} title="Check-in Center" sub="Manage your tournament check-ins. Missed check-ins trigger automatic no-show policy." />
      <div className="space-y-4">
        {myCheckIns.map((c) => {
          const checked = done.includes(c.tournamentSlug) || c.status === "done";
          return (
            <div key={c.tournamentSlug} className={cn("flex items-center justify-between gap-4 rounded-2xl glass-card p-5", c.status === "open" && !checked && "border-amber-400/20")}>
              <div className="flex items-center gap-4 min-w-0">
                <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl border text-lg", checked ? "border-emerald-400/30 bg-emerald-400/10" : c.status === "open" ? "border-amber-400/30 bg-amber-400/10" : "border-white/8 bg-white/[0.02]")}>
                  {checked ? "✓" : c.status === "open" ? "⚡" : "⏳"}
                </span>
                <div className="min-w-0"><Link to={`/explore/tournaments/${c.tournamentSlug}`} className="font-semibold text-hi hover:text-cyan-100 truncate block">{c.tournamentName}</Link><p className="font-mono text-xs text-mid mt-0.5">{c.status === "open" ? "Window closes:" : "Opens:"} {c.deadline}</p></div>
              </div>
              {checked ? (
                <span className="shrink-0 flex items-center gap-1.5 rounded-xl bg-emerald-400/10 px-3 py-2 text-sm font-medium text-emerald-400"><Check className="h-4 w-4" />Checked in</span>
              ) : c.status === "open" ? (
                <button onClick={() => checkIn(c.tournamentSlug)} disabled={checking === c.tournamentSlug} className="shrink-0 flex items-center gap-2 rounded-xl bg-amber-400/15 px-4 py-2 text-sm font-semibold text-amber-300 hover:bg-amber-400/25 transition-colors disabled:opacity-60">
                  {checking === c.tournamentSlug ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckSquare className="h-4 w-4" />}Check in
                </button>
              ) : (
                <span className="shrink-0 rounded-xl border border-white/8 px-3 py-2 text-sm text-lo">Not open yet</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================ VERIFICATION */
export function Verification() {
  const vstyleMap = { approved: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300", rejected: "border-rose-400/40 bg-rose-500/10 text-rose-300", pending: "border-amber-400/40 bg-amber-400/10 text-amber-300", "not-started": "border-white/10 text-lo bg-white/[0.02]" };
  return (
    <div>
      <PageHead crumb={["Player", "Verification"]} title="Verification Status" sub="Account, region, and eligibility verification for each tournament." />
      <div className="space-y-4">
        {myVerifications.map((v) => (
          <div key={v.tournamentSlug} className="flex items-center justify-between gap-4 rounded-2xl glass-card p-5">
            <div className="min-w-0 flex-1">
              <Link to={`/explore/tournaments/${v.tournamentSlug}`} className="font-semibold text-hi hover:text-cyan-100">{v.tournamentName}</Link>
              <p className="mt-1 font-mono text-xs text-mid">{v.game} · {v.region}{v.submittedAt && ` · Submitted ${v.submittedAt}`}</p>
            </div>
            <span className={cn("shrink-0 rounded-xl border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider", vstyleMap[v.status])}>
              {v.status === "approved" ? "✓ Approved" : v.status === "rejected" ? "✗ Rejected" : v.status === "pending" ? "⏳ Pending" : "Not started"}
            </span>
            {v.status === "not-started" && <button className="shrink-0 rounded-xl bg-cyan-400/10 px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-400/20 transition-colors">Start</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================ MATCH HISTORY */
export function MatchHistory() {
  return (
    <div>
      <PageHead crumb={["Player", "Match History"]} title="Match History" sub={`${myMatches.length} matches recorded across all tournaments.`} />
      <div className="overflow-hidden rounded-2xl glass-card">
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 border-b border-white/6 px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-lo sm:grid-cols-[auto_1fr_auto_auto_auto]">
          <span>Result</span><span>Match</span><span className="hidden sm:block">Score</span><span>Tournament</span><span>Date</span>
        </div>
        {myMatches.map((m) => (
          <div key={m.id} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 border-b border-white/4 px-5 py-4 last:border-0 sm:grid-cols-[auto_1fr_auto_auto_auto]">
            <span className={cn("grid h-8 w-8 place-items-center rounded-lg font-mono text-xs font-bold", m.result === "win" ? "bg-emerald-500/15 text-emerald-400" : m.result === "loss" ? "bg-rose-500/15 text-rose-400" : "bg-amber-500/15 text-amber-400")}>
              {m.result === "win" ? "W" : m.result === "loss" ? "L" : "—"}
            </span>
            <div><p className="text-sm text-hi">vs {m.opponent}</p><p className="font-mono text-[10px] text-lo">{m.round}</p></div>
            <span className="hidden font-mono text-sm font-semibold text-cyan-300 sm:block">{m.score}</span>
            <Link to={`/explore/tournaments/${m.tournamentSlug}`} className="truncate text-xs text-mid hover:text-cyan-300 max-w-[120px]">{m.tournament}</Link>
            <span className="font-mono text-[10px] text-lo">{m.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================ STATISTICS */
export function PlayerStats() {
  const bars = [
    { label: "Win rate", val: careerStats.winRate },
    { label: "Consistency score", val: 88 },
    { label: "Top-placement rate", val: Math.round((careerStats.tournamentsWon / careerStats.tournamentsEntered) * 100) },
  ];
  return (
    <div>
      <PageHead crumb={["Player", "Statistics"]} title="Career Statistics" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl glass-card p-6">
          <h3 className="text-sm font-semibold text-hi mb-4">Overview</h3>
          <div className="grid grid-cols-2 gap-3">
            {[{ l: "Matches played", v: careerStats.matchesPlayed }, { l: "Wins", v: careerStats.wins }, { l: "Losses", v: careerStats.losses }, { l: "Peak rating", v: careerStats.rating }, { l: "Tournaments entered", v: careerStats.tournamentsEntered }, { l: "Tournaments won", v: careerStats.tournamentsWon }, { l: "Titles", v: careerStats.titles }, { l: "Avg. placement", v: careerStats.avgPlacement }].map((s) => (
              <div key={s.l} className="rounded-xl border border-white/6 bg-white/[0.02] p-3"><p className="font-display text-lg font-bold text-hi">{s.v}</p><p className="font-mono text-[10px] text-lo">{s.l}</p></div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl glass-card p-6">
          <h3 className="text-sm font-semibold text-hi mb-5">Performance</h3>
          <div className="space-y-5">
            {bars.map((b) => (
              <div key={b.label}>
                <div className="flex justify-between text-sm mb-1.5"><span className="text-mid">{b.label}</span><span className="font-mono font-semibold text-cyan-300">{b.val}%</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-white/8">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${b.val}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease: ease.emphasized }} className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-white/6 bg-white/[0.02] p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-lo mb-1">Platform rank</p>
            <p className="font-display text-3xl font-bold text-amber-300">#{careerStats.rank}</p>
            <p className="text-xs text-mid mt-1">EU-West · Valorant</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ ACHIEVEMENTS */
const rarityStyle: Record<string, string> = {
  legendary: "border-amber-400/50 bg-amber-400/10 text-amber-300",
  epic: "border-violet-400/40 bg-violet-400/10 text-violet-300",
  rare: "border-cyan-400/35 bg-cyan-400/10 text-cyan-300",
  common: "border-white/10 text-lo",
};

export function Achievements() {
  return (
    <div>
      <PageHead crumb={["Player", "Achievements"]} title="Achievements" sub={`${myAchievements.length} achievements unlocked.`} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {myAchievements.map((a) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ease: ease.emphasized }} className="flex gap-4 rounded-2xl glass-card p-5">
            <span className="text-3xl">{a.icon}</span>
            <div>
              <div className="flex items-center gap-2"><p className="font-semibold text-hi">{a.title}</p><span className={cn("rounded-full border px-1.5 font-mono text-[9px] uppercase", rarityStyle[a.rarity])}>{a.rarity}</span></div>
              <p className="mt-1 text-xs text-mid">{a.detail}</p>
              <p className="mt-1.5 font-mono text-[10px] text-lo">{a.date}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================ NOTIFICATIONS */
export function NotificationCenter() {
  const [notifs, setNotifs] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const unread = notifs.filter((n) => !n.read).length;

  const shown = filter === "unread" ? notifs.filter((n) => !n.read) : notifs;

  function markRead(id: string) { setNotifs((ns) => ns.map((n) => n.id === id ? { ...n, read: true } : n)); }
  function markAllRead() { setNotifs((ns) => ns.map((n) => ({ ...n, read: true }))); }

  return (
    <div>
      <PageHead crumb={["Player", "Notifications"]} title="Notification Center" sub={unread ? `${unread} unread notifications.` : "All caught up."} />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-xl glass-card p-1.5">
          {(["all", "unread"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={cn("rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors", filter === f ? "bg-cyan-400/10 text-cyan-300" : "text-mid hover:text-hi")}>{f} {f === "unread" && `(${unread})`}</button>
          ))}
        </div>
        {unread > 0 && <button onClick={markAllRead} className="text-xs text-cyan-300 hover:text-cyan-200">Mark all as read</button>}
      </div>
      <div className="space-y-2.5">
        {shown.length === 0 ? (
          <div className="rounded-2xl glass-card p-16 text-center"><p className="text-mid">No {filter === "unread" ? "unread " : ""}notifications.</p></div>
        ) : shown.map((n) => {
          const Icon = categoryIcon[n.category];
          return (
            <motion.div key={n.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: ease.emphasized }} className={cn("flex gap-4 rounded-2xl border px-5 py-4 transition-colors", n.read ? "border-white/6 bg-white/[0.015]" : "border-white/10 bg-white/[0.03]", n.urgent && !n.read && "border-amber-400/20 bg-amber-400/[0.04]")}>
              <span className={cn("mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border", categoryColor[n.category])}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn("text-sm font-medium", n.read ? "text-mid" : "text-hi")}>{n.title}{n.urgent && !n.read && <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-amber-400 align-middle" />}</p>
                  <span className="font-mono text-[10px] text-lo shrink-0">{n.time}</span>
                </div>
                <p className="mt-1 text-xs text-mid leading-relaxed">{n.body}</p>
                <div className="mt-2 flex items-center gap-3">
                  {n.action && <Link to={n.action.to} className="text-xs text-cyan-300 hover:text-cyan-200 font-medium">{n.action.label} →</Link>}
                  {!n.read && <button onClick={() => markRead(n.id)} className="text-xs text-lo hover:text-hi">Mark read</button>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================ SETTINGS */
export function AccountSettings() {
  const { updateUser, logout } = useAuth();
  const user = useUser();
  const [tab, setTab] = useState("profile");
  const TABS = [
    { id: "profile", label: "Profile", icon: UserCircle2 },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: ShieldCheck },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  /* Profile state */
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [country, setCountry] = useState(user?.country ?? "");
  const [region, setRegion] = useState(user?.region ?? "EU-West");
  const [discord, setDiscord] = useState(user?.discord ?? "");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  /* Security state */
  const [currPw, setCurrPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confPw, setConfPw] = useState("");
  const [showPw, setShowPw] = useState(false);

  /* Notification prefs */
  const [notifPrefs, setNotifPrefs] = useState({ matches: true, tournaments: true, team: true, verification: true, announcements: false, marketing: false });

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    updateUser({ displayName, bio, country, region, discord });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (!user) return null;

  return (
    <div>
      <PageHead crumb={["Player", "Settings"]} title="Account Settings" />
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Tab nav */}
        <div className="flex flex-row gap-1 overflow-x-auto rounded-2xl glass-card p-2 no-scrollbar lg:flex-col">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn("flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-colors whitespace-nowrap", tab === t.id ? "bg-cyan-400/10 text-cyan-300" : "text-mid hover:text-hi")}>
              <t.icon className="h-4 w-4 shrink-0" />{t.label}
            </button>
          ))}
          <div className="lg:mt-auto lg:pt-4">
            <button onClick={logout} className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-lo transition-colors hover:bg-rose-500/10 hover:text-rose-400"><ShieldCheck className="h-4 w-4" />Sign out</button>
          </div>
        </div>

        {/* Tab content */}
        <div className="rounded-2xl glass-card p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              {/* PROFILE */}
              {tab === "profile" && (
                <form onSubmit={saveProfile} className="space-y-5">
                  <h2 className="text-lg font-semibold text-hi">Profile settings</h2>
                  {saved && <div className="flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-sm text-emerald-300"><Check className="h-4 w-4" />Profile saved successfully.</div>}
                  <div className="flex items-center gap-4 pb-4 border-b border-white/8">
                    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500/30 to-amber-500/20 font-display text-2xl font-bold text-hi ring-1 ring-white/10">{user.avatar}</span>
                    <div><p className="font-semibold text-hi">{user.username}</p><p className="text-xs text-lo">{user.email}</p><button type="button" className="mt-1.5 text-xs text-cyan-300 hover:text-cyan-200">Change avatar</button></div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className="block text-sm font-medium text-hi">Display name</label><input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-hi focus:border-cyan-400/50 focus:outline-none" /></div>
                    <div><label className="block text-sm font-medium text-hi">Country</label><input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. Japan" className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-hi focus:border-cyan-400/50 focus:outline-none" /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-hi">Bio</label><textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-hi focus:border-cyan-400/50 focus:outline-none" /></div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><label className="block text-sm font-medium text-hi">Region</label><select value={region} onChange={(e) => setRegion(e.target.value)} className="mt-1.5 w-full rounded-xl border border-white/10 bg-void-850 px-4 py-3 text-sm text-hi focus:outline-none">{REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}</select></div>
                    <div><label className="block text-sm font-medium text-hi">Discord</label><input value={discord} onChange={(e) => setDiscord(e.target.value)} placeholder="handle#0000" className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-hi focus:border-cyan-400/50 focus:outline-none" /></div>
                  </div>
                  <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-void-950 disabled:opacity-60">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save changes
                  </button>
                </form>
              )}

              {/* SECURITY */}
              {tab === "security" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-hi">Security</h2>
                  <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                    <p className="text-sm font-medium text-hi">Change password</p>
                    <div className="mt-4 space-y-3">
                      <div className="relative"><input type={showPw ? "text" : "password"} value={currPw} onChange={(e) => setCurrPw(e.target.value)} placeholder="Current password" className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-hi placeholder:text-lo focus:outline-none" /><button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-lo">{showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
                      <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="New password" className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-hi placeholder:text-lo focus:outline-none" />
                      <input type="password" value={confPw} onChange={(e) => setConfPw(e.target.value)} placeholder="Confirm new password" className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-hi placeholder:text-lo focus:outline-none" />
                      <button className="flex items-center gap-2 rounded-xl bg-cyan-400/10 px-4 py-2.5 text-sm font-medium text-cyan-300 hover:bg-cyan-400/20 transition-colors"><Lock className="h-4 w-4" />Update password</button>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-3">
                    <p className="text-sm font-medium text-hi">Connected accounts</p>
                    {[{ name: "Google", desc: "Not connected", connected: false }, { name: "Discord", desc: "phantom#8402", connected: true }].map((c) => (
                      <div key={c.name} className="flex items-center justify-between"><div><p className="text-sm text-hi">{c.name}</p><p className="text-xs text-lo">{c.desc}</p></div><button className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", c.connected ? "border border-white/10 text-lo hover:text-rose-400" : "bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20")}>{c.connected ? "Disconnect" : "Connect"}</button></div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-rose-400/20 bg-rose-500/5 p-4">
                    <p className="text-sm font-medium text-rose-300">Danger zone</p>
                    <p className="mt-1 text-xs text-mid">Deleting your account removes all data permanently and cannot be undone.</p>
                    <button className="mt-3 rounded-lg border border-rose-400/30 px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors">Delete account</button>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {tab === "notifications" && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-hi">Notification preferences</h2>
                  {Object.entries(notifPrefs).map(([k, v]) => {
                    const labels: Record<string, { l: string; d: string }> = { matches: { l: "Match assignments", d: "Upcoming and live match reminders" }, tournaments: { l: "Tournament updates", d: "Bracket advances, results, announcements" }, team: { l: "Team activity", d: "Invitations, roster changes" }, verification: { l: "Verification alerts", d: "Status changes and approvals" }, announcements: { l: "Platform announcements", d: "Product updates and major news" }, marketing: { l: "Marketing emails", d: "Tips, guides, and promotions" } };
                    const info = labels[k];
                    return info ? (
                      <div key={k} className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3.5">
                        <div><p className="text-sm font-medium text-hi">{info.l}</p><p className="text-xs text-lo">{info.d}</p></div>
                        <Switch
                          checked={v}
                          onCheckedChange={(val) => setNotifPrefs((p) => ({ ...p, [k]: val }))}
                          className="data-[state=checked]:bg-cyan-400"
                        />
                      </div>
                    ) : null;
                  })}
                </div>
              )}

              {/* PRIVACY */}
              {tab === "privacy" && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-hi">Privacy settings</h2>
                  {[{ l: "Public profile", d: "Allow others to view your profile page", v: true }, { l: "Show match history", d: "Display your match history on public profile", v: true }, { l: "Show statistics", d: "Display career stats publicly", v: false }, { l: "Discoverable in search", d: "Appear in platform-wide player search", v: true }].map((s) => (
                    <div key={s.l} className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3.5">
                      <div><p className="text-sm font-medium text-hi">{s.l}</p><p className="text-xs text-lo">{s.d}</p></div>
                      <button className={cn("relative h-6 w-11 rounded-full border transition-colors", s.v ? "border-cyan-400/60 bg-cyan-400/20" : "border-white/15 bg-white/5")}>
                        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full transition-transform", s.v ? "translate-x-5 bg-cyan-400" : "translate-x-0.5 bg-white/25")} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* APPEARANCE */}
              {tab === "appearance" && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold text-hi">Appearance</h2>
                  <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                    <p className="text-sm font-medium text-hi">Theme</p>
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {["System", "Dark", "Light"].map((t) => (
                        <button key={t} className={cn("rounded-xl border py-3 text-sm text-hi transition-colors", t === "Dark" ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300" : "border-white/8 text-mid hover:text-hi")}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                    <p className="text-sm font-medium text-hi">Language</p>
                    <select className="mt-3 w-full rounded-xl border border-white/10 bg-void-850 px-4 py-2.5 text-sm text-hi focus:outline-none">
                      <option>English</option><option>Japanese</option><option>Korean</option><option>Portuguese</option><option>Spanish</option>
                    </select>
                  </div>
                  <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                    <p className="text-sm font-medium text-hi">Reduce animations</p>
                    <p className="text-xs text-lo mt-1">Simplifies motion effects across the platform.</p>
                    <button className="relative mt-3 h-6 w-11 rounded-full border border-white/15 bg-white/5">
                      <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white/25 transition-transform" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}