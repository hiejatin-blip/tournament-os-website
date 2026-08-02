import { useState, useMemo, type ReactNode } from "react";
import { Search, SlidersHorizontal, X, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============================================================ Search input */
export function SearchInput({ value, onChange, placeholder = "Search…", className }: {
  value: string; onChange: (s: string) => void; placeholder?: string; className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 rounded-2xl glass-card px-4 py-3", className)}>
      <Search className="h-5 w-5 shrink-0 text-lo" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-transparent text-sm text-hi placeholder:text-lo focus:outline-none" />
      {value && <button onClick={() => onChange("")} aria-label="Clear" className="text-lo transition-colors hover:text-hi"><X className="h-4 w-4" /></button>}
    </div>
  );
}

/* ============================================================ Pill filter row */
export function PillFilter<T extends string>({ options, value, onChange }: {
  options: readonly T[] | T[]; value: T; onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} className={cn(
          "mo-tap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
          value === o ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300" : "border-white/8 text-mid hover:border-white/20 hover:text-hi",
        )}>{o}</button>
      ))}
    </div>
  );
}

/* ============================================================ Dropdown select */
export function Select<T extends string>({ label, options, value, onChange }: {
  label: string; options: readonly T[] | T[]; value: T; onChange: (v: T) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className={cn("flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm transition-colors", open ? "border-cyan-400/40 text-hi" : "border-white/8 text-mid hover:text-hi")}>
        <span className="font-mono text-[10px] uppercase tracking-wider text-lo">{label}</span>
        <span className="text-hi">{value}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 mt-2 min-w-[160px] overflow-hidden rounded-xl border border-white/8 bg-void-900/95 backdrop-blur-xl elev-3">
            {options.map((o) => (
              <button key={o} onClick={() => { onChange(o); setOpen(false); }} className="flex w-full items-center justify-between px-3 py-2 text-sm text-mid transition-colors hover:bg-white/[0.04] hover:text-hi">
                {o}{value === o && <Check className="h-3.5 w-3.5 text-cyan-300" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ============================================================ Toolbar shell */
export function Toolbar({ children, resultCount, total }: { children: ReactNode; resultCount: number; total: number }) {
  return (
    <div className="space-y-4">
      {children}
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-lo">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Showing <span className="text-cyan-300">{resultCount}</span> of {total}
      </div>
    </div>
  );
}

/* ============================================================ Pagination */
export function usePagination<T>(items: T[], pageSize = 9) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const clamped = Math.min(page, pageCount);
  const paged = useMemo(() => items.slice((clamped - 1) * pageSize, clamped * pageSize), [items, clamped, pageSize]);
  return { page: clamped, setPage, pageCount, paged };
}

export function Pagination({ page, pageCount, onChange }: { page: number; pageCount: number; onChange: (p: number) => void }) {
  if (pageCount <= 1) return null;
  return (
    <div className="mt-10 flex items-center justify-center gap-1.5">
      <button disabled={page === 1} onClick={() => onChange(page - 1)} className="mo-press rounded-lg border border-white/8 px-3 py-1.5 text-sm text-mid transition-colors hover:border-cyan-400/25 hover:text-hi disabled:opacity-30">Prev</button>
      {Array.from({ length: pageCount }).map((_, i) => (
        <button key={i} onClick={() => onChange(i + 1)} className={cn("mo-tap h-9 w-9 rounded-lg text-sm transition-colors", page === i + 1 ? "bg-cyan-400/10 text-cyan-300" : "text-mid hover:text-hi")}>{i + 1}</button>
      ))}
      <button disabled={page === pageCount} onClick={() => onChange(page + 1)} className="rounded-lg border border-white/8 px-3 py-1.5 text-sm text-mid transition-colors hover:text-hi disabled:opacity-30">Next</button>
    </div>
  );
}
