import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ============================================================================
   OrbitingCircles — MagicUI-style orbiting satellite diagram (MIT pattern).
   Icons orbit a central core on configurable rings. Pure CSS animation —
   no three.js. Used for the integration ecosystem (Discord/Twitch/API/…).
   ============================================================================ */

export function OrbitingCircles({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex aspect-square w-full max-w-[420px] items-center justify-center",
        className,
      )}
    >
      <div className="absolute inset-0 rounded-full border border-white/8" />
      <div className="absolute inset-6 rounded-full border border-white/[0.04]" />
      {children}
    </div>
  );
}

/* Convenience satellite wrapper — a single orbiting node */
export function OrbitNode({
  children,
  className,
  radius = 160,
  duration = 18,
  reverse = false,
  angle = 0,
}: {
  children: ReactNode;
  className?: string;
  radius?: number;
  duration?: number;
  reverse?: boolean;
  angle?: number;
}) {
  return (
    <div
      className={cn("absolute left-1/2 top-1/2", className)}
      style={{ transform: `translate(-50%,-50%) rotate(${angle}deg) translateX(${radius}px) rotate(-${angle}deg)` }}
    >
      <motion.div
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        className="flex flex-col items-center justify-center"
      >
        {children}
      </motion.div>
    </div>
  );
}
