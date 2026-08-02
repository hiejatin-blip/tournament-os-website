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
    <ParallaxSection id="analytics" className="relative py-20 sm:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(34,211,238,0.04),transparent_55%)]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* split editorial: copy left, chart right */}
        <div className="grid items-end gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cyan-300/80">Analytics</p>
            <h2 className="mt-4 max-w-md font-display text-3xl font-bold tracking-tight text-hi sm:text-4xl">
              Every match, logged. Every result, queryable.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-mid">
              Player histories, head-to-heads, placement distributions, and org-wide exports —
              all derived from the match log, not re-typed by hand.
            </p>
            {/* stats as a plain data strip — no cards */}
            <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4 lg:grid-cols-2">
              {analyticsMetrics.map((m) => (
                <div key={m.label}>
                  <p className="font-display text-3xl font-bold text-hi">
                    {m.prefix}<NumberTicker value={m.value} decimalPlaces={m.decimals ?? 0} />{m.suffix}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-lo">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div ref={chartRef}>
            <Reveal>
              <div className="relative overflow-hidden rounded-2xl border border-white/6 bg-white/[0.02] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-hi">Match activity</p>
                    <p className="font-mono text-[11px] text-lo">last 12 weeks</p>
                  </div>
                  <span className="rounded-md border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 font-mono text-[10px] text-cyan-300">+182%</span>
                </div>
                <div className="relative mt-6 h-48">
                  <div className="absolute inset-0 bg-grid-fine opacity-30 mask-fade-b" />
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                    <defs>
                      <linearGradient id="af" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="rgba(34,211,238,0.3)" />
                        <stop offset="1" stopColor="rgba(34,211,238,0)" />
                      </linearGradient>
                    </defs>
                    <motion.path d={area} fill="url(#af)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} />
                    <motion.path d={line} fill="none" stroke="#22d3ee" strokeWidth="1.5" vectorEffect="non-scaling-stroke" style={{ pathLength: reduce ? 1 : pathLen }} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: ease.emphasized }} />
                    <motion.circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="1.6" fill="#a5f3fc" vectorEffect="non-scaling-stroke" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.6 }} className="animate-pulse" />
                  </svg>
                  <span className="pointer-events-none absolute right-5 top-16 h-2 w-2 animate-ping rounded-full bg-cyan-400" />
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-4 flex items-center justify-between gap-2 rounded-2xl border border-white/6 bg-white/[0.02] p-4">
                {records.map((r) => (
                  <div key={r.l} className="flex flex-1 items-center justify-center gap-2">
                    <r.icon className="h-4 w-4 text-cyan-300" />
                    <span className="hidden text-xs text-mid xl:block">{r.l}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </ParallaxSection>
  );
}
