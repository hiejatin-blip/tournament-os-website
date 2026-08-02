import { ease } from "@/shared/motion/motion-tokens";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { History, Swords, LayoutDashboard, Database } from "lucide-react";
import { ParallaxSection, SectionHeading, Reveal, Stagger, StaggerItem, spotlightHandlers } from "./ui";
import NumberTicker from "@/components/magic/number-ticker";
import { analyticsMetrics, chartSeries } from "@/lib/data";

const s = chartSeries, n = s.length;
const pts = s.map((v, i) => [(i / (n - 1)) * 100, 100 - v]);
const line = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
const area = `${line} L100,100 L0,100 Z`;
const records = [{ icon: History, l: "Player histories & ratings" }, { icon: Swords, l: "Head-to-head records" }, { icon: LayoutDashboard, l: "Org-wide dashboards" }, { icon: Database, l: "CSV & API data exports" }];

export function Analytics() {
  const chartRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: chartRef, offset: ["start 0.8", "start 0.3"] });
  const pathLen = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <ParallaxSection id="analytics" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="Analytics & intelligence" title={<>Every match becomes <span className="text-gradient-cyan">structured data.</span></>} description="Records your sponsors, staff, and players can trust — from player histories to organization-wide performance." />
        <Stagger className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {analyticsMetrics.map((m) => (<StaggerItem key={m.label}><div
            {...spotlightHandlers}
            className="edge-top spotlight group relative h-full overflow-hidden rounded-2xl glass-card p-5 transition-transform duration-500 hover:-translate-y-1"><m.icon className="h-5 w-5 text-cyan-400 transition-transform duration-500 group-hover:scale-110" /><div className="mt-4 font-display text-3xl font-bold text-hi transition-colors group-hover:text-cyan-100 sm:text-4xl">{m.prefix}<NumberTicker value={m.value} decimalPlaces={m.decimals ?? 0} />{m.suffix}</div><p className="mt-1.5 text-xs text-mid sm:text-sm">{m.label}</p></div></StaggerItem>))}
        </Stagger>
        <div ref={chartRef} className="mt-5 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <Reveal><div className="relative h-full overflow-hidden rounded-2xl border border-white/6 bg-white/[0.02] p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-hi">Match activity</p><p className="font-mono text-[11px] text-lo">last 12 weeks</p></div><span className="rounded-md border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 font-mono text-[10px] text-cyan-300">+182%</span></div><div className="relative mt-6 h-48"><div className="absolute inset-0 bg-grid-fine opacity-30 mask-fade-b" /><svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full"><defs><linearGradient id="af" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="rgba(34,211,238,0.3)" /><stop offset="1" stopColor="rgba(34,211,238,0)" /></linearGradient></defs><motion.path d={area} fill="url(#af)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} /><motion.path d={line} fill="none" stroke="#22d3ee" strokeWidth="1.5" vectorEffect="non-scaling-stroke" style={{ pathLength: reduce ? 1 : pathLen }} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: ease.emphasized }} /><motion.circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="1.6" fill="#a5f3fc" vectorEffect="non-scaling-stroke" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.6 }} className="animate-pulse" /></svg><span className="pointer-events-none absolute right-5 top-16 h-2 w-2 animate-ping rounded-full bg-cyan-400" /></div></div></Reveal>
          <Reveal delay={0.1}><div className="flex h-full flex-col justify-center gap-1 rounded-2xl border border-white/6 bg-white/[0.02] p-6">{records.map((r, i) => (<motion.div key={r.l} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/[0.02]"><span className="grid h-9 w-9 place-items-center rounded-lg border border-white/8 bg-void-800 text-cyan-300"><r.icon className="h-4 w-4" /></span><span className="text-sm text-hi">{r.l}</span></motion.div>))}</div></Reveal>
        </div>
      </div>
    </ParallaxSection>
  );
}