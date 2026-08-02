import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { pageVariants } from "@/shared/motion/motion";

/* ============================================================================
   MarketingLayout — chrome for all public marketing + company + resource pages.
   Provides: global nav, ambient background, cinematic page transition, footer.

   Background system: static radial gradients only — no animation.
   Marketing pages are content-first; animation would distract from the copy.
   ============================================================================ */
export function MarketingLayout({ ambient = true }: { ambient?: boolean }) {
  const { pathname } = useLocation();
  return (
    <div className="depth-fog relative min-h-screen">
      {ambient && (
        <>
          <div className="pointer-events-none fixed inset-0 bg-grid opacity-[0.35]" />
          <div className="pointer-events-none fixed inset-0 bg-noise" />
          {/* Static ambient — no animation, marketing pages are content-first */}
          <div
            className="pointer-events-none fixed inset-0"
            style={{
              background: [
                "radial-gradient(ellipse 100% 50% at 50% -10%, rgba(34,211,238,0.07) 0%, transparent 60%)",
                "radial-gradient(ellipse 60% 40% at 90% 100%, rgba(34,211,238,0.04) 0%, transparent 60%)",
              ].join(", "),
            }}
          />
        </>
      )}
      <SiteNav />
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
