import { Link } from "react-router-dom";
import { Trophy, Building2, Users, UserCheck, ArrowRight, Search } from "lucide-react";
import { PageHeader } from "../../components/site/PageHeader";
import { PageSection } from "../../components/site/blocks";
import { Stagger, StaggerItem, LiveDot , spotlightHandlers } from "../../components/ui";
import { TournamentCard, SkeletonGrid } from "../../components/site/PublicKit";
import { useCommandSearch } from "../../components/site/CommandSearch";
import { useTournaments, useGuilds, usePlayers, useTeams } from "@/lib/queries";
import { fmtNum } from "@/lib/directory";

const dirs = [
  { icon: Trophy, label: "Tournaments", to: "/explore/tournaments", count: "318,402", desc: "Live, upcoming, and completed events across every game." },
  { icon: Building2, label: "Guilds", to: "/explore/guilds", count: "24,180", desc: "Verified organizations running competitive circuits." },
  { icon: Users, label: "Teams", to: "/explore/teams", count: "180,940", desc: "Ranked rosters climbing the global ladder." },
  { icon: UserCheck, label: "Players", to: "/explore/players", count: "2,412,880", desc: "Competitors with full career histories." },
];


function RankCard({ title, to, loading, rows }: { title: string; to: string; loading: boolean; rows: { to: string; tag: string; name: string; val: string; grad: string }[] }) {
  return (
    <div className="rounded-2xl glass-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-lo">{title}</p>
        <Link to={to} className="text-[11px] font-medium text-cyan-300 hover:text-cyan-200">All</Link>
      </div>
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="flex items-center gap-3 px-2 py-2"><div className="h-9 w-9 animate-pulse rounded-lg bg-white/5" /><div className="h-3 flex-1 animate-pulse rounded bg-white/5" /></div>)}</div>
      ) : (
        <div className="space-y-1">
          {rows.map((r, i) => (
            <Link key={r.name} to={r.to} className="group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.03]">
              <span className="w-4 font-mono text-xs text-lo">{i + 1}</span>
              <span className={`grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br ${r.grad} text-[11px] font-bold text-hi ring-1 ring-white/10`}>{r.tag}</span>
              <span className="flex-1 truncate text-sm font-medium text-hi group-hover:text-cyan-100">{r.name}</span>
              <span className="font-mono text-xs text-cyan-300">{r.val}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function ExplorePage() {
  const search = useCommandSearch();
  const { data: tData, loading: tLoad } = useTournaments();
  const { data: gData, loading: gLoad } = useGuilds();
  const { data: pData, loading: pLoad } = usePlayers();
  const { data: teamData, loading: teamLoad } = useTeams();

  const live = (tData ?? []).filter((t) => t.status === "Live");
  const featured = (tData ?? []).filter((t) => t.status === "Live").concat((tData ?? []).filter((t) => t.status !== "Live")).slice(0, 6);
  const liveCount = live.length;
  const totalViewers = live.reduce((s, t) => s + (t.viewers ?? 0), 0);

  return (
    <>
      <PageHeader
        eyebrow="The public platform"
        title={<>Explore the <span className="text-hi">competitive network.</span></>}
        description="Every tournament, guild, team, and player on Tournament OS — searchable, ranked, and live."
      >
        <button onClick={() => search.setOpen(true)} className="flex w-full max-w-xl items-center gap-3 rounded-2xl glass-card px-4 py-3 text-left transition-colors hover:border-cyan-400/25">
          <Search className="h-5 w-5 text-lo" />
          <span className="flex-1 text-sm text-lo">Search tournaments, guilds, teams, players…</span>
          <kbd className="hidden rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-lo sm:block">⌘K</kbd>
        </button>
        {liveCount > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-500/5 px-3 py-1.5">
            <LiveDot color="bg-rose-400" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-rose-300">{liveCount} tournaments live · {fmtNum(totalViewers)} watching</span>
          </div>
        )}
      </PageHeader>

      <PageSection>
        <Stagger className="grid gap-4 sm:grid-cols-2">
          {dirs.map((d) => (
            <StaggerItem key={d.label} className="h-full">
              <Link to={d.to} {...spotlightHandlers} className="spotlight group flex h-full items-center gap-5 overflow-hidden rounded-2xl glass-card p-6 transition-transform duration-500 hover:-translate-y-1.5">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/8 bg-void-800 text-cyan-300 transition-all duration-500 group-hover:glow-cyan group-hover:scale-105"><d.icon className="h-6 w-6" /></span>
                <div className="flex-1"><div className="flex items-center gap-2"><h3 className="text-lg font-semibold text-hi group-hover:text-cyan-100">{d.label}</h3><span className="font-mono text-xs text-cyan-300">{d.count}</span></div><p className="mt-1 text-sm text-mid">{d.desc}</p></div>
                <ArrowRight className="h-5 w-5 text-lo transition-all group-hover:translate-x-1 group-hover:text-cyan-300" />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </PageSection>

      <PageSection eyebrow="Live now" heading={<>Tournaments <span className="text-hi">happening now.</span></>}>
        {tLoad ? <SkeletonGrid count={6} /> : (
          <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((t) => <StaggerItem key={t.slug} className="h-full"><TournamentCard t={t} /></StaggerItem>)}
          </Stagger>
        )}
        <div className="mt-8 flex justify-center">
          <Link to="/explore/tournaments" className="flex items-center gap-1.5 rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-hi transition-colors hover:border-cyan-400/40 hover:text-cyan-300">View all tournaments <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </PageSection>

      <PageSection eyebrow="Leaderboards" heading={<>Top of the <span className="text-hi">ladder.</span></>}>
        <div className="grid gap-4 lg:grid-cols-3">
          <RankCard title="Top teams" to="/explore/teams" loading={teamLoad} rows={(teamData ?? []).slice(0, 5).map((t) => ({ to: `/explore/teams/${t.slug}`, tag: t.tag, name: t.name, val: `${t.rating}`, grad: "from-cyan-500/25 to-blue-600/10" }))} />
          <RankCard title="Top guilds" to="/explore/guilds" loading={gLoad} rows={(gData ?? []).slice(0, 5).map((g) => ({ to: `/explore/guilds/${g.slug}`, tag: g.tag, name: g.name, val: `${g.tournaments}`, grad: g.gradient }))} />
          <RankCard title="Top players" to="/explore/players" loading={pLoad} rows={(pData ?? []).slice(0, 5).map((p) => ({ to: `/explore/players/${p.slug}`, tag: p.handle.slice(0, 2), name: p.handle, val: `${p.rating}`, grad: "from-amber-500/25 to-orange-600/10" }))} />
        </div>
      </PageSection>

          </>
  );
}
