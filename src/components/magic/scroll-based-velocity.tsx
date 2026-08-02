import { useRef } from "react";
import {
  motion, useScroll, useSpring, useTransform, useMotionValue, useAnimationFrame, useVelocity, useReducedMotion,
} from "framer-motion";
import { wrap } from "@motionone/utils";

/* ============================================================================
   ScrollBasedVelocity — MagicUI pattern (MIT, adapted from Codrops).
   A full-width statement band whose text accelerates with scroll velocity:
   scroll fast → the words whip by. Pure motion values, no re-renders.
   ============================================================================ */

export function ScrollBasedVelocity({
  text = "TOURNAMENT OS",
  baseVelocity = 3,
  className,
}: {
  text?: string;
  baseVelocity?: number;
  className?: string;
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const reduce = useReducedMotion();
  const directionFactor = useRef(1);

  const x = useTransform(baseX, (v) => `${wrap(-20, 20, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * Math.abs(velocityFactor.get());
    baseX.set(baseX.get() + moveBy);
  });

  const content = (
    <span className={`flex shrink-0 whitespace-nowrap font-display text-6xl font-bold uppercase tracking-tight sm:text-8xl ${className ?? ""}`}>
      <span className="text-hi/90">{text}</span>
      <span className="mx-6 text-cyan-400/80">✦</span>
      <span className="text-hi/40">{text}</span>
      <span className="mx-6 text-cyan-400/60">✦</span>
      <span className="text-hi/20">{text}</span>
    </span>
  );

  return (
    <div className="relative overflow-hidden py-14 [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
      <motion.div style={{ x }} className="flex whitespace-nowrap will-change-transform">
        {content}
        {content}
      </motion.div>
    </div>
  );
}
