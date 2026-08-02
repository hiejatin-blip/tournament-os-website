import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ============================================================================
   AnimatedList — spring-stacked feed rows (MagicUI pattern).
   New items slide in from the top; exit collapses. Use for feeds,
   notification lists, live event logs.
   ============================================================================ */

export function AnimatedList({
  items,
  render,
  className,
  itemKey,
}: {
  items: unknown[];
  render: (item: unknown, index: number) => ReactNode;
  className?: string;
  itemKey: (item: unknown, index: number) => string;
}) {
  return (
    <div className={cn("relative space-y-2", className)}>
      <AnimatePresence initial={false}>
        {items.map((item, i) => (
          <motion.div
            key={itemKey(item, i)}
            layout
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            {render(item, i)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
