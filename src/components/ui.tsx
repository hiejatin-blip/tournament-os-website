import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useScroll,
  useTransform,
  animate,
} from "framer-motion";
import {
  useRef,
  useEffect,
  useState,
  type ReactNode,
  type ComponentType,
  type MouseEvent,
} from "react";
import { Link as RouterLink } from "react-router-dom";
import { Search, X, ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ease } from "@/shared/motion/motion-tokens";


/* ==================== spotlightHandlers ====================
   Shared pointer-following radial glow for `.spotlight` cards.
   Replaces 8 duplicated inline onMouseMove handlers across pages. */
export const spotlightHandlers = {
  onMouseMove: (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  },
};

/* ==================== useSpotlight ====================
   Attaches a pointer-following radial glow via CSS vars (--mx/--my).
   Pair with the `.spotlight` utility class. */
export function useSpotlight<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const onMouseMove = (e: MouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return { ref, onMouseMove };
}

/* ==================== Smooth-scroll hook ====================
   Respects prefers-reduced-motion (skips Lenis entirely) and cancels its RAF
   loop on unmount to avoid a lingering animation frame after navigation. */
export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let lenis: any;
    let rafId = 0;
    let cancelled = false;
    (async () => {
      const Lenis = (await import("lenis")).default;
      if (cancelled) return;
      lenis = new Lenis({ duration: 1.4, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      const raf = (time: number) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
      rafId = requestAnimationFrame(raf);
    })();
    return () => { cancelled = true; cancelAnimationFrame(rafId); lenis?.destroy(); };
  }, []);
}

/* ==================== ScrollProgress ==================== */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div className="fixed inset-x-0 top-0 z-[90] h-[2px] origin-left bg-gradient-to-r from-cyan-400 via-cyan-300 to-amber-400" style={{ scaleX: scrollYProgress }} />
  );
}

/* ==================== Section parallax wrapper ==================== */
export function ParallaxSection({
  children,
  className,
  id,
  speed = 0.12,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 100}px`, `${-speed * 100}px`]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.3, 1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.97]);
  return (
    <section ref={ref} id={id} className={cn("relative scroll-mt-24", className)}>
      <motion.div style={{ y, opacity, scale }} className="will-change-transform">
        {children}
      </motion.div>
    </section>
  );
}

/* ==================== Reveal ==================== */
export function Reveal({
  children, className, delay = 0, y = 40, scale: s = 0.94, rotate = 0, blur = true, once = true,
}: {
  children: ReactNode; className?: string; delay?: number; y?: number; scale?: number; rotate?: number; blur?: boolean; once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, scale: s, rotateX: rotate, filter: blur ? "blur(6px)" : "none" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-8% 0px -8% 0px" }}
      transition={{ duration: 1, delay, ease: ease.emphasized }}
    >
      {children}
    </motion.div>
  );
}

/* ==================== Stagger ==================== */
const cV = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } };
const iV = { hidden: { opacity: 0, y: 30, scale: 0.94, filter: "blur(4px)" }, show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: ease.emphasized } } };

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={cV} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-6%" }} className={className}>
      {children}
    </motion.div>
  );
}
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div variants={iV} className={className}>{children}</motion.div>;
}

/* ==================== SectionHeading ==================== */
export function SectionHeading({
  eyebrow, title, description, align = "center", className,
}: {
  eyebrow?: ReactNode; title: ReactNode; description?: ReactNode; align?: "center" | "left"; className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" ? "mx-auto text-center" : "text-left", className)}>
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: ease.emphasized }}
          className="group/eb inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-[0.22em] text-cyan-300 transition-colors hover:text-cyan-200"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400" />
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
          </span>
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.9, delay: 0.05, ease: ease.emphasized }}
        className="mt-5 text-balance text-3xl font-bold leading-[1.04] text-gradient sm:text-5xl md:text-6xl"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.8, delay: 0.15, ease: ease.emphasized }}
          className="mt-5 text-base leading-relaxed text-mid sm:text-lg"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

/* ==================== Button ==================== */
export function Button({
  children, variant = "primary", size = "md", href, icon: Icon, iconRight: IconR, onClick, className, magnetic = true,
}: {
  children: ReactNode; variant?: "primary" | "secondary" | "ghost" | "outline"; size?: "sm" | "md" | "lg";
  href?: string; icon?: ComponentType<{ className?: string }>; iconRight?: ComponentType<{ className?: string }>;
  onClick?: () => void; className?: string; magnetic?: boolean;
}) {
  const sizes: Record<string, string> = { sm: "h-9 px-4 text-[13px]", md: "h-11 px-5 text-sm", lg: "h-13 px-7 text-[15px]" };
  const vars: Record<string, string> = {
    primary: "bg-gradient-to-r from-cyan-500 to-cyan-400 text-void-950 font-semibold hover:shadow-[0_0_0_1px_rgba(34,211,238,0.5),0_8px_32px_-6px_rgba(34,211,238,0.6)] hover:-translate-y-0.5",
    secondary: "glass-strong text-hi hover:-translate-y-0.5",
    outline: "border border-white/12 text-hi hover:border-cyan-400/50 hover:text-cyan-300 hover:-translate-y-0.5",
    ghost: "text-mid hover:text-hi",
  };
  const cls = cn("mo-press mo-focus group/btn relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full font-medium transition-all duration-300", sizes[size], vars[variant], className);
  const content = (
    <>
      {variant === "primary" && <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-[900ms] ease-out group-hover/btn:translate-x-full" />}
      {variant === "primary" && <span className="pointer-events-none absolute -inset-px rounded-full opacity-0 shadow-[0_0_24px_2px_rgba(34,211,238,0.6)] transition-opacity duration-300 group-hover/btn:opacity-100" />}
      {Icon && <Icon className="relative h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-x-0.5" />}
      <span className="relative">{children}</span>
      {IconR && <IconR className="relative h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />}
    </>
  );
  const isInternal = href && href.startsWith("/");
  const el = href
    ? isInternal
      ? <RouterLink to={href} className={cls} onClick={onClick}>{content}</RouterLink>
      : <a href={href} className={cls} onClick={onClick}>{content}</a>
    : <button type="button" className={cls} onClick={onClick}>{content}</button>;
  if (!magnetic) return el;
  return <Magnetic strength={0.3}>{el}</Magnetic>;
}

/* ==================== Magnetic ==================== */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 14 });
  const sy = useSpring(y, { stiffness: 160, damping: 14 });
  function onMove(e: MouseEvent<HTMLDivElement>) {
    if (reduce) return; const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }} style={{ x: sx, y: sy }} className={cn("inline-flex", className)}>
      {children}
    </motion.div>
  );
}

/* ==================== TiltCard ====================
   3D perspective tilt on hover + cursor spotlight. Handcrafted depth. */
/* ==================== LiveDot ==================== */
export function LiveDot({ className, color = "bg-cyan-400" }: { className?: string; color?: string }) {
  return (
    <span className={cn("relative inline-flex h-2 w-2", className)}>
      <span className={cn("absolute inline-flex h-2 w-2 rounded-full", color)} />
      <span className={cn("absolute inline-flex h-2 w-2 animate-ping rounded-full opacity-75", color)} />
    </span>
  );
}

/* ==================== Marquee ==================== */
export function Marquee({ children, duration = 35, reverse = false, className, itemClassName }: {
  children: ReactNode; duration?: number; reverse?: boolean; className?: string; itemClassName?: string;
}) {
  return (
    <div className={cn("mask-fade-x overflow-hidden", className)}>
      <div className="flex w-max" style={{ animation: `marquee ${duration}s linear infinite`, animationDirection: reverse ? "reverse" : "normal" }}>
        <div className={cn("flex shrink-0 items-center", itemClassName)}>{children}</div>
        <div className={cn("flex shrink-0 items-center", itemClassName)} aria-hidden>{children}</div>
      </div>
    </div>
  );
}

/* ==================== MonoLabel ==================== */
export function MonoLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("font-mono text-[11px] uppercase tracking-[0.22em] text-lo", className)}>{children}</span>;
}

/* ==================== SectionSeam ====================
   Connective tissue between sections — a flowing vertical data-line with
   a travelling pulse, reinforcing the "one continuous story" narrative. */
export function SectionSeam({ label }: { label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const height = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);
  const pulseY = useTransform(scrollYProgress, [0, 1], ["-10%", "110%"]);
  return (
    <div ref={ref} className="relative mx-auto flex h-24 w-full max-w-7xl items-center justify-center" aria-hidden>
      <div className="relative h-full w-px overflow-visible bg-white/5">
        <motion.div style={{ height }} className="absolute inset-x-0 top-0 w-px bg-gradient-to-b from-transparent via-cyan-400/50 to-cyan-400/70" />
        <motion.span style={{ top: pulseY }} className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-400 shadow-[0_0_12px_2px_rgba(34,211,238,0.7)]" />
      </div>
      {label && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full glass px-3 py-1 font-mono text-[9px] uppercase tracking-[0.28em] text-lo">
          {label}
        </span>
      )}
    </div>
  );
}

/* ==================== CursorGlow ====================
   Ambient pointer-following glow for whole-page immersion. Desktop only,
   disabled under reduced motion. */
export function CursorGlow() {
  const reduce = useReducedMotion();
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 120, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 120, damping: 22, mass: 0.4 });
  useEffect(() => {
    if (reduce) return;
    const move = (e: globalThis.MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [reduce, x, y]);
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[35] hidden h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full lg:block"
      style={{
        left: sx, top: sy,
        background: "radial-gradient(circle, rgba(34,211,238,0.06), transparent 65%)",
      }}
    />
  );
}

/* ============================================================================
   OFFICIAL TOURNAMENT OS COMPONENT LIBRARY — STANDARDIZED PRIMITIVES
   ============================================================================ */

/* ---- BADGE ---- */
export type BadgeTone = "default" | "cyan" | "emerald" | "amber" | "rose" | "violet" | "neutral" | "live" | "verified";
export function Badge({
  children, tone = "default", dot = false, icon: Icon, className, size = "md",
}: {
  children: ReactNode; tone?: BadgeTone; dot?: boolean; icon?: LucideIcon; className?: string; size?: "sm" | "md" | "lg";
}) {
  const tones: Record<BadgeTone, string> = {
    default: "border-white/15 bg-white/5 text-hi",
    cyan: "border-cyan-400/40 bg-cyan-400/10 text-cyan-300",
    emerald: "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
    amber: "border-amber-400/40 bg-amber-400/10 text-amber-300",
    rose: "border-rose-400/40 bg-rose-500/10 text-rose-300",
    violet: "border-violet-400/40 bg-violet-500/10 text-violet-300",
    neutral: "border-white/10 bg-white/[0.03] text-mid",
    live: "border-rose-400/50 bg-rose-500/15 text-rose-300 font-semibold",
    verified: "border-cyan-400/40 bg-cyan-500/15 text-cyan-300 font-semibold",
  };
  const sizes = { sm: "px-2 py-0.5 text-[9px]", md: "px-2.5 py-1 text-[10px]", lg: "px-3 py-1.5 text-[11px]" };
  const dotColors: Record<BadgeTone, string> = {
    default: "bg-white/60", cyan: "bg-cyan-400", emerald: "bg-emerald-400",
    amber: "bg-amber-400", rose: "bg-rose-400", violet: "bg-violet-400",
    neutral: "bg-mid", live: "bg-rose-400 animate-pulse", verified: "bg-cyan-400",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md border font-mono uppercase tracking-wider select-none", tones[tone], sizes[size], className)}>
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColors[tone])} />}
      {Icon && <Icon className="h-3 w-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}

/* ---- INPUT ---- */
export function Input({
  className, icon: Icon, error, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon?: LucideIcon; error?: string }) {
  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        {Icon && <Icon className="absolute left-3.5 h-4 w-4 text-lo pointer-events-none" />}
        <input
          className={cn(
            "w-full rounded-xl border border-white/10 bg-void-900/60 px-4 py-3 text-sm text-hi placeholder:text-lo transition-all duration-300 focus:border-cyan-400/50 focus:bg-void-900/90 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50",
            Icon && "pl-10",
            error && "border-rose-400/50 focus:border-rose-400 focus:ring-rose-400/20",
            className,
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-300">{error}</p>}
    </div>
  );
}

/* ---- SEARCH INPUT ---- */
export function SearchInput({
  value, onChange, onClear, placeholder = "Search...", className, shortcut, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { value?: string; onClear?: () => void; shortcut?: string }) {
  return (
    <div className={cn("relative flex items-center rounded-xl border border-white/10 bg-void-900/60 px-3.5 py-2.5 transition-all duration-300 focus-within:border-cyan-400/50 focus-within:bg-void-900/90 focus-within:ring-2 focus-within:ring-cyan-400/20", className)}>
      <Search className="h-4 w-4 shrink-0 text-lo mr-2.5" />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-hi placeholder:text-lo focus:outline-none"
        {...props}
      />
      {value && onClear && (
        <button type="button" onClick={onClear} className="ml-2 grid h-5 w-5 place-items-center rounded text-lo hover:text-hi transition-colors" aria-label="Clear search">
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      {shortcut && !value && (
        <kbd className="ml-2 hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-lo sm:inline-block select-none">{shortcut}</kbd>
      )}
    </div>
  );
}

/* ---- SELECT ---- */
export function Select({
  className, icon: Icon, children, ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { icon?: LucideIcon }) {
  return (
    <div className="relative inline-flex items-center w-full">
      {Icon && <Icon className="absolute left-3.5 h-4 w-4 text-lo pointer-events-none z-10" />}
      <select
        className={cn(
          "w-full appearance-none rounded-xl border border-white/10 bg-void-900/70 px-4 py-3 text-sm text-hi transition-all duration-300 focus:border-cyan-400/50 focus:bg-void-900/95 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50",
          Icon ? "pl-10 pr-10" : "pr-10",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3.5 h-4 w-4 text-lo pointer-events-none" />
    </div>
  );
}

/* ---- CARD ---- */
export function Card({
  children, className, spotlight = false, edge = true, hover = false, padding = "md",
}: {
  children: ReactNode; className?: string; spotlight?: boolean; edge?: boolean; hover?: boolean; padding?: "none" | "sm" | "md" | "lg";
}) {
  const pMap = { none: "p-0", sm: "p-4", md: "p-6", lg: "p-8" };
  return (
    <div
      onMouseMove={spotlight ? (e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      } : undefined}
      className={cn(
        "rounded-2xl border border-white/8 bg-void-900/60 backdrop-blur-xl",
        pMap[padding],
        edge && "edge-top",
        spotlight && "spotlight",
        hover ? "mo-lift" : "transition-colors duration-300",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ---- TABLE PRIMITIVES ---- */
export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-white/8 bg-void-900/60 backdrop-blur-xl", className)}>
      <div className="w-full overflow-x-auto no-scrollbar">{children}</div>
    </div>
  );
}

export function TableHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("grid border-b border-white/6 px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-lo bg-white/[0.02]", className)}>
      {children}
    </div>
  );
}

export function TableRow({ children, className, hover = true }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={cn("mo-row-in group/row grid items-center border-b border-white/4 px-5 py-4 last:border-0 transition-colors duration-200", hover && "hover:bg-white/[0.04]", className)}>
      {children}
    </div>
  );
}

