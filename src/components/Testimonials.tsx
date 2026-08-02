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
    <ParallaxSection id="testimonials" className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Trusted by operators"
          title={
            <>
              Built for the people who{" "}
              <span className="text-gradient-cyan">run the show.</span>
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
