import { useEffect, useRef } from "react";

// ─── Math helpers (module-level, no imports needed) ──────────────────────────
const TO_RAD = Math.PI / 180;
const HALF_PI = Math.PI / 2;
const TAU = Math.PI * 2;
const rand = (n: number): number => Math.random() * n;
const round = (n: number): number => Math.round(n);
const cos = (n: number): number => Math.cos(n);
const sin = (n: number): number => Math.sin(n);
/** Triangle wave — rises 0→1 in first half of life, falls 1→0 in second half */
const fadeInOut = (t: number, m: number): number => {
  const hm = 0.5 * m;
  return Math.abs(((t + hm) % m) - hm) / hm;
};

// Pipe Float32Array layout: [x, y, direction, speed, life, ttl, width, hue]
const PROP_COUNT = 8;
const IDX_X = 0;
const IDX_Y = 1;
const IDX_DIR = 2;
const IDX_SPD = 3;
const IDX_LIFE = 4;
const IDX_TTL = 5;
const IDX_W = 6;
const IDX_HUE = 7;

const turnCount = 8;
const turnAmount = (360 / turnCount) * TO_RAD;
const turnChanceRange = 58;
const baseSpeed = 0.5;
const rangeSpeed = 1;
const baseTTL = 100;
const rangeTTL = 300;
const baseWidth = 2;
const rangeWidth = 4;

// ─── Variant config ───────────────────────────────────────────────────────────
interface VariantConfig {
  pipeCount: number;
  opacityMult: number;
  bgFill: string;
  blur: number;
  baseHue: number;
  rangeHue: number;
}

const VARIANT_CONFIGS: Record<PipelineVariant, VariantConfig> = {
  boot: {
    pipeCount: 30,
    opacityMult: 0.125,
    bgFill: "hsla(150,80%,1%,1)",
    blur: 12,
    baseHue: 180,
    rangeHue: 60,
  },
  hero: {
    pipeCount: 18,
    opacityMult: 0.055,
    bgFill: "hsla(150,80%,1%,0.18)",
    blur: 8,
    baseHue: 185,
    rangeHue: 40,
  },
  dashboard: {
    pipeCount: 14,
    opacityMult: 0.04,
    bgFill: "hsla(150,80%,1%,0.08)",
    blur: 6,
    baseHue: 190,
    rangeHue: 30,
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────
export type PipelineVariant = "boot" | "hero" | "dashboard";

interface PipelineCanvasProps {
  variant: PipelineVariant;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function PipelineCanvas({ variant, className }: PipelineCanvasProps) {
  const canvasBRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Skip on reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Skip on mobile (CPU protection)
    if (window.innerWidth < 480) return;

    const cfg = VARIANT_CONFIGS[variant];
    const { pipeCount, opacityMult, bgFill, blur, baseHue, rangeHue } = cfg;
    const propsLen = pipeCount * PROP_COUNT;

    const canvasB = canvasBRef.current;
    if (!canvasB) return;

    // Offscreen buffer (never appended to DOM)
    const canvasA = document.createElement("canvas");
    const ctxA = canvasA.getContext("2d");
    const ctxB = canvasB.getContext("2d");
    if (!ctxA || !ctxB) return;

    // Capture non-null references for use inside nested function closures.
    // TypeScript does not narrow across function boundaries, so we pin them here.
    const A: CanvasRenderingContext2D = ctxA;
    const B: CanvasRenderingContext2D = ctxB;
    const CB: HTMLCanvasElement = canvasB;

    const pipeProps = new Float32Array(propsLen);
    let center: [number, number] = [0, 0];
    let tick = 0;
    let rafId = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvasA.width = Math.floor(w * dpr);
      canvasA.height = Math.floor(h * dpr);
      CB.width = Math.floor(w * dpr);
      CB.height = Math.floor(h * dpr);
      canvasA.style.width = `${w}px`;
      canvasA.style.height = `${h}px`;
      CB.style.width = `${w}px`;
      CB.style.height = `${h}px`;

      A.setTransform(dpr, 0, 0, dpr, 0, 0);
      B.setTransform(dpr, 0, 0, dpr, 0, 0);

      center = [w / 2, h / 2];
      initPipes();
    }

    function initPipe(i: number) {
      const w = window.innerWidth;
      const x = rand(w);
      const y = center[1];
      const direction = round(rand(1)) ? HALF_PI : TAU - HALF_PI;
      const speed = baseSpeed + rand(rangeSpeed);
      const life = 0;
      const ttl = baseTTL + rand(rangeTTL);
      const width = baseWidth + rand(rangeWidth);
      const hue = baseHue + rand(rangeHue);
      const base = i * PROP_COUNT;
      pipeProps[base + IDX_X] = x;
      pipeProps[base + IDX_Y] = y;
      pipeProps[base + IDX_DIR] = direction;
      pipeProps[base + IDX_SPD] = speed;
      pipeProps[base + IDX_LIFE] = life;
      pipeProps[base + IDX_TTL] = ttl;
      pipeProps[base + IDX_W] = width;
      pipeProps[base + IDX_HUE] = hue;
    }

    function initPipes() {
      for (let i = 0; i < pipeCount; i++) initPipe(i);
    }

    function checkBounds(x: number, y: number, i: number) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const base = i * PROP_COUNT;
      if (x > w) pipeProps[base + IDX_X] = 0;
      else if (x < 0) pipeProps[base + IDX_X] = w;
      if (y > h) pipeProps[base + IDX_Y] = 0;
      else if (y < 0) pipeProps[base + IDX_Y] = h;
    }

    function drawPipe(x: number, y: number, life: number, ttl: number, width: number, hue: number) {
      A.strokeStyle = `hsla(${hue},75%,50%,${fadeInOut(life, ttl) * opacityMult})`;
      A.beginPath();
      A.arc(x, y, width, 0, TAU);
      A.stroke();
      A.closePath();
    }

    function updatePipe(i: number) {
      const base = i * PROP_COUNT;
      let x = pipeProps[base + IDX_X];
      let y = pipeProps[base + IDX_Y];
      let direction = pipeProps[base + IDX_DIR];
      const speed = pipeProps[base + IDX_SPD];
      let life = pipeProps[base + IDX_LIFE];
      const ttl = pipeProps[base + IDX_TTL];
      const width = pipeProps[base + IDX_W];
      const hue = pipeProps[base + IDX_HUE];

      drawPipe(x, y, life, ttl, width, hue);

      life++;
      x += cos(direction) * speed;
      y += sin(direction) * speed;

      const turnChance =
        !(tick % round(rand(turnChanceRange))) &&
        (!(round(x) % 6) || !(round(y) % 6));
      const turnBias = round(rand(1)) ? -1 : 1;
      direction += turnChance ? turnAmount * turnBias : 0;

      checkBounds(x, y, i);

      pipeProps[base + IDX_X] = x;
      pipeProps[base + IDX_Y] = y;
      pipeProps[base + IDX_DIR] = direction;
      pipeProps[base + IDX_LIFE] = life;

      if (life > ttl) initPipe(i);
    }

    function updatePipes() {
      for (let i = 0; i < pipeCount; i++) updatePipe(i);
    }

    function render() {
      const w = window.innerWidth;
      const h = window.innerHeight;

      // Fill display canvas with background color (logical coords — B's transform handles dpr)
      B.fillStyle = bgFill;
      B.fillRect(0, 0, w, h);

      // canvasA is a raw pixel bitmap at (w*dpr) x (h*dpr) physical pixels.
      // When used as a drawImage SOURCE its own transform does not apply —
      // only its actual pixel buffer size matters. Reset B's transform to
      // identity and draw using explicit physical pixel dimensions on both
      // source and destination so the bitmap maps 1:1 with no double-scaling.
      B.save();
      B.setTransform(1, 0, 0, 1, 0, 0);

      B.filter = `blur(${blur}px)`;
      B.drawImage(canvasA, 0, 0, canvasA.width, canvasA.height, 0, 0, CB.width, CB.height);
      B.filter = "none";

      // Sharp pass on top — creates glow effect
      B.drawImage(canvasA, 0, 0, canvasA.width, canvasA.height, 0, 0, CB.width, CB.height);

      B.restore();
    }

    function frame() {
      tick++;
      updatePipes();
      render();
      if (!document.hidden) {
        rafId = requestAnimationFrame(frame);
      }
    }

    function onVisibility() {
      cancelAnimationFrame(rafId);
      if (!document.hidden) rafId = requestAnimationFrame(frame);
    }

    resize();
    rafId = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [variant]); // eslint-disable-line react-hooks/exhaustive-deps

  const posStyle: React.CSSProperties =
    variant === "hero"
      ? { position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }
      : { position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" };

  return (
    <canvas
      ref={canvasBRef}
      aria-hidden
      className={className}
      style={posStyle}
    />
  );
}

export type { PipelineCanvasProps };
