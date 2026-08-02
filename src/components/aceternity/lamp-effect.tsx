import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ============================================================================
   LampEffect — Aceternity UI pattern (MIT), tokenized to the void/cyan theme.
   Two conic beams meet at center-top, a glow ring + light line ignite, and
   the content is pulled up OVER the beam. REQUIRES a centered headline
   layout (the beam is symmetric from center-top).
   ============================================================================ */

export const LampEffect = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative z-0 flex min-h-[58vh] w-full flex-col items-center justify-center overflow-hidden",
        className,
      )}
    >
      <div className="relative isolate z-0 flex w-full flex-1 scale-y-125 items-center justify-center">
        {/* Left beam */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage:
              "conic-gradient(from 290deg at center top, #22d3ee 0%, transparent 55%)",
          }}
          className="absolute inset-auto right-1/2 h-56 w-[30rem] overflow-visible"
        >
          <div className="absolute bottom-0 left-0 z-20 h-40 w-full bg-void-950 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute bottom-0 left-0 z-20 h-full w-40 bg-void-950 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        {/* Right beam */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage:
              "conic-gradient(from 70deg at center top, #22d3ee 0%, transparent 55%)",
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] overflow-visible"
        >
          <div className="absolute bottom-0 right-0 z-20 h-40 w-full bg-void-950 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute bottom-0 right-0 z-20 h-full w-40 bg-void-950 [mask-image:linear-gradient(to_left,white,transparent)]" />
        </motion.div>
        {/* Glow ring */}
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute top-8 z-50 h-24 w-64 rounded-full bg-cyan-500 blur-2xl"
        />
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute top-8 z-50 h-24 w-64 rounded-full bg-cyan-500 blur-2xl"
        />
        {/* Core glow */}
        <div className="absolute z-50 h-36 w-[28rem] -translate-y-[6rem] rounded-full bg-cyan-400 opacity-50 blur-3xl" />
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-cyan-400 blur-2xl"
        />
        {/* Light line */}
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-cyan-400"
        />
        {/* Bottom mask that hides the beam base under the content */}
        <div className="absolute z-40 h-44 w-full -translate-y-[12.5rem] bg-void-950 [mask-image:linear-gradient(to_bottom,transparent,white_90%,black)]" />
      </div>

      {/* Content pulled up over the beam */}
      <div className="relative z-50 flex -translate-y-64 flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
};
