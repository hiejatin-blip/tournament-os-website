import { useState, useMemo } from "react";
import { PageHeader } from "../../components/site/PageHeader";
import { PageSection, Breadcrumb } from "../../components/site/blocks";
import { Stagger, StaggerItem } from "../../components/ui";
import {
  SearchInput, PillFilter, Select, Toolbar, usePagination, Pagination,
} from "../../components/site/FilterKit";
import {
  TournamentCard, GuildCard, TeamCard, PlayerRow, SkeletonGrid, SkeletonRows, EmptyState,
} from "../../components/site/PublicKit";
import { useTournaments, useGuilds, usePlayers, useTeams } from "@/lib/queries";
import {
  GAMES, REGIONS, MODES, T_STATUS_ORDER,
  type Game, type Region, type Mode, type TStatus,
} from "@/lib/directory";

const gameFilters = ["All", ...GAMES] as const;

/* ============================================================ Tournaments */
const T_SORT = ["Prize ↓", "Prize ↑", "Slots filled", "Start date", "A–Z"] as const;
type TSort = (typeof T_SORT)[number];

export function TournamentsDirectory() {
  const { data, loading } = useTournaments();
  const [query, setQuery] = useState("");
  const [game, setGame] = useState<(typeof gameFilters)[number]>("All");
  const [status, setStatus] = useState<TStatus | "All">("All");
  const [region, setRegion] = useState<Region | "All">("All");
  const [mode, setMode] = useState<Mode | "All">("All");
  const [sort, setSort] = useState<TSort>("Prize ↓");

  const list = useMemo(() => {
    let l = (data ?? []).filter((t) =>
      (game === "All" || t.game === game) &&
      (status === "All" || t.status === status) &&
      (region === "All" || t.region === region) &&
      (mode === "All" || t.mode === mode) &&
      t.name.toLowerCase().includes(query.toLowerCase()),
    );
    l = [...l].sort((a, b) => {
      switch (sort) {
        case "Prize ↓": return b.prizeValue - a.prizeValue;
        case "Prize ↑": return a.prizeValue - b.prizeValue;
        case "Slots filled": return b.filled / b.slots - a.filled / a.slots;
        case "Start date": return +new Date(a.startDate) - +new Date(b.startDate);
        case "A–Z": return a.name.localeCompare(b.name);
      }
    });
    return l;
  }, [data, game, status, region, mode, query, sort]);

  const { page, setPage, pageCount, paged } = usePagination(list, 9);

  return (
    <>
      <PageHeader eyebrow="Tournament Directory" title={<>Find your <span className="text-gradient-cyan">next event.</span></>} description="Browse live, open, and upcoming tournaments across every competitive title.">
        <Breadcrumb items={[{ label: "Explore", to: "/explore" }, { label: "Tournaments" }]} />
      </PageHeader>
      <PageSection>
        <Toolbar resultCount={list.length} total={data?.length ?? 0}>
          <SearchInput value={query} onChange={setQuery} placeholder="Search tournaments…" className="max-w-xl" />
          <PillFilter options={gameFilters} value={game} onChange={(v) => setGame(v)} />
          <div className="flex flex-wrap gap-2">
            <Select label="Status" options={["All", ...T_STATUS_ORDER] as const} value={status} onChange={(v) => setStatus(v)} />
            <Select label="Region" options={["All", ...REGIONS] as const} value={region} onChange={(v) => setRegion(v)} />
            <Select label="Mode" options={["All", ...MODES] as const} value={mode} onChange={(v) => setMode(v)} />
            <Select label="Sort" options={T_SORT} value={sort} onChange={(v) => setSort(v)} />
          </div>
        </Toolbar>

        <div className="mt-8">
          {loading ? <SkeletonGrid count={9} />
            : list.length === 0 ? <EmptyState title="No tournaments match" hint="Try clearing a filter or searching a different game." />
            : (
              <>
                <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {paged.map((t) => <StaggerItem key={t.slug} className="h-full"><TournamentCard t={t} /></StaggerItem>)}
                </Stagger>
                <Pagination page={page} pageCount={pageCount} onChange={setPage} />
              </>
            )}
        </div>
      </PageSection>
    </>
  );
}

/* ============================================================ Guilds */
export function GuildsDirectory() {
  const { data, loading } = useGuilds();
  const [query, setQuery] = useState("");
  const [game, setGame] = useState<(typeof gameFilters)[number]>("All");
  const [region, setRegion] = useState<Region | "All">("All");
  const [status, setStatus] = useState<"All" | "Featured" | "Active" | "Recruiting">("All");

  const list = useMemo(() => (data ?? []).filter((g) =>
    (game === "All" || g.games.includes(game as Game)) &&
    (region === "All" || g.region === region) &&
    (status === "All" || g.status === status) &&
    g.name.toLowerCase().includes(query.toLowerCase()),
  ), [data, game, region, status, query]);

  const { page, setPage, pageCount, paged } = usePagination(list, 6);

  return (
    <>
      <PageHeader eyebrow="Guild Directory" title={<>Discover <span className="text-gradient-cyan">competitive guilds.</span></>} description="Verified organizations running the world's most active tournament circuits.">
        <Breadcrumb items={[{ label: "Explore", to: "/explore" }, { label: "Guilds" }]} />
      </PageHeader>
      <PageSection>
        <Toolbar resultCount={list.length} total={data?.length ?? 0}>
          <SearchInput value={query} onChange={setQuery} placeholder="Search guilds…" className="max-w-xl" />
          <PillFilter options={gameFilters} value={game} onChange={(v) => setGame(v)} />
          <div className="flex flex-wrap gap-2">
            <Select label="Region" options={["All", ...REGIONS] as const} value={region} onChange={(v) => setRegion(v)} />
            <Select label="Status" options={["All", "Featured", "Active", "Recruiting"] as const} value={status} onChange={(v) => setStatus(v)} />
          </div>
        </Toolbar>
        <div className="mt-8">
          {loading ? <SkeletonGrid count={6} />
            : list.length === 0 ? <EmptyState title="No guilds match" hint="Try a different game or region filter." />
            : (
              <>
                <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {paged.map((g) => <StaggerItem key={g.slug} className="h-full"><GuildCard g={g} /></StaggerItem>)}
                </Stagger>
                <Pagination page={page} pageCount={pageCount} onChange={setPage} />
              </>
            )}
        </div>
      </PageSection>
    </>
  );
}

/* ============================================================ Players */
const P_SORT = ["Rating", "Wins", "Titles", "A–Z"] as const;
type PSort = (typeof P_SORT)[number];

export function PlayersDirectory() {
  const { data, loading } = usePlayers();
  const [query, setQuery] = useState("");
  const [game, setGame] = useState<(typeof gameFilters)[number]>("All");
  const [region, setRegion] = useState<Region | "All">("All");
  const [sort, setSort] = useState<PSort>("Rating");

  const list = useMemo(() => {
    let l = (data ?? []).filter((p) =>
      (game === "All" || p.game === game) &&
      (region === "All" || p.region === region) &&
      (p.handle.toLowerCase().includes(query.toLowerCase()) || p.name.toLowerCase().includes(query.toLowerCase())),
    );
    l = [...l].sort((a, b) => {
      switch (sort) {
        case "Rating": return b.rating - a.rating;
        case "Wins": return b.wins - a.wins;
        case "Titles": return b.titles - a.titles;
        case "A–Z": return a.handle.localeCompare(b.handle);
      }
    });
    return l;
  }, [data, game, region, query, sort]);

  return (
    <>
      <PageHeader eyebrow="Player Directory" title={<>Ranked <span className="text-gradient-cyan">competitors.</span></>} description="Every player, ranked by rating with full career histories and achievements.">
        <Breadcrumb items={[{ label: "Explore", to: "/explore" }, { label: "Players" }]} />
      </PageHeader>
      <PageSection>
        <Toolbar resultCount={list.length} total={data?.length ?? 0}>
          <SearchInput value={query} onChange={setQuery} placeholder="Search players…" className="max-w-xl" />
          <PillFilter options={gameFilters} value={game} onChange={(v) => setGame(v)} />
          <div className="flex flex-wrap gap-2">
            <Select label="Region" options={["All", ...REGIONS] as const} value={region} onChange={(v) => setRegion(v)} />
            <Select label="Sort" options={P_SORT} value={sort} onChange={(v) => setSort(v)} />
          </div>
        </Toolbar>
        <div className="mt-8">
          {loading ? <SkeletonRows count={8} />
            : list.length === 0 ? <EmptyState title="No players match" hint="Try a different search or filter." />
            : (
              <div className="overflow-hidden rounded-2xl glass-card">
                <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 border-b border-white/6 px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-lo sm:grid-cols-[auto_1fr_auto_auto_auto]">
                  <span className="w-6 text-center">#</span><span>Player</span><span className="hidden sm:block">Game</span><span>W/L</span><span>Rating</span>
                </div>
                {list.map((p, i) => <PlayerRow key={p.slug} p={p} index={i} />)}
              </div>
            )}
        </div>
      </PageSection>
    </>
  );
}

/* ============================================================ Teams */
const TEAM_SORT = ["Rank", "Rating", "Win rate", "Titles"] as const;
type TeamSort = (typeof TEAM_SORT)[number];

export function TeamsDirectory() {
  const { data, loading } = useTeams();
  const [query, setQuery] = useState("");
  const [game, setGame] = useState<(typeof gameFilters)[number]>("All");
  const [region, setRegion] = useState<Region | "All">("All");
  const [sort, setSort] = useState<TeamSort>("Rank");

  const list = useMemo(() => {
    let l = (data ?? []).filter((t) =>
      (game === "All" || t.game === game) &&
      (region === "All" || t.region === region) &&
      t.name.toLowerCase().includes(query.toLowerCase()),
    );
    l = [...l].sort((a, b) => {
      switch (sort) {
        case "Rank": return a.rank - b.rank;
        case "Rating": return b.rating - a.rating;
        case "Win rate": return (b.wins / (b.wins + b.losses)) - (a.wins / (a.wins + a.losses));
        case "Titles": return b.titles - a.titles;
      }
    });
    return l;
  }, [data, game, region, query, sort]);

  const { page, setPage, pageCount, paged } = usePagination(list, 6);

  return (
    <>
      <PageHeader eyebrow="Team Directory" title={<>The global <span className="text-gradient-cyan">team ladder.</span></>} description="Ranked rosters competing across every title on Tournament OS.">
        <Breadcrumb items={[{ label: "Explore", to: "/explore" }, { label: "Teams" }]} />
      </PageHeader>
      <PageSection>
        <Toolbar resultCount={list.length} total={data?.length ?? 0}>
          <SearchInput value={query} onChange={setQuery} placeholder="Search teams…" className="max-w-xl" />
          <PillFilter options={gameFilters} value={game} onChange={(v) => setGame(v)} />
          <div className="flex flex-wrap gap-2">
            <Select label="Region" options={["All", ...REGIONS] as const} value={region} onChange={(v) => setRegion(v)} />
            <Select label="Sort" options={TEAM_SORT} value={sort} onChange={(v) => setSort(v)} />
          </div>
        </Toolbar>
        <div className="mt-8">
          {loading ? <SkeletonGrid count={6} />
            : list.length === 0 ? <EmptyState title="No teams match" hint="Try a different game or region." />
            : (
              <>
                <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {paged.map((t) => <StaggerItem key={t.slug} className="h-full"><TeamCard t={t} /></StaggerItem>)}
                </Stagger>
                <Pagination page={page} pageCount={pageCount} onChange={setPage} />
              </>
            )}
        </div>
      </PageSection>
    </>
  );
}
