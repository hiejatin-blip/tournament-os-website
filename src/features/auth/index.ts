/* ============================================================================
   AUTH DOMAIN — barrel
   Owns: context, types, pages, protected route, player data, guild context.
   ============================================================================ */
export { AuthProvider, useAuth, useUser, useActiveGuild, useIsAuthenticated } from "./AuthContext";
export { ProtectedRoute } from "./ProtectedRoute";
export { LoginPage, SignupPage, ForgotPasswordPage, ResetPasswordPage, EmailVerificationPage } from "./AuthPages";
export type { User, AuthState, AuthError, GuildInfo } from "./types";
