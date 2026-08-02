import Marquee from "@/components/magic/marquee";
import { SectionReveal } from "./ui";
import { trustLogos } from "@/lib/data";

/* ============================================================================
   TrustBar — social-proof band, redesigned: live status chip + avatar stack
   + count + dual logo marquee rows. Reads as "the network is alive", not a
   static logo strip.
   ============================================================================ */

const ROW_A = trustLogos.slice(0, Math.ceil(trustLogos.length / 2));
const ROW_B = trustLogos.slice(Math.ceil(trustLogos.length / 2));

export function TrustBar() {
  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-void-900/40 py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionReveal>
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            {/* Live status */}
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-mid">
                Powering competitive operations worldwide
              </p>
            </div>

            {/* Avatar stack + count */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2" aria-hidden>
                {["V", "A", "N", "T", "A", "+"].map((ch, i) => (
                  <span
                    key={i}
                    className={`grid h-9 w-9 place-items-center rounded-full border-2 border-void-950 bg-gradient-to-br ${["from-cyan-500/50 to-blue-600/25", "from-amber-500/50 to-orange-600/25", "from-emerald-500/50 to-teal-600/25", "from-violet-500/50 to-purple-600/25", "from-rose-500/50 to-pink-600/25", "from-cyan-400 to-cyan-600"][i % 6]} text-[11px] font-bold text-hi`}
                  >
                    {ch}
                  </span>
                ))}
              </div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-lo">
                <span className="text-cyan-300">+8,940</span> players competing
              </p>
            </div>
          </div>
        </SectionReveal>

        {/* Dual logo marquees — opposing directions */}
        <div className="mt-8 space-y-3">
          <div className="[mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
            <Marquee pauseOnHover duration="30s" repeat={3}>
              {ROW_A.map((l) => (
                <div key={l} className="group mx-8 flex items-center gap-2.5 text-mid/40 transition-all duration-500 hover:scale-105 hover:text-hi">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/60 transition-all duration-500 group-hover:scale-150 group-hover:shadow-[0_0_10px_2px_rgba(34,211,238,0.6)]" />
                  <span className="font-display text-lg font-semibold tracking-tight">{l}</span>
                </div>
              ))}
            </Marquee>
          </div>
          <div className="[mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
            <Marquee pauseOnHover duration="38s" repeat={3} reverse>
              {ROW_B.map((l) => (
                <div key={l} className="group mx-8 flex items-center gap-2.5 text-mid/30 transition-all duration-500 hover:scale-105 hover:text-hi">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400/50 transition-all duration-500 group-hover:scale-150 group-hover:shadow-[0_0_10px_2px_rgba(251,191,36,0.5)]" />
                  <span className="font-display text-lg font-semibold tracking-tight">{l}</span>
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  );
}
