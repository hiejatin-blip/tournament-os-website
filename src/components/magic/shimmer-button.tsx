import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ============================================================================
   ShimmerButton — MagicUI-style shimmer sweep CTA (MIT pattern).
   A light band sweeps across the button on hover. Tokenized to the site's
   cyan primary gradient.
   ============================================================================ */

type ShimmerButtonProps = ComponentPropsWithoutRef<"button"> & {
  children: ReactNode;
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
};

export default function ShimmerButton({
  children,
  className,
  shimmerColor = "#ffffff",
  shimmerSize = "0.05em",
  borderRadius = "9999px",
  type = "button",
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      type={type}
      style={{ borderRadius, "--spread": "90deg" } as React.CSSProperties}
      className={cn(
        "mo-press group relative z-0 flex items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 bg-gradient-to-r from-cyan-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-void-950",
        "transition-shadow duration-500 hover:shadow-[0_0_24px_-4px_rgba(34,211,238,0.7)]",
        className,
      )}
      {...props}
    >
      {/* shimmer sweep */}
      <span
        aria-hidden
        style={{ "--shimmer-size": shimmerSize, "--shimmer-color": shimmerColor } as React.CSSProperties}
        className="absolute inset-0 overflow-hidden rounded-[inherit]"
      >
        <span className="absolute inset-0 translate-x-[-150%] bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[150%]" />
      </span>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
