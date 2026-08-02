import { Link } from "react-router-dom";
import { Globe, MessageCircle, Send, AtSign } from "lucide-react";
import { Logo } from "../Logo";
import { LiveDot } from "../ui";
import { footerColumns } from "@/shared/config/navigation";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/6 bg-void-900/50">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-[-2.5rem] select-none text-center font-display text-[20vw] font-bold leading-none text-white/[0.015]">TOURNAMENT OS</div>
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Link to="/"><Logo /></Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mid">The operating system for competitive tournaments. Automate the entire lifecycle.</p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/6 bg-white/[0.02] px-3 py-1.5">
              <LiveDot /><span className="font-mono text-[11px] uppercase tracking-[0.16em] text-mid">All systems operational</span>
            </div>
          </div>
          {footerColumns.map((c) => (
            <div key={c.heading}>
              <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-lo">{c.heading}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.to}><Link to={l.to} className="text-sm text-mid transition-colors hover:text-cyan-300">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-white/6 pt-7 sm:flex-row">
          <p className="text-xs text-lo">© 2026 Tournament OS. Engineered for competitive excellence.</p>
          <div className="flex items-center gap-2">
            {[Globe, MessageCircle, Send, AtSign].map((I, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-white/6 bg-white/[0.02] text-mid transition-all hover:-translate-y-0.5 hover:border-cyan-400/35 hover:text-cyan-300"><I className="h-4 w-4" /></a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
