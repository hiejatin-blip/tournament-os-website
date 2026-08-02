/* ============================================================================
   TOURNAMENT OS MOTION TOKENS — canonical motion vocabulary
   ----------------------------------------------------------------------------
   Single source of truth for durations, easing curves, springs and reusable
   variants. `shared/motion/index.ts` re-exports this file so existing
   imports keep working. Mirrored by the CSS `@theme` duration/easing tokens.
   ============================================================================ */
import type { Variants, Transition } from "framer-motion";

/* ---- EASING (mirrors CSS custom props) ---- */
export const ease = {
  standard: [0.2, 0, 0, 1] as const,       // entrances
  emphasized: [0.16, 1, 0.3, 1] as const,  // hero reveals (expo-out)
  spring: [0.34, 1.56, 0.64, 1] as const,  // playful overshoot
  exit: [0.4, 0, 1, 1] as const,           // accelerate out
};

/* ---- DURATION (seconds, mirrors CSS ms tokens) ---- */
export const dur = {
  instant: 0.09,
  fast: 0.16,
  base: 0.24,
  slow: 0.4,
  cinematic: 0.68,
};

/* ---- SPRINGS ---- */
export const spring = {
  soft: { type: "spring", stiffness: 260, damping: 30, mass: 0.9 } as Transition,
  snappy: { type: "spring", stiffness: 420, damping: 32 } as Transition,
  drawer: { type: "spring", stiffness: 320, damping: 34 } as Transition,
  bouncy: { type: "spring", stiffness: 500, damping: 24 } as Transition,
};

/* ---- REUSABLE VARIANTS ---- */

/* Page transition — used by all layout <Outlet /> wrappers */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 14 },
  enter: { opacity: 1, y: 0, transition: { duration: dur.slow, ease: ease.emphasized } },
  exit: { opacity: 0, y: -8, transition: { duration: dur.fast, ease: ease.exit } },
};

/* Dashboard content transition — tighter, snappier for app feel */
export const appPageVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  enter: { opacity: 1, y: 0, transition: { duration: dur.base, ease: ease.emphasized } },
  exit: { opacity: 0, y: -6, transition: { duration: dur.fast, ease: ease.exit } },
};

/* Reveal on scroll into view */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: dur.slow, ease: ease.emphasized } },
};

/* Stagger container + item */
export const staggerContainer = (stagger = 0.06, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: dur.slow, ease: ease.emphasized } },
};

/* Overlay + modal/drawer */
export const overlayVariants: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: dur.base, ease: ease.standard } },
  exit: { opacity: 0, transition: { duration: dur.fast, ease: ease.exit } },
};
export const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.94, y: 16 },
  enter: { opacity: 1, scale: 1, y: 0, transition: spring.soft },
  exit: { opacity: 0, scale: 0.96, y: 12, transition: { duration: dur.fast, ease: ease.exit } },
};
export const drawerRightVariants: Variants = {
  initial: { x: "100%" },
  enter: { x: 0, transition: spring.drawer },
  exit: { x: "100%", transition: { duration: dur.base, ease: ease.exit } },
};
export const drawerLeftVariants: Variants = {
  initial: { x: "-100%" },
  enter: { x: 0, transition: spring.drawer },
  exit: { x: "-100%", transition: { duration: dur.base, ease: ease.exit } },
};

/* List item entrance (feeds, notifications, table rows) */
export const listItemVariants: Variants = {
  initial: { opacity: 0, x: -12, height: 0 },
  enter: { opacity: 1, x: 0, height: "auto", transition: { duration: dur.base, ease: ease.emphasized } },
  exit: { opacity: 0, x: 16, height: 0, transition: { duration: dur.fast, ease: ease.exit } },
};

/* Shared viewport config for whileInView */
export const inView = { once: true, margin: "-8% 0px -8% 0px" } as const;
