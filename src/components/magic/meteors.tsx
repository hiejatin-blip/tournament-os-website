import { cn } from "@/lib/utils";

/* ============================================================================
   Meteors — Aceternity UI pattern (MIT). Meteor streaks streaking across a
   section. Pure CSS, `.decor`-gated for reduced motion.
   ============================================================================ */

export function Meteors({ number = 12, className }: { number?: number; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {Array.from({ length: number }).map((_, i) => {
        const left = (i * 83) % 100;
        const delay = (i * 0.9) % 8;
        const duration = 5 + (i % 5);
        return (
          <span
            key={i}
            className="decor animate-meteor absolute top-0 h-0.5 w-0.5 rounded-full bg-cyan-300 shadow-[0_0_8px_2px_rgba(34,211,238,0.8)]"
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
}
