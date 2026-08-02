import { ease } from "@/shared/motion/motion-tokens";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { ParallaxSection, SectionHeading, Reveal } from "./ui";
import { faqs } from "@/lib/data";
import { cn } from "@/lib/utils";
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ParallaxSection id="faq" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="Questions, answered" title="Everything you need to know." />
        <Reveal className="mx-auto mt-12 max-w-3xl">
          <div className="divide-y divide-white/6 overflow-hidden rounded-2xl border border-white/6 bg-white/[0.02]">
            {faqs.map((f, i) => { const o = open === i; return (
              <div key={f.q} className="relative">
                <span className={cn("absolute left-0 top-0 h-full w-px bg-gradient-to-b from-cyan-400/0 via-cyan-400/70 to-cyan-400/0 transition-opacity duration-500", o ? "opacity-100" : "opacity-0")} />
                <button type="button" onClick={() => setOpen(o ? null : i)} className="group flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-white/[0.02] sm:px-6" aria-expanded={o}>
                  <span className={cn("text-[15px] font-medium transition-colors sm:text-base", o ? "text-cyan-100" : "text-hi group-hover:text-cyan-100")}>{f.q}</span>
                  <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-all duration-300", o ? "rotate-45 border-cyan-400/40 bg-cyan-400/10 text-cyan-300" : "border-white/8 text-mid group-hover:border-cyan-400/30")}><Plus className="h-4 w-4" /></span>
                </button>
                <AnimatePresence initial={false}>{o && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: ease.emphasized }} className="overflow-hidden"><p className="px-5 pb-5 text-sm leading-relaxed text-mid sm:px-6">{f.a}</p></motion.div>)}</AnimatePresence>
              </div>
            ); })}
          </div>
        </Reveal>
      </div>
    </ParallaxSection>
  );
}