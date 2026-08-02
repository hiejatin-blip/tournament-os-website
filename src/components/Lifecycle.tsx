import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { SectionHeading } from "./ui";
import { lifecycle } from "@/lib/data";

export function Lifecycle() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const translate = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "-78%"]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const [idx, setIdx] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setIdx(Math.min(lifecycle.length - 1, Math.floor(v * lifecycle.length))));

  return (
    <section id="lifecycle" className="relative">
      <div ref={ref} style={{ height: "260vh" }}>
        <div className="sticky top-0 flex h-screen w-full flex-col justify-center overflow-hidden">
          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
            <SectionHeading align="left" eyebrow="End-to-end lifecycle" title={<>Every stage, in <span className="text-gradient-cyan">perfect order.</span></>} description="Scroll to walk through the eight stages — each hands off to the next, fully automated." />
            <div className="mt-8 flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-lo">progress</span>
              <div className="relative h-px flex-1 bg-white/8"><motion.div style={{ width: progressWidth }} className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-cyan-300" /></div>
              <span className="min-w-[3.5ch] font-mono text-xs text-mid tabular-nums">{String(idx + 1).padStart(2, "0")} <span className="text-lo">/ {String(lifecycle.length).padStart(2, "0")}</span></span>
            </div>
          </div>
          <motion.div style={{ x: translate }} className="mt-10 flex gap-5 px-5 will-change-transform sm:px-8">
            {lifecycle.map((s, i) => (
              <div key={s.title} className="flex h-full w-[80vw] shrink-0 p-2 sm:w-[420px] sm:p-4">
                <div className="edge-top relative h-full w-full overflow-hidden rounded-3xl border border-white/6 bg-void-900/60 p-7 elev-2 backdrop-blur sm:p-9">
                  <div className="flex items-start justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/8 bg-void-800 text-cyan-300"><s.icon className="h-6 w-6" /></span>
                    <span className="font-mono text-xs text-lo">{String(i + 1).padStart(2, "0")}<span className="mx-1 text-white/10">/</span>{String(lifecycle.length).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-10 font-display text-2xl font-bold text-hi sm:text-3xl">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mid sm:text-base">{s.desc}</p>
                  <div className="mt-8 flex items-center justify-between border-t border-white/6 pt-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-lo">automated</span>
                    <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /><span className="font-mono text-[10px] text-mid">zero manual work</span></span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
          <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2 rounded-full border border-white/8 bg-void-900/70 px-3 py-1.5 backdrop-blur">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-lo">scroll to explore</span>
              <span className="h-3 w-px bg-white/15" /><span className="font-mono text-[10px] text-mid">↕</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
