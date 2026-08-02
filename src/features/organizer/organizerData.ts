/* ============================================================================
   TOURNAMENT OS — ORGANIZER PORTAL DATA
   Mock backend data for the authenticated organizer's workspace.
   ============================================================================ */

export type ManagedTournament = {
  id: string;
  name: string;
  game: string;
  status: "Draft" | "Published" | "Registration" | "Live" | "Completed" | "Paused";
  participants: number;
  maxParticipants: number;
  date: string;
};

export const managedTournaments: ManagedTournament[] = [
  { id: "t1", name: "WinterCup 2026", game: "Valorant", status: "Live", participants: 256, maxParticipants: 256, date: "Jan 14, 2026" },
  { id: "t2", name: "Apex Circuit · Season 7", game: "Apex Legends", status: "Registration", participants: 94, maxParticipants: 128, date: "Jan 24, 2026" },
  { id: "t3", name: "Orbit Open", game: "CS2", status: "Draft", participants: 0, maxParticipants: 64, date: "Feb 10, 2026" },
  { id: "t4", name: "Pulse Masters", game: "Rocket League", status: "Completed", participants: 32, maxParticipants: 32, date: "Dec 15, 2025" },
];

export type RegistrationRequest = {
  id: string;
  player: string;
  team: string;
  game: string;
  rank: string;
  status: "Pending" | "Approved" | "Rejected";
  date: string;
};

export const registrationQueue: RegistrationRequest[] = [
  { id: "r1", player: "Phantom", team: "Vanta Black", game: "Valorant", rank: "Radiant", status: "Pending", date: "10m ago" },
  { id: "r2", player: "Vertex", team: "Helix Apex", game: "League of Legends", rank: "Challenger", status: "Pending", date: "25m ago" },
  { id: "r3", player: "Cipher", team: "Nexus Prime", game: "CS2", rank: "Global Elite", status: "Approved", date: "1h ago" },
  { id: "r4", player: "Nova", team: "Orbit.gg", game: "Rocket League", rank: "SSL", status: "Rejected", date: "2h ago" },
  { id: "r5", player: "Raze", team: "Pulse Arena", game: "Apex Legends", rank: "Predator", status: "Pending", date: "3h ago" },
];

export type BotStatus = {
  status: "Online" | "Offline" | "Syncing" | "Degraded";
  ping: number;
  lastSync: string;
  activeGuilds: number;
  shards: number;
};

export const botStatus: BotStatus = {
  status: "Online",
  ping: 12,
  lastSync: "Just now",
  activeGuilds: 24180,
  shards: 16,
};
