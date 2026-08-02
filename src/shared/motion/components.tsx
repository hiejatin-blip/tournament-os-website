import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useMotionValue, useSpring, useReducedMotion, animate } from "framer-motion";
import { revealVariants, staggerContainer, staggerItem, inView, ease, dur } from "./index";
import { cn } from "@/lib/utils";

/* ============================================================================
   MotionReveal — declarative scroll-reveal wrapper using the shared variants.
   ============================================================================ */
export function MotionReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/* MotionList — staggered container + item for grids/lists */
export function MotionList({ children, className, stagger = 0.06 }: { children: ReactNode; className?: string; stagger?: number }) {
  return (
    <motion.div variants={staggerContainer(stagger)} initial="hidden" whileInView="show" viewport={inView} className={className}>
      {children}
    </motion.div>
  );
}
export function MotionItem({ children, className }: { children: ReactNode; className?: string }) {
  return <motion.div variants={staggerItem} className={className}>{children}</motion.div>;
}

/* ============================================================================
   AnimatedNumber — smoothly tweens between values (live dashboards / counters).
   Never abruptly replaces a stat; flashes cyan briefly on change.
   ============================================================================ */
export function AnimatedNumber({
  value, decimals = 0, prefix = "", suffix = "", className, duration = 0.6, flash = true,
}: {
  value: number; decimals?: number; prefix?: string; suffix?: string; className?: string; duration?: number; flash?: boolean;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    if (reduce) { setDisplay(value); prev.current = value; return; }
    const controls = animate(prev.current, value, {
      duration, ease: ease.emphasized,
      onUpdate: (v) => setDisplay(v),
    });
    if (flash && value !== prev.current) {
      setFlashing(true);
      const t = setTimeout(() => setFlashing(false), 900);
      prev.current = value;
      return () => { controls.stop(); clearTimeout(t); };
    }
    prev.current = value;
    return () => controls.stop();
  }, [value, duration, reduce, flash]);

  return (
    <span className={cn("tabular-nums transition-colors", flashing && "text-cyan-300", className)}>
      {prefix}{display.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  );
}

/* CountUp on first view (non-live headline stats) */
export function CountOnView({
  to, decimals = 0, prefix = "", suffix = "", className, duration = 1.4,
}: { to: number; decimals?: number; prefix?: string; suffix?: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "-12%" });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (reduce) { setVal(to); return; }
    const c = animate(0, to, { duration, ease: ease.emphasized, onUpdate: setVal });
    return () => c.stop();
  }, [seen, to, duration, reduce]);
  return <span ref={ref} className={cn("tabular-nums", className)}>{prefix}{val.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

/* ============================================================================
   Skeleton primitives — animated shimmer loaders (context-aware, no spinners).
   ============================================================================ */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("mo-skeleton", className)} />;
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-3", i === lines - 1 ? "w-2/3" : "w-full")} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-white/8 bg-void-900/40 p-6", className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-xl" />
        <div className="flex-1 space-y-2"><Skeleton className="h-3 w-1/2" /><Skeleton className="h-3 w-1/3" /></div>
      </div>
      <SkeletonText lines={2} className="mt-5" />
      <div className="mt-5 grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 rounded-lg" />)}
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

export function SkeletonRow({ cols = 5 }: { cols?: number }) {
  return (
    <div className="grid items-center gap-4 border-b border-white/4 px-5 py-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
      {Array.from({ length: cols }).map((_, i) => <Skeleton key={i} className="h-4" />)}
    </div>
  );
}

/* ============================================================================
   useDeferredLoad — simulate progressive content streaming (skeleton → content)
   ============================================================================ */
export function useDeferredLoad(ms = 650): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setReady(true); return; }
    const t = setTimeout(() => setReady(true), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return ready;
}

/* ============================================================================
   Tilt — subtle pointer-driven 3D perspective (cards). Compositor-only.
   ============================================================================ */
export function Tilt({ children, className, max = 6 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        ry.set(nx * max); rx.set(-ny * max);
        ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
        ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      onMouseLeave={() => { rx.set(0); ry.set(0); }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className={cn("[transform-style:preserve-3d] will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}

/* re-export tokens for convenience */
export { dur, ease };
