import { useEffect, useRef, useState } from "react";

/* ============================================================================
   ScrambleText — React Bits ScrambleText pattern.
   Characters scramble through random glyphs before resolving to the value.
   Use on player IDs, ratings, seeds, tournament codes.
   ============================================================================ */

const GLYPHS = "!<>-_\\/[]{}—=+*^?#________";

export function ScrambleText({
  text,
  className,
  speed = 30,
  tick = 1,
  as = "span",
}: {
  text: string;
  className?: string;
  speed?: number;
  tick?: number;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const [display, setDisplay] = useState("");
  const frame = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(text);
      return;
    }
    let prev = "";
    const chars = text.split("");
    interval = setInterval(() => {
      frame.current += tick;
      const complete = Math.floor(frame.current / speed);
      let out = "";
      for (let i = 0; i < chars.length; i++) {
        if (i < complete) out += chars[i];
        else if (chars[i] === " ") out += " ";
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      if (prev === out) {
        clearInterval(interval!);
        setDisplay(text);
        return;
      }
      prev = out;
      setDisplay(out);
      if (complete >= chars.length) {
        clearInterval(interval!);
        setDisplay(text);
      }
    }, speed);
    return () => {
      if (interval) clearInterval(interval);
      cancelAnimationFrame(raf.current);
    };
  }, [text, speed, tick]);

  const Tag = as as "span";
  return <Tag className={className} aria-label={text}>{display}</Tag>;
}
