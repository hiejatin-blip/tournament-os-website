import { ease } from "@/shared/motion/motion-tokens";
import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Trophy, Users, MapPin, Radio, SearchX } from "lucide-react";
import { LiveDot } from "../ui";
import {
  statusStyles, guildStatusStyles, gameShort, fmtNum, winRate,
  type Tournament, type Guild, type Player, type Team,
} from "@/lib/directory";
import { cn } from "@/lib/utils";
import { ScrambleText } from "@/components/reactbits/ScrambleText";

/* ============================================================ Skeletons */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-white/6 bg-white/[0.02] p-5", className)}>
      <div className="animate-pulse space-y-3">
        <div className="h-10 w-10 rounded-xl bg-white/5" />
        <div className="h-4 w-2/3 rounded bg-white/5" />
        <div className="h-3 w-1/2 rounded bg-white/5" />
        <div className="mt-4 h-1 w-full rounded bg-white/5" />
      </div>
      <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    </div>
  );
}

export function SkeletonGrid({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

export function SkeletonRows({ count = 6 }: { count?: number }) {
  return (
    <div className="overflow-hidden rounded-2xl glass-card">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-white/4 px-5 py-4 last:border-0">
          <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-white/5" />
          <div className="flex-1 space-y-2"><div className="h-3.5 w-1/3 animate-pulse rounded bg-white/5" /><div className="h-2.5 w-1/4 animate-pulse rounded bg-white/5" /></div>
          <div className="h-4 w-12 animate-pulse rounded bg-white/5" />
        </div>
      ))}
    </div>
  );
}

/* ============================================================ Empty state */
export function EmptyState({ title = "No results found", hint = "Try adjusting your search or filters.", icon: Icon = SearchX }: { title?: string; hint?: string; icon?: typeof SearchX }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid place-items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01] px-6 py-20 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/8 bg-void-800 text-lo"><Icon className="h-6 w-6" /></span>
      <p className="mt-5 text-lg font-semibold text-hi">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm text-mid">{hint}</p>
    </motion.div>
  );
}

/* ============================================================ Progress bar */
function Progress({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
      <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: ease.emphasized }} className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300" />
    </div>
  );
}

/* spotlight mouse tracker */
const spot = (e: React.MouseEvent<HTMLElement>) => {
  const el = e.currentTarget; const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`); el.style.setProperty("--my", `${e.clientY - r.top}px`);
};

/* ============================================================ Banner (CSS-generated, zero image weight) */
export function CardBanner({ gradient, label, children, className }: { gradient: string; label?: string; children?: ReactNode; className?: string }) {
  return (
    <div className={cn("relative h-24 overflow-hidden", className)}>
      <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} />
      <div className="absolute inset-0 bg-grid-fine opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-void-900 via-void-900/30 to-transparent" />
      {label && <span className="absolute right-3 top-3 rounded-md border border-white/10 bg-void-950/50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-hi/80 backdrop-blur">{label}</span>}
      {children}
    </div>
  );
}

/* ============================================================ TournamentCard */
export function TournamentCard({ t }: { t: Tournament }) {
  return (
    <Link to={`/explore/tournaments/${t.slug}`} onMouseMove={spot} className="mo-lift spotlight group relative flex h-full flex-col overflow-hidden rounded-2xl glass-card">
      <CardBanner gradient={t.gradient} label={gameShort[t.game]}>
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <span className={cn("inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider", statusStyles[t.status])}>
            {t.status === "Live" && <LiveDot color="bg-rose-400" className="scale-75" />}{t.status}
          </span>
          {t.status === "Live" && t.viewers ? <span className="flex items-center gap-1 font-mono text-[10px] text-hi/70"><Radio className="h-3 w-3" />{fmtNum(t.viewers)}</span> : null}
        </div>
      </CardBanner>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-base font-semibold text-hi group-hover:text-cyan-100">{t.name}</p>
        <p className="mt-1 text-xs text-mid">{t.organizerName} · {t.format}</p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="font-semibold text-cyan-300">{t.prize}</span>
          <span className="font-mono text-xs text-mid">{t.mode} · {t.region}</span>
        </div>
        <div className="mt-auto pt-4">
          <Progress value={t.filled} max={t.slots} />
          <p className="mt-2 flex items-center justify-between font-mono text-[10px] text-lo"><span>{t.filled}/{t.slots} slots</span><span>{t.startsIn}</span></p>
        </div>
      </div>
    </Link>
  );
}

/* ============================================================ GuildCard */
export function GuildCard({ g }: { g: Guild }) {
  return (
    <Link to={`/explore/guilds/${g.slug}`} onMouseMove={spot} className="mo-lift spotlight group relative flex h-full flex-col overflow-hidden rounded-2xl glass-card">
      <CardBanner gradient={g.gradient}>
        <span className={cn("absolute right-3 top-3 rounded-md border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider", guildStatusStyles[g.status])}>{g.status}</span>
      </CardBanner>
      <div className="flex flex-1 flex-col p-5">
        <div className="-mt-10 flex items-end gap-3">
          <span className={cn("grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br font-display text-sm font-bold text-hi ring-2 ring-void-900", g.gradient)}>{g.tag}</span>
          <div className="pb-1">
            <div className="flex items-center gap-1.5"><p className="font-semibold text-hi group-hover:text-cyan-100">{g.name}</p>{g.verified && <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />}</div>
            <p className="flex items-center gap-1 font-mono text-[11px] text-lo"><MapPin className="h-3 w-3" />{g.region}</p>
          </div>
        </div>
        <p className="mt-4 line-clamp-2 text-sm text-mid">{g.description}</p>
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/6 pt-4">
          <div><p className="font-display text-base font-bold text-hi">{fmtNum(g.members)}</p><p className="font-mono text-[9px] text-lo">members</p></div>
          <div><p className="font-display text-base font-bold text-cyan-300">{g.activeTournaments}</p><p className="font-mono text-[9px] text-lo">active</p></div>
          <div><p className="font-display text-base font-bold text-hi">{g.tournaments}</p><p className="font-mono text-[9px] text-lo">hosted</p></div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">{g.games.map((gm) => <span key={gm} className="rounded-md border border-white/8 bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-mid">{gameShort[gm]}</span>)}</div>
        <button className="mt-4 w-full rounded-xl border border-cyan-400/25 bg-cyan-400/5 py-2 text-sm font-medium text-cyan-300 transition-colors group-hover:border-cyan-400/50 group-hover:bg-cyan-400/10">Join guild</button>
      </div>
    </Link>
  );
}

/* ============================================================ TeamCard */
export function TeamCard({ t }: { t: Team }) {
  return (
    <Link to={`/explore/teams/${t.slug}`} onMouseMove={spot} className="mo-lift spotlight group relative flex h-full flex-col overflow-hidden rounded-2xl glass-card p-6">
      <span className="absolute right-5 top-5 flex items-center gap-1 font-mono text-[10px] text-amber-300"><Trophy className="h-3 w-3" />#{t.rank}</span>
      <div className="flex items-center gap-3">
        <span className={cn("grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br font-display text-sm font-bold text-hi ring-1 ring-white/10", "from-cyan-500/25 to-blue-600/10")}>{t.tag}</span>
        <div>
          <p className="font-semibold text-hi group-hover:text-cyan-100">{t.name}</p>
          <p className="font-mono text-[11px] text-lo">{gameShort[t.game]} · {t.region}</p>
        </div>
      </div>
      {t.currentTournament && <p className="mt-4 flex items-center gap-1.5 rounded-lg border border-rose-400/20 bg-rose-500/5 px-2.5 py-1.5 text-[11px] text-rose-300"><LiveDot color="bg-rose-400" className="scale-75" />Competing in {t.currentTournament}</p>}
      <div className="mt-4 grid grid-cols-4 gap-2 border-t border-white/6 pt-4">
        <div><p className="font-display text-base font-bold text-cyan-300">{t.rating}</p><p className="font-mono text-[9px] text-lo">rating</p></div>
        <div><p className="font-display text-base font-bold text-hi">{t.wins}-{t.losses}</p><p className="font-mono text-[9px] text-lo">record</p></div>
        <div><p className="font-display text-base font-bold text-emerald-400">{winRate(t.wins, t.losses)}%</p><p className="font-mono text-[9px] text-lo">win rate</p></div>
        <div><p className="font-display text-base font-bold text-hi">{t.titles}</p><p className="font-mono text-[9px] text-lo">titles</p></div>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-xs text-mid"><Users className="h-3.5 w-3.5" />{t.members} members · {t.guild}</div>
    </Link>
  );
}

/* ============================================================ PlayerRow (table row) */
export function PlayerRow({ p, index }: { p: Player; index: number }) {
  return (
    <Link to={`/explore/players/${p.slug}`} className="mo-row-in group grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 border-b border-white/4 px-5 py-3.5 transition-colors last:border-0 hover:bg-white/[0.04] sm:grid-cols-[auto_1fr_auto_auto_auto]">
      <span className={cn("w-6 text-center font-mono text-sm", index < 3 ? "font-bold text-amber-300" : "text-lo")}>{index + 1}</span>
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-500/25 to-amber-500/15 text-[11px] font-bold text-hi ring-1 ring-white/10">{p.handle.slice(0, 2)}</span>
        <div className="min-w-0"><p className="truncate text-sm font-medium text-hi group-hover:text-cyan-100">{p.handle}</p><p className="truncate font-mono text-[10px] text-lo">{p.team} · {p.role}</p></div>
      </div>
      <span className="hidden font-mono text-xs text-mid sm:block">{gameShort[p.game]}</span>
      <span className="font-mono text-xs text-mid">{p.wins}-{p.losses}</span>
      <span className="font-mono text-sm font-semibold text-cyan-300"><ScrambleText text={String(p.rating)} /></span>
    </Link>
  );
}