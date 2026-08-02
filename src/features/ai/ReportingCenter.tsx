import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download, Sparkles, Filter, Play, Check,
  Trophy, Users, Users2, ShieldCheck, Building2, Activity, BarChart3,
} from "lucide-react";
import { DashboardCrumb } from "@/app/layouts/DashboardLayout";
import { reportTemplates, type ReportTemplate } from "./aiEngine";
import { useCopilot } from "./AICopilotPanel";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Tournament", "Guild", "Player", "Team", "Moderator", "Operational", "Analytics"] as const;
type Cat = (typeof CATEGORIES)[number];

const catIcon: Record<ReportTemplate["category"], any> = {
  Tournament: Trophy, Guild: Building2, Player: Users, Team: Users2,
  Moderator: ShieldCheck, Operational: Activity, Analytics: BarChart3,
};

const catColor: Record<ReportTemplate["category"], string> = {
  Tournament: "text-cyan-300 border-cyan-400/25 bg-cyan-400/5",
  Guild: "text-violet-300 border-violet-400/25 bg-violet-400/5",
  Player: "text-emerald-300 border-emerald-400/25 bg-emerald-400/5",
  Team: "text-emerald-300 border-emerald-400/25 bg-emerald-400/5",
  Moderator: "text-amber-300 border-amber-400/25 bg-amber-400/5",
  Operational: "text-cyan-300 border-cyan-400/25 bg-cyan-400/5",
  Analytics: "text-violet-300 border-violet-400/25 bg-violet-400/5",
};

export function ReportingCenter() {
  const [cat, setCat] = useState<Cat>("All");
  const [selected, setSelected] = useState<ReportTemplate | null>(null);
  const { setOpen } = useCopilot();
  const filtered = cat === "All" ? reportTemplates : reportTemplates.filter((r) => r.category === cat);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/8 pb-5">
        <div>
          <DashboardCrumb trail={["Organizer", "Reporting Center"]} />
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-2xl font-bold uppercase tracking-[0.1em] text-hi sm:text-3xl">Reporting Center</h1>
            <span className="rounded-md border border-cyan-400/30 bg-cyan-500/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-cyan-300">{reportTemplates.length} templates</span>
          </div>
          <p className="mt-1 font-mono text-xs text-lo">// professional reports · PDF · CSV · JSON · scheduled or on-demand</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-cyan-400/25 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 px-4 py-2.5 text-sm text-cyan-300 transition-colors hover:border-cyan-400/50"
        >
          <Sparkles className="h-4 w-4" /> Ask Copilot to build one
        </button>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-lo"><Filter className="h-3 w-3" /> Category</span>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={cn("rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors", cat === c ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300" : "border-white/8 text-mid hover:border-white/20 hover:text-hi")}>{c}</button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((r) => {
          const Icon = catIcon[r.category];
          return (
            <motion.button
              key={r.id}
              layout
              onClick={() => setSelected(r)}
              className="group flex h-full flex-col rounded-xl border border-white/8 bg-void-900/40 p-5 text-left backdrop-blur transition-colors hover:border-cyan-400/25 hover:bg-void-900/70"
            >
              <div className="flex items-center justify-between">
                <span className={cn("grid h-9 w-9 place-items-center rounded-lg border", catColor[r.category])}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-lo">{r.category}</span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-hi group-hover:text-cyan-100">{r.name}</h3>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-mid">{r.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {r.formats.map((f) => <span key={f} className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-mid">{f}</span>)}
              </div>
              <p className="mt-2 font-mono text-[10px] text-lo">{r.lastGenerated ? `Last generated ${r.lastGenerated}` : "Never generated"}</p>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && <ReportModal r={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}

function ReportModal({ r, onClose }: { r: ReportTemplate; onClose: () => void }) {
  const [fmt, setFmt] = useState<ReportTemplate["formats"][number]>(r.formats[0]);
  const [enabled, setEnabled] = useState<Record<string, boolean>>(Object.fromEntries(r.sections.map((s) => [s, true])));
  const [state, setState] = useState<"idle" | "generating" | "ready">("idle");

  function generate() {
    setState("generating");
    window.setTimeout(() => setState("ready"), 1600);
  }

  const Icon = catIcon[r.category];
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-[80] bg-void-950/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-1/2 top-1/2 z-[81] w-[94%] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/10 bg-void-900/95 backdrop-blur-xl"
      >
        <header className="flex items-center gap-3 border-b border-white/8 px-5 py-4">
          <span className={cn("grid h-9 w-9 place-items-center rounded-lg border", catColor[r.category])}><Icon className="h-4 w-4" /></span>
          <div className="flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">{r.category} · Report</p>
            <h3 className="font-display text-lg font-bold text-hi">{r.name}</h3>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-lo hover:text-hi">✕</button>
        </header>

        <div className="p-5">
          <p className="text-sm leading-relaxed text-mid">{r.description}</p>

          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-lo">Sections</p>
          <div className="mt-2 space-y-1.5">
            {r.sections.map((s) => (
              <label key={s} className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-white/6 bg-white/[0.02] px-3 py-2 hover:bg-white/[0.04]">
                <input type="checkbox" checked={enabled[s]} onChange={(e) => setEnabled({ ...enabled, [s]: e.target.checked })} className="rounded border-white/15 bg-transparent text-cyan-400 focus:ring-cyan-400/50" />
                <span className="text-sm text-hi">{s}</span>
              </label>
            ))}
          </div>

          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-lo">Format</p>
          <div className="mt-2 flex gap-2">
            {r.formats.map((f) => (
              <button key={f} onClick={() => setFmt(f)} className={cn("flex-1 rounded-lg border px-3 py-2 font-mono text-xs transition-colors", fmt === f ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300" : "border-white/8 text-mid hover:border-white/20")}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-white/8 bg-white/[0.02] px-5 py-4">
          <p className="font-mono text-[10px] text-lo">Report will be delivered to your email + dashboard.</p>
          {state === "idle" && (
            <button onClick={generate} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-void-950 transition-transform hover:scale-[1.02]">
              <Play className="h-3.5 w-3.5" /> Generate
            </button>
          )}
          {state === "generating" && (
            <span className="flex items-center gap-2 text-sm text-cyan-300">
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="grid h-4 w-4 place-items-center rounded-full border border-cyan-400/40 border-t-transparent" />
              Generating {fmt}…
            </span>
          )}
          {state === "ready" && (
            <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-400 px-4 py-2 text-sm font-semibold text-void-950 transition-transform hover:scale-[1.02]">
              <Download className="h-3.5 w-3.5" /> Download {fmt}
              <Check className="h-3.5 w-3.5" />
            </button>
          )}
        </footer>
      </motion.div>
    </>
  );
}
