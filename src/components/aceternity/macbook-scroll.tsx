import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/* ============================================================================
   MacbookScroll — Aceternity UI pattern (MIT), tokenized to void/cyan.
   A MacBook opens (rotateX 15° -> 0) as the page scrolls, then the tall
   dashboard image scrolls INSIDE the screen (screenScroll y: 0 -> -72%).
   The wrapper reserves ~240vh of scroll runway.
   ============================================================================ */

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

export const MacbookScroll = ({
  src,
  title,
  className,
}: {
  src: string;
  title?: string;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const isMobile = useIsMobile();

  /* Lid opening */
  const rotateX = useTransform(scrollYProgress, [0, 0.4], [15, 0]);
  const translateY = useTransform(scrollYProgress, [0, 0.4], [120, 0]);
  const lidGlowX = useTransform(scrollYProgress, [0, 0.5], [0, isMobile ? 0 : 350]);

  /* Content scrolls inside the screen */
  const screenScroll = useTransform(scrollYProgress, [0.15, 1], ["0%", "-74%"]);

  return (
    <div
      ref={ref}
      className={cn("relative min-h-[200vh] w-full overflow-hidden", className)}
    >
      {/* Aurora backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[60vh] w-[80vw] -translate-x-1/2 rounded-full bg-cyan-500/[0.07] blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[40vh] w-[50vw] rounded-full bg-amber-500/[0.04] blur-[100px]" />
      </div>

      <div className="sticky top-16 flex flex-col items-center px-4 pt-10 sm:px-8">
        {title && (
          <h2 className="mx-auto max-w-3xl text-center font-display text-3xl font-bold tracking-tight text-hi sm:text-4xl">
            {title}
          </h2>
        )}

        <motion.div
          style={{ rotateX, translateY, transformPerspective: 1200 } as CSSProperties}
          className="relative mt-14 w-[min(92vw,880px)]"
        >
          {/* Lid back (glows as it opens) */}
          <motion.div
            style={{ x: lidGlowX }}
            className="absolute -inset-x-10 -top-16 z-[-1] h-40 rounded-t-3xl bg-gradient-to-r from-cyan-500/25 via-cyan-400/40 to-amber-400/20 blur-2xl"
          />

          {/* Screen */}
          <div className="relative overflow-hidden rounded-t-2xl border border-white/12 bg-void-900 shadow-[0_-20px_60px_-20px_rgba(34,211,238,0.25)]">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-white/6 bg-white/[0.02] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-3 truncate font-mono text-[11px] text-lo">
                app.tournament-os.com
              </span>
            </div>
            {/* Scrolling dashboard */}
            <div className="relative h-[400px] overflow-hidden sm:h-[520px]">
              <motion.div style={{ y: screenScroll }} className="will-change-transform">
                <img
                  src={src}
                  alt="Tournament OS dashboard"
                  className="h-auto w-full"
                  draggable={false}
                />
              </motion.div>
            </div>
          </div>

          {/* Base */}
          <div className="relative h-6 rounded-b-2xl bg-gradient-to-b from-void-700 to-void-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8)]" />
          <div className="relative mx-auto h-5 w-[97%] rounded-b-[1.75rem] bg-void-800 [clip-path:polygon(4%_0,96%_0,100%_100%,0_100%)]" />
          <div className="relative mx-auto h-2 w-[92%] rounded-b-2xl bg-gradient-to-b from-void-700/60 to-void-900" />
        </motion.div>
      </div>
    </div>
  );
};
