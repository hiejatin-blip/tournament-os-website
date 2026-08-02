import { useRef, lazy, Suspense } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { SectionHeading, Reveal, Stagger, StaggerItem } from "./ui";
import { Cpu, Network, Zap, Globe2 } from "lucide-react";

/* Lazy-load the WebGL scene: Three.js + R3F (~heaviest chunk) only executes
   when the section scrolls into view — cutting initial main-thread cost. */
const Scene3D = lazy(() => import("./Scene3D").then((m) => ({ default: m.Scene3D })));

function SceneFallback() {
  return (
    <div className="relative grid h-full w-full place-items-center rounded-3xl">
      <div className="h-40 w-40 rounded-full border border-cyan-400/20 bg-cyan-400/[0.03] animate-breathe" aria-hidden />
      <span className="sr-only">Loading interactive core visualization</span>
    </div>
  );
}

export function SystemCore() {
  const ref = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const sceneInView = useInView(sceneRef, { once: true, margin: "200px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateZ = useTransform(scrollYProgress, [0, 0.5, 1], [4, 0, -4]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1.02, 0.96]);

  const specs = [
    { icon: Cpu, label: "6-core orchestrator", value: "realtime" },
    { icon: Network, label: "Event-driven pipeline", value: "zero-copy" },
    { icon: Zap, label: "Sub-50ms latency", value: "~38ms" },
    { icon: Globe2, label: "Global edge network", value: "28 regions" },
  ];

  return (
    <section ref={ref} id="system" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.08),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-noise" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The engine"
          title={<>Built on a <span className="text-gradient-cyan">real-time</span> operating core.</>}
          description="Tournament OS runs on a purpose-built orchestration engine — event-driven, globally distributed, and engineered for the split-second demands of live competitive operations."
        />

        <motion.div
          style={{ rotateZ, scale }}
          className="relative mt-16 overflow-hidden rounded-[2rem] border border-white/8 bg-gradient-to-b from-void-800/50 to-void-900/70 elev-3 backdrop-blur-xl"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
          <div className="pointer-events-none absolute -left-20 top-1/2 h-[50vh] w-[50vh] -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="pointer-events-none absolute -right-20 top-1/2 h-[40vh] w-[40vh] -translate-y-1/2 rounded-full bg-amber-500/8 blur-[100px]" />

          <div className="grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-2">
            {/* 3D scene */}
            <Reveal rotate={8}>
              <div ref={sceneRef} className="relative mx-auto aspect-square w-full max-w-[520px]">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/15 via-transparent to-amber-500/10 blur-2xl" />
                {sceneInView ? (
                  <Suspense fallback={<SceneFallback />}>
                    <Scene3D className="relative h-full w-full" />
                  </Suspense>
                ) : (
                  <SceneFallback />
                )}
                {/* Corner HUD elements */}
                <div className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400/60">● core.active</div>
                <div className="pointer-events-none absolute right-4 top-4 font-mono text-[10px] text-lo">v4.2</div>
                <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[10px] text-lo">orbit.sync</div>
                <div className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-1.5 font-mono text-[10px] text-emerald-400/80">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />stable
                </div>
              </div>
            </Reveal>

            {/* Specs */}
            <Stagger className="space-y-3">
              {specs.map((s) => (
                <StaggerItem key={s.label}>
                  <div className="group flex items-center gap-4 rounded-2xl border border-white/6 bg-white/[0.02] p-4 transition-all duration-500 hover:-translate-x-1 hover:border-cyan-400/25 hover:bg-white/[0.04]">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-cyan-400/20 bg-cyan-400/5 text-cyan-300 transition-all duration-500 group-hover:glow-cyan group-hover:scale-105">
                      <s.icon className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-hi transition-colors group-hover:text-cyan-100">{s.label}</p>
                      <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-lo">{s.value}</p>
                    </div>
                    <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-400/80"><span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" />online</span>
                  </div>
                </StaggerItem>
              ))}
              <StaggerItem>
                <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/6 bg-gradient-to-r from-cyan-400/[0.06] to-transparent p-4">
                  <div>
                    <p className="text-sm font-semibold text-hi">SOC 2 · ISO 27001 ready</p>
                    <p className="mt-0.5 text-xs text-mid">Enterprise-grade security &amp; audit trails.</p>
                  </div>
                  <span className="rounded-md border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-300">verified</span>
                </div>
              </StaggerItem>
            </Stagger>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
