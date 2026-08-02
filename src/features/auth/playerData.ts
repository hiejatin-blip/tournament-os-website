/* ============================================================================
   TOURNAMENT OS — PLAYER PORTAL DATA
   Mock backend data for the authenticated player's portal.
   Shapes designed to map onto real API responses in Phase 4.
   ============================================================================ */

export type MyTournament = {
  slug: string;
  name: string;
  game: string;
  status: "Registration" | "Verification" | "Check-in" | "Live" | "Completed" | "Upcoming";
  regStatus: "registered" | "verified" | "checked-in" | "active" | "winner" | "eliminated";
  prize: string;
  format: string;
  organizer: string;
  date: string;
  placement?: number;
  totalTeams?: number;
  gradient: string;
};

export type MyTeam = {
  slug: string;
  name: string;
  tag: string;
  game: string;
  role: string;
  isCaptain: boolean;
  members: number;
  status: "active" | "inactive";
  joined: string;
};

export type MyMatch = {
  id: string;
  tournament: string;
  tournamentSlug: string;
  round: string;
  opponent: string;
  result: "win" | "loss" | "upcoming";
  score: string;
  date: string;
  map?: string;
};

export type MyCheckIn = {
  tournamentSlug: string;
  tournamentName: string;
  status: "pending" | "open" | "done" | "missed";
  deadline: string;
  windowOpen: boolean;
};

export type MyVerification = {
  tournamentSlug: string;
  tournamentName: string;
  status: "pending" | "approved" | "rejected" | "not-started";
  game: string;
  region: string;
  submittedAt?: string;
};

export type Achievement = {
  id: string;
  title: string;
  detail: string;
  date: string;
  icon: string; // emoji stand-in
  rarity: "common" | "rare" | "epic" | "legendary";
};

export type ActivityItem = {
  id: string;
  type: "match_won" | "match_lost" | "registered" | "verified" | "checked_in" | "achievement" | "team_joined";
  title: string;
  detail: string;
  time: string;
};

/* ---- Data ---- */

export const myTournaments: MyTournament[] = [
  { slug: "wintercup-2026", name: "WinterCup 2026", game: "Valorant", status: "Live", regStatus: "active", prize: "$25,000", format: "Double Elimination", organizer: "Vanta Esports", date: "Jan 14, 2026", gradient: "from-rose-500/30 to-red-600/10" },
  { slug: "apex-circuit-s7", name: "Apex Circuit · Season 7", game: "Apex Legends", status: "Registration", regStatus: "registered", prize: "$50,000", format: "Swiss → Playoffs", organizer: "Apex League", date: "Jan 24, 2026", gradient: "from-orange-500/30 to-red-600/10" },
  { slug: "vanguard-league", name: "Vanguard League", game: "League of Legends", status: "Check-in", regStatus: "checked-in", prize: "$18,000", format: "Round Robin", organizer: "Vanguard", date: "Jan 22, 2026", gradient: "from-violet-500/30 to-fuchsia-600/10" },
  { slug: "meridian-clash", name: "Meridian Clash", game: "Overwatch 2", status: "Completed", regStatus: "winner", prize: "$12,000", format: "Swiss", organizer: "Meridian", date: "Jan 4, 2026", placement: 1, totalTeams: 48, gradient: "from-sky-500/30 to-cyan-600/10" },
  { slug: "grand-finals-2025", name: "Grand Finals 2025", game: "CS2", status: "Completed", regStatus: "eliminated", prize: "$100,000", format: "Double Elimination", organizer: "Vanta Esports", date: "Dec 14, 2025", placement: 4, totalTeams: 16, gradient: "from-amber-500/30 to-yellow-600/10" },
];

export const myTeams: MyTeam[] = [
  { slug: "vanta-black", name: "Vanta Black", tag: "VNTA", game: "Valorant", role: "Duelist", isCaptain: true, members: 5, status: "active", joined: "Mar 2022" },
  { slug: "helix-reserve", name: "Helix Reserve", tag: "HLX-R", game: "Valorant", role: "Duelist", isCaptain: false, members: 5, status: "inactive", joined: "Sep 2021" },
];

export const myMatches: MyMatch[] = [
  { id: "m1", tournament: "WinterCup 2026", tournamentSlug: "wintercup-2026", round: "Quarterfinal", opponent: "Nexus Prime", result: "upcoming", score: "TBD", date: "Today 18:00 UTC" },
  { id: "m2", tournament: "WinterCup 2026", tournamentSlug: "wintercup-2026", round: "Round of 16", opponent: "Orbit.gg", result: "win", score: "2-0", date: "Jan 14, 2026" },
  { id: "m3", tournament: "WinterCup 2026", tournamentSlug: "wintercup-2026", round: "Round of 32", opponent: "Pulse Arena", result: "win", score: "2-1", date: "Jan 14, 2026" },
  { id: "m4", tournament: "Meridian Clash", tournamentSlug: "meridian-clash", round: "Grand Final", opponent: "Vanguard Elite", result: "win", score: "3-1", date: "Jan 4, 2026" },
  { id: "m5", tournament: "Meridian Clash", tournamentSlug: "meridian-clash", round: "Semifinal", opponent: "Strata Core", result: "win", score: "2-0", date: "Jan 3, 2026" },
  { id: "m6", tournament: "Grand Finals 2025", tournamentSlug: "grand-finals-2025", round: "Semifinal", opponent: "Vanta Black-2", result: "loss", score: "0-2", date: "Dec 14, 2025" },
];

export const myCheckIns: MyCheckIn[] = [
  { tournamentSlug: "vanguard-league", tournamentName: "Vanguard League", status: "open", deadline: "17:00 UTC today", windowOpen: true },
  { tournamentSlug: "apex-circuit-s7", tournamentName: "Apex Circuit · Season 7", status: "pending", deadline: "Opens Jan 22", windowOpen: false },
  { tournamentSlug: "wintercup-2026", tournamentName: "WinterCup 2026", status: "done", deadline: "Jan 13, 14:00 UTC", windowOpen: false },
];

export const myVerifications: MyVerification[] = [
  { tournamentSlug: "wintercup-2026", tournamentName: "WinterCup 2026", status: "approved", game: "Valorant", region: "EU-West", submittedAt: "Jan 12, 2026" },
  { tournamentSlug: "apex-circuit-s7", tournamentName: "Apex Circuit · Season 7", status: "pending", game: "Apex Legends", region: "Global" },
  { tournamentSlug: "vanguard-league", tournamentName: "Vanguard League", status: "not-started", game: "League of Legends", region: "NA-East" },
];

export const myAchievements: Achievement[] = [
  { id: "a1", title: "Grand Champion", detail: "Won Meridian Clash (Jan 2026)", date: "Jan 2026", icon: "🏆", rarity: "legendary" },
  { id: "a2", title: "Undefeated Run", detail: "5 consecutive wins without dropping a map", date: "Jan 2026", icon: "⚡", rarity: "epic" },
  { id: "a3", title: "Top 100 EU-West", detail: "Reached top 100 on the EU-West ranking", date: "Dec 2025", icon: "📈", rarity: "rare" },
  { id: "a4", title: "Century", detail: "Played 100 competitive matches", date: "Nov 2025", icon: "💯", rarity: "rare" },
  { id: "a5", title: "Team Captain", detail: "Appointed captain of Vanta Black", date: "Mar 2022", icon: "🎖️", rarity: "epic" },
  { id: "a6", title: "First Blood", detail: "Won first competitive match", date: "Mar 2021", icon: "🎯", rarity: "common" },
];

export const activityFeed: ActivityItem[] = [
  { id: "f1", type: "match_won", title: "Match won vs Orbit.gg", detail: "WinterCup 2026 — Round of 16 · 2-0", time: "2h ago" },
  { id: "f2", type: "checked_in", title: "Checked in", detail: "WinterCup 2026 — Ready for QF", time: "4h ago" },
  { id: "f3", type: "match_won", title: "Match won vs Pulse Arena", detail: "WinterCup 2026 — Round of 32 · 2-1", time: "6h ago" },
  { id: "f4", type: "verified", title: "Verification approved", detail: "WinterCup 2026 — EU-West confirmed", time: "Yesterday" },
  { id: "f5", type: "registered", title: "Registered for tournament", detail: "Apex Circuit · Season 7", time: "2 days ago" },
  { id: "f6", type: "achievement", title: "Achievement unlocked: Grand Champion", detail: "Won Meridian Clash", time: "1 week ago" },
  { id: "f7", type: "team_joined", title: "Invited Specter to team", detail: "Vanta Black — Duelist slot", time: "2 weeks ago" },
];

export const careerStats = {
  rating: 2847,
  rank: 1,
  wins: 412,
  losses: 98,
  titles: 14,
  winRate: 81,
  matchesPlayed: 510,
  tournamentsEntered: 38,
  tournamentsWon: 14,
  avgPlacement: 2.1,
};
