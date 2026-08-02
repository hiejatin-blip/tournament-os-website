import { useEffect, useState, useRef, createContext, useContext, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X, Zap, MessageSquare, Wand2 } from "lucide-react";
import { generateCopilotReply, suggestedPrompts, type CopilotMessage, relTime } from "./aiEngine";
import { cn } from "@/lib/utils";

/* ============================================================
   AI Copilot — global slide-over. Toggle via useCopilot() or ⌘I.
   ============================================================ */

type Ctx = { open: boolean; setOpen: (v: boolean) => void };
const CopilotCtx = createContext<Ctx | null>(null);

export function CopilotProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "i") { e.preventDefault(); setOpen((v) => !v); }
      if (e.key === "Escape" && open) setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <CopilotCtx.Provider value={{ open, setOpen }}>
      {children}
      <CopilotPanel />
    </CopilotCtx.Provider>
  );
}

export function useCopilot() {
  const ctx = useContext(CopilotCtx);
  if (!ctx) throw new Error("useCopilot must be used within CopilotProvider");
  return ctx;
}

/* ------------------------------------------------------------------ SEED MESSAGE */
const INTRO: CopilotMessage = {
  id: "intro",
  role: "assistant",
  content:
    "I'm your operations copilot. I watch the live telemetry, flag risks early, and suggest actions when I see patterns. Ask me anything — or try one of the prompts below.",
  ts: Date.now(),
  chips: suggestedPrompts.map((p) => ({ label: p, prompt: p })),
};

function CopilotPanel() {
  const { open, setOpen } = useCopilot();
  const [messages, setMessages] = useState<CopilotMessage[]>([INTRO]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 100); }, [open]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, thinking]);

  function send(prompt: string) {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    const userMsg: CopilotMessage = { id: `u_${Date.now()}`, role: "user", content: trimmed, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);
    // Simulated latency
    window.setTimeout(() => {
      setMessages((prev) => [...prev, generateCopilotReply(trimmed)]);
      setThinking(false);
    }, 700 + Math.random() * 600);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-[90] bg-void-950/60 backdrop-blur-sm" />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 z-[91] flex h-full w-[94%] max-w-lg flex-col border-l border-white/10 bg-void-900/95 backdrop-blur-xl"
          >
            <header className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-cyan-400/25 bg-gradient-to-br from-cyan-500/20 to-violet-500/15 text-cyan-300">
                  <Sparkles className="h-4 w-4" />
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">Tournament OS · Copilot</p>
                  <h3 className="font-display text-lg font-bold text-hi">Intelligence assistant</h3>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-lo hover:text-hi"><X className="h-4 w-4" /></button>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5 no-scrollbar">
              {messages.map((m) => <MessageBubble key={m.id} m={m} onChip={send} />)}
              <AnimatePresence>
                {thinking && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-sm text-lo">
                    <span className="grid h-7 w-7 place-items-center rounded-lg border border-cyan-400/25 bg-cyan-400/5"><Wand2 className="h-3.5 w-3.5 text-cyan-300" /></span>
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 [animation-delay:120ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 [animation-delay:240ms]" />
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <footer className="border-t border-white/8 p-4">
              <form
                onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="flex items-end gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-2 focus-within:border-cyan-400/40"
              >
                <MessageSquare className="ml-1 h-4 w-4 shrink-0 text-lo" />
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about scheduling, verification, growth…"
                  className="min-w-0 flex-1 bg-transparent px-1 py-1.5 text-sm text-hi placeholder:text-lo focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || thinking}
                  className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-500 text-void-950 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                ><Send className="h-4 w-4" /></button>
              </form>
              <p className="mt-2 flex items-center justify-between font-mono text-[10px] text-lo">
                <span>Press <kbd className="rounded border border-white/10 bg-white/5 px-1.5">⌘ I</kbd> to toggle anywhere</span>
                <span>AI generated · verify before acting</span>
              </p>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function MessageBubble({ m, onChip }: { m: CopilotMessage; onChip: (p: string) => void }) {
  const isUser = m.role === "user";
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <span className={cn("mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[10px] font-bold", isUser ? "bg-void-800 text-mid" : "border border-cyan-400/25 bg-cyan-400/5 text-cyan-300")}>
        {isUser ? "YOU" : <Sparkles className="h-3.5 w-3.5" />}
      </span>
      <div className={cn("min-w-0 flex-1", isUser && "text-right")}>
        <div className={cn("inline-block max-w-full rounded-2xl px-4 py-2.5 text-left text-sm leading-relaxed", isUser ? "bg-cyan-400/10 text-hi" : "border border-white/8 bg-void-950/50 text-hi")}>
          {m.content}
        </div>
        {m.chips && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {m.chips.map((c) => (
              <button key={c.label} onClick={() => onChip(c.prompt)} className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1 text-[11px] text-mid transition-colors hover:border-cyan-400/30 hover:text-cyan-300">
                <Zap className="h-3 w-3" />{c.label}
              </button>
            ))}
          </div>
        )}
        <p className={cn("mt-1 font-mono text-[10px] text-lo", isUser && "text-right")}>{relTime(m.ts)}</p>
      </div>
    </motion.div>
  );
}

/* Trigger button used in the dashboard topbar */
export function CopilotTriggerButton() {
  const { setOpen } = useCopilot();
  return (
    <button
      onClick={() => setOpen(true)}
      title="Ask the Copilot (⌘I)"
      className="group relative flex items-center gap-2 rounded-lg border border-cyan-400/25 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 px-2.5 py-1.5 text-xs font-medium text-cyan-300 transition-all hover:border-cyan-400/50 hover:from-cyan-500/20"
    >
      <Sparkles className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Copilot</span>
      <kbd className="hidden rounded border border-cyan-400/20 bg-void-950/60 px-1 font-mono text-[9px] sm:inline">⌘I</kbd>
      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
    </button>
  );
}
