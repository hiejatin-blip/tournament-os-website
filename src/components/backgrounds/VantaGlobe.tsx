import { useEffect, useRef } from "react";
import { useVantaLoader } from "@/shared/hooks/useVantaLoader";
import { cn } from "@/lib/utils";

// (shared window type declaration lives with the archive copy)

interface VantaGlobeProps {
  className?: string;
}

export function VantaGlobe({ className }: VantaGlobeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const vantaInstance = useRef<{ destroy(): void } | null>(null);
  const { ready } = useVantaLoader("globe");

  useEffect(() => {
    if (!ready) return;
    if (!containerRef.current) return;
    if (vantaInstance.current) return;

    if (
      typeof window.VANTA === "undefined" ||
      typeof window.VANTA.GLOBE === "undefined"
    ) {
      return;
    }

    const isMobile = window.innerWidth < 640;

    try {
      vantaInstance.current = window.VANTA.GLOBE({
        el: containerRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: isMobile ? 0.6 : 0.75,
        backgroundColor: 0x030308, // void-950
        color: 0x22d3ee,           // cyan-400
        color2: 0x06b6d4,          // cyan-500
        size: 1.2,
        points: isMobile ? 6.0 : 10.0,
        maxDistance: 22.0,
        spacing: 18.0,
      });
    } catch {
      // WebGL context unavailable (headless / no GPU) — degrade silently
      return;
    }

    return () => {
      vantaInstance.current?.destroy();
      vantaInstance.current = null;
    };
  }, [ready]);

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none fixed inset-0", className)}
      style={{ zIndex: 0, opacity: 0.55 }}
    >
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
