import { Outlet } from "react-router-dom";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { GradientShift } from "@/components/GradientShift";
import { CinematicHUD } from "@/components/CinematicHUD";
import { ScrollSpeedLines } from "@/components/Backgrounds";
import { ScrollProgress, useSmoothScroll } from "@/components/ui";
import { LiveTicker } from "@/components/site/LiveTicker";

/* ============================================================================
   HomeLayout — the full cinematic chrome reserved for the landing experience.
   Owns: smooth scroll, preloader, HUD, scroll speed lines, scroll progress.
   Kept separate from MarketingLayout so heavy effects only load on Home.
   ============================================================================ */
export function HomeLayout() {
  useSmoothScroll();
  return (
    <div className="depth-fog relative min-h-screen">
      <GradientShift />
      <ScrollSpeedLines />
      <CinematicHUD />
      <ScrollProgress />
      <SiteNav />
      <LiveTicker />
      <main id="main-content">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
