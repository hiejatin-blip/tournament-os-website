import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// Aurora has been removed from this module — the new background system uses:
// - PipelineCanvas (src/components/backgrounds/PipelineCanvas.tsx) for Hero/Dashboard/Boot
// - VantaGlobe (src/components/backgrounds/VantaGlobe.tsx) for Explore directories
// - Static radial gradients (inline) for Marketing and Profile pages

export function ParticleField({ className, density = 0.00008, color = "34,211,238", linkColor = "34,211,238", interactive = true }: {
  className?: string; density?: number; color?: string; linkColor?: string; interactive?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const g = cv.getContext("2d"); if (!g) return;
    const C: HTMLCanvasElement = cv; const G: CanvasRenderingContext2D = g;
    const parent = C.parentElement;
    let w = 0, h = 0, raf = 0;
    let particles: { x: number; y: number; vx: number; vy: number; r: number; ox: number; oy: number }[] = [];
    const LINK = 140;
    let mouseX = -1000;
    let mouseY = -1000;

    function onMouseMove(e: MouseEvent) {
      if (!interactive) return;
      const rect = C.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }
    function onMouseLeave() {
      mouseX = -1000;
      mouseY = -1000;
    }

    if (interactive && parent) {
      parent.addEventListener("mousemove", onMouseMove);
      parent.addEventListener("mouseleave", onMouseLeave);
    }

    function init() {
      particles = Array.from({ length: Math.min(130, Math.max(30, Math.floor(w * h * density))) }, () => {
        const x = Math.random() * w;
        const y = Math.random() * h;
        return {
          x, y,
          ox: x, oy: y,
          vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.8 + 0.4,
        };
      });
    }
    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const rect = parent ? parent.getBoundingClientRect() : { width: innerWidth, height: innerHeight };
      w = rect.width; h = rect.height;
      C.width = Math.floor(w * dpr); C.height = Math.floor(h * dpr);
      C.style.width = `${w}px`; C.style.height = `${h}px`;
      G.setTransform(dpr, 0, 0, dpr, 0, 0); init();
    }
    function render() {
      G.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const d = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
          if (d < LINK * LINK) {
            G.strokeStyle = `rgba(${linkColor},${(1 - Math.sqrt(d) / LINK) * 0.16})`;
            G.lineWidth = 0.6; G.beginPath(); G.moveTo(a.x, a.y); G.lineTo(b.x, b.y); G.stroke();
          }
        }
        // Connect to mouse if close
        if (interactive && mouseX > -500) {
          const md = (particles[i].x - mouseX) ** 2 + (particles[i].y - mouseY) ** 2;
          if (md < 180 * 180) {
            G.strokeStyle = `rgba(${color},${(1 - Math.sqrt(md) / 180) * 0.35})`;
            G.lineWidth = 1;
            G.beginPath(); G.moveTo(particles[i].x, particles[i].y); G.lineTo(mouseX, mouseY); G.stroke();
          }
        }
      }
      for (const p of particles) {
        G.fillStyle = `rgba(${color},0.75)`; G.beginPath(); G.arc(p.x, p.y, p.r, 0, Math.PI * 2); G.fill();
      }
    }
    function tick() {
      for (const p of particles) {
        // Mouse repulsion physics
        if (interactive && mouseX > -500) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.hypot(dx, dy);
          if (dist < 130 && dist > 0) {
            const force = (130 - dist) / 130;
            p.vx += (dx / dist) * force * 0.6;
            p.vy += (dy / dist) * force * 0.6;
          }
        }
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.99; p.vy *= 0.99;
        if (Math.abs(p.vx) < 0.1) p.vx += (Math.random() - 0.5) * 0.1;
        if (Math.abs(p.vy) < 0.1) p.vy += (Math.random() - 0.5) * 0.1;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      render();
      if (!document.hidden) raf = requestAnimationFrame(tick);
    }
    // Pause the simulation on hidden tabs; resume on return (saves CPU/battery).
    const onVisibility = () => {
      if (reduce) return;
      if (document.hidden) { cancelAnimationFrame(raf); }
      else { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); }
    };
    resize();
    if (reduce) render(); else tick();
    document.addEventListener("visibilitychange", onVisibility);
    const ro = new ResizeObserver(resize);
    if (parent) ro.observe(parent);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (interactive && parent) {
        parent.removeEventListener("mousemove", onMouseMove);
        parent.removeEventListener("mouseleave", onMouseLeave);
      }
    };
  }, [density, color, linkColor, interactive, reduce]);
  return <canvas ref={canvasRef} className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} aria-hidden />;
}

export function GridFloor({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-x-0 bottom-0 h-[45vh] [perspective:500px]", className)} aria-hidden>
      <div className="absolute inset-0 origin-bottom [transform:rotateX(72deg)] bg-grid-fine opacity-60 mask-fade-b" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
    </div>
  );
}

/* ============================================================
   Scroll-Velocity Optical Warp Lines
   Renders vertical laser streaks that stretch and accelerate
   with real-time scroll velocity, creating a warp speed effect.
   ============================================================ */
export function ScrollSpeedLines() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    let w = window.innerWidth;
    let h = window.innerHeight;
    let rafId: number;
    let lastY = window.scrollY;
    let scrollVelocity = 0;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      cv!.width = w;
      cv!.height = h;
    }
    resize();

    const lines = Array.from({ length: 45 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      len: 20 + Math.random() * 60,
      speed: 1.5 + Math.random() * 3,
      alpha: Math.random() * 0.4,
    }));

    function tick() {
      const curY = window.scrollY;
      const delta = curY - lastY;
      lastY = curY;
      scrollVelocity = scrollVelocity * 0.88 + delta * 0.12;

      ctx!.clearRect(0, 0, w, h);
      const absVel = Math.abs(scrollVelocity);

      if (absVel > 0.5) {
        lines.forEach((line) => {
          line.y += line.speed * (scrollVelocity > 0 ? -1 : 1) * Math.min(absVel * 0.8, 6);
          if (line.y < -100) { line.y = h + 100; line.x = Math.random() * w; }
          if (line.y > h + 100) { line.y = -100; line.x = Math.random() * w; }

          const stretch = Math.min(absVel * 8, 140);
          const alpha = Math.min(line.alpha * (absVel * 0.35), 0.6);

          const grad = ctx!.createLinearGradient(line.x, line.y, line.x, line.y + stretch);
          grad.addColorStop(0, "rgba(34,211,238,0)");
          grad.addColorStop(0.5, `rgba(34,211,238,${alpha})`);
          grad.addColorStop(1, "rgba(34,211,238,0)");

          ctx!.strokeStyle = grad;
          ctx!.lineWidth = 1 + Math.random() * 0.8;
          ctx!.beginPath();
          ctx!.moveTo(line.x, line.y);
          ctx!.lineTo(line.x, line.y + stretch);
          ctx!.stroke();
        });
      }

      if (!document.hidden) rafId = requestAnimationFrame(tick);
    }
    const onVisibility = () => {
      cancelAnimationFrame(rafId);
      if (!document.hidden) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce]);

  if (reduce) return null;

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[70] h-full w-full opacity-70" aria-hidden />;
}
