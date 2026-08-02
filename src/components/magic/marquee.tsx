import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ============================================================================
   Marquee — MagicUI-style infinite horizontal ticker (MIT pattern).
   Uses the repo's existing `marquee` keyframes (translateX -50% loop).
   Pauses on hover; decorative layer — add `.decor` class so the
   reduced-motion override can freeze it.
   ============================================================================ */

interface MarqueeProps {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: ReactNode;
  vertical?: boolean;
  repeat?: number;
  duration?: string;
  [key: string]: unknown;
}

export default function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  duration = "35s",
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "decor group flex overflow-hidden p-2 [--duration:35s] [--gap:1rem] [gap:var(--gap)]",
        className,
      )}
      style={{ "--duration": duration } as CSSProperties}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
            "animate-marquee flex-row": !vertical,
            "animate-marquee-vertical flex-col": vertical,
            "group-hover:[animation-play-state:paused]": pauseOnHover,
            "[animation-direction:reverse]": reverse,
          })}
          style={{ animationDuration: "var(--duration)" }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
