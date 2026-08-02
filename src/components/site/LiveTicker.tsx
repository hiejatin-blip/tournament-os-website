import Marquee from "@/components/magic/marquee";
import { LiveDot } from "@/components/ui";
import { liveMatches } from "@/lib/data";

/* ============================================================================
   LiveTicker — live match events ticker across the marketing top (Home).
   Broadcasts the "always running" story to every visitor; pauses on hover;
   `role="status"` so screen readers get live announcements without focus theft.
   ============================================================================ */
export function LiveTicker() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="relative z-[55] border-b border-white/6 bg-void-950/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-[100rem] items-center gap-4 px-4 py-2 sm:px-8">
        <span className="flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">
          <LiveDot />
          Live
        </span>
        <div className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
          <Marquee pauseOnHover duration="28s" repeat={3}>
            {liveMatches.map((m) => (
              <span
                key={m.a + m.b}
                className="mx-4 inline-flex items-center gap-2 whitespace-nowrap font-mono text-[11px] text-mid"
              >
                <span className="text-hi">{m.a}</span>
                <span className="text-lo">vs</span>
                <span className="text-mid">{m.b}</span>
                <span className="rounded border border-white/8 bg-white/[0.02] px-1.5 py-px text-cyan-300">
                  {m.score}
                </span>
                <span className="text-lo/60">{m.round}</span>
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
}
