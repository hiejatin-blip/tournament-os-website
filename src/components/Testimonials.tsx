import { ParallaxSection, SectionHeading } from "./ui";
import { testimonials } from "@/lib/data";
import { InfiniteMovingCards } from "@/components/aceternity/infinite-moving-cards";

/* ============================================================================
   Testimonials — Aceternity InfiniteMovingCards (dual counter-scrolling rows).
   Replaces the static tilt grid: a "crowd of voices" instead of a curated set.
   Data stays the same (`testimonials` from lib/data).
   ============================================================================ */

const cards = testimonials.map((t) => ({
  quote: t.quote,
  name: t.name,
  title: `${t.role} · ${t.org}`,
}));

const left = cards.slice(0, Math.ceil(cards.length / 2));
const right = cards.slice(Math.ceil(cards.length / 2));

export function Testimonials() {
  return (
    <ParallaxSection id="testimonials" className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.04),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Trusted by operators"
          title={
            <>
              Built for the people who{" "}
              run the brackets.
            </>
          }
        />
        <div className="mt-12 space-y-4">
          <InfiniteMovingCards items={left} direction="left" speed="normal" />
          <InfiniteMovingCards items={right} direction="right" speed="normal" />
        </div>
      </div>
    </ParallaxSection>
  );
}
