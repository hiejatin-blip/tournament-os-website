import { Outlet, useLocation, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { VantaGlobe } from "@/components/backgrounds/VantaGlobe";
import { publicTabs } from "@/shared/config/navigation";
import { pageVariants } from "@/shared/motion/motion";
import { cn } from "@/lib/utils";

/* ============================================================================
   PublicLayout — chrome for the public platform (Explore + directories).
   Adds a sticky secondary tab bar (context navigation) across the four
   directory domains. Profile pages hide the tab bar for a focused view.

   Background system:
   - Directory pages (/explore, /explore/tournaments, etc.) → VantaGlobe
   - Profile pages (/explore/tournaments/:slug, etc.)       → static radial glow
   ============================================================================ */
export function PublicLayout() {
  const { pathname } = useLocation();
  // Hide the directory tab-bar on individual profile detail pages.
  // Also used to gate the Vanta Globe — Globe only shows on directory views.
  const isProfile = /\/explore\/(tournaments|guilds|teams|players)\/[^/]+$/.test(pathname);

  return (
    <div className="depth-fog relative min-h-screen">
      {/* Base grid + noise overlays */}
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-[0.35]" />
      <div className="pointer-events-none fixed inset-0 bg-noise" />

      {/* Globe background — directory pages only */}
      {!isProfile && <VantaGlobe />}

      {/* Static ambient for profile pages — no animation, content-first */}
      {isProfile && (
        <div
          className="pointer-events-none fixed inset-0"
          style={{
            zIndex: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,211,238,0.05) 0%, transparent 70%)",
          }}
        />
      )}

      <SiteNav />

      {!isProfile && (
        <div className="sticky top-[76px] z-40 border-b border-white/6 bg-void-950/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 no-scrollbar sm:px-8">
            {publicTabs.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.to === "/explore"}
                className={({ isActive }) =>
                  cn(
                    "flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                    isActive ? "bg-cyan-400/10 text-cyan-300" : "text-mid hover:text-hi",
                  )
                }
              >
                {t.icon && <t.icon className="h-3.5 w-3.5" />}
                {t.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      <motion.main
        id="main-content"
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        className="relative"
      >
        <Outlet />
      </motion.main>
      <SiteFooter />
    </div>
  );
}
