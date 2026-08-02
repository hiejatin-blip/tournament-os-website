import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { VantaHalo } from "@/components/archive/VantaHalo";
import anime from "animejs/lib/anime.es.js";

// ─── Text ────────────────────────────────────────────────────
const TOURNAMENT = "TOURNAMENT";
const OS         = "OS";
const SPLIT      = TOURNAMENT.length; // 10

// ─── Outside-in convergence pairs ────────────────────────────
// T(0) O(1) U(2) R(3) N(4)   A(5) M(6) E(7) N(8) T(9)
// Outermost pair lands first, converging inward
const PAIRS: [number, number][] = [[0, 9], [1, 8], [2, 7], [3, 6], [4, 5]];

// ── Slowed-down timing constants ──────────────────────────────
const PAIR_DELAY  = 130;  // ms between each pair  (was 90)
const LETTER_DUR  = 1000; // duration per letter    (was 700)
const T_COMPLETE  = (PAIRS.length - 1) * PAIR_DELAY + LETTER_DUR; // 1520ms

// Fixed fly-in distances — outer letters travel more, inner less
const LEFT_DX:  number[] = [-355, -265, -178, -108, -52];
const RIGHT_DX: number[] = [ 355,  265,  178,  108,  52];
function getDx(i: number): number {
  return i < 5 ? (LEFT_DX[i] ?? -200) : (RIGHT_DX[i - 5] ?? 200);
}

// ─── Timing (ms, relative to when "running" phase starts) ────
const SCANLINE_START  = PAIR_DELAY * 2;          //  260ms
const SHIMMER_START   = T_COMPLETE - 100;        // 1420ms — starts as last pair lands
const CHARGE_START    = T_COMPLETE + 360;        // 1880ms
const OS_START        = CHARGE_START + 480;      // 2360ms — both O and S together
const UNDERLINE_START = OS_START + 850;          // 3210ms
const PULSE_START     = UNDERLINE_START + 120;   // 3330ms
const TAGLINE_START   = PULSE_START + 320;       // 3650ms

export const HALO_FADE_MS        = 1800;
const        RUN_TOTAL_MS        = TAGLINE_START + 1800; // 5450ms
export const HALO_PHASE_TOTAL_MS = HALO_FADE_MS + RUN_TOTAL_MS;

// ─── Tagline — typewriter char by char ───────────────────────
const TAGLINE     = "COMPETE  ·  ORGANISE  ·  DOMINATE";
const TAGLINE_ARR = TAGLINE.split("");

// ─── Props ───────────────────────────────────────────────────
interface HaloBootPhaseProps {
  onComplete: () => void;
  skip?: boolean;
  /** Scales all animation durations (default 1.0). Values < 1 speed things up. */
  speedMultiplier?: number;
}

// ─── Component ───────────────────────────────────────────────
export function HaloBootPhase({ onComplete, skip = false, speedMultiplier = 1 }: HaloBootPhaseProps) {
  const reduce         = useReducedMotion();

  // Char refs — indices 0–9 = TOURNAMENT, 10–11 = OS
  const charRefs       = useRef<(HTMLSpanElement | null)[]>([]);
  const scanlineRef    = useRef<HTMLDivElement>(null);
  const shimmerRef     = useRef<HTMLDivElement>(null);
  const chargeLineRef  = useRef<HTMLDivElement>(null);
  const underlineRef   = useRef<HTMLSpanElement>(null);
  const travelRef      = useRef<HTMLSpanElement>(null);
  const taglineRefs    = useRef<(HTMLSpanElement | null)[]>([]);
  const timelineRef    = useRef<anime.AnimeTimelineInstance | null>(null);

  const [phase, setPhase] = useState<"fading-in" | "running" | "done">("fading-in");
  const doneRef = useRef(false);

  // ── Phase transitions ─────────────────────────────────────
  useEffect(() => {
    if (phase !== "fading-in") return;
    if (reduce || skip) { setPhase("done"); return; }
    const t = setTimeout(() => setPhase("running"), HALO_FADE_MS);
    return () => clearTimeout(t);
  }, [phase, reduce, skip]);

  useEffect(() => {
    if (phase !== "running") return;
    const t = setTimeout(() => setPhase("done"), RUN_TOTAL_MS);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase === "done" && !doneRef.current) {
      doneRef.current = true;
      onComplete();
    }
  }, [phase, onComplete]);

  useEffect(() => {
    if (skip && !doneRef.current) {
      doneRef.current = true;
      timelineRef.current?.pause();
      onComplete();
    }
  }, [skip, onComplete]);

  // ── Anime.js master timeline ──────────────────────────────
  useEffect(() => {
    if (phase !== "running" || reduce || skip) return;

    const els = charRefs.current;
    const tl  = anime.timeline({ autoplay: true });
    timelineRef.current = tl;

    // Start all chars hidden
    const allEls = els.filter(Boolean) as HTMLSpanElement[];
    anime.set(allEls, { opacity: 0 });

    // ── 1. TOURNAMENT — outside-in convergence ─────────────
    PAIRS.forEach(([left, right], pairIdx) => {
      const pairStart = pairIdx * PAIR_DELAY;

      [left, right].forEach((charIdx) => {
        const el = els[charIdx];
        if (!el) return;
        const dx = getDx(charIdx);

        anime.set(el, {
          opacity:    0,
          translateX: dx,
          filter:     "blur(18px)",
        });

        tl.add(
          {
            targets:    el,
            opacity:    [0, 0.28, 0.88, 1],
            translateX: [dx, dx * 0.12, 0],
            filter:     ["blur(18px)", "blur(7px)", "blur(0.5px)", "blur(0px)"],
            duration:   LETTER_DUR,
            easing:     "cubicBezier(0.1, 0.82, 0.25, 1.02)",
            // White glow flash on landing
            complete: () => {
              anime({
                targets:    el,
                textShadow: [
                  "0 0 0px rgba(238,242,247,0)",
                  "0 0 22px rgba(238,242,247,0.55), 0 0 44px rgba(34,211,238,0.18)",
                  "0 0 0px rgba(238,242,247,0)",
                ],
                duration: 640,
                easing:   "easeOutSine",
              });
            },
          },
          pairStart
        );
      });
    });

    // ── 2. Scanline sweep ──────────────────────────────────
    if (scanlineRef.current) {
      anime.set(scanlineRef.current, {
        opacity:         0,
        scaleX:          0,
        transformOrigin: "left",
      });
      tl.add(
        {
          targets:  scanlineRef.current,
          opacity:  [0, 0.92, 0.92, 0],
          scaleX:   [0, 0.4, 1, 1],
          duration: 900,
          easing:   "easeOutCubic",
        },
        SCANLINE_START
      );
    }

    // ── 3. TOURNAMENT shimmer sweep (gradient travels L→R) ─
    if (shimmerRef.current) {
      const proxy = { pos: -150 };
      anime.set(shimmerRef.current, { opacity: 1 });
      tl.add(
        {
          targets:  proxy,
          pos:      150,
          duration: 1400,
          easing:   "easeInOutSine",
          update: () => {
            if (shimmerRef.current)
              shimmerRef.current.style.backgroundPosition =
                `${proxy.pos}% center`;
          },
          complete: () => {
            if (shimmerRef.current)
              shimmerRef.current.style.opacity = "0";
          },
        },
        SHIMMER_START
      );
    }

    // ── 4. Pre-OS charge line ──────────────────────────────
    if (chargeLineRef.current) {
      anime.set(chargeLineRef.current, {
        scaleX:          0,
        opacity:         0,
        transformOrigin: "left",
      });
      tl.add(
        {
          targets:  chargeLineRef.current,
          scaleX:   [0, 1],
          opacity:  [0, 0.7, 0.7, 0],
          duration: 520,
          easing:   "easeOutQuart",
        },
        CHARGE_START
      );
    }

    // ── 5. O — scale punch from left ──────────────────────
    const oEl = els[SPLIT];
    if (oEl) {
      anime.set(oEl, {
        opacity:    0,
        translateX: -155,
        scale:      1.32,
        filter:     "blur(22px)",
      });
      tl.add(
        {
          targets:    oEl,
          opacity:    [0, 0.65, 1],
          translateX: [-155, -10, 0],
          scale:      [1.32, 0.92, 1.0],
          filter:     ["blur(22px)", "blur(5px)", "blur(0px)"],
          duration:   900,
          easing:     "cubicBezier(0.34, 1.56, 0.64, 1)",
        },
        OS_START
      );
    }

    // ── 6. S — scale punch from right, same time as O ─────
    const sEl = els[SPLIT + 1];
    if (sEl) {
      anime.set(sEl, {
        opacity:    0,
        translateX: 80,
        scale:      1.32,
        filter:     "blur(22px)",
      });
      tl.add(
        {
          targets:    sEl,
          opacity:    [0, 0.65, 1],
          translateX: [80, 8, 0],
          scale:      [1.32, 0.92, 1.0],
          filter:     ["blur(22px)", "blur(5px)", "blur(0px)"],
          duration:   900,
          easing:     "cubicBezier(0.34, 1.56, 0.64, 1)",
        },
        OS_START // same offset — both arrive together
      );
    }

    // ── 7. OS bloom breath — 4-layer, loops ───────────────
    const osEls = [oEl, sEl].filter(Boolean) as HTMLSpanElement[];
    if (osEls.length) {
      tl.add(
        {
          targets: osEls,
          keyframes: [
            {
              textShadow: "0 0 0px rgba(74,140,247,0)",
              duration:   0,
            },
            {
              textShadow:
                "0 0 28px rgba(74,140,247,1.0), " +
                "0 0 65px rgba(74,140,247,0.62), " +
                "0 0 130px rgba(34,211,238,0.28), " +
                "0 0 260px rgba(74,140,247,0.1)",
              duration: 800,
            },
            {
              textShadow:
                "0 0 12px rgba(74,140,247,0.48), " +
                "0 0 28px rgba(74,140,247,0.2)",
              duration: 700,
            },
          ],
          loop:     true,
          endDelay: 450,
          easing:   "easeInOutSine",
        },
        PULSE_START
      );
    }

    // ── 8. Underline draw ──────────────────────────────────
    if (underlineRef.current) {
      anime.set(underlineRef.current, {
        scaleX:          0,
        opacity:         0,
        transformOrigin: "left",
      });
      tl.add(
        {
          targets:  underlineRef.current,
          scaleX:   [0, 1],
          opacity:  [0, 1],
          duration: 800,
          easing:   "cubicBezier(0.25, 1, 0.5, 1)",
        },
        UNDERLINE_START
      );
    }

    // ── 9. Traveling light along underline ─────────────────
    if (travelRef.current) {
      anime.set(travelRef.current, { opacity: 0, left: "0%" });
      tl.add(
        {
          targets:  travelRef.current,
          left:     ["0%", "100%"],
          opacity:  [0, 1, 1, 0],
          duration: 800,
          easing:   "easeInOutSine",
        },
        UNDERLINE_START
      );
    }

    // ── 10. Tagline — character-by-character typewriter ────
    const tagEls = taglineRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (tagEls.length) {
      anime.set(tagEls, { opacity: 0 });
      tl.add(
        {
          targets:  tagEls,
          opacity:  [0, 1],
          duration: 70,
          delay:    anime.stagger(42),
          easing:   "linear",
        },
        TAGLINE_START
      );
    }

    return () => { tl.pause(); };
  }, [phase, reduce, skip]);

  const fullyRevealed = phase === "done" || skip || reduce;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#06080c]">

      {/* ── VantaHalo ─────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 2.0, ease: [0.16, 1, 0.3, 1] }}
      >
        <VantaHalo size={1.5} />
        {/* Vignette — keeps text readable against halo */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 46% 50%, transparent 52%, #06080c 94%)",
          }}
        />
      </motion.div>

      {/* ── Title block ───────────────────────────────────── */}
      <div
        className="pointer-events-none fixed left-[20vw] top-1/2 z-10
                   -translate-y-1/2 whitespace-nowrap"
        style={{
          fontSize:      "clamp(46px, 7vw, 80px)",
          fontWeight:    650,
          letterSpacing: "-0.04em",
          lineHeight:    1.06,
          fontFamily:    "'Space Grotesk', sans-serif",
        }}
      >

        {/* TOURNAMENT row */}
        <span className="relative block">

          {TOURNAMENT.split("").map((ch, i) => (
            <span
              key={`t-${i}`}
              ref={(el) => { charRefs.current[i] = el; }}
              className="inline-block"
              style={{
                color:      "#eef2f7",
                opacity:    fullyRevealed ? 1 : 0,
                willChange: "transform, filter, opacity, text-shadow",
              }}
            >
              {ch}
            </span>
          ))}

          {/* Scanline sweep */}
          <div
            ref={scanlineRef}
            className="pointer-events-none absolute inset-x-0 top-0 h-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.2) 40%," +
                "rgba(165,243,252,0.5) 50%, rgba(34,211,238,0.2) 60%, transparent 100%)",
              opacity: 0,
            }}
          />

          {/* Shimmer — gradient sweeps across after TOURNAMENT is in */}
          <div
            ref={shimmerRef}
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, " +
                "rgba(255,255,255,0.0) 36%, rgba(255,255,255,0.18) 47%, " +
                "rgba(165,243,252,0.3) 50%, rgba(255,255,255,0.18) 53%, " +
                "rgba(255,255,255,0.0) 64%, transparent 100%)",
              backgroundSize:     "200% 100%",
              backgroundPosition: "-150% center",
              opacity:            0,
            }}
          />
        </span>

        {/* OS row */}
        <span className="relative mt-1 block">

          {/* Pre-OS charge line — appears just before O and S arrive */}
          <div
            ref={chargeLineRef}
            className="pointer-events-none absolute -top-px left-0 h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, #22d3ee 25%," +
                "#a5f3fc 50%, #22d3ee 75%, transparent 100%)",
              opacity: 0,
            }}
          />

          {/* O and S */}
          {OS.split("").map((ch, i) => {
            const gIdx = SPLIT + i;
            return (
              <span
                key={`os-${i}`}
                ref={(el) => { charRefs.current[gIdx] = el; }}
                className="inline-block"
                style={{
                  color:      "#4a8cf7",
                  opacity:    fullyRevealed ? 1 : 0,
                  textShadow: fullyRevealed
                    ? "0 0 12px rgba(74,140,247,0.48), 0 0 28px rgba(74,140,247,0.2)"
                    : undefined,
                  willChange: "transform, filter, opacity, text-shadow",
                }}
              >
                {ch}
              </span>
            );
          })}

          {/* Reflection — mirrored OS below, gradient-masked */}
          <div
            className="pointer-events-none absolute left-0 top-full
                       select-none overflow-hidden"
            style={{
              height:              "0.45em",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(255,255,255,0.07) 0%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, rgba(255,255,255,0.07) 0%, transparent 100%)",
              opacity: fullyRevealed ? 1 : 0,
            }}
          >
            <span
              style={{
                display:         "block",
                color:           "#4a8cf7",
                fontSize:        "clamp(46px, 7vw, 80px)",
                fontWeight:      650,
                letterSpacing:   "-0.04em",
                lineHeight:      1.06,
                fontFamily:      "'Space Grotesk', sans-serif",
                transform:       "scaleY(-1)",
                transformOrigin: "top",
              }}
            >
              OS
            </span>
          </div>

          {/* Underline */}
          <span
            ref={underlineRef}
            className="absolute -bottom-1 left-0 w-full rounded-sm"
            style={{
              height:          "2.5px",
              background:
                "linear-gradient(90deg, #4a8cf7 0%, #22d3ee 40%," +
                "#a5f3fc 50%, #22d3ee 60%, #4a8cf7 100%)",
              transformOrigin: "left",
              scaleX:          fullyRevealed ? 1 : 0,
              opacity:         fullyRevealed ? 1 : 0,
              boxShadow:       "0 0 10px rgba(34,211,238,0.65)",
            }}
          >
            {/* Traveling light */}
            <span
              ref={travelRef}
              className="absolute top-1/2 -translate-y-1/2 rounded-full"
              style={{
                width:      "32px",
                height:     "7px",
                background:
                  "radial-gradient(ellipse, rgba(255,255,255,1) 0%," +
                  "rgba(165,243,252,0.8) 40%, transparent 100%)",
                filter:  "blur(2px)",
                opacity: 0,
              }}
            />
          </span>
        </span>

        {/* Tagline — typewriter */}
        <div
          className="mt-6 font-mono"
          style={{ fontSize: "11px", letterSpacing: "0.3em" }}
        >
          {TAGLINE_ARR.map((ch, i) => {
            const isAccent = ch === "·";
            return (
              <span
                key={i}
                ref={(el) => { taglineRefs.current[i] = el; }}
                className="inline"
                style={{
                  color:   isAccent ? "#22d3ee" : "rgba(238,242,247,0.32)",
                  opacity: fullyRevealed ? 1 : 0,
                }}
              >
                {ch === " " ? "\u00a0" : ch}
              </span>
            );
          })}
        </div>

      </div>
    </div>
  );
}
