import { ease } from "@/shared/motion/motion-tokens";
import { type ReactNode } from "react";
import { motion } from "framer-motion";

/* ============================================================================
   PageHeader — standard page hero header used across marketing/directory pages.
   Extracted from the deleted no-op PageShell wrapper (which rendered {children}
   with zero logic — removed in the Phase 0 purge).
   ============================================================================ */
export function PageHeader({
  eyebrow, title, description, children,
}: { eyebrow?: string; title: ReactNode; description?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden px-5 pb-10 pt-36 sm:px-8 sm:pt-44">
      <div className="pointer-events-none absolute left-1/2 top-20 h-[40vh] w-[70vh] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px] blur-orb" />
      <div className="relative mx-auto max-w-7xl">
        {eyebrow && (
          <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse-ring" />{eyebrow}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05, ease: ease.emphasized }}
          className="mt-5 max-w-4xl text-balance text-4xl font-bold leading-[1.02] text-gradient sm:text-5xl md:text-6xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="mt-5 max-w-2xl text-base leading-relaxed text-mid sm:text-lg">
            {description}
          </motion.p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}