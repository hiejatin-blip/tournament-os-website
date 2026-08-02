import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HaloBootPhase } from "./HaloBootPhase";

/**
 * BootSequence — cinematic boot experience on first load.
 *
 * Plays the HaloBootPhase (VantaHalo + TOURNAMENT OS letter fly-in) as the
 * sole boot animation, then calls onDone to reveal the site.
 *
 * Skip: a "Skip" button appears ~1 s in. Clicking it (or pressing
 * Enter / Space / Escape) immediately ends the boot.
 *
 * Repeat visits: sessionStorage flag detected — repeat visitors run the
 * animation at ~50% speed so it doesn't overstay its welcome.
 */

const SESSION_KEY = "tos_boot_seen";
const REPEAT_SPEED = 0.5; // repeat visits run at 50% of full duration

export function BootSequence({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();

  const isRepeatVisit = useRef(
    typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem(SESSION_KEY) === "1",
  );

  const [active, setActive]           = useState(!reduce);
  const [skipRequested, setSkipReq]   = useState(false);
  const [showSkipHint, setShowSkip]   = useState(false);

  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Reduced-motion: skip immediately
  useEffect(() => {
    if (reduce) onDoneRef.current();
  }, [reduce]);

  const finish = useCallback(() => {
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* ignore */ }
    setActive(false);
    onDoneRef.current();
  }, []);

  // Skip hint appears ~1 s after boot starts
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setShowSkip(true), 1000);
    return () => clearTimeout(t);
  }, [active]);

  const requestSkip = useCallback(() => setSkipReq(true), []);

  // Keyboard skip: Enter / Space / Escape
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        requestSkip();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, requestSkip]);

  if (!active) return null;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[200] bg-[#06080c]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.4, 0, 1, 1] } }}
        >
          <HaloBootPhase
            key="halo"
            onComplete={finish}
            skip={skipRequested}
            speedMultiplier={isRepeatVisit.current ? REPEAT_SPEED : 1}
          />

          <SkipHint visible={showSkipHint} onSkip={requestSkip} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SkipHint({ visible, onSkip }: { visible: boolean; onSkip: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onSkip}
      aria-label="Skip intro"
      className="fixed bottom-8 right-8 z-[201] flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-white/[0.06] hover:text-white/80"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 8 }}
      transition={{ duration: 0.4 }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      Skip
      <span aria-hidden className="text-white/30">⏭</span>
    </motion.button>
  );
}
