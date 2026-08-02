import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Swords, Trophy, Zap, CheckCircle2 } from "lucide-react";
import { SectionHeading, Button, Reveal, LiveDot, MonoLabel } from "./ui";
import { cn } from "@/lib/utils";

interface Team {
  id: number;
  name: string;
  seed: number;
  color: string;
  alive: boolean;
  score: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

const TEAMS_DATA = [
  { name: "VANTA Black", seed: 1, color: "#22d3ee" },
  { name: "Helix Apex", seed: 2, color: "#38bdf8" },
  { name: "Nexus Prime", seed: 3, color: "#06b6d4" },
  { name: "Orbit.gg", seed: 4, color: "#fbbf24" },
  { name: "Pulse Arena", seed: 5, color: "#f59e0b" },
  { name: "Strata Core", seed: 6, color: "#10b981" },
  { name: "Meridian", seed: 7, color: "#34d399" },
  { name: "Vanguard", seed: 8, color: "#a5f3fc" },
];

export function InteractiveSim() {
  const [running, setRunning] = useState(false);
  const [round, setRound] = useState<"IDLE" | "QF" | "SF" | "FINAL" | "CHAMPION">("IDLE");
  const [champion, setChampion] = useState<string | null>(null);
  const [logFeed, setLogFeed] = useState<string[]>(["[sys.ready] Arena physics simulation engine online."]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const teamsRef = useRef<Team[]>([]);
  const explosionsRef = useRef<{ x: number; y: number; vx: number; vy: number; color: string; life: number }[]>([]);

  // Add line to log
  function addLog(msg: string) {
    setLogFeed((prev) => [msg, ...prev.slice(0, 7)]);
  }

  // Initialize teams
  function initSimulation() {
    setRunning(true);
    setRound("QF");
    setChampion(null);
    addLog("[sim.start] Spawning 8 elite organizations into physics arena...");
    
    const cv = canvasRef.current;
    const w = cv ? cv.width / (window.devicePixelRatio || 1) : 600;
    const h = cv ? cv.height / (window.devicePixelRatio || 1) : 400;

    teamsRef.current = TEAMS_DATA.map((t, i) => {
      const angle = (i / TEAMS_DATA.length) * Math.PI * 2;
      const dist = 140;
      return {
        id: i,
        name: t.name,
        seed: t.seed,
        color: t.color,
        alive: true,
        score: 0,
        x: w / 2 + Math.cos(angle) * dist,
        y: h / 2 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        radius: 22,
      };
    });

    explosionsRef.current = [];
  }

  // Trigger explosions
  function explode(x: number, y: number, color: string) {
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4;
      explosionsRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        life: 1,
      });
    }
  }

  // Advance tournament rounds
  useEffect(() => {
    if (!running) return;
    const qfTimer = setTimeout(() => {
      // QF -> SF: Eliminate 4 teams
      const alive = teamsRef.current.filter((t) => t.alive);
      for (let i = 0; i < 4; i++) {
        const target = alive[i * 2 + 1] || alive[i * 2];
        if (target) {
          target.alive = false;
          explode(target.x, target.y, "#f43f5e");
          addLog(`[match.qf] ${target.name} eliminated! Score: 1 - 2`);
        }
      }
      setRound("SF");
    }, 2800);

    const sfTimer = setTimeout(() => {
      // SF -> FINAL: Eliminate 2 teams
      const alive = teamsRef.current.filter((t) => t.alive);
      for (let i = 0; i < 2; i++) {
        const target = alive[i * 2 + 1] || alive[i * 2];
        if (target) {
          target.alive = false;
          explode(target.x, target.y, "#f43f5e");
          addLog(`[match.sf] ${target.name} eliminated in Semifinals!`);
        }
      }
      setRound("FINAL");
    }, 5600);

    const finalTimer = setTimeout(() => {
      // FINAL -> CHAMPION
      const alive = teamsRef.current.filter((t) => t.alive);
      if (alive.length > 1) {
        const runnerUp = alive[1];
        runnerUp.alive = false;
        explode(runnerUp.x, runnerUp.y, "#fbbf24");
        addLog(`[match.final] ${runnerUp.name} defeated in Grand Final!`);
      }
      const champ = teamsRef.current.find((t) => t.alive);
      if (champ) {
        setChampion(champ.name);
        setRound("CHAMPION");
        addLog(`[sim.victory] 🏆 ${champ.name} crowned Grand Champion!`);
        explode(champ.x, champ.y, "#22d3ee");
        explode(champ.x + 20, champ.y - 20, "#fbbf24");
      }
      setRunning(false);
    }, 8400);

    return () => {
      clearTimeout(qfTimer);
      clearTimeout(sfTimer);
      clearTimeout(finalTimer);
    };
  }, [running]);

  // Canvas Physics Render Loop
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    let rafId: number;
    let w = 0;
    let h = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = cv!.parentElement!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      cv!.width = Math.floor(w * dpr);
      cv!.height = Math.floor(h * dpr);
      cv!.style.width = `${w}px`;
      cv!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    function updatePhysics() {
      ctx!.clearRect(0, 0, w, h);

      // Draw center trophy arena target
      ctx!.strokeStyle = "rgba(34,211,238,0.08)";
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.arc(w / 2, h / 2, 130, 0, Math.PI * 2);
      ctx!.stroke();

      ctx!.beginPath();
      ctx!.arc(w / 2, h / 2, 60, 0, Math.PI * 2);
      ctx!.stroke();

      // Draw match connection lines between alive teams
      const aliveTeams = teamsRef.current.filter((t) => t.alive);
      for (let i = 0; i < aliveTeams.length; i++) {
        for (let j = i + 1; j < aliveTeams.length; j++) {
          const t1 = aliveTeams[i];
          const t2 = aliveTeams[j];
          const dist = Math.hypot(t1.x - t2.x, t1.y - t2.y);
          if (dist < 220) {
            ctx!.strokeStyle = `rgba(34, 211, 238, ${(1 - dist / 220) * 0.25})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(t1.x, t1.y);
            ctx!.lineTo(t2.x, t2.y);
            ctx!.stroke();
          }
        }
      }

      // Update & render teams
      teamsRef.current.forEach((t) => {
        if (!t.alive) return;

        // Attract toward center arena slightly
        const dx = w / 2 - t.x;
        const dy = h / 2 - t.y;
        t.vx += dx * 0.0004;
        t.vy += dy * 0.0004;

        // Add movement
        t.x += t.vx;
        t.y += t.vy;

        // Wall collisions
        if (t.x < t.radius) { t.x = t.radius; t.vx *= -0.8; }
        if (t.x > w - t.radius) { t.x = w - t.radius; t.vx *= -0.8; }
        if (t.y < t.radius) { t.y = t.radius; t.vy *= -0.8; }
        if (t.y > h - t.radius) { t.y = h - t.radius; t.vy *= -0.8; }

        // Team collisions
        teamsRef.current.forEach((other) => {
          if (t.id === other.id || !other.alive) return;
          const odx = other.x - t.x;
          const ody = other.y - t.y;
          const odist = Math.hypot(odx, ody);
          const minD = t.radius + other.radius;
          if (odist < minD && odist > 0) {
            const overlap = minD - odist;
            const nx = odx / odist;
            const ny = ody / odist;
            t.x -= nx * overlap * 0.5;
            t.y -= ny * overlap * 0.5;
            other.x += nx * overlap * 0.5;
            other.y += ny * overlap * 0.5;
            // Elastic bounce
            const k = t.vx * nx + t.vy * ny - (other.vx * nx + other.vy * ny);
            t.vx -= k * nx * 0.8;
            t.vy -= k * ny * 0.8;
            other.vx += k * nx * 0.8;
            other.vy += k * ny * 0.8;
          }
        });

        // Render team capsule node
        ctx!.fillStyle = t.color;
        ctx!.shadowColor = t.color;
        ctx!.shadowBlur = 15;
        ctx!.beginPath();
        ctx!.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.shadowBlur = 0;

        // Team seed label
        ctx!.fillStyle = "#030308";
        ctx!.font = "bold 11px JetBrains Mono, monospace";
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.fillText(`#${t.seed}`, t.x, t.y);

        // Name tag below
        ctx!.fillStyle = "#f0f0f8";
        ctx!.font = "10px Inter, sans-serif";
        ctx!.fillText(t.name.split(" ")[0], t.x, t.y + t.radius + 12);
      });

      // Update & render explosions
      for (let i = explosionsRef.current.length - 1; i >= 0; i--) {
        const p = explosionsRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life -= 0.025;
        if (p.life <= 0) {
          explosionsRef.current.splice(i, 1);
          continue;
        }
        ctx!.fillStyle = p.color;
        ctx!.globalAlpha = p.life;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.life * 3.5, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(updatePhysics);
    }
    rafId = requestAnimationFrame(updatePhysics);

    const ro = new ResizeObserver(resize);
    ro.observe(cv.parentElement!);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <section id="simulator" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.06),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Interactive AI Arena"
          title={<>Live Tournament <span className="text-gradient-cyan">Physics Sandbox.</span></>}
          description="Click below to spawn 8 competitive organizations into a live real-time physics simulation. Watch Tournament OS automatically orchestrate collisions, match resolutions, and bracket progression on the fly."
        />

        <Reveal className="mt-14" rotate={4}>
          <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-void-900/80 elev-3 backdrop-blur-2xl lg:grid-cols-[1fr_320px]">
            {/* Left Canvas Arena */}
            <div className="relative min-h-[440px] w-full border-b border-white/8 lg:border-b-0 lg:border-r">
              <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full glass px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan-300">
                <LiveDot />
                <span>physics arena · 60 fps gl</span>
              </div>

              {/* Tournament State Badge */}
              <div className="absolute right-4 top-4 z-10 rounded-lg border border-white/10 bg-void-950/80 px-3 py-1 font-mono text-xs text-hi">
                ROUND: <span className="font-bold text-cyan-400">{round}</span>
              </div>

              <canvas ref={canvasRef} className="absolute inset-0 h-full w-full cursor-crosshair" />

              {/* Champion overlay */}
              <AnimatePresence>
                {champion && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-void-950/85 backdrop-blur-md"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="grid h-20 w-20 place-items-center rounded-2xl border border-amber-400/40 bg-amber-400/10 glow-amber"
                    >
                      <Trophy className="h-10 w-10 text-amber-400" />
                    </motion.div>
                    <span className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-amber-300">
                      tournament champion
                    </span>
                    <h3 className="mt-2 font-display text-3xl font-bold text-hi sm:text-4xl">{champion}</h3>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Control Surface & Live Stream */}
            <div className="flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between border-b border-white/8 pb-4">
                  <div className="flex items-center gap-2">
                    <Swords className="h-4 w-4 text-cyan-400" />
                    <span className="font-display text-sm font-semibold text-hi">Live Match Surface</span>
                  </div>
                  <MonoLabel className="text-[9px]">v4.2 engine</MonoLabel>
                </div>

                {/* Automation Log Stream */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-lo">
                    <Zap className="h-3 w-3 text-cyan-400" />
                    <span>Orchestration Telemetry Feed</span>
                  </div>
                  <div className="h-48 space-y-1.5 overflow-y-auto rounded-xl border border-white/6 bg-void-950/90 p-3 font-mono text-[11px] leading-relaxed no-scrollbar">
                    {logFeed.map((log, i) => (
                      <motion.div
                        key={i + log}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                          "flex items-start gap-1.5",
                          i === 0 ? "font-semibold text-cyan-300" : "text-mid/80"
                        )}
                      >
                        <span className="text-cyan-400/50">›</span>
                        <span>{log}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3 pt-4 border-t border-white/8">
                <Button
                  variant="primary"
                  size="md"
                  onClick={initSimulation}
                  icon={running ? RotateCcw : Play}
                  className="w-full"
                  magnetic={false}
                >
                  {running ? "Restart Live Arena" : "Initiate Live Simulation"}
                </Button>
                <div className="flex items-center justify-center gap-2 font-mono text-[10px] text-lo">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span>Real-time particle collision logic</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
