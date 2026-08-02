import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { VantaHalo } from "@/components/archive/VantaHalo";

/**
 * ============================================================================
 * NexusBoot — "Halo Convergence"
 * ============================================================================
 *
 * Direct redesign per explicit direction: no log terminal, no [OK]/[LOCK]
 * status panel — that entire layer is gone. Two things only:
 *
 *   1. VantaHalo at full, undimmed intensity — the same effect used on the
 *      Hero, but here it IS the whole boot visual, not a background layer
 *      competing with other UI. This mirrors how vantajs.com's own demo
 *      page presents the effect: bold, unobstructed, front and center.
 *
 *   2. A particle-text field, positioned above the Halo ring, where each
 *      point samples a pixel from an offscreen-rendered "TOURNAMENT OS"
 *      wordmark and converges into place — the letters assemble from
 *      scattered light rather than simply fading in as static text.
 *
 * DURATION: shorter than the old log-driven boot (2.4s vs 3.8s) since there
 * is no log copy to read — the visual doesn't need to hold the screen as
 * long to communicate the idea.
 */

const DURATION = 2400; // ms — total boot duration
const TAU = Math.PI * 2;
const rand = (n: number) => Math.random() * n;

interface TextParticle {
  tx: number; // target x (sampled from wordmark canvas)
  ty: number; // target y
  sx: number; // start (scattered) x
  sy: number; // start (scattered) y
  size: number;
  delay: number; // per-particle stagger so convergence isn't perfectly uniform
}

/**
 * Renders `text` to an offscreen canvas, reads pixel data, and returns an
 * array of {x,y} points wherever an opaque pixel was drawn — i.e. the
 * actual shape of the letters, sampled at a manageable density.
 */
function sampleTextPoints(text: string, canvasWidth: number, canvasHeight: number): { x: number; y: number }[] {
  const off = document.createElement("canvas");
  off.width = canvasWidth;
  off.height = canvasHeight;
  const ctx = off.getContext("2d");
  if (!ctx) return [];

  const fontSize = Math.min(canvasWidth / (text.length * 0.62), canvasHeight * 0.5);
  ctx.fillStyle = "#fff";
  ctx.font = `700 ${fontSize}px "Space Grotesk", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);

  const { data } = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const points: { x: number; y: number }[] = [];
  // Step size of 3 was measured to produce ~2,700+ particles at typical
  // hero-width text areas — far too many for smooth 60fps canvas draws
  // with per-particle shadowBlur (an expensive operation per call). A
  // step of 7 brings this down to a few hundred particles, which is
  // still dense enough to read clearly as letterforms while staying
  // well within a comfortable frame budget.
  const step = 7;

  for (let y = 0; y < canvasHeight; y += step) {
    for (let x = 0; x < canvasWidth; x += step) {
      const alpha = data[(y * canvasWidth + x) * 4 + 3];
      if (alpha > 128) points.push({ x, y });
    }
  }
  return points;
}

function TextConvergence({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<TextParticle[]>([]);
  const rafRef = useRef(0);
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const build = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Wordmark sits in the upper portion of the viewport, above where
      // Halo's own visual center/ring typically reads strongest.
      const textAreaW = Math.min(w * 0.86, 920);
      const textAreaH = Math.min(h * 0.22, 180);
      const points = sampleTextPoints("TOURNAMENT OS", textAreaW, textAreaH);

      const originX = w / 2 - textAreaW / 2;
      const originY = h * 0.22 - textAreaH / 2;

      particlesRef.current = points.map((p) => ({
        tx: originX + p.x,
        ty: originY + p.y,
        sx: rand(w),
        sy: rand(h * 0.6), // scatter across the upper portion, not full viewport
        size: 1.1 + rand(0.7),
        delay: rand(0.35), // 0–0.35 of total progress before this particle starts moving
      }));
      setReady(true);
    };

    build();
    window.addEventListener("resize", build);

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const p = progressRef.current;
      for (const particle of particlesRef.current) {
        // each particle has its own start delay so the convergence feels
        // organic rather than a single uniform snap
        const localP = Math.max(0, Math.min(1, (p - particle.delay) / (1 - particle.delay)));
        const eased = 1 - Math.pow(1 - localP, 3); // ease-out-cubic

        const x = particle.sx + (particle.tx - particle.sx) * eased;
        const y = particle.sy + (particle.ty - particle.sy) * eased;
        const brightness = 0.25 + eased * 0.75;

        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, TAU);
        ctx.fillStyle = `rgba(224,251,255,${brightness})`;
        if (eased > 0.6) {
          ctx.shadowColor = "rgba(34,211,238,0.9)";
          ctx.shadowBlur = 8 * eased;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", build);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[2]"
      style={{ opacity: ready ? 1 : 0, transition: "opacity 0.3s" }}
      aria-hidden
    />
  );
}

export function NexusBoot({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const shouldSkip = useRef(
    reduce ||
      (typeof sessionStorage !== "undefined" && sessionStorage.getItem("tos_nexus_boot_seen") === "1")
  );

  const [active, setActive] = useState(!shouldSkip.current);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(0);
  const startRef = useRef(0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem("tos_nexus_boot_seen", "1");
    } catch {
      /* ignore */
    }
    setActive(false);
    onDoneRef.current();
  }, []);

  // Tracked via ref (not read directly from state in the visibility handler)
  // because that handler is registered once inside a mount-only effect and
  // would otherwise close over progress's initial value (0) forever,
  // causing a visible jump back to the start on every tab-return instead
  // of a smooth resume from wherever the boot actually was.
  const progressRef = useRef(0);

  useEffect(() => {
    // Skip immediately if return visitor or reduced-motion — must also
    // flip `active` to false, or the fixed full-screen overlay stays
    // mounted (initial `active: true`) forever, silently blocking the
    // Hero underneath on every repeat visit.
    if (shouldSkip.current) {
      setActive(false);
      onDoneRef.current();
      return;
    }

    startRef.current = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - startRef.current) / DURATION);
      progressRef.current = p;
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(finish, 260); // brief hold at full convergence before exit
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    const handleVisibility = () => {
      if (document.hidden) cancelAnimationFrame(rafRef.current);
      else {
        // resume without losing elapsed time — reads the ref, which is
        // always current, not the stale state closure
        startRef.current = performance.now() - progressRef.current * DURATION;
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finish]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[200] bg-void-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.4, 0, 1, 1] } }}
        >
          {/* Halo at full, undimmed intensity — this IS the boot visual,
              not a dimmed background layer. Same component used on Hero,
              rendered here with nothing competing against it. */}
          <VantaHalo className="absolute inset-0 z-[1]" size={2.2} />

          {/* Particle-text convergence — "TOURNAMENT OS" assembles from
              scattered points of light, positioned above the Halo ring */}
          <TextConvergence progress={progress} />

          {/* Minimal identity mark, bottom corner only — no terminal, no
              status log, no percentage readout */}
          <motion.div
            className="pointer-events-none absolute bottom-8 left-1/2 z-[3] -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400/25"
            initial={{ opacity: 0 }}
            animate={{ opacity: progress > 0.92 ? 0 : 1 }}
            transition={{ duration: 0.4 }}
          >
            nexus boot sequence
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
