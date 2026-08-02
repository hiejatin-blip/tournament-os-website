/* ============================================================================
   Detail data: schedules, matches, discussion, achievements, brackets.
   Deterministic generators keyed by slug so every profile feels populated.
   ============================================================================ */
import { tournaments, teams, players, type Tournament } from "./directory";

export type Match = {
  id: string;
  round: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  status: "Live" | "Upcoming" | "Final";
  time: string;
};

export type ScheduleItem = { phase: string; date: string; time: string; done: boolean };
export type Post = { id: string; author: string; avatar: string; time: string; body: string; likes: number };
export type Achievement = { title: string; detail: string; year: string };

const TEAM_POOL = teams.map((t) => t.name);
const ROUNDS = ["Round of 16", "Quarterfinal", "Semifinal", "Grand Final"];

function seeded(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) & 0xffff;
  return () => { h = (h * 1103515245 + 12345) & 0x7fffffff; return h / 0x7fffffff; };
}

export function tournamentMatches(t: Tournament): Match[] {
  const rand = seeded(t.slug);
  const count = t.status === "Live" ? 6 : t.status === "Completed" || t.status === "Archived" ? 8 : 4;
  return Array.from({ length: count }, (_, i) => {
    const a = TEAM_POOL[Math.floor(rand() * TEAM_POOL.length)];
    let b = TEAM_POOL[Math.floor(rand() * TEAM_POOL.length)];
    if (b === a) b = TEAM_POOL[(TEAM_POOL.indexOf(a) + 1) % TEAM_POOL.length];
    const live = t.status === "Live" && i < 3;
    const done = t.status === "Completed" || t.status === "Archived" || (t.status === "Live" && i >= 3);
    const sa = done ? (rand() > 0.5 ? 2 : 1) : live ? Math.floor(rand() * 2) : 0;
    const sb = done ? (sa === 2 ? (rand() > 0.5 ? 0 : 1) : 2) : live ? Math.floor(rand() * 2) : 0;
    return {
      id: `${t.slug}-m${i}`,
      round: ROUNDS[Math.min(ROUNDS.length - 1, Math.floor(i / 2))],
      teamA: a, teamB: b, scoreA: sa, scoreB: sb,
      status: live ? "Live" : done ? "Final" : "Upcoming",
      time: live ? "Now" : done ? "Final" : `${14 + i}:00`,
    };
  });
}

export function tournamentSchedule(t: Tournament): ScheduleItem[] {
  const phases = ["Registration", "Verification", "Check-in", "Group Stage", "Playoffs", "Grand Final"];
  const idx = { Upcoming: 0, Registration: 1, Verification: 2, "Check-in": 3, Live: 4, Completed: 6, Archived: 6 }[t.status] ?? 0;
  return phases.map((p, i) => ({
    phase: p,
    date: new Date(new Date(t.startDate).getTime() + i * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    time: `${12 + i}:00 UTC`,
    done: i < idx,
  }));
}

const AVATARS = ["PH", "VX", "CP", "NV", "RZ", "EC"];
const NAMES = ["Phantom", "Vertex", "Cipher", "Nova", "Raze", "Echo"];
const COMMENTS = [
  "Bracket looks stacked this season. Vanta Black are the clear favourites.",
  "Anyone else hyped for the QF? That seeding is brutal.",
  "GLHF everyone — may the best team win. 🏆",
  "Check-in was seamless this year, huge props to the organizers.",
  "That last upset was insane. Never counting out the underdogs again.",
  "Casters are on point today. Production quality keeps climbing.",
];

export function tournamentDiscussion(t: Tournament): Post[] {
  const rand = seeded(t.slug + "d");
  return Array.from({ length: 5 }, (_, i) => ({
    id: `${t.slug}-p${i}`,
    author: NAMES[Math.floor(rand() * NAMES.length)],
    avatar: AVATARS[Math.floor(rand() * AVATARS.length)],
    time: `${i + 1}h ago`,
    body: COMMENTS[i % COMMENTS.length],
    likes: Math.floor(rand() * 120) + 3,
  }));
}

export function guildAchievements(slug: string): Achievement[] {
  const rand = seeded(slug + "a");
  const pool: Achievement[] = [
    { title: "Circuit of the Year", detail: "Awarded by the Community Council", year: "2025" },
    { title: "1M+ Matches Orchestrated", detail: "Platform milestone", year: "2025" },
    { title: "Zero-Incident Season", detail: "Full season, no disputes escalated", year: "2024" },
    { title: "Fastest Growing Guild", detail: "+180% member growth", year: "2024" },
    { title: "Verified Partner", detail: "Tournament OS verified organization", year: "2023" },
    { title: "100th Tournament Hosted", detail: "Century milestone", year: "2023" },
  ];
  return pool.filter(() => rand() > 0.35).slice(0, 4);
}

export function playerAchievements(slug: string): Achievement[] {
  const rand = seeded(slug + "pa");
  const pool: Achievement[] = [
    { title: "Grand Champion", detail: "WinterCup 2026", year: "2026" },
    { title: "Tournament MVP", detail: "Apex Circuit S6", year: "2025" },
    { title: "2800+ Peak Rating", detail: "All-time high", year: "2025" },
    { title: "100-Win Streak", detail: "Ranked ladder", year: "2024" },
    { title: "Rookie of the Season", detail: "Debut season honours", year: "2023" },
  ];
  return pool.filter(() => rand() > 0.3).slice(0, 4);
}

/* Tournaments organized by a guild */
export function guildTournaments(guildSlug: string) {
  return tournaments.filter((t) => t.organizer === guildSlug);
}

/* Teams belonging to a guild */
export function guildTeams(guildName: string) {
  return teams.filter((t) => t.guild === guildName);
}

/* Players belonging to a guild */
export function guildPlayers(guildName: string) {
  return players.filter((p) => p.guild === guildName);
}

/* Recent match history for a player/team */
export function recentMatches(slug: string, opponentList = TEAM_POOL): Match[] {
  const rand = seeded(slug + "rm");
  return Array.from({ length: 6 }, (_, i) => {
    const win = rand() > 0.35;
    const opp = opponentList[Math.floor(rand() * opponentList.length)];
    return {
      id: `${slug}-h${i}`,
      round: ROUNDS[Math.floor(rand() * ROUNDS.length)],
      teamA: "You", teamB: opp,
      scoreA: win ? 2 : rand() > 0.5 ? 1 : 0,
      scoreB: win ? (rand() > 0.5 ? 0 : 1) : 2,
      status: "Final",
      time: `${i + 1}d ago`,
    };
  });
}
