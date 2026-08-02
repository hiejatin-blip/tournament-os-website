import { useEffect, useState } from "react";

/* ============================================================================
   useIsMobile — shared mobile breakpoint hook (matches Tailwind's md: 768px).
   Progressive enhancement: heavy scroll-choreography sections render a
   lighter static/vertical variant on mobile instead of 200-250vh runways.
   ============================================================================ */

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}
