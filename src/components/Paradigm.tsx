import { ArrowRight, Check, X } from "lucide-react";
import { ParallaxSection, SectionHeading, Reveal } from "./ui";
import { pains, gains } from "@/lib/data";
export function Paradigm() {
  return (
    <ParallaxSection id="paradigm" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="The status quo is broken" title={<>Tournaments shouldn&apos;t be run on<br className="hidden sm:block" /> spreadsheets and DMs.</>} description="Every organizer knows the chaos. Tournament OS replaces all of it with one automated system." />
        <div className="mt-16 grid items-stretch gap-5 lg:grid-cols-[1fr_auto_1fr]">
          <Reveal rotate={4}>
            <div className="relative h-full overflow-hidden rounded-2xl border border-white/6 bg-white/[0.02] p-6 sm:p-8">
              <div className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-lg border border-rose-500/30 bg-rose-500/10"><X className="h-4 w-4 text-rose-400" /></div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-lo">The old way</p>
              <h3 className="mt-2 text-xl font-semibold text-hi">Manual operations</h3>
              <div className="mt-6 space-y-5">{pains.map((p) => (<div key={p.title} className="flex gap-3.5 opacity-80"><p.icon className="mt-0.5 h-5 w-5 shrink-0 text-rose-400/70" /><div><p className="text-sm font-medium text-hi line-through decoration-rose-400/40">{p.title}</p><p className="mt-1 text-sm leading-relaxed text-mid">{p.desc}</p></div></div>))}</div>
            </div>
          </Reveal>
          <div className="flex items-center justify-center lg:flex-col">
            <div className="flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-300">automated</span>
              <ArrowRight className="h-4 w-4 rotate-90 text-cyan-300 lg:rotate-0" />
            </div>
          </div>
          <Reveal delay={0.12} rotate={-4}>
            <div className="edge-top relative h-full overflow-hidden rounded-2xl border border-cyan-400/15 bg-gradient-to-b from-cyan-400/[0.05] to-transparent p-6 sm:p-8">
              <div className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-lg border border-cyan-400/40 bg-cyan-400/15"><Check className="h-4 w-4 text-cyan-300" /></div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300/80">The Tournament OS way</p>
              <h3 className="mt-2 text-xl font-semibold text-hi">Fully automated</h3>
              <div className="mt-6 space-y-5">{gains.map((g) => (<div key={g} className="flex items-start gap-3.5"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cyan-400/15"><Check className="h-3 w-3 text-cyan-300" /></span><p className="text-sm font-medium leading-relaxed text-hi">{g}</p></div>))}</div>
            </div>
          </Reveal>
        </div>
      </div>
    </ParallaxSection>
  );
}
