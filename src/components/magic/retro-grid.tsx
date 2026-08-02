import { cn } from "@/lib/utils";

/* ============================================================================
   RetroGrid — MagicUI-style perspective grid floor (MIT pattern), pure CSS.
   The synthwave floor behind CTAs and pricing. `.decor` lets reduced-motion
   freeze it (it's a static pattern — no animation, so it just works).
   ============================================================================ */

export function RetroGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden opacity-25 [perspective:200px]",
        className,
      )}
    >
      {/* Floor */}
      <div className="absolute inset-0 [transform:rotateX(80deg)]">
        <div
          className="animate-grid absolute inset-0 [background-image:linear-gradient(to_right,rgba(34,211,238,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.35)_1px,transparent_1px)] [background-size:64px_64px]"
        />
      </div>
      {/* Fog gradient over the floor */}
      <div className="absolute inset-0 bg-gradient-to-t from-void-950 to-transparent" />
    </div>
  );
}
