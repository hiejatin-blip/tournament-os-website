import { ease } from "@/shared/motion/motion-tokens";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button, Stagger, StaggerItem, SectionHeading , spotlightHandlers } from "../ui";
import { cn } from "@/lib/utils";

/* ---- Feature grid ---- */
export function FeatureGrid({ items, columns = 3 }: { items: { icon: LucideIcon; title: string; desc: string }[]; columns?: 2 | 3 | 4 }) {
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <Stagger className={cn("grid gap-4", cols)}>
      {items.map((f, i) => (
        <StaggerItem key={f.title} className="h-full">
          <div
            {...spotlightHandlers}
            className="mo-lift spotlight group relative h-full overflow-hidden rounded-2xl glass-card p-6"
          >
            <span className="pointer-events-none absolute right-5 top-5 font-mono text-[10px] text-lo/50">{String(i + 1).padStart(2, "0")}</span>
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/8 bg-void-800 text-cyan-300 transition-all duration-500 group-hover:glow-cyan group-hover:-rotate-6 group-hover:scale-105"><f.icon className="h-5 w-5" /></span>
            <h3 className="mt-4 text-lg font-semibold text-hi transition-colors group-hover:text-cyan-100">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mid">{f.desc}</p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/* ---- Split feature block (alternating) ---- */
export function SplitBlock({
  eyebrow, title, description, bullets, visual, reverse = false,
}: { eyebrow: string; title: ReactNode; description: string; bullets?: string[]; visual: ReactNode; reverse?: boolean }) {
  return (
    <div className={cn("grid items-center gap-10 lg:grid-cols-2", reverse && "lg:[&>*:first-child]:order-2")}>
      <motion.div initial={{ opacity: 0, x: reverse ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.8, ease: ease.emphasized }}>
        <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">{eyebrow}</span>
        <h3 className="mt-4 text-2xl font-bold text-hi sm:text-3xl">{title}</h3>
        <p className="mt-3 text-base leading-relaxed text-mid">{description}</p>
        {bullets && (
          <ul className="mt-6 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-hi">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cyan-400/15"><Check className="h-3 w-3 text-cyan-300" /></span>{b}
              </li>
            ))}
          </ul>
        )}
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.9, ease: ease.emphasized }}>
        {visual}
      </motion.div>
    </div>
  );
}

/* ---- Stat band ---- */
export function StatBand({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/6 md:grid-cols-4">
      {stats.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }} className="group relative bg-void-900/50 p-6 backdrop-blur transition-colors hover:bg-void-850/70">
          <span className="pointer-events-none absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
          <div className="font-display text-3xl font-bold text-hi group-hover:text-cyan-100 sm:text-4xl">{s.value}</div>
          <p className="mt-1.5 text-sm text-mid">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ---- Big CTA band ---- */
export function CTABand({ title, description }: { title?: ReactNode; description?: string }) {
  return (
    <section className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[40vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px] animate-breathe" />
      <div className="relative mx-auto max-w-4xl">
        <div className="conic-border overflow-hidden rounded-[2rem] border border-white/8 bg-gradient-to-b from-void-800/80 to-void-950/90 px-6 py-16 text-center elev-3 backdrop-blur-xl sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold leading-[1.05] text-gradient sm:text-4xl md:text-5xl">
            {title ?? <>Run your next tournament on <span className="text-gradient-holo">autopilot.</span></>}
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-base text-mid">{description ?? "Deploy Tournament OS in minutes. Free to start, no credit card required."}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button variant="primary" size="lg" href="/pricing" iconRight={ArrowRight}>Get access</Button>
            <Button variant="secondary" size="lg" href="/explore">Explore the platform</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- Section wrapper for inner pages ---- */
export function PageSection({ heading, eyebrow, description, children, className }: {
  heading?: ReactNode; eyebrow?: string; description?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <section className={cn("relative px-5 py-16 sm:px-8 sm:py-24", className)}>
      <div className="mx-auto max-w-7xl">
        {heading && <SectionHeading eyebrow={eyebrow} title={heading} description={description} />}
        <div className={heading ? "mt-14" : ""}>{children}</div>
      </div>
    </section>
  );
}

/* ---- Breadcrumb ---- */
export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-lo">
      {items.map((it, i) => (
        <span key={it.label} className="flex items-center gap-2">
          {it.to ? <Link to={it.to} className="transition-colors hover:text-cyan-300">{it.label}</Link> : <span className="text-mid">{it.label}</span>}
          {i < items.length - 1 && <span className="text-white/20">/</span>}
        </span>
      ))}
    </nav>
  );
}