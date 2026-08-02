import { useEffect, useRef } from "react";

/* ============================================================================
   Confetti — canvas burst (MagicUI confetti pattern, self-contained).
   Fire on match wins / bracket advances / match ends. Unmounts itself after
   the burst. Reduced-motion: parent should skip firing (see useConfetti).
   ============================================================================ */

export function fireConfetti({
  particleCount = 160,
  spread = 70,
  origin = { x: 0.5, y: 0.6 },
  colors = ["#22d3ee", "#a5f3fc", "#fbbf24", "#34d399", "#fb7185"],
  zIndex = 200,
}: {
  particleCount?: number;
  spread?: number;
  origin?: { x: number; y: number };
  colors?: string[];
  zIndex?: number;
} = {}) {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = `position:fixed;inset:0;pointer-events:none;z-index:${zIndex}`;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;
  const W = canvas.width;
  const H = canvas.height;
  const ox = origin.x * W;
  const oy = origin.y * H;

  const parts = Array.from({ length: particleCount }, () => ({
    x: ox,
    y: oy,
    vx: (Math.random() - 0.5) * spread * 2,
    vy: -Math.random() * spread * 1.6 - 2,
    g: 0.14 + Math.random() * 0.08,
    w: 5 + Math.random() * 5,
    h: 6 + Math.random() * 8,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.25,
    color: colors[Math.floor(Math.random() * colors.length)],
    life: 1,
  }));

  let raf = 0;
  let start: number | null = null;
  const DURATION = 2600;

  function tick(now: number) {
    if (start === null) start = now;
    const elapsed = now - start;
    if (elapsed > DURATION) {
      canvas.remove();
      return;
    }
    ctx.clearRect(0, 0, W, H);
    for (const p of parts) {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life = 1 - elapsed / DURATION;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(raf);
    canvas.remove();
  };
}

/* Convenience: fire once, respects reduced motion. */
export function useConfetti() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (opts?: Parameters<typeof fireConfetti>[0]) => {
    if (reduced) return;
    fireConfetti(opts);
  };
}
