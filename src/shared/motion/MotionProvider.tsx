import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/* ============================================================================
   MotionProvider — global reduced-motion enforcement.
   `reducedMotion="user"` makes EVERY Framer-based component in the tree
   (including all vendored MagicUI/Aceternity/KokonutUI files) respect the
   OS `prefers-reduced-motion` setting automatically — one line, 64+ files.
   ============================================================================ */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
