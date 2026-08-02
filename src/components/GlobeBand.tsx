import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { motion } from "framer-motion";
import { SectionHeading } from "./ui";
import { ease } from "@/shared/motion/motion-tokens";

/* ============================================================================
   GlobeBand — "Global by default". A COBE 5KB WebGL globe (prebuilt,
   MIT) with glowing markers at the platform's regions, lazy-mounting
   via IntersectionObserver so it never blocks first paint.
   ============================================================================ */

const MARKERS = [
  { location: [40.71, -74.0], size: 0.06 }, // NY
  { location: [37.77, -122.42], size: 0.06 }, // SF
  { location: [51.5, -0.12], size: 0.06 }, // London
  { location: [52.52, 13.4], size: 0.06 }, // Berlin
  { location: [28.61, 77.21], size: 0.06 }, // Delhi
  { location: [35.68, 139.65], size: 0.06 }, // Tokyo
  { location: [-33.86, 151.21], size: 0.06 }, // Sydney
  { location: [-23.55, -46.63], size: 0.06 }, // São Paulo
  { location: [1.35, 103.82], size: 0.06 }, // Singapore
];

function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    /* only mount when the globe enters the viewport (and not reduced-motion) */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let phi = 0;
    let width = 0;
    let globe: ReturnType<typeof createGlobe> | null = null;
    let observer: IntersectionObserver | null = null;

    const mount = () => {
      if (globe || !canvas || !wrap) return;
      width = wrap.offsetWidth || 480;
      canvas.width = width * 2;
      canvas.height = width * 2;
      globe = createGlobe(canvas, {
        devicePixelRatio: 2,
        width: width * 2,
        height: width * 2,
        phi: 0,
        theta: 0.28,
        dark: 1,
        diffuse: 1.1,
        mapSamples: 18000,
        mapBrightness: 5.5,
        baseColor: [0.13, 0.85, 0.93],
        markerColor: [0.7, 0.95, 1],
        glowColor: [0.13, 0.85, 0.93],
        markers: MARKERS,
        onRender: (state: { phi: number }) => {
          state.phi = phi;
          phi += 0.0022;
        },
      });
    };

    const unmount = () => {
      globe?.destroy();
      globe = null;
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? mount() : unmount()));
      },
      { rootMargin: "200px" },
    );
    observer.observe(wrap);

    return () => {
      observer?.disconnect();
      unmount();
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative aspect-square w-full max-w-[520px]">
      {/* halo */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-cyan-500/[0.07] blur-3xl" />
      <canvas ref={canvasRef} className="relative h-full w-full" aria-label="Global network globe" role="img" />
    </div>
  );
}

const REGIONS = [
  "NA-East", "NA-West", "EU-West", "EU-North", "APAC", "MEA", "LATAM", "SEA",
];

export function GlobeBand() {
  return (
    <section id="global" className="relative overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.06),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* reversed: globe LEFT, copy RIGHT */}
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, ease: ease.emphasized }}
            className="mx-auto"
          >
            <GlobeCanvas />
          </motion.div>

          <div>
            <SectionHeading
              align="left"
              eyebrow="Global by default"
              title={<>28 edge regions. <span className="text-hi">Your players are already local.</span></>}
              description="Tournament OS runs closer to your players than their own ping. Matches, brackets, and check-ins are served from the edge region nearest to every competitor — automatically."
            />
            <ul className="mt-8 flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <span key={r} className="rounded-full border border-white/8 bg-white/[0.02] px-3 py-1.5 font-mono text-[11px] text-mid transition-colors hover:border-cyan-400/25 hover:text-cyan-200">
                  {r}
                </span>
              ))}
            </ul>
            <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
              {[
                { v: '38ms', l: 'p50 latency' },
                { v: '99.99%', l: 'uptime' },
                { v: '28', l: 'edge regions' },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl border border-white/6 bg-white/[0.02] p-4 text-center">
                  <p className="font-display text-xl font-bold text-cyan-300">{s.v}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-lo">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
