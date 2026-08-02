import { motion } from "framer-motion";
import { Users, ShieldCheck, CalendarClock, Gauge, GitBranch, BellRing, Cpu, Terminal } from "lucide-react";
import { ParallaxSection, SectionHeading, Reveal } from "./ui";
import { automationLog, capabilities } from "@/lib/data";
import { ParticleField } from "./Backgrounds";
import { cn } from "@/lib/utils";

const nodes = [
  { icon: Users, label: "Register" }, { icon: ShieldCheck, label: "Verify" }, { icon: CalendarClock, label: "Check-in" },
  { icon: Gauge, label: "Seed" }, { icon: GitBranch, label: "Bracket" }, { icon: BellRing, label: "Notify" },
];
const R = 39;
const pos = nodes.map((n, i) => { const a = (-90 + i * 60) * (Math.PI / 180); return { ...n, x: 50 + R * Math.cos(a), y: 50 + R * Math.sin(a) }; });
const tagC: Record<string, string> = { init: "text-lo", ok: "text-cyan-300", info: "text-amber-300", discord: "text-amber-300", live: "text-cyan-300" };

function Engine() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[440px]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">{pos.map((n) => (<line key={n.label} x1="50" y1="50" x2={n.x} y2={n.y} stroke="rgba(34,211,238,0.15)" strokeWidth="0.4" strokeDasharray="2 2" />))}</svg>
      <div className="absolute left-1/2 top-1/2 h-[44%] w-[44%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/8 animate-spin-slow" />
      <div className="absolute left-1/2 top-1/2 h-[66%] w-[66%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" style={{ animation: "spin-slow 38s linear infinite reverse" }} />
      <div className="absolute left-1/2 top-1/2 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/4" />
      {pos.map((n, i) => (
        <div key={n.label} className="absolute" style={{ left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%,-50%)" }}>
          <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.08, duration: 0.6 }} className="flex flex-col items-center gap-1.5">
            <div className="grid h-12 w-12 place-items-center rounded-xl border border-white/8 bg-void-800 elev-2" style={{ animation: `float-y ${5 + (i % 3)}s ease-in-out ${i * 0.4}s infinite` }}><n.icon className="h-5 w-5 text-cyan-300" /></div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-mid">{n.label}</span>
          </motion.div>
        </div>
      ))}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative grid h-24 w-24 place-items-center rounded-full border border-cyan-400/30 bg-void-900 glow-cyan">
          <div className="absolute inset-0 animate-pulse-ring rounded-full" />
          <Cpu className="h-7 w-7 text-cyan-400" />
          <span className="absolute -bottom-5 font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-300">core</span>
        </div>
      </div>
    </div>
  );
}

function Log() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-void-950/80 elev-2">
      <div className="flex items-center justify-between border-b border-white/6 bg-white/[0.02] px-4 py-2.5">
        <div className="flex items-center gap-2"><Terminal className="h-3.5 w-3.5 text-cyan-400" /><span className="font-mono text-[11px] tracking-wide text-mid">automation-engine · stream</span></div>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-lo">realtime</span>
      </div>
      <div className="space-y-1.5 p-4 font-mono text-[12px] leading-relaxed sm:text-[13px]">
        {automationLog.map((l, i) => {
          const live = l.tag === "live";
          return (
            <motion.div key={l.t} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.12 }} className={cn("flex gap-3", live && "rounded-md bg-cyan-400/10 px-2 py-1")}>
              <span className="shrink-0 text-lo">{l.t}</span><span className="text-cyan-400/60">›</span><span className={cn(live ? "font-semibold text-cyan-300" : tagC[l.tag])}>{l.msg}</span>
            </motion.div>
          );
        })}
        <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 2 }} className="inline-block h-3.5 w-2 animate-pulse bg-cyan-400 align-middle" />
      </div>
    </div>
  );
}

export function AutomationCore() {
  return (
    <ParallaxSection id="automation" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0"><ParticleField density={0.00006} color="34,211,238" linkColor="34,211,238" className="opacity-40" /></div>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 relative">
        <SectionHeading eyebrow="The automation engine" title={<>One engine runs the <span className="text-gradient-cyan">entire</span> operation.</>} description="Create a tournament and Tournament OS takes it from there — verifying players, seeding brackets, provisioning channels, all without a human in the loop." />
        <div className="relative mt-16 grid items-center gap-12 lg:grid-cols-2"><Reveal><Engine /></Reveal><Reveal delay={0.1}><Log /></Reveal></div>
        <div className="mt-14 flex flex-wrap justify-center gap-2.5">
          {capabilities.map((c, i) => (<motion.div key={c.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="flex items-center gap-2 rounded-full border border-white/6 bg-white/[0.02] px-3.5 py-2 text-xs text-mid"><c.icon className="h-3.5 w-3.5 text-cyan-400/70" />{c.label}</motion.div>))}
        </div>
      </div>
    </ParallaxSection>
  );
}
