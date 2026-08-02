import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================================
   StickyScrollReveal — Aceternity UI pattern (MIT).
   A sticky headline on the left changes as description cards scroll past on
   the right. Used on /platform to tell the system story one pillar at a time.
   ============================================================================ */

export function StickyScrollReveal({
  content,
}: {
  content: { icon: LucideIcon; title: string; description: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduce) return;
    setActive(Math.min(content.length - 1, Math.max(0, Math.floor(v * content.length))));
  });

  return (
    <div ref={ref} className="relative grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
      {/* Sticky left headline */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="grid h-14 w-14 place-items-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300 shadow-[0_0_30px_-8px_rgba(34,211,238,0.6)]">
            {(() => {
              const Icon = content[active].icon;
              return <Icon className="h-6 w-6" />;
            })()}
          </span>
          <h3 className="mt-6 font-display text-3xl font-bold tracking-tight text-hi sm:text-4xl">
            {content[active].title}
          </h3>
          <div className="mt-6 flex gap-1.5">
            {content.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  i === active ? "w-8 bg-cyan-400" : "w-2 bg-white/15",
                )}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scrolling cards */}
      <div className="space-y-6">
        {content.map((c, i) => (
          <div
            key={c.title}
            className={cn(
              "rounded-3xl border p-7 transition-all duration-300 sm:p-9",
              i === active
                ? "border-cyan-400/25 bg-gradient-to-b from-cyan-400/[0.05] to-transparent shadow-[0_0_40px_-16px_rgba(34,211,238,0.4)]"
                : "border-white/6 bg-white/[0.015]",
            )}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-lo">
              {String(i + 1).padStart(2, "0")} / {String(content.length).padStart(2, "0")}
            </p>
            <h4 className="mt-3 font-display text-xl font-bold text-hi">{c.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-mid sm:text-base">{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
