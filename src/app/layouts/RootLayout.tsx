import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { CursorGlow } from "@/components/ui";

/* ============================================================================
   RootLayout — the single global shell mounted once for the whole app.
   Owns cross-domain concerns: scroll reset on navigation + ambient cursor glow.
   Every domain layout renders inside this via <Outlet />.
   ============================================================================ */
function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

export function RootLayout() {
  return (
    <div className="relative min-h-screen bg-void-950 text-hi antialiased">
      <ScrollReset />
      <CursorGlow />
      <Outlet />
    </div>
  );
}

