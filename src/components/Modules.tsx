import { ease } from "@/shared/motion/motion-tokens";
import { motion } from "framer-motion";
import { Check, ShieldCheck } from "lucide-react";
import { ParallaxSection, SectionHeading, Stagger, StaggerItem, spotlightHandlers } from "./ui";
import { modules } from "@/lib/data";

function VerifVisual() {
  const rows = [{ t: "@vanta.black", r: "EU-W", ok: true }, { t: "@helix.apex", r: "NA-E", ok: true }, { t: "@nexus.prime", r: "EU-W", ok: true }, { t: "@smurf.alt", r: "—", ok: false }];
  return (
    <div className="rounded-xl border border-white/6 bg-void-950/60 p-3.5">
      <div className="mb-2.5 flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-lo">verification stream</span><span className="font-mono text-[10px] text-cyan-300">254 / 256</span></div>
      <div className="space-y-1.5">{rows.map((r, i) => (
        <motion.div key={r.t} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.12 }} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.01] px-2.5 py-2">
          <div className="flex items-center gap-2">{r.ok ? <span className="grid h-4 w-4 place-items-center rounded-full bg-cyan-400/15"><Check className="h-2.5 w-2.5 text-cyan-300" /></span> : <span className="grid h-4 w-4 place-items-center rounded-full bg-rose-500/15"><span className="text-[10px] text-rose-400">×</span></span>}<span className="font-mono text-[11px] text-hi">{r.t}</span></div>
          <span className={r.ok ? "font-mono text-[10px] text-mid" : "font-mono text-[10px] text-rose-400/80"}>{r.ok ? r.r : "blocked · smurf"}</span>
        </motion.div>
      ))}</div>
    </div>
  );
}

export function Modules() {
  const feat = modules.find((m) => m.featured)!;
  const rest = modules.filter((m) => !m.featured);
  return (
    <ParallaxSection id="platform" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="The platform" title={<>A complete operating system,<br className="hidden sm:block" /> not a pile of features.</>} description="Every module works as part of one system. Registration feeds verification, verification feeds seeding, seeding feeds the bracket — automatically." />
        <motion.div initial={{ opacity: 0, y: 28, rotateX: 6, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }} viewport={{ once: true, margin: "-8%" }} transition={{ duration: 1, ease: ease.emphasized }} className="edge-top relative mt-14 overflow-hidden rounded-3xl border border-cyan-400/12 bg-gradient-to-br from-cyan-400/[0.04] via-white/[0.01] to-transparent p-7 [perspective:800px] sm:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl border border-cyan-400/30 bg-cyan-400/10"><ShieldCheck className="h-6 w-6 text-cyan-300" /></span><span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300/80">Core module</span></div>
              <h3 className="mt-5 text-2xl font-bold text-hi sm:text-3xl">{feat.name}</h3>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-mid">{feat.desc}</p>
              <ul className="mt-5 flex flex-wrap gap-2.5">{feat.points.map((p) => (<li key={p} className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] px-3 py-1.5 text-sm text-hi"><Check className="h-3.5 w-3.5 text-cyan-300" />{p}</li>))}</ul>
            </div>
            <VerifVisual />
          </div>
        </motion.div>
        <Stagger className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((m, i) => (
            <StaggerItem key={m.name} className="h-full">
              <div
{...spotlightHandlers}
                className="conic-border spotlight group relative h-full overflow-hidden rounded-2xl glass-card p-6 transition-transform duration-500 hover:-translate-y-1.5"
              >
                <span className="pointer-events-none absolute right-5 top-5 font-mono text-[10px] text-lo/60">{String(i + 1).padStart(2, "0")}</span>
                <span className="relative grid h-11 w-11 place-items-center rounded-xl border border-white/8 bg-void-800 text-cyan-300 transition-all duration-500 group-hover:border-cyan-400/40 group-hover:text-cyan-200 group-hover:glow-cyan group-hover:-rotate-6 group-hover:scale-105"><m.icon className="h-5 w-5" /></span>
                <h3 className="mt-4 text-lg font-semibold text-hi transition-colors group-hover:text-cyan-100">{m.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mid">{m.desc}</p>
                <span className="pointer-events-none absolute inset-x-6 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </ParallaxSection>
  );
}