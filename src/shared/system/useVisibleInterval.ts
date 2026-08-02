import { useEffect, useRef } from "react";

/* ============================================================================
   useVisibleInterval — a setInterval that automatically PAUSES when the tab
   is hidden (Page Visibility API) and RESUMES on return. Respects reduced
   motion by running at a calmer cadence. Prevents wasted CPU / battery / API
   churn on background tabs — critical for real-time dashboards at scale.
   ============================================================================ */
export function useVisibleInterval(cb: () => void, delay: number) {
  const savedCb = useRef(cb);
  savedCb.current = cb;

  useEffect(() => {
    if (delay <= 0) return;
    let id: number | undefined;

    const start = () => {
      if (id !== undefined) return;
      id = window.setInterval(() => savedCb.current(), delay);
    };
    const stop = () => {
      if (id !== undefined) { clearInterval(id); id = undefined; }
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [delay]);
}

/* Visibility-aware self-scheduling timeout loop (irregular cadences). */
export function useVisibleLoop(cb: () => void, nextDelay: () => number) {
  const savedCb = useRef(cb);
  const savedDelay = useRef(nextDelay);
  savedCb.current = cb;
  savedDelay.current = nextDelay;

  useEffect(() => {
    let timer: number | undefined;
    let stopped = false;

    const schedule = () => {
      if (stopped || document.hidden) return;
      timer = window.setTimeout(() => {
        savedCb.current();
        schedule();
      }, savedDelay.current());
    };
    const onVisibility = () => {
      if (document.hidden) { if (timer) clearTimeout(timer); timer = undefined; }
      else if (timer === undefined) schedule();
    };

    schedule();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
}
