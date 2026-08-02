import { useEffect, useState } from "react";
import { LiveDot } from "./ui";

/* ============================================================
   Cinematic Enterprise Telemetry HUD
   Provides an ultra-premium, fixed enterprise viewport frame
   with real-time FPS calculation, scroll velocity tracking,
   and SOC-2 security encryption status.
   ============================================================ */
export function CinematicHUD() {
  const [fps, setFps] = useState(60);
  const [timeStr, setTimeStr] = useState("00:00:00 UTC");
  const [scrollVel, setScrollVel] = useState(0);

  // Track FPS via RAF (counts frames only) + commit state at most once/second.
  // Previously setTimeStr fired every frame → ~60 re-renders/sec. Now ~1/sec.
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let rafId: number;

    function count(now: number) {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(Math.min(60, Math.round((frameCount * 1000) / (now - lastTime))));
        frameCount = 0;
        lastTime = now;
      }
      if (!document.hidden) rafId = requestAnimationFrame(count);
    }
    const onVisibility = () => {
      cancelAnimationFrame(rafId);
      if (!document.hidden) { lastTime = performance.now(); frameCount = 0; rafId = requestAnimationFrame(count); }
    };
    rafId = requestAnimationFrame(count);

    const clock = setInterval(() => setTimeStr(new Date().toISOString().slice(11, 19) + " UTC"), 1000);
    setTimeStr(new Date().toISOString().slice(11, 19) + " UTC");
    document.addEventListener("visibilitychange", onVisibility);
    return () => { cancelAnimationFrame(rafId); clearInterval(clock); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);

  // Track scroll velocity
  useEffect(() => {
    let lastY = window.scrollY;
    let lastT = performance.now();
    const interval = setInterval(() => {
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) {
        const vel = Math.abs(window.scrollY - lastY) / dt;
        setScrollVel(Number(vel.toFixed(2)));
        lastY = window.scrollY;
        lastT = now;
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[85] hidden select-none overflow-hidden xl:block" aria-hidden>
      {/* Top Left Corner Bracket */}
      <div className="absolute left-4 top-4 flex items-start gap-3">
        <div className="h-4 w-4 border-l-2 border-t-2 border-cyan-400/40" />
        <div className="flex flex-col gap-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-lo">
          <div className="flex items-center gap-1.5 text-cyan-300">
            <LiveDot className="scale-75" />
            <span>sys.core: online</span>
          </div>
          <span>enc: soc2_aes256 · {timeStr}</span>
        </div>
      </div>

      {/* Top Right Corner Bracket */}
      <div className="absolute right-4 top-4 flex items-start gap-3 text-right">
        <div className="flex flex-col gap-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-lo">
          <div className="flex items-center justify-end gap-1.5 text-hi">
            <span>render: {fps}.0 fps</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span>gl_pipeline: 0.38ms · dpr: 2.0</span>
        </div>
        <div className="h-4 w-4 border-r-2 border-t-2 border-cyan-400/40" />
      </div>

      {/* Bottom Left Corner Bracket */}
      <div className="absolute bottom-4 left-4 flex items-end gap-3">
        <div className="h-4 w-4 border-b-2 border-l-2 border-cyan-400/40" />
        <div className="flex flex-col gap-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-lo">
          <div className="flex items-center gap-2 text-cyan-400/80">
            <span>vel: {scrollVel} px/ms</span>
            <span className="h-2 w-px bg-cyan-400/60" />
            <span>state: {scrollVel > 0.8 ? "high_speed_warp" : "optimal_sync"}</span>
          </div>
          <span>geo: 37.7749° n, 122.4194° w</span>
        </div>
      </div>

      {/* Bottom Right Corner Bracket */}
      <div className="absolute bottom-4 right-16 flex items-end gap-3 text-right">
        <div className="flex flex-col gap-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-lo">
          <div className="flex items-center justify-end gap-1 text-amber-300/80">
            <span>telemetry stream</span>
            <span className="inline-block h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          </div>
          <span>node_id: sfo-04 · latency: 12ms</span>
        </div>
        <div className="h-4 w-4 border-b-2 border-r-2 border-cyan-400/40" />
      </div>

      {/* Subtle edge scan lines */}
      <div className="absolute left-0 top-1/4 h-1/2 w-[1px] bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent" />
      <div className="absolute right-0 top-1/3 h-1/3 w-[1px] bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent" />
    </div>
  );
}
