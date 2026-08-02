import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SmoothTabBar } from "@/components/ui/kit/SmoothTabBar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  ArrowRight, Share2, ShieldCheck, Trophy, Users, MapPin, Swords,
} from "lucide-react";
import { PageSection, Breadcrumb } from "../../components/site/blocks";
import { Button, LiveDot, Stagger, StaggerItem } from "../../components/ui";
import { EmptyState, CardBanner, TournamentCard } from "../../components/site/PublicKit";
import { useGuild, usePlayer, useTeam } from "@/lib/queries";
import {
  guildTournaments, guildTeams, guildPlayers, guildAchievements, playerAchievements, recentMatches,
} from "@/lib/detail";
import {
  gameShort, winRate, fmtNum, guildStatusStyles, players as allPlayers,
} from "@/lib/directory";
import { cn } from "@/lib/utils";

function Tabs({ tabs, active, setActive }: { tabs: string[]; active: string; setActive: (s: string) => void }) {
  return (
    <SmoothTabBar
      items={tabs.map((t) => ({ id: t, label: t }))}
      value={active}
      onChange={setActive}
      className="rounded-2xl glass-card p-1.5"
    />
  );
}

function ProfileSkeleton() {
  return (
    <div className="px-5 pt-36 sm:px-8 sm:pt-44">
      <div className="mx-auto max-w-7xl">
        <div className="h-40 animate-pulse rounded-3xl bg-white/[0.03]" />
        <div className="mt-6 flex gap-4"><div className="h-20 w-20 animate-pulse rounded-2xl bg-white/5" /><div className="flex-1 space-y-3"><div className="h-6 w-1/3 animate-pulse rounded bg-white/5" /><div className="h-4 w-1/4 animate-pulse rounded bg-white/5" /></div></div>
      </div>
    </div>
  );
}

function AchievementGrid({ items }: { items: { title: string; detail: string; year: string }[] }) {
  return (
    <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((a) => (
        <StaggerItem key={a.title}>
          <div className="flex items-start gap-3 rounded-2xl glass-card p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-amber-400/10 text-amber-300"><Trophy className="h-5 w-5" /></span>
            <div><p className="text-sm font-semibold text-hi">{a.title}</p><p className="text-xs text-mid">{a.detail}</p><p className="mt-1 font-mono text-[10px] text-lo">{a.year}</p></div>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

function StatCards({ stats }: { stats: { l: string; v: string | number; c?: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.l} className="rounded-2xl glass-card p-5"><p className="font-mono text-[10px] uppercase tracking-wider text-lo">{s.l}</p><p className={cn("mt-2 font-display text-2xl font-bold", s.c ?? "text-hi")}>{s.v}</p></div>
      ))}
    </div>
  );
}

/* ============================================================ GUILD */
export function GuildProfile() {
  const { slug } = useParams();
  const { data: g, loading } = useGuild(slug);
  const [tab, setTab] = useState("Overview");
  if (loading) return <ProfileSkeleton />;
  if (!g) return <PageSection><EmptyState title="Guild not found" icon={ShieldCheck} /></PageSection>;

  const gTournaments = guildTournaments(g.slug);
  const gTeams = guildTeams(g.name);
  const gPlayers = guildPlayers(g.name);
  const achievements = guildAchievements(g.slug);
  const tabs = ["Overview", "Tournaments", "Teams", "Players", "Achievements"];

  return (
    <ProfileShell
      banner={<CardBanner gradient={g.gradient} className="h-52 sm:h-60" />}
      badge={<span className={cn("grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br font-display text-xl font-bold text-hi ring-2 ring-void-900", g.gradient)}>{g.tag}</span>}
      title={<span className="flex items-center gap-2">{g.name}{g.verified && <ShieldCheck className="h-6 w-6 text-cyan-400" />}</span>}
      meta={<><span className={cn("rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase", guildStatusStyles[g.status])}>{g.status}</span><span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{g.region}</span><span>Founded {g.founded}</span></>}
      crumb={[{ label: "Explore", to: "/explore" }, { label: "Guilds", to: "/explore/guilds" }, { label: g.name }]}
      actions={<><Button variant="primary" href="#" iconRight={ArrowRight} magnetic={false}>Join Discord</Button><Button variant="outline" href="#" icon={Share2} magnetic={false}>Follow</Button></>}
    >
      <StatCards stats={[{ l: "Members", v: fmtNum(g.members) }, { l: "Active events", v: g.activeTournaments, c: "text-cyan-300" }, { l: "Total hosted", v: g.tournaments }, { l: "Games", v: g.games.length }]} />
      <div className="mt-6"><Tabs tabs={tabs} active={tab} setActive={setTab} /></div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="mt-6">
          {tab === "Overview" && (
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl glass-card p-6 lg:col-span-2"><h3 className="text-lg font-semibold text-hi">About</h3><p className="mt-3 text-sm leading-relaxed text-mid">{g.description}</p><div className="mt-5 flex flex-wrap gap-1.5">{g.games.map((gm) => <span key={gm} className="rounded-md border border-white/8 bg-white/[0.02] px-2.5 py-1 font-mono text-[11px] text-mid">{gm}</span>)}</div></div>
              <div className="rounded-2xl glass-card p-6"><h3 className="text-sm font-semibold text-hi">Top players</h3><div className="mt-4 space-y-2">{gPlayers.slice(0, 4).map((p) => <HoverCard key={p.slug}>
            <HoverCardTrigger asChild>
              <Link to={`/explore/players/${p.slug}`} className="group flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.03]">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-cyan-500/25 to-amber-500/15 text-[10px] font-bold text-hi ring-1 ring-white/10">{p.handle.slice(0, 2)}</span>
                <span className="flex-1 text-sm text-hi group-hover:text-cyan-100">{p.handle}</span>
                <span className="font-mono text-xs text-cyan-300">{p.rating}</span>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent side="right" className="w-56 border-white/10 bg-void-900/95 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-cyan-500/25 to-amber-500/15 text-[11px] font-bold text-hi ring-1 ring-white/10">{p.handle.slice(0, 2)}</span>
                <div>
                  <p className="text-sm font-semibold text-hi">{p.handle}</p>
                  <p className="font-mono text-[10px] text-lo">{p.role} · {p.team}</p>
                </div>
              </div>
              <p className="mt-3 flex items-center justify-between font-mono text-[11px] text-mid"><span>Rating</span><span className="text-cyan-300">{p.rating}</span></p>
              <p className="mt-1 flex items-center justify-between font-mono text-[11px] text-mid"><span>Region</span><span className="text-hi">{p.region}</span></p>
            </HoverCardContent>
          </HoverCard>)}</div></div>
            </div>
          )}
          {tab === "Tournaments" && (gTournaments.length ? <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{gTournaments.map((t) => <StaggerItem key={t.slug} className="h-full"><TournamentCard t={t} /></StaggerItem>)}</Stagger> : <EmptyState title="No tournaments yet" icon={Trophy} />)}
          {tab === "Teams" && (gTeams.length ? <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{gTeams.map((tm) => <StaggerItem key={tm.slug}><Link to={`/explore/teams/${tm.slug}`} className="group flex items-center gap-3 rounded-2xl glass-card p-4 transition-transform hover:-translate-y-1"><span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-cyan-500/25 to-blue-600/10 text-[11px] font-bold text-hi ring-1 ring-white/10">{tm.tag}</span><div className="flex-1"><p className="text-sm font-medium text-hi group-hover:text-cyan-100">{tm.name}</p><p className="font-mono text-[10px] text-lo">Rank #{tm.rank} · {gameShort[tm.game]}</p></div></Link></StaggerItem>)}</Stagger> : <EmptyState title="No teams yet" icon={Users} />)}
          {tab === "Players" && (gPlayers.length ? <div className="overflow-hidden rounded-2xl glass-card">{gPlayers.map((p, i) => <Link key={p.slug} to={`/explore/players/${p.slug}`} className="group flex items-center gap-4 border-b border-white/4 px-5 py-3.5 transition-colors last:border-0 hover:bg-white/[0.03]"><span className="w-5 text-center font-mono text-sm text-lo">{i + 1}</span><span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-cyan-500/25 to-amber-500/15 text-[11px] font-bold text-hi ring-1 ring-white/10">{p.handle.slice(0, 2)}</span><div className="flex-1"><p className="text-sm font-medium text-hi group-hover:text-cyan-100">{p.handle}</p><p className="font-mono text-[10px] text-lo">{p.role} · {p.team}</p></div><span className="font-mono text-sm text-cyan-300">{p.rating}</span></Link>)}</div> : <EmptyState title="No players yet" icon={Users} />)}
          {tab === "Achievements" && <AchievementGrid items={achievements} />}
        </motion.div>
      </AnimatePresence>
    </ProfileShell>
  );
}

/* ============================================================ PLAYER */
export function PlayerProfile() {
  const { slug } = useParams();
  const { data: p, loading } = usePlayer(slug);
  const [tab, setTab] = useState("Overview");
  if (loading) return <ProfileSkeleton />;
  if (!p) return <PageSection><EmptyState title="Player not found" icon={Users} /></PageSection>;

  const tabs = ["Overview", "Statistics", "Match History", "Achievements"];
  const wr = winRate(p.wins, p.losses);
  const history = recentMatches(p.slug);
  const achievements = playerAchievements(p.slug);

  return (
    <ProfileShell
      banner={<CardBanner gradient="from-cyan-500/30 to-amber-500/10" className="h-52 sm:h-60" />}
      badge={<span className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500/30 to-amber-500/20 font-display text-2xl font-bold text-hi ring-2 ring-void-900">{p.handle.slice(0, 2)}</span>}
      title={p.handle}
      meta={<><span className="rounded-md border border-white/10 bg-void-950/50 px-2 py-0.5 font-mono text-[10px] text-hi/80">#{p.rank} GLOBAL</span><span>{p.name}</span><span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{p.region}</span></>}
      crumb={[{ label: "Explore", to: "/explore" }, { label: "Players", to: "/explore/players" }, { label: p.handle }]}
      actions={<><Button variant="primary" href="#" iconRight={ArrowRight} magnetic={false}>Follow player</Button><Button variant="outline" href={`/explore/teams/${p.team.toLowerCase().replace(/[^a-z]/g, "-")}`} icon={Users} magnetic={false}>View team</Button></>}
    >
      <StatCards stats={[{ l: "Rating", v: p.rating, c: "text-cyan-300" }, { l: "Win rate", v: `${wr}%`, c: "text-emerald-400" }, { l: "Record", v: `${p.wins}-${p.losses}` }, { l: "Titles", v: p.titles, c: "text-amber-300" }]} />
      <div className="mt-6"><Tabs tabs={tabs} active={tab} setActive={setTab} /></div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="mt-6">
          {tab === "Overview" && (
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl glass-card p-6 lg:col-span-2"><h3 className="text-lg font-semibold text-hi">Career</h3><p className="mt-3 text-sm leading-relaxed text-mid">{p.handle} ({p.name}) is a {p.role} for <Link to={`/explore/teams/${p.team.toLowerCase().replace(/[^a-z]/g, "-")}`} className="text-cyan-300 hover:text-cyan-200">{p.team}</Link>, competing in {p.game} out of {p.region}. Ranked #{p.rank} globally with a {p.rating} rating and {p.titles} career titles.</p></div>
              <div className="rounded-2xl glass-card p-6"><h3 className="text-sm font-semibold text-hi">Affiliations</h3><div className="mt-4 space-y-2"><Link to={`/explore/guilds/${p.guild.toLowerCase().replace(/[^a-z]/g, "-")}`} className="flex items-center gap-2 rounded-lg border border-white/6 bg-white/[0.02] px-3 py-2.5 text-sm text-hi transition-colors hover:border-cyan-400/25"><ShieldCheck className="h-4 w-4 text-cyan-400" />{p.guild}</Link><Link to={`/explore/teams/${p.team.toLowerCase().replace(/[^a-z]/g, "-")}`} className="flex items-center gap-2 rounded-lg border border-white/6 bg-white/[0.02] px-3 py-2.5 text-sm text-hi transition-colors hover:border-cyan-400/25"><Users className="h-4 w-4 text-cyan-400" />{p.team}</Link></div></div>
            </div>
          )}
          {tab === "Statistics" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl glass-card p-6"><h3 className="text-sm font-semibold text-hi">Performance</h3><div className="mt-4 space-y-3">{[{ l: "Win rate", v: wr }, { l: "Title rate", v: Math.round((p.titles / (p.wins + p.losses)) * 100) }, { l: "Consistency", v: 88 }].map((s) => <div key={s.l}><div className="flex justify-between text-xs"><span className="text-mid">{s.l}</span><span className="font-mono text-cyan-300">{s.v}%</span></div><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/8"><motion.div initial={{ width: 0 }} whileInView={{ width: `${s.v}%` }} viewport={{ once: true }} transition={{ duration: 1 }} className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300" /></div></div>)}</div></div>
              <div className="rounded-2xl glass-card p-6"><h3 className="text-sm font-semibold text-hi">Totals</h3><div className="mt-4 grid grid-cols-2 gap-3">{[{ l: "Matches", v: p.wins + p.losses }, { l: "Wins", v: p.wins }, { l: "Losses", v: p.losses }, { l: "Titles", v: p.titles }].map((s) => <div key={s.l} className="rounded-xl border border-white/6 bg-white/[0.02] p-3"><p className="font-display text-xl font-bold text-hi">{s.v}</p><p className="font-mono text-[10px] text-lo">{s.l}</p></div>)}</div></div>
            </div>
          )}
          {tab === "Match History" && (
            <div className="overflow-hidden rounded-2xl glass-card">
              {history.map((m) => { const win = m.scoreA > m.scoreB; return (
                <div key={m.id} className="flex items-center justify-between border-b border-white/4 px-5 py-3.5 last:border-0">
                  <div className="flex items-center gap-3"><span className={cn("grid h-8 w-8 place-items-center rounded-lg font-mono text-xs font-bold", win ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400")}>{win ? "W" : "L"}</span><div><p className="text-sm font-medium text-hi">vs {m.teamB}</p><p className="font-mono text-[10px] text-lo">{m.round}</p></div></div>
                  <div className="flex items-center gap-4"><span className="font-mono text-sm text-cyan-300">{m.scoreA}-{m.scoreB}</span><span className="hidden font-mono text-[10px] text-lo sm:block">{m.time}</span></div>
                </div>
              ); })}
            </div>
          )}
          {tab === "Achievements" && <AchievementGrid items={achievements} />}
        </motion.div>
      </AnimatePresence>
    </ProfileShell>
  );
}

/* ============================================================ TEAM */
export function TeamProfile() {
  const { slug } = useParams();
  const { data: t, loading } = useTeam(slug);
  const [tab, setTab] = useState("Overview");
  if (loading) return <ProfileSkeleton />;
  if (!t) return <PageSection><EmptyState title="Team not found" icon={Users} /></PageSection>;

  const tabs = ["Overview", "Roster", "Statistics", "Match History", "Achievements"];
  const roster = allPlayers.filter((p) => p.team === t.name).concat(allPlayers).slice(0, t.members);
  const history = recentMatches(t.slug);
  const wr = winRate(t.wins, t.losses);

  return (
    <ProfileShell
      banner={<CardBanner gradient="from-cyan-500/30 to-blue-600/10" className="h-52 sm:h-60" />}
      badge={<span className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500/25 to-blue-600/10 font-display text-xl font-bold text-hi ring-2 ring-void-900">{t.tag}</span>}
      title={<span className="flex items-center gap-3">{t.name}<span className="rounded-lg bg-white/5 px-2 py-1 font-mono text-sm text-mid">#{t.rank}</span></span>}
      meta={<><span>{gameShort[t.game]}</span><span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{t.region}</span><Link to={`/explore/guilds/${t.guild.toLowerCase().replace(/[^a-z]/g, "-")}`} className="flex items-center gap-1 hover:text-cyan-300"><ShieldCheck className="h-3.5 w-3.5" />{t.guild}</Link></>}
      crumb={[{ label: "Explore", to: "/explore" }, { label: "Teams", to: "/explore/teams" }, { label: t.name }]}
      actions={<><Button variant="primary" href="#" iconRight={ArrowRight} magnetic={false}>Follow team</Button><Button variant="outline" href="#" icon={Swords} magnetic={false}>Challenge</Button></>}
    >
      {t.currentTournament && <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-500/5 px-4 py-2.5 text-sm text-rose-300"><LiveDot color="bg-rose-400" className="scale-75" />Currently competing in <span className="font-semibold">{t.currentTournament}</span></div>}
      <StatCards stats={[{ l: "World rank", v: `#${t.rank}`, c: "text-amber-300" }, { l: "Rating", v: t.rating, c: "text-cyan-300" }, { l: "Win rate", v: `${wr}%`, c: "text-emerald-400" }, { l: "Titles", v: t.titles }]} />
      <div className="mt-6"><Tabs tabs={tabs} active={tab} setActive={setTab} /></div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="mt-6">
          {(tab === "Overview" || tab === "Roster") && (
            <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {roster.map((p, i) => (
                <StaggerItem key={p.slug + i}>
                  <Link to={`/explore/players/${p.slug}`} className="group flex items-center gap-3 rounded-2xl glass-card p-4 transition-transform hover:-translate-y-1">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-cyan-500/25 to-amber-500/15 text-[11px] font-bold text-hi ring-1 ring-white/10">{p.handle.slice(0, 2)}</span>
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-hi group-hover:text-cyan-100">{p.handle}{i === 0 && <span className="ml-2 rounded bg-amber-400/10 px-1.5 py-0.5 font-mono text-[9px] text-amber-300">CAPTAIN</span>}</p><p className="font-mono text-[10px] text-lo">{p.role} · {p.rating}</p></div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          )}
          {tab === "Statistics" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl glass-card p-6"><h3 className="text-sm font-semibold text-hi">Form</h3><div className="mt-4 space-y-3">{[{ l: "Win rate", v: wr }, { l: "Recent form", v: 80 }, { l: "Objective control", v: 72 }].map((s) => <div key={s.l}><div className="flex justify-between text-xs"><span className="text-mid">{s.l}</span><span className="font-mono text-cyan-300">{s.v}%</span></div><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/8"><motion.div initial={{ width: 0 }} whileInView={{ width: `${s.v}%` }} viewport={{ once: true }} transition={{ duration: 1 }} className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300" /></div></div>)}</div></div>
              <div className="rounded-2xl glass-card p-6"><h3 className="text-sm font-semibold text-hi">Totals</h3><div className="mt-4 grid grid-cols-2 gap-3">{[{ l: "Matches", v: t.wins + t.losses }, { l: "Wins", v: t.wins }, { l: "Losses", v: t.losses }, { l: "Titles", v: t.titles }].map((s) => <div key={s.l} className="rounded-xl border border-white/6 bg-white/[0.02] p-3"><p className="font-display text-xl font-bold text-hi">{s.v}</p><p className="font-mono text-[10px] text-lo">{s.l}</p></div>)}</div></div>
            </div>
          )}
          {tab === "Match History" && (
            <div className="overflow-hidden rounded-2xl glass-card">
              {history.map((m) => { const win = m.scoreA > m.scoreB; return (
                <div key={m.id} className="flex items-center justify-between border-b border-white/4 px-5 py-3.5 last:border-0">
                  <div className="flex items-center gap-3"><span className={cn("grid h-8 w-8 place-items-center rounded-lg font-mono text-xs font-bold", win ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400")}>{win ? "W" : "L"}</span><div><p className="text-sm font-medium text-hi">vs {m.teamB}</p><p className="font-mono text-[10px] text-lo">{m.round}</p></div></div>
                  <div className="flex items-center gap-4"><span className="font-mono text-sm text-cyan-300">{m.scoreA}-{m.scoreB}</span><span className="hidden font-mono text-[10px] text-lo sm:block">{m.time}</span></div>
                </div>
              ); })}
            </div>
          )}
          {tab === "Achievements" && <AchievementGrid items={playerAchievements(t.slug)} />}
        </motion.div>
      </AnimatePresence>
    </ProfileShell>
  );
}

/* ============================================================ Shared profile shell */
function ProfileShell({ banner, badge, title, meta, crumb, actions, children }: {
  banner: React.ReactNode; badge: React.ReactNode; title: React.ReactNode; meta: React.ReactNode;
  crumb: { label: string; to?: string }[]; actions: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <>
      <section className="px-5 pt-28 sm:px-8 sm:pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/8 elev-3">
            {banner}
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <Breadcrumb items={crumb} />
            </div>
          </div>
          <div className="relative -mt-10 flex flex-col gap-4 px-2 sm:flex-row sm:items-end sm:justify-between sm:px-6">
            <div className="flex items-end gap-4">
              {badge}
              <div className="pb-1">
                <h1 className="font-display text-2xl font-bold text-hi sm:text-4xl">{title}</h1>
                <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-mid">{meta}</p>
              </div>
            </div>
            <div className="flex gap-2 pb-1">{actions}</div>
          </div>
        </div>
      </section>
      <PageSection className="!pt-8">{children}</PageSection>
    </>
  );
}
