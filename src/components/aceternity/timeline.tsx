import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/* ============================================================================
   Timeline — Aceternity UI pattern (MIT), tokenized to void/cyan.
   Scroll-linked vertical timeline with a filling gradient line and
   sticky phase markers. Used for the Changelog.
   ============================================================================ */

export const Timeline = ({
  data,
}: {
  data: { title: string; content: ReactNode }[];
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 15%", "end 55%"],
  });
  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div ref={containerRef} className="w-full">
      <div ref={ref} className="relative mx-auto max-w-4xl pb-16">
        {data.map((item, i) => (
          <div key={i} className="flex justify-start pt-10 md:gap-10 md:pt-14">
            <div className="sticky top-40 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
              <div className="absolute left-2 flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/30 bg-void-900 ring-1 ring-white/10">
                <span className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_10px_2px_rgba(34,211,238,0.6)]" />
              </div>
              <h3 className="hidden pl-16 font-display text-2xl font-bold text-hi md:block lg:text-3xl">
                {item.title}
              </h3>
            </div>
            <div className="relative w-full pl-16 pr-4 md:pl-4">
              <h3 className="mb-3 block font-display text-xl font-bold text-hi md:hidden">{item.title}</h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{ height: `${height}px` }}
          className="absolute left-6 top-0 w-[2px] overflow-hidden bg-white/8 md:left-6 [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-cyan-600 via-cyan-400 to-transparent"
          />
        </div>
      </div>
    </div>
  );
};
