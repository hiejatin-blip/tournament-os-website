import { ease } from "@/shared/motion/motion-tokens";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ArrowRight, ChevronDown, Search } from "lucide-react";
import { Logo } from "../Logo";
import { Button } from "../ui";
import { useCommandSearch } from "./CommandSearch";
import { ProfileMenu } from "@/components/ui/kit/ProfileMenu";
import { useEscapeKey, useFocusTrap } from "@/shared/hooks/useFocusTrap";
import { marketingNav, type NavGroup } from "@/shared/config/navigation";
import { useUser } from "@/features/auth/AuthContext";
import { cn } from "@/lib/utils";

function MegaPanel({ groups }: { groups: NavGroup[] }) {
  return (
    <div className="grid gap-8 p-6 sm:grid-cols-3">
      {groups.map((g) => (
        <div key={g.heading}>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-lo">{g.heading}</p>
          <ul className="space-y-1">
            {g.links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="group flex items-start gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-white/[0.04]">
                  {l.icon && (
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/8 bg-void-800 text-cyan-300 transition-all group-hover:border-cyan-400/40 group-hover:glow-cyan">
                      <l.icon className="h-4 w-4" />
                    </span>
                  )}
                  <span>
                    <span className="block text-sm font-medium text-hi transition-colors group-hover:text-cyan-100">{l.label}</span>
                    {l.desc && <span className="block text-xs text-mid">{l.desc}</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(drawerRef, open);
  const { scrollY } = useScroll();
  /* Escape closes the drawer; lock body scroll while open */
  useEscapeKey(open, () => setOpen(false));
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);
  const { pathname } = useLocation();
  const search = useCommandSearch();
  const user = useUser();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 16));
  useEffect(() => { setOpen(false); setHovered(null); }, [pathname]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[60] pt-3 sm:pt-4" onMouseLeave={() => setHovered(null)}>
        <div className={cn("mx-auto px-4 transition-all duration-700 sm:px-8", scrolled ? "max-w-6xl" : "max-w-7xl")}>
          <div className={cn("relative flex items-center justify-between rounded-2xl px-3 py-2 transition-all duration-500", scrolled || hovered ? "glass-strong elev-2" : "border border-transparent")}>
            <Link to="/"><Logo /></Link>

            <nav className="hidden items-center gap-0.5 lg:flex">
              {marketingNav.map((item) => {
                const active = item.to ? (item.to === "/" ? pathname === "/" : pathname.startsWith(item.to)) : pathname.startsWith(`/${item.label.toLowerCase()}`);
                if (item.groups) {
                  return (
                    <div
                      key={item.label}
                      onMouseEnter={() => setHovered(item.label)}
                      onMouseLeave={() => setHovered((h) => (h === item.label ? null : h))}
                      onFocus={() => setHovered(item.label)}
                      className="relative"
                    >
                      <button
                        aria-expanded={hovered === item.label}
                        aria-haspopup="true"
                        className={cn("flex items-center gap-1 rounded-full px-3.5 py-2 text-[13.5px] transition-colors", hovered === item.label || active ? "text-hi" : "text-mid hover:text-hi")}
                      >
                        {item.label}
                        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-300", hovered === item.label && "rotate-180")} />
                      </button>
                    </div>
                  );
                }
                return (
                  <Link key={item.label} to={item.to!} className={cn("rounded-full px-3.5 py-2 text-[13.5px] transition-colors", active ? "text-cyan-300" : "text-mid hover:text-hi")}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <button onClick={() => search.setOpen(true)} aria-label="Search" className="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.02] px-3 py-2 text-sm text-lo transition-colors hover:border-cyan-400/25 hover:text-hi">
                <Search className="h-4 w-4" /><span className="hidden xl:inline">Search</span>
                <kbd className="rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px]">⌘K</kbd>
              </button>
              {user ? (
                <ProfileMenu />
              ) : (
                <>
                  <Button variant="ghost" size="sm" href="/login" magnetic={false}>Sign in</Button>
                  <Button variant="primary" size="sm" href="/pricing" iconRight={ArrowRight}>Get access</Button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <button onClick={() => search.setOpen(true)} aria-label="Search" className="grid h-10 w-10 place-items-center rounded-xl glass text-hi"><Search className="h-5 w-5" /></button>
              <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-xl glass text-hi"><Menu className="h-5 w-5" /></button>
            </div>

            {/* Mega dropdown */}
            <AnimatePresence>
              {hovered && marketingNav.find((i) => i.label === hovered)?.groups && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: ease.emphasized }}
                  className="absolute left-1/2 top-full mt-3 w-[min(720px,90vw)] -translate-x-1/2 overflow-hidden rounded-2xl glass-strong elev-3"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                  <MegaPanel groups={marketingNav.find((i) => i.label === hovered)!.groups!} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[80] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Site navigation">
            <div className="absolute inset-0 bg-void-950/90 backdrop-blur-xl" onClick={() => setOpen(false)} />
            <motion.div ref={drawerRef} className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col gap-1 overflow-y-auto border-l border-white/8 bg-void-900 p-6" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }}>
              <div className="mb-6 flex items-center justify-between">
                <Link to="/" onClick={() => setOpen(false)}><Logo /></Link>
                <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl glass text-hi"><X className="h-5 w-5" /></button>
              </div>
              {marketingNav.map((item) => {
                if (!item.groups) {
                  return <Link key={item.label} to={item.to!} onClick={() => setOpen(false)} className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3.5 text-base font-medium text-hi">{item.label}</Link>;
                }
                const isOpen = mobileGroup === item.label;
                return (
                  <div key={item.label} className="rounded-xl border border-white/5 bg-white/[0.02]">
                    <button onClick={() => setMobileGroup(isOpen ? null : item.label)} className="flex w-full items-center justify-between px-4 py-3.5 text-base font-medium text-hi">
                      {item.label}
                      <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="space-y-0.5 px-2 pb-2">
                            {item.groups.flatMap((g) => g.links).map((l) => (
                              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-mid transition-colors hover:bg-white/5 hover:text-hi">{l.label}</Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              <div className="mt-auto space-y-2.5 pt-4">
                <Button variant="outline" size="lg" href="/login" className="w-full" magnetic={false}>Sign in</Button>
                <Button variant="primary" size="lg" href="/pricing" className="w-full" iconRight={ArrowRight} magnetic={false}>Get access</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}