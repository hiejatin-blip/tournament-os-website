import { ParallaxSection, SectionHeading } from "./ui";
import { Compare } from "@/components/aceternity/compare";

/* ============================================================================
   CompareSection — "Manual chaos vs Tournament OS" before/after demo.
   BEFORE: an old mobile screenshot of the pre-rebuild experience.
   AFTER: the rebuilt player dashboard.
   ============================================================================ */
export function CompareSection() {
  return (
    <ParallaxSection id="compare" className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The difference"
          title={
            <>
              Manual chaos vs. <span className="text-gradient-cyan">Tournament OS.</span>
            </>
          }
          description="Drag the handle. This is what running a tournament used to look like — and what it looks like now."
        />
        <div className="mx-auto mt-12 max-w-5xl">
          <Compare
            firstImage="/compare-before.jpg"
            secondImage="/compare-after.jpg"
            firstLabel="Before"
            secondLabel="After"
          />
        </div>
      </div>
    </ParallaxSection>
  );
}
