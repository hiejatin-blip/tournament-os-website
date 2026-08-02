import { Marquee, Reveal } from "./ui";
import { trustLogos } from "@/lib/data";
export function TrustBar() {
  return (
    <section className="relative border-y border-white/5 bg-void-900/40 py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal><p className="text-center font-mono text-[11px] uppercase tracking-[0.24em] text-lo">Powering competitive operations worldwide</p></Reveal>
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="flex -space-x-2" aria-hidden>
            {["V", "A", "N", "T", "A", "+"].map((ch, i) => (
              <span key={i} className={`grid h-8 w-8 place-items-center rounded-full border-2 border-void-950 bg-gradient-to-br ${["from-cyan-500/40 to-blue-600/20", "from-amber-500/40 to-orange-600/20", "from-emerald-500/40 to-teal-600/20", "from-violet-500/40 to-purple-600/20", "from-rose-500/40 to-pink-600/20", "from-cyan-400 to-cyan-600"][i % 6]} text-[10px] font-bold text-hi`}>{ch}</span>
            ))}
          </div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-lo"><span className="text-cyan-300">+8,940</span> players competing</p>
        </div>
        <div className="mt-8"><Marquee>{trustLogos.map((l) => (<div key={l} className="group mx-8 flex items-center gap-2.5 text-mid/40 transition-all duration-500 hover:scale-105 hover:text-hi"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400/60 transition-all duration-500 group-hover:scale-150 group-hover:shadow-[0_0_10px_2px_rgba(34,211,238,0.6)]" /><span className="font-display text-lg font-semibold tracking-tight">{l}</span></div>))}</Marquee></div>
      </div>
    </section>
  );
}
