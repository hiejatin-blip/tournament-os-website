/* ============================================================================
   TOURNAMENT OS — NOTIFICATION DATA MODEL
   Structured notification types for the player portal.
   ============================================================================ */
import type { LucideIcon } from "lucide-react";
import { Trophy, Bell, ShieldCheck, CheckSquare, Swords, Users, Megaphone, AlertCircle } from "lucide-react";

export type NotifCategory =
  | "tournament" | "registration" | "verification" | "check-in" | "match" | "team" | "announcement" | "system";

export type Notif = {
  id: string;
  category: NotifCategory;
  title: string;
  body: string;
  time: string;
  read: boolean;
  urgent?: boolean;
  action?: { label: string; to: string };
};

export const categoryIcon: Record<NotifCategory, LucideIcon> = {
  tournament: Trophy,
  registration: Bell,
  verification: ShieldCheck,
  "check-in": CheckSquare,
  match: Swords,
  team: Users,
  announcement: Megaphone,
  system: AlertCircle,
};

export const categoryColor: Record<NotifCategory, string> = {
  tournament: "text-cyan-300 bg-cyan-400/10 border-cyan-400/30",
  registration: "text-sky-300 bg-sky-400/10 border-sky-400/30",
  verification: "text-violet-300 bg-violet-400/10 border-violet-400/30",
  "check-in": "text-amber-300 bg-amber-400/10 border-amber-400/30",
  match: "text-rose-300 bg-rose-500/10 border-rose-400/30",
  team: "text-emerald-300 bg-emerald-400/10 border-emerald-400/30",
  announcement: "text-amber-300 bg-amber-400/10 border-amber-400/30",
  system: "text-mid bg-white/5 border-white/10",
};

export const mockNotifications: Notif[] = [
  { id: "n1", category: "match", title: "Match starting in 15 minutes", body: "Your Quarterfinal match against Nexus Prime begins at 18:00 UTC in WinterCup 2026.", time: "14m ago", read: false, urgent: true, action: { label: "View match", to: "/app/player/matches" } },
  { id: "n2", category: "check-in", title: "Check-in window open", body: "The check-in window for Vanguard League is now open. Close in 2 hours.", time: "1h ago", read: false, urgent: true, action: { label: "Check in now", to: "/app/player/check-ins" } },
  { id: "n3", category: "verification", title: "Verification approved", body: "Your account has been verified for WinterCup 2026. Region lock: EU-West confirmed.", time: "3h ago", read: false, action: { label: "View status", to: "/app/player/verification" } },
  { id: "n4", category: "team", title: "Team invitation received", body: "Strata Core has invited you to join as a Duelist. Invitation expires in 24 hours.", time: "6h ago", read: false, action: { label: "View invitation", to: "/app/player/teams" } },
  { id: "n5", category: "tournament", title: "WinterCup 2026 — QF results", body: "Round of 16 completed. You advanced to the Quarterfinals. Your next match is scheduled.", time: "Yesterday", read: true, action: { label: "View bracket", to: "/explore/tournaments/wintercup-2026" } },
  { id: "n6", category: "registration", title: "Registration confirmed", body: "Your registration for Apex Circuit · Season 7 is confirmed. 94/128 slots filled.", time: "2 days ago", read: true, action: { label: "View tournament", to: "/explore/tournaments/apex-circuit-s7" } },
  { id: "n7", category: "announcement", title: "Platform update — v4.2.0", body: "Real-time bracket recompute engine is now live. Sub-second propagation across all events.", time: "3 days ago", read: true },
  { id: "n8", category: "system", title: "Email verification reminder", body: "Please verify your email address to unlock all platform features.", time: "1 week ago", read: true, action: { label: "Verify now", to: "/auth/verify-email" } },
];
