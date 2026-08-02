import { ease } from "@/shared/motion/motion-tokens";
import { Link } from "react-router-dom";
import { Radio } from "lucide-react";
import { motion } from "framer-motion";
import { ArrowRight, Trophy, Users, UserCheck, Building2 } from "lucide-react";
import { SectionHeading, Stagger, StaggerItem , spotlightHandlers } from "../ui";
import { tournaments, guilds, players, statusStyles, fmtNum } from "@/lib/directory";

const dirs = [
  { icon: Trophy, label: "Tournaments", to: "/explore/tournaments", count: "318K+", desc: "Live & upcoming events" },
  { icon: Building2, label: "Guilds", to: "/explore/guilds", count: "24K+", desc: "Verified organizations" },
  { icon: Users, label: "Teams", to: "/explore/teams", count: "180K+", desc: "Competitive rosters" },
  { icon: UserCheck, label: "Players", to: "/explore/players", count: "2.4M+", desc: "Ranked competitors" },
];

export function ExploreTeaser() {
  const featured = tournaments.slice(0, 3);
  return (
    <section id="explore" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.06),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The public platform"
          title={<>What&apos;s live on <span className="text-hi">Tournament OS right now.</span></>}
          description="Tournament OS isn't just software — it's a public arena. Explore live tournaments, verified guilds, ranked teams, and player careers, all in one place."
        />

        <Stagger className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {dirs.map((d) => (
            <StaggerItem key={d.label} className="h-full">
              <Link to={d.to} className="spotlight group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl glass-card p-6 transition-transform duration-500 hover:-translate-y-1.5"
                {...spotlightHandlers}
              >
                <div>
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/8 bg-void-800 text-cyan-300 transition-all duration-500 group-hover:glow-cyan group-hover:scale-105"><d.icon className="h-5 w-5" /></span>
                  <div className="mt-4 font-display text-2xl font-bold text-hi">{d.count}</div>
                  <p className="text-sm text-mid">{d.desc}</p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-cyan-300">
                  {d.label} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Live tournament preview strip */}
        <div className="mt-6 overflow-hidden rounded-2xl glass-card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-hi">Happening now</p>
            <Link to="/explore/tournaments" className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-300 hover:text-cyan-200">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="focus-cards grid gap-4 sm:grid-cols-3">
            {featured.map((t) => (
              <Link key={t.slug} to={`/explore/tournaments/${t.slug}`} className="group relative overflow-hidden rounded-xl border border-white/6 bg-white/[0.02] p-4 transition-all duration-500 hover:-translate-y-1 hover:border-cyan-400/25">
                <div className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${t.gradient} blur-2xl`} />
                <div className="relative flex items-center justify-between">
                  <span className={`rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${statusStyles[t.status]}`}>{t.status}</span>
                  <span className="font-mono text-[10px] text-lo">{t.game}</span>
                </div>
                <p className="relative mt-3 text-sm font-semibold text-hi group-hover:text-cyan-100">{t.name}</p>
                <div className="relative mt-2 flex items-center justify-between text-xs text-mid">
                  <span>{t.prize}</span>
                  <span className="flex items-center gap-2">
                    {t.status === 'Live' && t.viewers ? (
                      <span className="flex items-center gap-1 font-mono text-[10px] text-rose-300"><Radio className="h-3 w-3" />{fmtNum(t.viewers)}</span>
                    ) : null}
                    <span>{t.filled}/{t.slots}</span>
                  </span>
                </div>
                <div className="relative mt-2 h-1 w-full overflow-hidden rounded-full bg-white/8">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${(t.filled / t.slots) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1, ease: ease.emphasized }} className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300" />
                </div>
              </Link>
            ))}
            </div>
          </div>
        </div>

        {/* Ticker of top players + guilds */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl glass-card p-6">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-lo">Top guilds</p>
            <div className="space-y-2">
              {guilds.slice(0, 3).map((g, i) => (
                <Link key={g.slug} to={`/explore/guilds/${g.slug}`} className="group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.03]">
                  <span className="font-mono text-xs text-lo">{i + 1}</span>
                  <span className={`grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br ${g.gradient} text-[11px] font-bold text-hi`}>{g.tag}</span>
                  <span className="flex-1 text-sm font-medium text-hi group-hover:text-cyan-100">{g.name}</span>
                  <span className="font-mono text-xs text-mid">{g.tournaments} events</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-2xl glass-card p-6">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-lo">Top players</p>
            <div className="space-y-2">
              {players.slice(0, 3).map((p, i) => (
                <Link key={p.slug} to={`/explore/players/${p.slug}`} className="group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/[0.03]">
                  <span className="font-mono text-xs text-lo">{i + 1}</span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-cyan-500/25 to-amber-500/15 text-[11px] font-bold text-hi ring-1 ring-white/10">{p.handle.slice(0, 2)}</span>
                  <span className="flex-1 text-sm font-medium text-hi group-hover:text-cyan-100">{p.handle}</span>
                  <span className="font-mono text-xs text-cyan-300">{p.rating}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}