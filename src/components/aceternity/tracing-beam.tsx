import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ============================================================================
   TracingBeam — Aceternity UI pattern (MIT), tokenized to void/cyan.
   A glowing line traces down the left edge of the wrapped content as the
   user scrolls — the "progress narrative" visual.
   ============================================================================ */

export const TracingBeam = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    if (contentRef.current) {
      setSvgHeight(contentRef.current.offsetHeight);
    }
  }, []);

  const y1 = useSpring(useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]), {
    stiffness: 500,
    damping: 90,
  });
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]), {
    stiffness: 500,
    damping: 90,
  });

  return (
    <motion.div ref={ref} className={cn("relative mx-auto h-full w-full max-w-5xl", className)}>
      <div className="absolute left-3 top-3 z-50 hidden md:-left-10 md:block" aria-hidden>
        <motion.div
          style={{ translateY: y1 }}
          className="h-4 w-4 rounded-full border border-cyan-300 bg-void-900 shadow-[0_0_12px_2px_rgba(34,211,238,0.7)]"
        />
        <svg
          viewBox={`0 0 24 ${svgHeight}`}
          width="24"
          height={svgHeight}
          className="ml-4 block"
          aria-hidden
        >
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="url(#tracing-gradient)"
            strokeWidth="1.5"
            style={{ pathLength: scrollYProgress }}
            className="[mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
          />
          <defs>
            <linearGradient id="tracing-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="15%" stopColor="#22d3ee" />
              <stop offset="85%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
        <motion.div
          style={{ translateY: y2 }}
          className="ml-1.5 mt-2 h-24 w-px bg-gradient-to-b from-cyan-400 to-transparent"
        />
      </div>
      <div ref={contentRef} className="pl-8 md:pl-8">{children}</div>
    </motion.div>
  );
};
