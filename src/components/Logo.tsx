import { cn } from "@/lib/utils";
export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <span aria-label="Tournament OS" className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl border border-cyan-400/20 bg-void-800 transition-transform duration-300 group-hover:scale-105">
        <span className="absolute inset-0 bg-gradient-to-br from-cyan-400/25 to-transparent" />
        <svg viewBox="0 0 24 24" className="relative h-[18px] w-[18px] text-cyan-400" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="5.5" stroke="currentColor" strokeWidth="1.5" />
          <rect x="8" y="8" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" transform="rotate(45 12 12)" />
          <circle cx="12" cy="12" r="1.7" fill="currentColor" />
        </svg>
      </span>
      {showText && <span className="text-[15px] font-semibold tracking-tight text-hi">Tournament<span className="text-cyan-400"> OS</span></span>}
    </span>
  );
}
