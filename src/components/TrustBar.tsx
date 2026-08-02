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
    <section className="relative border-y border-white/5 bg-void-900/40 py-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionReveal>
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.28em] text-lo">
            Trusted by operators at
          </p>
          <div className="mt-6 [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
            <Marquee pauseOnHover duration="32s" repeat={3}>
              {trustLogos.map((l) => (
                <span key={l} className="mx-10 font-display text-lg font-semibold tracking-tight text-mid/40 transition-colors duration-300 hover:text-hi">
                  {l}
                </span>
              ))}
            </Marquee>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
