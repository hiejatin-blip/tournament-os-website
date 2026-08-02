import { useState, useEffect } from "react";

// ─── Module-level script cache ────────────────────────────────────────────────
// Persists across component mounts/unmounts. Deduplicates script loading.
const scriptCache = new Map<string, Promise<void>>();

function loadScript(src: string): Promise<void> {
  if (scriptCache.has(src)) return scriptCache.get(src)!;
  const p = new Promise<void>((resolve, reject) => {
    // Already in DOM (e.g. hydration or double-mount)
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed to load: ${src}`));
    document.head.appendChild(el);
  });
  scriptCache.set(src, p);
  return p;
}

// ─── CDN URLs ────────────────────────────────────────────────────────────────
const THREE_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
const VANTA_URLS: Record<VantaEffect, string> = {
  halo: "https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.halo.min.js",
  globe: "https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.globe.min.js",
};

// ─── Types ────────────────────────────────────────────────────────────────────
export type VantaEffect = "halo" | "globe";

export interface VantaLoaderResult {
  ready: boolean;
  error: string | null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useVantaLoader(effect: VantaEffect): VantaLoaderResult {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Respect reduced-motion preference — never set ready
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;

    async function load() {
      try {
        // Three.js must be loaded before any Vanta effect
        await loadScript(THREE_URL);
        await loadScript(VANTA_URLS[effect]);
        if (!cancelled) setReady(true);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn("[useVantaLoader]", msg);
        if (!cancelled) setError(msg);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [effect]);

  return { ready, error };
}
