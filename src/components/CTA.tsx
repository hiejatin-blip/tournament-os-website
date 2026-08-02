import { ArrowRight, Sparkles } from "lucide-react";
import { Button, SectionReveal } from "./ui";
import { fireConfetti } from "@/components/magic/confetti";
import { ParticleField } from "./Backgrounds";
import { RetroGrid } from "@/components/magic/retro-grid";
export function CTA() {
  return (
    <section id="cta" className="relative overflow-hidden py-28 sm:py-36">
      <RetroGrid className="inset-x-0 bottom-0 h-[55%]" />
      <div className="absolute inset-0 bg-grid opacity-35 mask-fade-b" /><div className="absolute inset-0 bg-noise pointer-events-none" />
      <ParticleField className="opacity-50" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionReveal>
          <div className="group relative overflow-hidden rounded-[2rem] border border-white/8 bg-gradient-to-b from-void-800/80 to-void-950/90 px-6 py-16 text-center elev-3 backdrop-blur-xl sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-[40vh] w-[40vh] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px] animate-breathe blur-orb blur-orb" />
            <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-[0.04]" />
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5"><Sparkles className="h-3.5 w-3.5 text-cyan-400" /><span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mid">Ready when you are</span></span>
            <h2 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-bold leading-[1.05] text-gradient sm:text-5xl md:text-6xl">Run your next tournament on <span className="text-gradient-holo">autopilot.</span></h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-mid sm:text-lg">Deploy Tournament OS in minutes. Let the engine handle everything while you focus on the game.</p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                variant="primary"
                size="lg"
                href="#top"
                iconRight={ArrowRight}
                onClick={() => fireConfetti({ particleCount: 180, origin: { x: 0.5, y: 0.85 } })}
              >
                Deploy Tournament OS
              </Button>
              <Button variant="secondary" size="lg" href="#pricing">View pricing</Button>
            </div>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-lo">Free to start · No credit card · SOC 2 ready</p>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
