import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CheckCircle2, LayoutDashboard, Activity, BarChart3, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================================
   MacbookScroll — Aceternity UI pattern (MIT), tokenized to void/cyan.
   The product demo section: a MacBook opens as the user scrolls and the
   real dashboard scrolls INSIDE the screen. Rebuilt to be content-rich at
   every scroll position (header, feature chips, stat strip) so the section
   never reads as a blank void.
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

const FEATURES = [
  { icon: LayoutDashboard, label: "Live dashboard" },
  { icon: Activity, label: "Real-time telemetry" },
  { icon: BarChart3, label: "Deep analytics" },
  { icon: ShieldCheck, label: "Role-based access" },
];

const STATS = [
  { value: "40K+", label: "matches run" },
  { value: "12s", label: "avg. bracket update" },
  { value: "99.99%", label: "uptime" },
];

export const MacbookScroll = ({
  src,
  title,
  eyebrow = "The command center",
  description,
  className,
}: {
  src: string;
  title?: string;
  eyebrow?: string;
  description?: string;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const isMobile = useIsMobile();
  const runway = isMobile ? "110vh" : "170vh";

  /* Lid opening */
  const rotateX = useTransform(scrollYProgress, [0.05, 0.4], [22, 0]);
  const translateY = useTransform(scrollYProgress, [0.05, 0.4], [160, 0]);
  const lidGlowX = useTransform(scrollYProgress, [0.1, 0.55], [0, isMobile ? 0 : 350]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  /* Content scrolls inside the screen */
  const screenScroll = useTransform(scrollYProgress, [0.12, 1], ["0%", "-72%"]);

  return (
    <div
      ref={ref}
      style={{ minHeight: runway }}
      className={cn("relative w-full overflow-x-clip", className)}
    >
      {/* Backdrop: stronger aurora + grid so it never reads as empty */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[30%] h-[70vh] w-[90vw] -translate-x-1/2 rounded-full bg-cyan-500/[0.12] blur-[130px] blur-orb" />
        <div className="absolute bottom-[10%] left-[15%] h-[45vh] w-[55vw] rounded-full bg-amber-500/[0.07] blur-[110px] blur-orb" />
        <div className="absolute right-[10%] top-[45%] h-[40vh] w-[40vw] rounded-full bg-violet-500/[0.06] blur-[100px] blur-orb" />
        <div className="absolute inset-0 bg-grid opacity-[0.12] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000,transparent)]" />
      </div>

      <div className="sticky top-10 flex flex-col items-center px-4 pt-8 sm:px-8">
        {/* Section header — fades as the MacBook rises */}
        <motion.div style={{ opacity: headerOpacity }} className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            {eyebrow}
          </span>
          {title && (
            <h2 className="mx-auto mt-5 max-w-3xl text-balance font-display text-3xl font-bold tracking-tight text-hi sm:text-5xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-mid sm:text-base">
              {description}
            </p>
          )}
          {/* Feature chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {FEATURES.map((f) => (
              <span
                key={f.label}
                className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] px-3.5 py-1.5 backdrop-blur transition-colors hover:border-cyan-400/25"
              >
                <f.icon className="h-3.5 w-3.5 text-cyan-300" />
                <span className="text-xs text-mid">{f.label}</span>
              </span>
            ))}
          </div>
        </motion.div>

        {/* MacBook */}
        <motion.div
          style={{ rotateX, translateY, transformPerspective: 1200 } as CSSProperties}
          className="relative mt-12 w-[min(92vw,860px)]"
        >
          {/* Lid back glow */}
          <motion.div
            style={{ x: lidGlowX }}
            className="absolute -inset-x-10 -top-16 z-[-1] h-40 rounded-t-3xl bg-gradient-to-r from-cyan-500/30 via-cyan-400/50 to-amber-400/25 blur-2xl"
          />

          {/* Screen */}
          <div className="relative overflow-hidden rounded-t-2xl border border-white/12 bg-void-900 shadow-[0_-20px_80px_-20px_rgba(34,211,238,0.3)]">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-white/6 bg-white/[0.02] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-3 truncate font-mono text-[11px] text-lo">
                app.tournament-os.com
              </span>
              <span className="ml-auto hidden items-center gap-1.5 font-mono text-[10px] text-cyan-300 sm:flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                synced
              </span>
            </div>
            {/* Scrolling dashboard */}
            <div className="relative h-[380px] overflow-hidden sm:h-[500px]">
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

        {/* Stat strip under the MacBook */}
        <div className="mt-10 grid w-full max-w-2xl grid-cols-3 gap-3">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/6 bg-white/[0.02] px-4 py-3 text-center backdrop-blur">
              <p className="font-display text-xl font-bold text-cyan-300 sm:text-2xl">{s.value}</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-lo">{s.label}</p>
            </div>
          ))}
        </div>

        {/* scroll progress bar */}
      <div className="mt-6 h-px w-56 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 to-amber-300"
          style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
        />
      </div>

      {/* Scroll cue */}
        <div className="mt-8 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-lo">
          <motion.span
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
          keep scrolling to explore the dashboard
        </div>

        {/* Little confirmation chips as you scroll past */}
        <div className="mt-6 hidden items-center gap-2 sm:flex">
          {["Automated", "Live", "Secure"].map((t) => (
            <span key={t} className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-mid">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
