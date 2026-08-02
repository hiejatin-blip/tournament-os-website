/* ============================================================================
   TOURNAMENT OS — AUTH TYPES
   Shared types for the authentication and user ecosystem.
   ============================================================================ */

export type GuildInfo = {
  id: string;
  name: string;
  tag: string;
  avatar: string;      // initials fallback
  gradient: string;
  memberCount: number;
  role: string;        // user's role in this guild
};

export type User = {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;          // initials fallback
  bio: string;
  country: string;
  region: string;
  discord: string;
  joinedDate: string;      // ISO
  currentTeam: string;
  currentGuild: string;
  role: "player" | "organizer" | "admin";
  verified: boolean;
  emailVerified: boolean;
  managedGuilds: GuildInfo[];
  activeGuildId: string;
};

export type AuthState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "authenticated"; user: User }
  | { status: "unauthenticated" };

export type SignupPayload = {
  username: string;
  email: string;
  password: string;
  displayName: string;
  region: string;
};

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type AuthError = {
  field?: string;
  message: string;
};
