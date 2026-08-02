/* ============================================================================
   TOURNAMENT OS — AUTH CONTEXT & PROVIDER
   Client-side auth state management with session persistence.
   Simulates a backend auth API using sessionStorage — shapes map 1:1 onto
   a real JWT / cookie-based backend for Phase 4.
   ============================================================================ */
import {
  createContext, useContext, useReducer, useEffect, useCallback,
  type ReactNode,
} from "react";
import type { AuthState, User, GuildInfo, LoginPayload, SignupPayload, AuthError } from "./types";

/* ---------------------------------------------------------------------- MOCK BACKEND */
const DEMO_GUILDS = [
  { id: "g_vanta", name: "Vanta Esports", tag: "VNTA", avatar: "VE", gradient: "from-cyan-500/30 to-blue-600/10", memberCount: 12840, role: "Owner" },
  { id: "g_apex", name: "Apex League", tag: "APX", avatar: "AL", gradient: "from-amber-500/30 to-orange-600/10", memberCount: 8920, role: "Organizer" },
];

const DEMO_USER: User = {
  id: "usr_phantom_01",
  username: "Phantom",
  displayName: "Kai Nakamura",
  email: "kai@vanta.gg",
  avatar: "KN",
  bio: "Duelist main. Competing on the EU-West circuit since 2021. Vanta Black captain.",
  country: "Japan",
  region: "EU-West",
  discord: "phantom#8402",
  joinedDate: "2021-03-14",
  currentTeam: "Vanta Black",
  currentGuild: "Vanta Esports",
  role: "player",
  verified: true,
  emailVerified: true,
  managedGuilds: DEMO_GUILDS,
  activeGuildId: "g_vanta",
};

const SESSION_KEY = "tos_auth_session";

async function mockLogin(payload: LoginPayload): Promise<{ user: User; error?: AuthError }> {
  await new Promise((r) => setTimeout(r, 900));
  if (!payload.email.includes("@")) return { user: DEMO_USER, error: { field: "email", message: "Enter a valid email address." } };
  if (payload.password.length < 6) return { user: DEMO_USER, error: { field: "password", message: "Password must be at least 6 characters." } };
  return { user: { ...DEMO_USER, email: payload.email } };
}

async function mockSignup(payload: SignupPayload): Promise<{ user: User; error?: AuthError }> {
  await new Promise((r) => setTimeout(r, 1100));
  if (payload.username.length < 3) return { user: DEMO_USER, error: { field: "username", message: "Username must be at least 3 characters." } };
  if (!payload.email.includes("@")) return { user: DEMO_USER, error: { field: "email", message: "Enter a valid email address." } };
  if (payload.password.length < 6) return { user: DEMO_USER, error: { field: "password", message: "Password must be at least 6 characters." } };
  const user: User = { ...DEMO_USER, id: `usr_${Date.now()}`, username: payload.username, displayName: payload.displayName || payload.username, email: payload.email, avatar: payload.displayName ? payload.displayName.slice(0, 2).toUpperCase() : payload.username.slice(0, 2).toUpperCase(), region: payload.region, joinedDate: new Date().toISOString(), emailVerified: false };
  return { user };
}

/* ---------------------------------------------------------------------- CONTEXT */
type AuthCtx = {
  auth: AuthState;
  login: (p: LoginPayload) => Promise<AuthError | null>;
  signup: (p: SignupPayload) => Promise<AuthError | null>;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  switchGuild: (guildId: string) => void;
};

const Ctx = createContext<AuthCtx | null>(null);

/* ---------------------------------------------------------------------- REDUCER */
type Action =
  | { type: "LOADING" }
  | { type: "SET"; user: User }
  | { type: "CLEAR" };

function reducer(_: AuthState, action: Action): AuthState {
  switch (action.type) {
    case "LOADING": return { status: "loading" };
    case "SET": return { status: "authenticated", user: action.user };
    case "CLEAR": return { status: "unauthenticated" };
  }
}

/* ---------------------------------------------------------------------- PROVIDER */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, dispatch] = useReducer(reducer, { status: "idle" });

  /* Restore session on mount */
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const user: User = JSON.parse(saved);
        dispatch({ type: "SET", user });
      } else {
        dispatch({ type: "CLEAR" });
      }
    } catch {
      dispatch({ type: "CLEAR" });
    }
  }, []);

  const persist = (user: User) => {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(user)); } catch { /* ignore */ }
  };

  const login = useCallback(async (payload: LoginPayload): Promise<AuthError | null> => {
    dispatch({ type: "LOADING" });
    const { user, error } = await mockLogin(payload);
    if (error) { dispatch({ type: "CLEAR" }); return error; }
    if (payload.rememberMe) persist(user);
    dispatch({ type: "SET", user });
    return null;
  }, []);

  const signup = useCallback(async (payload: SignupPayload): Promise<AuthError | null> => {
    dispatch({ type: "LOADING" });
    const { user, error } = await mockSignup(payload);
    if (error) { dispatch({ type: "CLEAR" }); return error; }
    dispatch({ type: "SET", user });
    return null;
  }, []);

  const logout = useCallback(() => {
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
    dispatch({ type: "CLEAR" });
  }, []);

  const updateUser = useCallback((patch: Partial<User>) => {
    if (auth.status !== "authenticated") return;
    const updated = { ...auth.user, ...patch };
    persist(updated);
    dispatch({ type: "SET", user: updated });
  }, [auth]);

  const switchGuild = useCallback((guildId: string) => {
    updateUser({ activeGuildId: guildId });
  }, [updateUser]);

  return <Ctx.Provider value={{ auth, login, signup, logout, updateUser, switchGuild }}>{children}</Ctx.Provider>;
}

/* ---------------------------------------------------------------------- HOOKS */
export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useUser(): User | null {
  const { auth } = useAuth();
  return auth.status === "authenticated" ? auth.user : null;
}

export function useActiveGuild(): GuildInfo | null {
  const user = useUser();
  if (!user) return null;
  return user.managedGuilds.find((g) => g.id === user.activeGuildId) ?? user.managedGuilds[0] ?? null;
}

export function useIsAuthenticated(): boolean {
  const { auth } = useAuth();
  return auth.status === "authenticated";
}
