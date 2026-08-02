import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";

/* Section that scales from 0.6 to 1 as you scroll through it.
   Combined with rotation, opacity fade, and clip-path reveal —
   creates a cinematic "entering a new room" effect. */
export function ZoomSection({
  children, className, id, rotate = 0,
}: { children: ReactNode; className?: string; id?: string; rotate?: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.25"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.55, 1]);
  const rotateVal = useTransform(scrollYProgress, [0, 1], [rotate, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.85, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], ["3rem", "0rem"]);

  return (
    <section ref={ref} id={id} className={className}>
      <motion.div
        style={{
          scale,
          rotateZ: rotateVal,
          opacity,
          borderRadius,
        }}
        className="will-change-transform overflow-hidden"
      >
        {children}
      </motion.div>
    </section>
  );
}
