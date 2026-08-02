import { ease } from "@/shared/motion/motion-tokens";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Logo } from "../Logo";
import { LiveDot } from "../ui";

const WORD = "TOURNAMENT";

/* Real-time physics simulation rendered via canvas behind the letters.
   - Particles spawn from top, fall with gravity
   - Bounce off a virtual floor with energy loss
   - Shockwave rings expand where letters "land"
   - Trail particles follow each letter's descent */
function PhysicsCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const g = cv.getContext("2d"); if (!g) return;
    const C: HTMLCanvasElement = cv;
    const G: CanvasRenderingContext2D = g;
    let w = 0, h = 0, raf = 0;
    const particles: { x: number; y: number; vx: number; vy: number; life: number; size: number; color: string }[] = [];
    const shocks: { x: number; r: number; life: number }[] = [];

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const rect = C.parentElement!.getBoundingClientRect();
      w = rect.width; h = rect.height;
      C.width = Math.floor(w * dpr); C.height = Math.floor(h * dpr);
      C.style.width = `${w}px`; C.style.height = `${h}px`;
      G.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Spawn particles
    function spawn() {
      if (!active) return;
      // Falling rain
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: Math.random() * w, y: -10,
          vx: (Math.random() - 0.5) * 0.4,
          vy: 2 + Math.random() * 3,
          life: 1,
          size: Math.random() * 1.5 + 0.5,
          color: Math.random() > 0.5 ? "34,211,238" : "251,191,36",
        });
      }
      // Upward sparks from bottom center
      if (Math.random() < 0.3) {
        particles.push({
          x: w / 2 + (Math.random() - 0.5) * 200,
          y: h * 0.65,
          vx: (Math.random() - 0.5) * 2,
          vy: -1 - Math.random() * 3,
          life: 1,
          size: Math.random() * 2 + 1,
          color: "34,211,238",
        });
      }
    }

    function shock(x: number) { shocks.push({ x, r: 0, life: 1 }); }

    function tick() {
      G.clearRect(0, 0, w, h);
      spawn();
      // Particles with gravity
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += 0.12; // gravity
        p.vx *= 0.995; // air resistance
        p.x += p.vx; p.y += p.vy;
        p.life -= 0.008;
        // Floor bounce
        if (p.y > h - 5 && p.vy > 0) {
          p.vy *= -0.55;
          p.vx *= 0.7;
          if (Math.abs(p.vy) < 0.5) particles.splice(i, 1);
        }
        if (p.life <= 0 || p.x < 0 || p.x > w) { particles.splice(i, 1); continue; }
        G.fillStyle = `rgba(${p.color},${p.life * 0.8})`;
        G.beginPath(); G.arc(p.x, p.y, p.size, 0, Math.PI * 2); G.fill();
        // Trail
        if (Math.abs(p.vy) > 1) {
          G.strokeStyle = `rgba(${p.color},${p.life * 0.3})`;
          G.lineWidth = p.size * 0.6;
          G.beginPath(); G.moveTo(p.x, p.y); G.lineTo(p.x - p.vx * 3, p.y - p.vy * 3); G.stroke();
        }
      }
      // Shockwaves
      for (let i = shocks.length - 1; i >= 0; i--) {
        const s = shocks[i];
        s.r += 4; s.life -= 0.02;
        if (s.life <= 0) { shocks.splice(i, 1); continue; }
        G.strokeStyle = `rgba(34,211,238,${s.life * 0.6})`;
        G.lineWidth = 1.5;
        G.beginPath(); G.arc(s.x, h * 0.6, s.r, 0, Math.PI * 2); G.stroke();
      }
      raf = requestAnimationFrame(tick);
    }

    resize();
    if (active) tick();
    const ro = new ResizeObserver(resize);
    ro.observe(C.parentElement!);
    // Emit a shockwave every time a letter lands
    const shockInt = setInterval(() => {
      shock(w / 2 + (Math.random() - 0.5) * w * 0.5);
    }, 110);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); clearInterval(shockInt); };
  }, [active]);
  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden />;
}

/* Physics letter — falls from top with spring bounce on landing */
function PhysLetter({ char, i, animate: anim }: { char: string; i: number; animate: boolean }) {
  const y = useMotionValue(-200);
  const rotate = useMotionValue(0);
  const translateY = useTransform(y, (v) => `${v}px`);
  const rotZ = useTransform(rotate, (v) => `${v}deg`);

  useEffect(() => {
    if (!anim) return;
    const delay = 0.08 + i * 0.055;
    // Multi-stage keyframe simulating gravity + bounce + settle
    const controls = animate(y, [-200, 15, -8, 3, 0], {
      duration: 1.3,
      delay,
      times: [0, 0.65, 0.8, 0.92, 1],
      ease: ease.emphasized,
    });
    const rot = animate(rotate, [-25 + i * 2, 4, -2, 1, 0], {
      duration: 1.3,
      delay,
      times: [0, 0.65, 0.8, 0.92, 1],
      ease: ease.emphasized,
    });
    return () => { controls.stop(); rot.stop(); };
  }, [anim, i, y, rotate]);

  return (
    <motion.span className="relative inline-block" style={{ y: translateY, rotateZ: rotZ }}>
      {/* Letter glow */}
      <motion.span
        className="absolute inset-0 blur-xl"
        initial={{ opacity: 0 }}
        animate={anim ? { opacity: [0, 0.8, 0.4] } : undefined}
        transition={{ duration: 1, delay: 0.3 + i * 0.055 }}
        aria-hidden
      >
        <span className="text-cyan-400">{char}</span>
      </motion.span>
      <span className="relative block text-gradient-cyan">{char}</span>
    </motion.span>
  );
}

export function Preloader() {
  const seen = typeof sessionStorage !== "undefined" && sessionStorage.getItem("tos_intro_seen") === "1";
  const [visible, setVisible] = useState(!seen);
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0);
  useEffect(() => {
    if (seen) return;
    const timers = [
      setTimeout(() => setPhase(1), 120),   // letters begin falling
      setTimeout(() => setPhase(2), 1700),  // OS appears
      setTimeout(() => setPhase(3), 2300),  // tagline
      setTimeout(() => setPhase(4), 2900),  // burst + reveal
      setTimeout(() => { setVisible(false); try { sessionStorage.setItem("tos_intro_seen", "1"); } catch {} }, 3800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [seen]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div key="pre" className="fixed inset-0 z-[100] overflow-hidden bg-void-950" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
          {/* Background grid + ambient */}
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="pointer-events-none absolute inset-0 bg-noise" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="pointer-events-none absolute left-1/4 top-1/3 h-[40vh] w-[40vh] rounded-full bg-amber-500/8 blur-[100px]" />

          {/* Physics particle canvas */}
          <PhysicsCanvas active={phase >= 1 && phase < 4} />

          <div className="relative flex h-full w-full flex-col items-center justify-center px-6">
            {/* Status badge */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10 inline-flex items-center gap-2 rounded-full glass px-3 py-1.5">
              <LiveDot /><span className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">booting core systems</span>
            </motion.div>

            {/* Physics-falling wordmark */}
            <div className="select-none text-center">
              <div className="flex justify-center">
                <h1 className="font-display text-[13vw] font-bold leading-[0.88] tracking-tighter text-hi sm:text-[9vw]">
                  {WORD.split("").map((ch, i) => (
                    <PhysLetter key={i} char={ch} i={i} animate={phase >= 1} />
                  ))}
                </h1>
              </div>

              {/* OS + divider */}
              <motion.div className="mt-4 flex items-center justify-center gap-5" initial={{ opacity: 0, scale: 0.8 }} animate={phase >= 2 ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8, ease: ease.emphasized }}>
                <motion.span initial={{ scaleX: 0 }} animate={phase >= 2 ? { scaleX: 1 } : {}} transition={{ delay: 0.1, duration: 0.6 }} className="h-px w-14 origin-right bg-gradient-to-r from-transparent via-cyan-400 to-cyan-400" />
                <span className="font-display text-[7vw] font-bold tracking-tight text-gradient-cyan sm:text-[4.5vw]">OS</span>
                <motion.span initial={{ scaleX: 0 }} animate={phase >= 2 ? { scaleX: 1 } : {}} transition={{ delay: 0.1, duration: 0.6 }} className="h-px w-14 origin-left bg-gradient-to-l from-transparent via-cyan-400 to-cyan-400" />
              </motion.div>

              {/* Tagline */}
              <motion.p className="mt-8 font-mono text-[11px] uppercase tracking-[0.28em] text-mid" initial={{ opacity: 0, y: 10 }} animate={phase >= 3 ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15, duration: 0.6 }}>
                The operating system · for competitive tournaments
              </motion.p>
            </div>

            {/* Bottom progress */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="absolute bottom-14 left-1/2 w-64 -translate-x-1/2">
              <div className="h-px w-full overflow-hidden bg-white/8">
                <motion.div initial={{ x: "-100%" }} animate={{ x: phase >= 4 ? "0%" : "-10%" }} transition={{ duration: phase >= 4 ? 0.5 : 2.4, ease: ease.emphasized }} className="h-full w-full bg-gradient-to-r from-cyan-500 via-cyan-300 to-amber-400" />
              </div>
              <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-lo">
                <span>{phase < 4 ? "initializing" : "system ready"}</span>
                <span className="tabular-nums">{Math.min(100, Math.round(phase * 25))}%</span>
              </div>
            </motion.div>

            {/* Particle burst on final reveal */}
            {phase >= 4 && (
              <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                {Array.from({ length: 60 }, (_, i) => {
                  const a = (i / 60) * Math.PI * 2;
                  const d = 250 + Math.random() * 350;
                  const isAmber = Math.random() > 0.75;
                  return (
                    <motion.span key={i} className="absolute block rounded-full" style={{ width: 3 + Math.random() * 5, height: 3 + Math.random() * 5, backgroundColor: isAmber ? "#fbbf24" : "#22d3ee", boxShadow: `0 0 14px ${isAmber ? "rgba(251,191,36,0.8)" : "rgba(34,211,238,0.9)"}` }}
                      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                      animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d, opacity: [0, 1, 0], scale: [0, 1.2, 0.1] }}
                      transition={{ duration: 1.5, delay: Math.random() * 0.2, ease: ease.emphasized }}
                    />
                  );
                })}
                {/* Shockwave ring */}
                <motion.div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-400"
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 8, opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
            )}

            <motion.div className="absolute left-6 top-6 sm:left-10 sm:top-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}><Logo showText={false} /></motion.div>
            <motion.div className="absolute right-6 top-6 font-mono text-[10px] uppercase tracking-[0.2em] text-lo sm:right-10 sm:top-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <span className="text-cyan-400">●</span> v4.2 · 2026
            </motion.div>
          </div>

          {/* Radial reveal wipe at the end */}
          <motion.div className="pointer-events-none absolute inset-0"
            style={{
              clipPath: phase >= 4 ? "circle(160% at 50% 50%)" : "circle(0% at 50% 50%)",
              transition: "clip-path 1s cubic-bezier(0.16, 1, 0.3, 1)",
              background: "radial-gradient(circle at 50% 50%, rgba(34,211,238,0.15), rgba(251,191,36,0.06) 40%, transparent 70%)",
            }}
            aria-hidden
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}