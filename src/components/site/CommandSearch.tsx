import { ease } from "@/shared/motion/motion-tokens";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trophy, Building2, Users, UserCheck, CornerDownLeft, ArrowUp, ArrowDown } from "lucide-react";
import { useSearchIndex, searchAll, type SearchResult } from "@/lib/queries";
import { quickActions } from "@/shared/config/navigation";
import { cn } from "@/lib/utils";

const typeIcon = { Tournament: Trophy, Guild: Building2, Team: Users, Player: UserCheck } as const;
const typeColor = {
  Tournament: "text-cyan-300", Guild: "text-amber-300", Team: "text-emerald-400", Player: "text-violet-300",
} as const;

/* Global command palette — opens with the topbar button or ⌘K / Ctrl-K */
export function CommandSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const index = useSearchIndex();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => searchAll(index, query, 8), [index, query]);

  // Popular suggestions when empty
  const suggestions = useMemo(() => index.filter((r) => r.type === "Tournament").slice(0, 4), [index]);
  const shown = query ? results : suggestions;

  useEffect(() => { if (open) { setQuery(""); setActive(0); setTimeout(() => inputRef.current?.focus(), 40); } }, [open]);
  useEffect(() => { setActive(0); }, [query]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, shown.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      else if (e.key === "Enter" && shown[active]) { navigate(shown[active].to); onClose(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, shown, active, navigate, onClose]);

  function go(r: SearchResult) { navigate(r.to); onClose(); }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[95] flex items-start justify-center px-4 pt-[12vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-void-950/80 backdrop-blur-md" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: ease.emphasized }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-void-900/95 backdrop-blur-2xl elev-3"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
            {/* Input */}
            <div className="flex items-center gap-3 border-b border-white/8 px-5 py-4">
              <Search className="h-5 w-5 shrink-0 text-lo" />
              <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tournaments, guilds, teams, players…" className="w-full bg-transparent text-[15px] text-hi placeholder:text-lo focus:outline-none" />
              <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-lo">ESC</kbd>
            </div>

            {/* Results */}
            <div className="max-h-[52vh] overflow-y-auto p-2 no-scrollbar">
              {!query && (
                <>
                  <p className="px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-lo">Quick actions</p>
                  {quickActions.map((qa) => (
                    <button
                      key={qa.label}
                      onClick={() => go({ to: qa.to, title: qa.label, subtitle: "", type: "Tournament" as never, tag: "→" })}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.03]"
                    >
                      {qa.icon && <qa.icon className="h-4 w-4 shrink-0 text-cyan-300" />}
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-hi">{qa.label}</span>
                    </button>
                  ))}
                  <p className="px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-lo">Popular tournaments</p>
                </>
              )}
              {shown.length === 0 ? (
                <div className="px-3 py-10 text-center"><p className="text-sm text-mid">No results for “{query}”.</p></div>
              ) : shown.map((r, i) => {
                const Icon = typeIcon[r.type];
                return (
                  <button
                    key={r.to}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r)}
                    className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors", active === i ? "bg-cyan-400/10" : "hover:bg-white/[0.03]")}
                  >
                    <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/8 bg-void-800 text-[11px] font-bold", active === i ? "text-cyan-200" : "text-hi")}>{r.tag}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-hi">{r.title}</span>
                      <span className="block truncate text-xs text-mid">{r.subtitle}</span>
                    </span>
                    <span className={cn("flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider", typeColor[r.type])}>
                      <Icon className="h-3.5 w-3.5" />{r.type}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Footer hints */}
            <div className="flex items-center justify-between border-t border-white/8 px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-lo">
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1"><ArrowUp className="h-3 w-3" /><ArrowDown className="h-3 w-3" /> navigate</span>
                <span className="flex items-center gap-1"><CornerDownLeft className="h-3 w-3" /> open</span>
              </span>
              <span>Tournament OS Search</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Single global palette state — owned by SearchProvider (mounted once in App) */
export { useCommandSearch } from "@/shared/search/SearchProvider";