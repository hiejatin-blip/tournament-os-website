/* ============================================================================
   Query layer — simulates an async backend so the public platform has real
   loading and empty states. Maps 1:1 onto future REST/GraphQL calls.
   ============================================================================ */
import { useEffect, useState, useMemo } from "react";
import {
  tournaments, guilds, players, teams,
  type Tournament, type Guild, type Player, type Team,
} from "./directory";

/* Generic async simulator with a short, believable latency */
function useAsync<T>(resolver: () => T, deps: unknown[], delay = 420) {
  const [state, setState] = useState<{ data: T | null; loading: boolean }>({ data: null, loading: true });
  useEffect(() => {
    let alive = true;
    setState({ data: null, loading: true });
    const id = setTimeout(() => {
      if (alive) setState({ data: resolver(), loading: false });
    }, delay);
    return () => { alive = false; clearTimeout(id); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}

/* ---- Collections ---- */
export const useTournaments = () => useAsync<Tournament[]>(() => tournaments, []);
export const useGuilds = () => useAsync<Guild[]>(() => guilds, []);
export const usePlayers = () => useAsync<Player[]>(() => players, []);
export const useTeams = () => useAsync<Team[]>(() => teams, []);

/* ---- Single records ---- */
export const useTournament = (slug?: string) =>
  useAsync<Tournament | null>(() => tournaments.find((t) => t.slug === slug) ?? null, [slug], 360);
export const useGuild = (slug?: string) =>
  useAsync<Guild | null>(() => guilds.find((g) => g.slug === slug) ?? null, [slug], 360);
export const usePlayer = (slug?: string) =>
  useAsync<Player | null>(() => players.find((p) => p.slug === slug) ?? null, [slug], 360);
export const useTeam = (slug?: string) =>
  useAsync<Team | null>(() => teams.find((t) => t.slug === slug) ?? null, [slug], 360);

/* ---- Global search index (instant, in-memory) ---- */
export type SearchResult = {
  type: "Tournament" | "Guild" | "Team" | "Player";
  title: string;
  subtitle: string;
  to: string;
  tag: string;
};

export function useSearchIndex(): SearchResult[] {
  return useMemo(() => {
    const idx: SearchResult[] = [];
    tournaments.forEach((t) => idx.push({ type: "Tournament", title: t.name, subtitle: `${t.game} · ${t.status}`, to: `/explore/tournaments/${t.slug}`, tag: t.name.slice(0, 2).toUpperCase() }));
    guilds.forEach((g) => idx.push({ type: "Guild", title: g.name, subtitle: `${g.region} · ${g.members.toLocaleString()} members`, to: `/explore/guilds/${g.slug}`, tag: g.tag }));
    teams.forEach((t) => idx.push({ type: "Team", title: t.name, subtitle: `${t.game} · Rank #${t.rank}`, to: `/explore/teams/${t.slug}`, tag: t.tag }));
    players.forEach((p) => idx.push({ type: "Player", title: p.handle, subtitle: `${p.team} · ${p.role}`, to: `/explore/players/${p.slug}`, tag: p.handle.slice(0, 2).toUpperCase() }));
    return idx;
  }, []);
}

export function searchAll(index: SearchResult[], query: string, limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return index
    .map((r) => {
      const t = r.title.toLowerCase();
      let score = 0;
      if (t === q) score = 100;
      else if (t.startsWith(q)) score = 80;
      else if (t.includes(q)) score = 50;
      else if (r.subtitle.toLowerCase().includes(q)) score = 20;
      return { r, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.r);
}
