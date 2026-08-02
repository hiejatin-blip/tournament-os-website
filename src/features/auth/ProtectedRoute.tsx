import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { ReactNode } from "react";

/* ============================================================
   ProtectedRoute — wraps any route that requires authentication.
   Redirects to /login, preserving the attempted URL as `?next=`
   so the user is returned after successful authentication.
   ============================================================ */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { auth } = useAuth();
  const location = useLocation();

  if (auth.status === "idle" || auth.status === "loading") {
    /* During hydration, render nothing to avoid flicker */
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-lo">Authenticating…</span>
        </div>
      </div>
    );
  }

  if (auth.status === "unauthenticated") {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  return <>{children}</>;
}
