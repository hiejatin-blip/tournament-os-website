import { ease } from "@/shared/motion/motion-tokens";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, Circle, Clock, Zap, Globe, Terminal } from "lucide-react";
import { PageHeader } from "../components/site/PageHeader";
import { PageSection, CTABand } from "../components/site/blocks";
import { Timeline } from "@/components/aceternity/timeline";
import GlitchText from "@/components/ui-lib/kokonutui/texts/glitch-text";
import { ProgressCircle, ProgressBar } from "@tremor/react";
import { TracingBeam } from "@/components/aceternity/tracing-beam";
import { Button, Stagger, StaggerItem, LiveDot } from "../components/ui";
import { cn } from "@/lib/utils";

/* ---------- Changelog ---------- */
const changelog = [
  { version: "v4.2.0", date: "Jan 2026", tag: "latest", items: ["Real-time bracket recompute engine (sub-second propagation)", "Swiss pairing v2 with Buchholz tiebreakers", "Discord thread auto-archival on match completion", "28th edge region live (São Paulo)"] },
  { version: "v4.1.0", date: "Dec 2025", tag: "", items: ["Anti-smurf detection model 3.0", "Custom registration field types", "Organizer analytics exports (CSV + API)"] },
  { version: "v4.0.0", date: "Nov 2025", tag: "major", items: ["Rebuilt automation engine — event-driven core", "New unified organizer dashboard", "SSO / SAML for enterprise", "Public platform: guild & player directories"] },
];

export function ChangelogPage() {
  return (
    <>
      <PageHeader eyebrow="Changelog" title={<>Shipping <span className="text-gradient-cyan">relentlessly.</span></>} description="Every improvement to the Tournament OS platform, in reverse chronological order." />
      <PageSection>
        <Timeline
          data={changelog.map((c) => ({
            title: c.version,
            content: (
              <div>
                <div className="mb-3 flex items-center gap-3">
                  {c.tag && <span className={cn("rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider", c.tag === "latest" ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300" : c.tag === "major" ? "border-amber-400/40 bg-amber-400/10 text-amber-300" : "border-white/10 text-mid")}>{c.tag}</span>}
                  <span className="font-mono text-xs text-lo">{c.date}</span>
                </div>
                <ul className="space-y-2 rounded-2xl glass-card p-5">
                  {c.items.map((it) => (<li key={it} className="flex items-start gap-2.5 text-sm text-mid"><Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />{it}</li>))}
                </ul>
              </div>
            ),
          }))}
        />
      </PageSection>
      <CTABand />
    </>
  );
}

/* ---------- Roadmap ---------- */
const roadmap = [
  { phase: "Now", icon: Zap, color: "text-cyan-300", items: ["Mobile companion app (beta)", "AI seeding assistant", "Public API explorer"] },
  { phase: "Next", icon: Clock, color: "text-amber-300", items: ["Plugin marketplace", "White-label portal", "Webhook manager v2", "Theme store"] },
  { phase: "Later", icon: Circle, color: "text-mid", items: ["Enterprise console", "Developer dashboard", "Native OBS integration", "Sponsorship marketplace"] },
];

export function RoadmapPage() {
  return (
    <>
      <PageHeader eyebrow="Roadmap" title={<>Where we're <span className="text-gradient-cyan">headed.</span></>} description="A transparent look at what's shipping now, what's next, and what's on the horizon." />
      <PageSection>
        <TracingBeam>
          <div className="space-y-8">
            {roadmap.map((r) => (
              <div key={r.phase} className="rounded-3xl glass-card p-6">
                <div className="flex items-center gap-2"><r.icon className={cn("h-5 w-5", r.color)} /><h3 className="font-display text-lg font-bold text-hi">{r.phase}</h3></div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {r.items.map((it) => (
                    <div key={it} className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.02] p-3.5 text-sm text-hi">
                      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", r.phase === "Now" ? "bg-cyan-400" : r.phase === "Next" ? "bg-amber-400" : "bg-white/20")} />{it}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TracingBeam>
      </PageSection>
      <CTABand />
    </>
  );
}

/* ---------- Generic content page (About, Contact, Docs, Blog, Careers) ---------- */
export function ContentPage({ eyebrow, title, description, body }: { eyebrow: string; title: React.ReactNode; description: string; body?: React.ReactNode }) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <PageSection>{body ?? <div className="rounded-3xl glass-card p-8 text-sm leading-relaxed text-mid">Content coming soon. This section is part of the full Tournament OS product architecture.</div>}</PageSection>
      <CTABand />
    </>
  );
}

/* ---------- Status ---------- */
export function StatusPage() {
  const systems = [
    { name: "Automation Engine", status: "Operational", up: 99.99, color: "emerald" as const },
    { name: "Tournament Engine", status: "Operational", up: 99.98, color: "emerald" as const },
    { name: "Discord Integration", status: "Operational", up: 99.95, color: "emerald" as const },
    { name: "Live Brackets", status: "Operational", up: 99.97, color: "emerald" as const },
    { name: "Analytics Pipeline", status: "Operational", up: 99.91, color: "emerald" as const },
    { name: "Edge Network (28 regions)", status: "Operational", up: 99.99, color: "emerald" as const },
    { name: "API", status: "Operational", up: 99.93, color: "emerald" as const },
    { name: "Dashboard", status: "Operational", up: 99.99, color: "emerald" as const },
  ];
  return (
    <>
      <PageHeader eyebrow="Status" title={<>All systems <span className="text-gradient-cyan">operational.</span></>} description="Real-time status of every Tournament OS service." />
      <PageSection>
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center gap-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/5 p-5">
            <ProgressCircle value={99.99} size="lg" color="emerald" showAnimation />
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-emerald-300"><LiveDot color="bg-emerald-400" />All systems operational</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-mid">99.99% uptime · 90 days</p>
            </div>
          </div>
          <div className="divide-y divide-white/6 overflow-hidden rounded-2xl glass-card">
            {systems.map((s) => (
              <div key={s.name} className="flex items-center justify-between gap-4 px-5 py-4">
                <span className="text-sm text-hi">{s.name}</span>
                <div className="flex items-center gap-4">
                  <ProgressBar value={s.up} color={s.color} className="w-36" showAnimation />
                  <span className="w-24 text-right font-mono text-xs text-emerald-400">{s.up.toFixed(2)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageSection>
    </>
  );
}

/* ---------- 404 ---------- */
export function NotFoundPage() {
  return (
    <>
      <div className="grid min-h-[70vh] place-items-center px-5">
        <div className="text-center">
          <GlitchText text="404" color="cyan" className="font-display text-[22vw] font-bold leading-none sm:text-[12rem]" isStatic={false} />
          <p className="mt-4 text-lg text-mid">This page went off-bracket.</p>
          <div className="mt-8 flex justify-center gap-3"><Button variant="primary" href="/" iconRight={ArrowRight}>Back home</Button><Button variant="secondary" href="/explore">Explore</Button></div>
        </div>
      </div>
    </>
  );
}