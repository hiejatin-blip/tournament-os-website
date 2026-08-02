import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ============================================================================
   InfiniteMovingCards — Aceternity UI pattern (MIT).
   Two infinite counter-scrolling rows of cards ("a crowd, not a curated set").
   Needs the `scroll` keyframes + `.animate-scroll` utility in index.css.
   ============================================================================ */

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}: {
  items: { quote: string; name: string; title: string }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) scrollerRef.current.appendChild(duplicatedItem);
      });
      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse",
      );
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      const s = speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";
      containerRef.current.style.setProperty("--animation-duration", s);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "decor scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]",
        className,
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          "[animation-direction:var(--animation-direction)] [animation-duration:var(--animation-duration)]",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
      >
        {items.map((item) => (
          <li
            key={item.name}
            className="relative w-[340px] max-w-full shrink-0 rounded-2xl border border-white/8 bg-void-900/70 px-7 py-6 backdrop-blur-sm sm:w-[400px]"
          >
            <blockquote>
              <span className="text-lg leading-relaxed text-hi">"{item.quote}"</span>
              <footer className="mt-4 flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-cyan-500/30 to-amber-500/20 text-[10px] font-bold text-hi ring-1 ring-white/10">
                  {item.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-hi">{item.name}</span>
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-cyan-300/80">{item.title}</span>
                </span>
              </footer>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
