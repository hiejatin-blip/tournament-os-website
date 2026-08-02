import { ease } from "@/shared/motion/motion-tokens";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Share2, Radio, Trophy, Users, Calendar, MapPin, Gamepad2,
  ShieldCheck, MessageSquare, ThumbsUp, ChevronRight,
} from "lucide-react";
import { PageSection, Breadcrumb } from "../../components/site/blocks";
import { Button, LiveDot, Stagger, StaggerItem } from "../../components/ui";
import { EmptyState, CardBanner } from "../../components/site/PublicKit";
import { useTournament } from "@/lib/queries";
import { tournamentMatches, tournamentSchedule, tournamentDiscussion } from "@/lib/detail";
import { statusStyles, gameShort, teams, type Tournament } from "@/lib/directory";
import { cn } from "@/lib/utils";

/* Countdown to start date */
function useCountdown(iso: string) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const diff = Math.max(0, new Date(iso).getTime() - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
    over: diff === 0,
  };
}

function Countdown({ iso }: { iso: string }) {
  const c = useCountdown(iso);
  if (c.over) return null;
  const cells = [{ v: c.days, l: "days" }, { v: c.hours, l: "hrs" }, { v: c.mins, l: "min" }, { v: c.secs, l: "sec" }];
  return (
    <div className="flex gap-2">
      {cells.map((x) => (
        <div key={x.l} className="min-w-[54px] rounded-xl border border-white/8 bg-void-900/60 px-3 py-2 text-center backdrop-blur">
          <div className="font-display text-xl font-bold tabular-nums text-hi">{String(x.v).padStart(2, "0")}</div>
          <div className="font-mono text-[9px] uppercase tracking-wider text-lo">{x.l}</div>
        </div>
      ))}
    </div>
  );
}

function Tabs({ tabs, active, setActive }: { tabs: string[]; active: string; setActive: (s: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1 overflow-x-auto rounded-2xl glass-card p-1.5 no-scrollbar">
      {tabs.map((t) => (
        <button key={t} onClick={() => setActive(t)} className={cn("relative shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-colors", active === t ? "text-void-950" : "text-mid hover:text-hi")}>
          {active === t && <motion.span layoutId="tprofiletab" className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
          <span className="relative">{t}</span>
        </button>
      ))}
    </div>
  );
}

function LoadingHero() {
  return (
    <div className="px-5 pt-36 sm:px-8 sm:pt-44">
      <div className="mx-auto max-w-7xl">
        <div className="h-48 animate-pulse rounded-3xl bg-white/[0.03]" />
        <div className="mt-6 h-8 w-1/3 animate-pulse rounded bg-white/5" />
        <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-white/5" />
      </div>
    </div>
  );
}

/* ------------ Section renderers ------------ */
function Bracket() {
  return (
    <div className="overflow-x-auto rounded-2xl glass-card p-6 no-scrollbar">
      <svg viewBox="0 0 520 240" className="h-auto w-full min-w-[480px]">
        <g stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none"><path d="M120 30H170V90H120" /><path d="M120 150H170V210H120" /><path d="M330 60H390V180H330" /><path d="M280 60H330V180" /></g>
        <g stroke="rgba(34,211,238,0.7)" strokeWidth="1.4" fill="none"><path d="M120 90H170V60H280V120H390V120H470" /></g>
        {[{ x: 10, y: 18, n: "Vanta Black", w: false }, { x: 10, y: 78, n: "Helix Apex", w: true }, { x: 10, y: 138, n: "Nexus Prime", w: false }, { x: 10, y: 198, n: "Orbit.gg", w: true }].map((n) => (
          <g key={n.n}><rect x={n.x} y={n.y} width="110" height="24" rx="6" fill="rgba(10,10,24,0.9)" stroke={n.w ? "rgba(34,211,238,0.5)" : "rgba(255,255,255,0.06)"} /><text x={n.x + 12} y={n.y + 16} fontSize="10" fontFamily="JetBrains Mono,monospace" fill={n.w ? "#a5f3fc" : "#888"}>{n.n}</text></g>
        ))}
        <g><rect x="390" y="108" width="80" height="24" rx="6" fill="rgba(34,211,238,0.12)" stroke="rgba(34,211,238,0.6)" /><text x="404" y="124" fontSize="10" fontFamily="JetBrains Mono,monospace" fill="#a5f3fc">CHAMPION</text></g>
      </svg>
    </div>
  );
}

function MatchFeed({ t }: { t: Tournament }) {
  const matches = tournamentMatches(t);
  return (
    <div className="space-y-2.5">
      {matches.map((m) => (
        <div key={m.id} className="flex items-center gap-4 rounded-2xl glass-card px-4 py-3.5">
          <span className={cn("shrink-0 rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase", m.status === "Live" ? statusStyles.Live : m.status === "Final" ? "border-white/10 text-lo" : statusStyles.Upcoming)}>
            {m.status === "Live" ? <span className="flex items-center gap-1"><LiveDot color="bg-rose-400" className="scale-75" />Live</span> : m.status}
          </span>
          <span className="hidden font-mono text-[10px] text-lo sm:block">{m.round}</span>
          <div className="flex flex-1 items-center justify-center gap-3">
            <span className="flex-1 text-right text-sm font-medium text-hi">{m.teamA}</span>
            <span className="rounded-lg bg-void-950/60 px-3 py-1 font-mono text-sm font-bold text-cyan-300">{m.scoreA} : {m.scoreB}</span>
            <span className="flex-1 text-left text-sm font-medium text-hi">{m.teamB}</span>
          </div>
          <span className="hidden font-mono text-[10px] text-lo md:block">{m.time}</span>
        </div>
      ))}
    </div>
  );
}

function Schedule({ t }: { t: Tournament }) {
  const items = tournamentSchedule(t);
  return (
    <div className="relative rounded-2xl glass-card p-6">
      <div className="absolute left-[31px] top-8 h-[calc(100%-4rem)] w-px bg-white/8" />
      <div className="space-y-5">
        {items.map((s) => (
          <div key={s.phase} className="relative flex items-center gap-4">
            <span className={cn("z-10 grid h-4 w-4 place-items-center rounded-full border", s.done ? "border-cyan-400 bg-cyan-400/20" : "border-white/15 bg-void-900")}>
              {s.done && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
            </span>
            <div className="flex flex-1 items-center justify-between">
              <span className={cn("text-sm font-medium", s.done ? "text-hi" : "text-mid")}>{s.phase}</span>
              <span className="font-mono text-[11px] text-lo">{s.date} · {s.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Discussion({ t }: { t: Tournament }) {
  const posts = tournamentDiscussion(t);
  return (
    <div className="space-y-3">
      <div className="rounded-2xl glass-card p-4">
        <textarea placeholder="Join the discussion…" rows={2} className="w-full resize-none bg-transparent text-sm text-hi placeholder:text-lo focus:outline-none" />
        <div className="mt-2 flex justify-end"><Button variant="primary" size="sm" iconRight={ArrowRight} magnetic={false}>Post</Button></div>
      </div>
      {posts.map((p) => (
        <div key={p.id} className="rounded-2xl glass-card p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-cyan-500/25 to-amber-500/15 text-[11px] font-bold text-hi ring-1 ring-white/10">{p.avatar}</span>
            <div><p className="text-sm font-medium text-hi">{p.author}</p><p className="font-mono text-[10px] text-lo">{p.time}</p></div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-mid">{p.body}</p>
          <button className="mt-3 flex items-center gap-1.5 text-xs text-lo transition-colors hover:text-cyan-300"><ThumbsUp className="h-3.5 w-3.5" />{p.likes}</button>
        </div>
      ))}
    </div>
  );
}

export function TournamentProfile() {
  const { slug } = useParams();
  const { data: t, loading } = useTournament(slug);
  const [tab, setTab] = useState("Overview");

  if (loading) return <LoadingHero />;
  if (!t) return <PageSection><EmptyState title="Tournament not found" hint="This event may have been removed." icon={Trophy} /><div className="text-center"><Button variant="primary" href="/explore/tournaments" iconRight={ArrowRight}>Browse tournaments</Button></div></PageSection>;

  const tabs = ["Overview", "Rules", "Schedule", "Teams", "Bracket", "Live Feed", "Results", "Discussion"];
  const pct = Math.round((t.filled / t.slots) * 100);
  const bracketTeams = teams.slice(0, 8);
  const matches = tournamentMatches(t);

  return (
    <>
      {/* HERO with banner */}
      <section className="px-5 pt-28 sm:px-8 sm:pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/8 elev-3">
            <CardBanner gradient={t.gradient} className="h-56 sm:h-64" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
              <Breadcrumb items={[{ label: "Explore", to: "/explore" }, { label: "Tournaments", to: "/explore/tournaments" }, { label: t.name }]} />
              <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider", statusStyles[t.status])}>
                      {t.status === "Live" && <LiveDot color="bg-rose-400" />}{t.status}
                    </span>
                    <span className="rounded-md border border-white/10 bg-void-950/50 px-2 py-1 font-mono text-[11px] text-hi/80 backdrop-blur">{gameShort[t.game]}</span>
                    {t.status === "Live" && t.viewers ? <span className="flex items-center gap-1 font-mono text-[11px] text-hi/70"><Radio className="h-3.5 w-3.5" />{t.viewers.toLocaleString()} watching</span> : null}
                  </div>
                  <h1 className="mt-3 font-display text-3xl font-bold text-hi sm:text-5xl">{t.name}</h1>
                  <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-mid">
                    <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-cyan-400" /><Link to={`/explore/guilds/${t.organizer}`} className="hover:text-cyan-300">{t.organizerName}</Link></span>
                    <span className="flex items-center gap-1.5"><Gamepad2 className="h-4 w-4" />{t.format}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{t.region}</span>
                  </p>
                </div>
                {(t.status === "Upcoming" || t.status === "Registration") && <Countdown iso={t.startDate} />}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration + quick stats bar */}
      <PageSection className="!py-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[{ i: Trophy, l: "Prize pool", v: t.prize, c: "text-cyan-300" }, { i: Users, l: "Team size", v: t.teamSize === 1 ? "Solo" : `${t.teamSize} players`, c: "text-hi" }, { i: Gamepad2, l: "Mode", v: t.mode, c: "text-hi" }, { i: Calendar, l: "Starts", v: t.startsIn, c: "text-hi" }].map((s) => (
              <div key={s.l} className="rounded-2xl glass-card p-4"><s.i className="h-4 w-4 text-cyan-400" /><p className={cn("mt-3 font-display text-lg font-bold", s.c)}>{s.v}</p><p className="font-mono text-[10px] uppercase tracking-wider text-lo">{s.l}</p></div>
            ))}
          </div>
          <div className="rounded-2xl glass-card p-5">
            <div className="flex items-center justify-between text-sm"><span className="text-mid">Registration</span><span className="font-mono text-cyan-300">{pct}% full</span></div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/8"><motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: ease.emphasized }} className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300" /></div>
            <p className="mt-2 font-mono text-[10px] text-lo">{t.filled} / {t.slots} slots</p>
            <div className="mt-4 flex gap-2">
              <Button variant="primary" size="md" href="#" iconRight={ArrowRight} className="flex-1" magnetic={false}>{t.status === "Completed" || t.status === "Archived" ? "View results" : "Register"}</Button>
              <Button variant="outline" size="md" href="#" icon={Share2} magnetic={false}>Share</Button>
            </div>
          </div>
        </div>
      </PageSection>

      {/* Tabs */}
      <PageSection className="!pt-0">
        <Tabs tabs={tabs} active={tab} setActive={setTab} />
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="mt-6">
            {tab === "Overview" && (
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-2xl glass-card p-6 lg:col-span-2">
                  <h3 className="text-lg font-semibold text-hi">About this tournament</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mid">{t.name} is a {t.format.toLowerCase()} {t.game} tournament hosted by {t.organizerName}, featuring a {t.prize} prize pool across {t.slots} competitive slots. Every match is orchestrated end-to-end by Tournament OS — verified entries, automated check-ins, live brackets, and real-time results.</p>
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[{ l: "Matches", v: matches.length * 4 }, { l: "Teams", v: t.slots }, { l: "Peak viewers", v: (t.viewers || 12400).toLocaleString() }, { l: "Avg length", v: "27m" }].map((s) => (
                      <div key={s.l} className="rounded-xl border border-white/6 bg-white/[0.02] p-3"><p className="font-display text-lg font-bold text-hi">{s.v}</p><p className="font-mono text-[10px] text-lo">{s.l}</p></div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl glass-card p-6">
                  <h3 className="text-sm font-semibold text-hi">Organizer</h3>
                  <Link to={`/explore/guilds/${t.organizer}`} className="mt-4 flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.02] p-3 transition-colors hover:border-cyan-400/25">
                    <span className={cn("grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br font-display text-xs font-bold text-hi", t.gradient)}>{t.organizerName.slice(0, 3).toUpperCase()}</span>
                    <div className="flex-1"><p className="text-sm font-medium text-hi">{t.organizerName}</p><p className="font-mono text-[10px] text-lo">View guild</p></div>
                    <ChevronRight className="h-4 w-4 text-lo" />
                  </Link>
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.05] px-3 py-2.5"><MessageSquare className="h-4 w-4 text-cyan-300" /><span className="text-xs text-cyan-300">Discussion is open — join the conversation</span></div>
                </div>
              </div>
            )}
            {tab === "Rules" && <div className="rounded-2xl glass-card p-8"><h3 className="text-lg font-semibold text-hi">Ruleset</h3><ul className="mt-4 space-y-3 text-sm leading-relaxed text-mid">{["All players must be verified and check in during the assigned window.", "No-shows forfeit automatically per the automated policy engine.", "Standard competitive map pool and settings apply.", "Disputes resolved through structured match threads with staff escalation.", "Substitutions permitted only before roster lock."].map((r, i) => <li key={i} className="flex gap-3"><span className="font-mono text-cyan-400">{String(i + 1).padStart(2, "0")}</span>{r}</li>)}</ul></div>}
            {tab === "Schedule" && <Schedule t={t} />}
            {tab === "Teams" && (
              <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {bracketTeams.map((tm) => (
                  <StaggerItem key={tm.slug}>
                    <Link to={`/explore/teams/${tm.slug}`} className="group flex items-center gap-3 rounded-2xl glass-card p-4 transition-transform hover:-translate-y-1">
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-cyan-500/25 to-blue-600/10 text-[11px] font-bold text-hi ring-1 ring-white/10">{tm.tag}</span>
                      <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-hi group-hover:text-cyan-100">{tm.name}</p><p className="font-mono text-[10px] text-lo">seed #{tm.rank}</p></div>
                    </Link>
                  </StaggerItem>
                ))}
              </Stagger>
            )}
            {tab === "Bracket" && <Bracket />}
            {(tab === "Live Feed" || tab === "Results") && <MatchFeed t={t} />}
            {tab === "Discussion" && <Discussion t={t} />}
          </motion.div>
        </AnimatePresence>
      </PageSection>
    </>
  );
}