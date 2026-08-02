import { motion } from "framer-motion";
import { Hash, Check } from "lucide-react";
import { ParallaxSection, SectionHeading, Reveal, LiveDot } from "./ui";
import { discordFeatures } from "@/lib/data";

function ServerVisual() {
  const ch = [{n:"announcements",l:false},{n:"check-in",l:true},{n:"match-qf-1",l:true},{n:"match-qf-2",l:true},{n:"match-qf-3",l:false},{n:"results",l:false}];
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-void-900/80 elev-2 backdrop-blur">
      <div className="flex">
        <div className="flex w-16 flex-col items-center gap-3 border-r border-white/6 bg-void-950/60 py-4">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-500 text-void-950"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.5" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg></span>
          {[0,1,2,3].map(i=><span key={i} className="h-9 w-9 rounded-2xl border border-white/6 bg-white/[0.02]"/>)}
        </div>
        <div className="flex-1 p-4">
          <div className="mb-3 flex items-center justify-between border-b border-white/6 pb-3"><div><p className="text-sm font-semibold text-hi">WinterCup 2026</p><p className="font-mono text-[10px] text-lo">1,284 members</p></div><span className="flex items-center gap-1.5 rounded-full bg-cyan-400/10 px-2 py-1"><LiveDot className="scale-75"/><span className="font-mono text-[10px] text-cyan-300">live</span></span></div>
          <div className="space-y-1">{ch.map((c,i)=>(<motion.div key={c.n} initial={{opacity:0,x:-8}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:0.15+i*0.1}} className="flex items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-white/[0.02]"><Hash className="h-3.5 w-3.5 text-lo"/><span className="text-sm text-mid">{c.n}</span>{c.l&&<span className="ml-auto flex items-center gap-1"><LiveDot className="scale-[0.6]" color="bg-rose-400"/><span className="font-mono text-[10px] text-rose-400">live</span></span>}</motion.div>))}</div>
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-cyan-400/[0.05] px-3 py-2"><Check className="h-3.5 w-3.5 text-cyan-300"/><span className="font-mono text-[11px] text-cyan-300">Tournament OS connected · infrastructure, not a bot</span></div>
        </div>
      </div>
    </div>
  );
}

export function DiscordIntegration() {
  return (
    <ParallaxSection id="integration" className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal rotate={6}><ServerVisual /></Reveal>
          <Reveal delay={0.1}>
            <SectionHeading align="left" eyebrow="Discord, native" title={<>Your Discord server, <span className="text-gradient-cyan">orchestrated.</span></>} description="Tournament OS provisions roles, channels, permissions instantly. It lives inside Discord — but it's infrastructure, not another bot." />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">{discordFeatures.map((f)=>(<div key={f.title} className="rounded-xl border border-white/6 bg-white/[0.02] p-4 transition-colors hover:border-cyan-400/20"><span className="grid h-9 w-9 place-items-center rounded-lg border border-white/8 bg-void-800 text-cyan-300"><f.icon className="h-4 w-4"/></span><h3 className="mt-3 text-sm font-semibold text-hi">{f.title}</h3><p className="mt-1 text-[13px] leading-relaxed text-mid">{f.desc}</p></div>))}</div>
          </Reveal>
        </div>
      </div>
    </ParallaxSection>
  );
}
