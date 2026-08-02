import { cn } from "@/lib/utils";

/* ============================================================================
   BorderBeam — MagicUI-style orbiting border light (MIT pattern).
   A gradient square rotates around the card border (transform-origin 0% 50%),
   masked into a thin ring by the parent's border-box mask. `.decor` class
   lets the reduced-motion override freeze it.
   ============================================================================ */

export default function BorderBeam({
  className,
  size = 200,
  duration = 8,
  borderWidth = 1.5,
  colorFrom = "#22d3ee",
  colorTo = "#fbbf24",
  delay = 0,
}: {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "decor pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
        "[mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]",
        className,
      )}
      style={{ "--border-width": borderWidth } as React.CSSProperties}
    >
      <div
        className="animate-border-beam absolute aspect-square w-[var(--size)] rounded-[inherit] [background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] [background-size:100%_100%] [transform-origin:0%_50%]"
        style={
          {
            "--size": `${size}px`,
            "--duration": `${duration}s`,
            "--delay": `-${delay}s`,
            "--color-from": colorFrom,
            "--color-to": colorTo,
          } as React.CSSProperties
        }
      />
    </div>
  );
}
