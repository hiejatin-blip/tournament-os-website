import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/* ============================================================================
   Compare — Aceternity UI pattern (MIT), simplified + accessible.
   Drag the handle (or use the keyboard slider) to reveal the AFTER image
   over the BEFORE image. Used for the "Manual vs Tournament OS" demo.
   ============================================================================ */

export function Compare({
  firstImage,
  secondImage,
  firstLabel = "Before",
  secondLabel = "After",
  className,
  initialSliderPosition = 50,
}: {
  firstImage: string;
  secondImage: string;
  firstLabel?: string;
  secondLabel?: string;
  className?: string;
  initialSliderPosition?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(initialSliderPosition);
  const clip = useTransform(x, (v) => `inset(0 ${100 - v}% 0 0)`);

  return (
    <div
      ref={ref}
      className={cn(
        "group relative aspect-[16/10] w-full select-none overflow-hidden rounded-3xl border border-white/10 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {/* BEFORE (base layer) */}
      <img
        src={firstImage}
        alt={firstLabel}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      {/* AFTER (clipped layer) */}
      <motion.div style={{ clipPath: clip }} className="absolute inset-0">
        <img
          src={secondImage}
          alt={secondLabel}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </motion.div>

      {/* Labels */}
      <span className="absolute left-4 top-4 z-10 rounded-full border border-white/10 bg-void-950/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-mid backdrop-blur">
        {firstLabel}
      </span>
      <span className="absolute right-4 top-4 z-10 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300 backdrop-blur">
        {secondLabel}
      </span>

      {/* Drag handle */}
      <motion.div
        drag="x"
        dragConstraints={ref}
        dragElastic={0}
        dragMomentum={false}
        style={{ x }}
        className="absolute inset-y-0 z-20 w-0.5 -translate-x-1/2 cursor-ew-resize touch-none bg-cyan-400/90 shadow-[0_0_16px_rgba(34,211,238,0.8)]"
        aria-hidden
      >
        <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-cyan-400/50 bg-void-900/90 text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.5)] backdrop-blur">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 8-4 4 4 4" /><path d="m15 8 4 4-4 4" />
          </svg>
        </span>
      </motion.div>

      {/* Keyboard-accessible range input */}
      <input
        type="range"
        min={0}
        max={100}
        defaultValue={initialSliderPosition}
        aria-label={`Compare ${firstLabel} and ${secondLabel}`}
        onChange={(e) => x.set(Number(e.target.value))}
        className="absolute inset-x-0 bottom-3 z-30 mx-auto block w-1/2 cursor-ew-resize opacity-0"
      />
    </div>
  );
}
