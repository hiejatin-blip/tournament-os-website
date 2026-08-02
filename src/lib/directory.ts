/* ============================================================================
   TOURNAMENT OS — PUBLIC PLATFORM DATA LAYER
   Rich, structured mock data modelling a live esports platform.
   Shapes are designed to map 1:1 onto a future backend API.
   ============================================================================ */

export type Game =
  | "Valorant" | "League of Legends" | "CS2" | "Rocket League" | "Apex Legends" | "Overwatch 2";

export const GAMES: Game[] = ["Valorant", "League of Legends", "CS2", "Rocket League", "Apex Legends", "Overwatch 2"];

export const REGIONS = ["Global", "EU-West", "NA-East", "NA-West", "APAC"] as const;
export type Region = (typeof REGIONS)[number];

export const MODES = ["5v5", "3v3", "2v2", "1v1", "Solo"] as const;
export type Mode = (typeof MODES)[number];

/* Full lifecycle status set required by the tournament explorer */
export type TStatus =
  | "Upcoming" | "Registration" | "Verification" | "Check-in" | "Live" | "Completed" | "Archived";

export const T_STATUS_ORDER: TStatus[] = ["Upcoming", "Registration", "Verification", "Check-in", "Live", "Completed", "Archived"];

/* Per-game accent gradient (design-system tokens only) */
export const gameGradient: Record<Game, string> = {
  "Valorant": "from-rose-500/30 to-red-600/10",
  "League of Legends": "from-violet-500/30 to-fuchsia-600/10",
  "CS2": "from-amber-500/30 to-yellow-600/10",
  "Rocket League": "from-sky-500/30 to-blue-600/10",
  "Apex Legends": "from-orange-500/30 to-red-600/10",
  "Overwatch 2": "from-cyan-500/30 to-teal-600/10",
};

export const gameShort: Record<Game, string> = {
  "Valorant": "VAL", "League of Legends": "LoL", "CS2": "CS2",
  "Rocket League": "RL", "Apex Legends": "APEX", "Overwatch 2": "OW2",
};

/* ---------------------------------------------------------------- TOURNAMENTS */
export type Tournament = {
  slug: string;
  name: string;
  game: Game;
  mode: Mode;
  status: TStatus;
  format: string;
  prize: string;       // display
  prizeValue: number;  // for sorting/filtering
  slots: number;
  filled: number;
  teamSize: number;
  region: Region;
  organizer: string;   // guild slug
  organizerName: string;
  startDate: string;   // ISO
  startsIn: string;    // display
  gradient: string;
  featured?: boolean;
  viewers?: number;
};

export const tournaments: Tournament[] = [
  { slug: "wintercup-2026", name: "WinterCup 2026", game: "Valorant", mode: "5v5", status: "Live", format: "Double Elimination", prize: "$25,000", prizeValue: 25000, slots: 256, filled: 256, teamSize: 5, region: "EU-West", organizer: "vanta-esports", organizerName: "Vanta Esports", startDate: "2026-01-14", startsIn: "Live now", gradient: gameGradient["Valorant"], featured: true, viewers: 18420 },
  { slug: "apex-circuit-s7", name: "Apex Circuit · Season 7", game: "Apex Legends", mode: "3v3", status: "Registration", format: "Swiss → Playoffs", prize: "$50,000", prizeValue: 50000, slots: 128, filled: 94, teamSize: 3, region: "Global", organizer: "apex-league", organizerName: "Apex League", startDate: "2026-01-24", startsIn: "3 days", gradient: gameGradient["Apex Legends"], featured: true, viewers: 0 },
  { slug: "helix-invitational", name: "Helix Invitational", game: "League of Legends", mode: "5v5", status: "Verification", format: "Round Robin", prize: "$15,000", prizeValue: 15000, slots: 32, filled: 28, teamSize: 5, region: "NA-East", organizer: "helix-circuit", organizerName: "Helix Circuit", startDate: "2026-01-28", startsIn: "1 week", gradient: gameGradient["League of Legends"], viewers: 0 },
  { slug: "orbit-open", name: "Orbit Open", game: "CS2", mode: "5v5", status: "Registration", format: "Single Elimination", prize: "$10,000", prizeValue: 10000, slots: 64, filled: 41, teamSize: 5, region: "EU-West", organizer: "orbit-gg", organizerName: "OrbitGG", startDate: "2026-01-26", startsIn: "5 days", gradient: gameGradient["CS2"], viewers: 0 },
  { slug: "pulse-masters", name: "Pulse Masters", game: "Rocket League", mode: "3v3", status: "Live", format: "Double Elimination", prize: "$8,000", prizeValue: 8000, slots: 32, filled: 32, teamSize: 3, region: "NA-West", organizer: "pulse-arena", organizerName: "Pulse Arena", startDate: "2026-01-15", startsIn: "Live now", gradient: gameGradient["Rocket League"], viewers: 9240 },
  { slug: "meridian-clash", name: "Meridian Clash", game: "Overwatch 2", mode: "5v5", status: "Completed", format: "Swiss", prize: "$12,000", prizeValue: 12000, slots: 48, filled: 48, teamSize: 5, region: "APAC", organizer: "meridian", organizerName: "Meridian", startDate: "2026-01-04", startsIn: "Ended", gradient: gameGradient["Overwatch 2"], viewers: 0 },
  { slug: "strata-showdown", name: "Strata Showdown", game: "Valorant", mode: "5v5", status: "Upcoming", format: "Gauntlet", prize: "$20,000", prizeValue: 20000, slots: 96, filled: 12, teamSize: 5, region: "Global", organizer: "vanta-esports", organizerName: "Strata", startDate: "2026-02-06", startsIn: "2 weeks", gradient: gameGradient["Valorant"], viewers: 0 },
  { slug: "vanguard-league", name: "Vanguard League", game: "League of Legends", mode: "5v5", status: "Check-in", format: "Round Robin", prize: "$18,000", prizeValue: 18000, slots: 24, filled: 19, teamSize: 5, region: "NA-East", organizer: "vanguard", organizerName: "Vanguard", startDate: "2026-01-22", startsIn: "4 days", gradient: gameGradient["League of Legends"], viewers: 0 },
  { slug: "nexus-qualifier", name: "Nexus Qualifier", game: "CS2", mode: "5v5", status: "Live", format: "Single Elimination", prize: "$5,000", prizeValue: 5000, slots: 128, filled: 128, teamSize: 5, region: "EU-West", organizer: "nexus", organizerName: "Nexus", startDate: "2026-01-14", startsIn: "Live now", gradient: gameGradient["CS2"], viewers: 4110 },
  { slug: "duel-masters", name: "Duel Masters 1v1", game: "Valorant", mode: "1v1", status: "Registration", format: "Single Elimination", prize: "$3,000", prizeValue: 3000, slots: 64, filled: 52, teamSize: 1, region: "Global", organizer: "orbit-gg", organizerName: "OrbitGG", startDate: "2026-01-25", startsIn: "6 days", gradient: gameGradient["Valorant"], viewers: 0 },
  { slug: "apex-legends-cup", name: "Apex Legends Cup", game: "Apex Legends", mode: "3v3", status: "Completed", format: "Battle Royale Points", prize: "$30,000", prizeValue: 30000, slots: 60, filled: 60, teamSize: 3, region: "APAC", organizer: "meridian", organizerName: "Meridian", startDate: "2025-12-20", startsIn: "Ended", gradient: gameGradient["Apex Legends"], viewers: 0 },
  { slug: "grand-finals-2025", name: "Grand Finals 2025", game: "CS2", mode: "5v5", status: "Archived", format: "Double Elimination", prize: "$100,000", prizeValue: 100000, slots: 16, filled: 16, teamSize: 5, region: "Global", organizer: "vanta-esports", organizerName: "Vanta Esports", startDate: "2025-12-14", startsIn: "Archived", gradient: gameGradient["CS2"], viewers: 0 },
];

/* ---------------------------------------------------------------- GUILDS */
export type Guild = {
  slug: string;
  name: string;
  tag: string;
  members: number;
  activeTournaments: number;
  tournaments: number;
  region: Region;
  games: Game[];
  verified: boolean;
  gradient: string;
  status: "Active" | "Recruiting" | "Featured";
  founded: string;
  description: string;
};

export const guilds: Guild[] = [
  { slug: "vanta-esports", name: "Vanta Esports", tag: "VNTA", members: 12840, activeTournaments: 4, tournaments: 340, region: "EU-West", games: ["Valorant", "CS2"], verified: true, gradient: "from-cyan-500/30 to-blue-600/10", status: "Featured", founded: "2021", description: "Europe's premier competitive collective, running elite Valorant and CS2 circuits since 2021." },
  { slug: "apex-league", name: "Apex League", tag: "APX", members: 8920, activeTournaments: 3, tournaments: 210, region: "Global", games: ["Apex Legends", "Valorant"], verified: true, gradient: "from-amber-500/30 to-orange-600/10", status: "Active", founded: "2022", description: "A global battle-royale league bringing structure to Apex and Valorant competition." },
  { slug: "helix-circuit", name: "Helix Circuit", tag: "HLX", members: 6410, activeTournaments: 2, tournaments: 156, region: "NA-East", games: ["League of Legends"], verified: true, gradient: "from-violet-500/30 to-fuchsia-600/10", status: "Active", founded: "2020", description: "The definitive collegiate and amateur League of Legends circuit for North America." },
  { slug: "orbit-gg", name: "OrbitGG", tag: "ORB", members: 5230, activeTournaments: 2, tournaments: 128, region: "EU-West", games: ["CS2", "Rocket League"], verified: true, gradient: "from-emerald-500/30 to-teal-600/10", status: "Recruiting", founded: "2023", description: "A fast-growing grassroots org focused on accessible, well-run CS2 and Rocket League events." },
  { slug: "pulse-arena", name: "Pulse Arena", tag: "PLS", members: 4180, activeTournaments: 1, tournaments: 96, region: "NA-West", games: ["Rocket League"], verified: false, gradient: "from-rose-500/30 to-pink-600/10", status: "Recruiting", founded: "2023", description: "West-coast Rocket League community with a passion for high-tempo 3v3 play." },
  { slug: "meridian", name: "Meridian", tag: "MRD", members: 3920, activeTournaments: 1, tournaments: 88, region: "APAC", games: ["Overwatch 2", "Valorant"], verified: true, gradient: "from-sky-500/30 to-cyan-600/10", status: "Active", founded: "2022", description: "APAC's home for Overwatch 2 and Valorant, spanning tournaments across the region." },
  { slug: "vanguard", name: "Vanguard", tag: "VGD", members: 3110, activeTournaments: 1, tournaments: 64, region: "NA-East", games: ["League of Legends"], verified: true, gradient: "from-cyan-500/30 to-emerald-600/10", status: "Active", founded: "2024", description: "An ambitious new league building the next generation of League of Legends talent." },
  { slug: "nexus", name: "Nexus", tag: "NXS", members: 2870, activeTournaments: 1, tournaments: 52, region: "EU-West", games: ["CS2"], verified: false, gradient: "from-amber-500/30 to-yellow-600/10", status: "Recruiting", founded: "2024", description: "Qualifier-focused CS2 org creating pathways from amateur to pro." },
];

/* ---------------------------------------------------------------- PLAYERS */
export type Player = {
  slug: string;
  handle: string;
  name: string;
  team: string;
  guild: string;
  game: Game;
  rating: number;
  rank: number;
  wins: number;
  losses: number;
  titles: number;
  region: Region;
  role: string;
};

export const players: Player[] = [
  { slug: "phantom", handle: "Phantom", name: "Kai Nakamura", team: "Vanta Black", guild: "Vanta Esports", game: "Valorant", rating: 2847, rank: 1, wins: 412, losses: 98, titles: 14, region: "EU-West", role: "Duelist" },
  { slug: "vertex", handle: "Vertex", name: "Elena Rossi", team: "Helix Apex", guild: "Helix Circuit", game: "League of Legends", rating: 2790, rank: 2, wins: 388, losses: 121, titles: 11, region: "NA-East", role: "Mid" },
  { slug: "cipher", handle: "Cipher", name: "Marcus Okonkwo", team: "Nexus Prime", guild: "Nexus", game: "CS2", rating: 2734, rank: 3, wins: 356, losses: 140, titles: 9, region: "EU-West", role: "AWPer" },
  { slug: "nova", handle: "Nova", name: "Sofia Vargas", team: "Orbit.gg", guild: "OrbitGG", game: "Rocket League", rating: 2688, rank: 4, wins: 501, losses: 210, titles: 8, region: "NA-West", role: "Striker" },
  { slug: "raze", handle: "Raze", name: "Dmitri Volkov", team: "Pulse Arena", guild: "Pulse Arena", game: "Apex Legends", rating: 2645, rank: 5, wins: 298, losses: 156, titles: 7, region: "Global", role: "Fragger" },
  { slug: "echo", handle: "Echo", name: "Yuki Tanaka", team: "Meridian", guild: "Meridian", game: "Overwatch 2", rating: 2601, rank: 6, wins: 334, losses: 178, titles: 6, region: "APAC", role: "Support" },
  { slug: "specter", handle: "Specter", name: "Liam Chen", team: "Vanta Black", guild: "Vanta Esports", game: "Valorant", rating: 2588, rank: 7, wins: 276, losses: 132, titles: 6, region: "EU-West", role: "Controller" },
  { slug: "quasar", handle: "Quasar", name: "Amara Diallo", team: "Helix Apex", guild: "Helix Circuit", game: "League of Legends", rating: 2544, rank: 8, wins: 312, losses: 190, titles: 5, region: "NA-East", role: "Jungle" },
  { slug: "vortex", handle: "Vortex", name: "Noah Berg", team: "Nexus Prime", guild: "Nexus", game: "CS2", rating: 2510, rank: 9, wins: 244, losses: 158, titles: 4, region: "EU-West", role: "Rifler" },
  { slug: "flux", handle: "Flux", name: "Mia Santos", team: "Orbit.gg", guild: "OrbitGG", game: "Rocket League", rating: 2489, rank: 10, wins: 388, losses: 240, titles: 4, region: "NA-West", role: "Midfielder" },
];

/* ---------------------------------------------------------------- TEAMS */
export type Team = {
  slug: string;
  name: string;
  tag: string;
  game: Game;
  guild: string;
  rank: number;
  rating: number;
  wins: number;
  losses: number;
  titles: number;
  members: number;
  region: Region;
  currentTournament?: string;
};

export const teams: Team[] = [
  { slug: "vanta-black", name: "Vanta Black", tag: "VNTA", game: "Valorant", guild: "Vanta Esports", rank: 1, rating: 2910, wins: 142, losses: 28, titles: 12, members: 5, region: "EU-West", currentTournament: "WinterCup 2026" },
  { slug: "helix-apex", name: "Helix Apex", tag: "HLX", game: "League of Legends", guild: "Helix Circuit", rank: 2, rating: 2874, wins: 128, losses: 41, titles: 9, members: 5, region: "NA-East", currentTournament: "Helix Invitational" },
  { slug: "nexus-prime", name: "Nexus Prime", tag: "NXS", game: "CS2", guild: "Nexus", rank: 3, rating: 2820, wins: 118, losses: 52, titles: 8, members: 5, region: "EU-West", currentTournament: "Nexus Qualifier" },
  { slug: "orbit-gg", name: "Orbit.gg", tag: "ORB", game: "Rocket League", guild: "OrbitGG", rank: 4, rating: 2765, wins: 156, losses: 64, titles: 7, members: 3, region: "NA-West", currentTournament: "Pulse Masters" },
  { slug: "pulse-arena", name: "Pulse Arena", tag: "PLS", game: "Apex Legends", guild: "Pulse Arena", rank: 5, rating: 2712, wins: 98, losses: 58, titles: 5, members: 3, region: "Global" },
  { slug: "meridian", name: "Meridian", tag: "MRD", game: "Overwatch 2", guild: "Meridian", rank: 6, rating: 2680, wins: 110, losses: 72, titles: 4, members: 6, region: "APAC" },
  { slug: "strata-core", name: "Strata Core", tag: "STR", game: "Valorant", guild: "Vanta Esports", rank: 7, rating: 2634, wins: 88, losses: 60, titles: 3, members: 5, region: "Global" },
  { slug: "vanguard-elite", name: "Vanguard Elite", tag: "VGD", game: "League of Legends", guild: "Vanguard", rank: 8, rating: 2588, wins: 76, losses: 55, titles: 2, members: 5, region: "NA-East", currentTournament: "Vanguard League" },
];

/* ---------------------------------------------------------------- STATUS STYLES */
export const statusStyles: Record<TStatus, string> = {
  Upcoming: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  Registration: "border-cyan-400/40 bg-cyan-400/10 text-cyan-300",
  Verification: "border-violet-400/40 bg-violet-400/10 text-violet-300",
  "Check-in": "border-sky-400/40 bg-sky-400/10 text-sky-300",
  Live: "border-rose-400/40 bg-rose-500/10 text-rose-300",
  Completed: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  Archived: "border-white/15 bg-white/5 text-mid",
};

export const guildStatusStyles: Record<Guild["status"], string> = {
  Featured: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  Active: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  Recruiting: "border-cyan-400/40 bg-cyan-400/10 text-cyan-300",
};

/* ---------------------------------------------------------------- helpers */
export const fmtNum = (n: number) => n.toLocaleString("en-US");
export const winRate = (w: number, l: number) => Math.round((w / Math.max(1, w + l)) * 100);
