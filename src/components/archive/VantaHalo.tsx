import { useEffect, useRef } from "react";
import { useVantaLoader } from "@/shared/hooks/useVantaLoader";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    VANTA: {
      HALO: (config: Record<string, unknown>) => { destroy(): void };
      GLOBE: (config: Record<string, unknown>) => { destroy(): void };
    };
    THREE: unknown;
  }
}

interface VantaHaloProps {
  className?: string;
  /**
   * Stock VANTA.HALO — backgroundColor, baseColor, amplitudeFactor,
   * xOffset, and yOffset are intentionally left unset so the effect falls
   * back to Vanta's own built-in defaults (the same values vantajs.com's
   * own customize panel shows before any slider is touched). `size` is
   * the ONLY parameter this component ever overrides — scale it up or
   * down to fit a given canvas, nothing else.
   * Defaults to 1, which is Vanta's own default size.
   */
  size?: number;
}

export function VantaHalo({ className, size = 1 }: VantaHaloProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const vantaInstance = useRef<{ destroy(): void } | null>(null);
  const { ready } = useVantaLoader("halo");

  useEffect(() => {
    if (!ready) return;
    if (!containerRef.current) return;
    if (vantaInstance.current) return; // already initialized

    // Graceful degradation if VANTA didn't load
    if (
      typeof window.VANTA === "undefined" ||
      typeof window.VANTA.HALO === "undefined"
    ) {
      return;
    }

    try {
      // No color/amplitude/offset overrides — pure stock VANTA.HALO.
      vantaInstance.current = window.VANTA.HALO({
        el: containerRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        size,
      });
    } catch {
      // WebGL context unavailable (headless / no GPU) — degrade silently
      return;
    }

    return () => {
      vantaInstance.current?.destroy();
      vantaInstance.current = null;
    };
  }, [ready, size]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{ zIndex: 1 }}
    />
  );
}
