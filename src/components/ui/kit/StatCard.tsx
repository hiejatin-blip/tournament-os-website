import NumberTicker from "@/components/magic/number-ticker";
import { cn } from "@/lib/utils";

/* ============================================================================
   StatCard — AppleActivityCard-style KPI: animated progress ring + label +
   count-up value. Tokenized to the void/cyan palette. Drop-in for the
   portal's static stat divs.
   ============================================================================ */

export function StatCard({
  label,
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  percent,
  delta,
  className,
}: {
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** 0..1 — renders the activity ring */
  percent?: number;
  delta?: string;
  className?: string;
}) {
  const pct = percent ?? 0;
  const R = 26;
  const C = 2 * Math.PI * R;
  return (
    <div className={cn("rounded-2xl glass-card p-4", className)}>
      <div className="flex items-center gap-3">
        {percent !== undefined && (
          <div className="relative h-16 w-16 shrink-0" aria-hidden>
            <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
              <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
              <circle
                cx="32" cy="32" r={R} fill="none" stroke="#22d3ee" strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - Math.min(1, Math.max(0, pct)))}
                style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)" }}
              />
            </svg>
            <span className="absolute inset-0 grid place-items-center font-mono text-[10px] text-cyan-300">
              {Math.round(pct * 100)}%
            </span>
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-mono text-[10px] uppercase tracking-wider text-lo">{label}</p>
          <p className="mt-1 font-display text-2xl font-bold text-hi">
            {prefix}
            <NumberTicker value={value} decimalPlaces={decimals} />
            {suffix}
          </p>
          {delta && <p className="font-mono text-[11px] text-emerald-400">{delta}</p>}
        </div>
      </div>
    </div>
  );
}
