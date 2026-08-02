import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, CheckSquare, ShieldCheck, MessageSquare,
  BarChart3, Settings, FileText, Calendar, Plus, Edit2, Copy,
  Trash2, Play, Pause, XCircle, Check, Search, Download, Bot, Radio,
  Activity, FastForward, Flag
} from "lucide-react";
import { DashboardCrumb } from "@/app/layouts/DashboardLayout";
import { Metric, AreaChart, BarChart } from "@tremor/react";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Button, LiveDot } from "@/components/ui";
import { managedTournaments, registrationQueue, botStatus } from "./organizerData";
import { cn } from "@/lib/utils";

function PageHead({ crumb, title, sub, actions }: { crumb: string[]; title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <DashboardCrumb trail={crumb} />
        <h1 className="font-display text-2xl font-bold text-hi sm:text-3xl">{title}</h1>
        {sub && <p className="mt-1 text-sm text-mid">{sub}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

/* ============================================================ TOURNAMENT MANAGER */
export function TournamentManager() {
  const [statusFilter, setStatusFilter] = useState("All");

  return (
    <div>
      <PageHead
        crumb={["Organizer", "Tournament Manager"]}
        title="Tournaments"
        sub="Manage the lifecycle of your competitive events."
        actions={<Button variant="primary" size="md" icon={Plus}>Create Tournament</Button>}
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex max-w-sm items-center gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2">
          <Search className="h-4 w-4 text-lo" />
          <input placeholder="Search tournaments..." className="w-full bg-transparent text-sm text-hi placeholder:text-lo focus:outline-none" />
        </div>
        <div className="flex gap-1 rounded-xl glass-card p-1">
          {["All", "Live", "Registration", "Draft", "Completed"].map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)} className={cn("rounded-lg px-3 py-1.5 text-sm font-medium transition-colors", statusFilter === f ? "bg-cyan-400/10 text-cyan-300" : "text-mid hover:text-hi")}>{f}</button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl glass-card">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-white/6 px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-lo sm:grid-cols-[1fr_auto_auto_auto_auto]">
          <span>Name</span><span className="hidden sm:block">Game</span><span>Status</span><span>Participants</span><span>Actions</span>
        </div>
        <AnimatePresence>
          {managedTournaments.filter(t => statusFilter === "All" || t.status === statusFilter).map((t) => (
            <motion.div key={t.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="group grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-white/4 px-5 py-4 last:border-0 sm:grid-cols-[1fr_auto_auto_auto_auto] hover:bg-white/[0.02] transition-colors">
              <div>
                <p className="text-sm font-medium text-hi group-hover:text-cyan-100">{t.name}</p>
                <p className="font-mono text-[10px] text-lo mt-0.5">{t.date}</p>
              </div>
              <span className="hidden font-mono text-xs text-mid sm:block">{t.game}</span>
              <span className={cn("rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase", 
                t.status === "Live" ? "border-rose-400/40 bg-rose-500/10 text-rose-300" : 
                t.status === "Draft" ? "border-white/15 bg-white/5 text-mid" :
                t.status === "Completed" ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300" : "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
              )}>
                {t.status === "Live" && <LiveDot color="bg-rose-400" className="mr-1.5 inline-block scale-75" />}{t.status}
              </span>
              <div className="flex items-center gap-2 w-24">
                <div className="h-1.5 w-full rounded-full bg-white/8"><div className="h-full rounded-full bg-cyan-400" style={{ width: `${(t.participants/t.maxParticipants)*100}%` }} /></div>
                <span className="font-mono text-[10px] text-mid">{t.participants}/{t.maxParticipants}</span>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {t.status === "Draft" && <button className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded-md" title="Publish"><Play className="h-4 w-4" /></button>}
                {t.status === "Live" && <button className="p-1.5 text-amber-400 hover:bg-amber-400/10 rounded-md" title="Pause"><Pause className="h-4 w-4" /></button>}
                <button className="p-1.5 text-cyan-300 hover:bg-cyan-400/10 rounded-md" title="Edit"><Edit2 className="h-4 w-4" /></button>
                <button className="p-1.5 text-mid hover:bg-white/10 hover:text-hi rounded-md" title="Clone"><Copy className="h-4 w-4" /></button>
                <button className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-md" title="Archive/Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================================ REGISTRATION MANAGER */
export function RegistrationManager() {
  const [tab, setTab] = useState<"Pending" | "Approved" | "Rejected">("Pending");
  const filtered = registrationQueue.filter(r => r.status === tab);

  return (
    <div>
      <PageHead crumb={["Organizer", "Registration"]} title="Registration Queue" sub="Approve or reject participant entries." actions={<><Button variant="outline" size="md" icon={Download}>Export CSV</Button><Button variant="primary" size="md" icon={CheckSquare}>Bulk Approve</Button></>} />
      
      <div className="mb-6 flex gap-1 rounded-2xl glass-card p-1.5 w-fit">
        {(["Pending", "Approved", "Rejected"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("relative rounded-xl px-4 py-2 text-sm font-medium transition-colors", tab === t ? "text-void-950" : "text-mid hover:text-hi")}>
            {tab === t && <motion.span layoutId="regtab" className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
            <span className="relative">{t} <span className="font-mono text-[10px]">({registrationQueue.filter(r => r.status === t).length})</span></span>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl glass-card">
        <div className="grid grid-cols-[auto_1fr_1fr_auto_auto_auto] gap-4 border-b border-white/6 px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-lo">
          <input type="checkbox" className="rounded border-white/10 bg-transparent text-cyan-400 focus:ring-cyan-400/50" />
          <span>Player</span><span>Team</span><span>Rank</span><span>Date</span><span>Actions</span>
        </div>
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-sm text-mid">No {tab.toLowerCase()} registrations.</div>
          ) : filtered.map((r) => (
            <motion.div key={r.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="group grid grid-cols-[auto_1fr_1fr_auto_auto_auto] items-center gap-4 border-b border-white/4 px-5 py-3.5 last:border-0 hover:bg-white/[0.02]">
              <input type="checkbox" className="rounded border-white/10 bg-transparent text-cyan-400 focus:ring-cyan-400/50" />
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-cyan-500/20 to-amber-500/10 text-[10px] font-bold text-hi ring-1 ring-white/10">{r.player.slice(0,2).toUpperCase()}</span>
                <span className="text-sm font-medium text-hi">{r.player}</span>
              </div>
              <span className="text-sm text-mid">{r.team}</span>
              <span className="font-mono text-xs text-amber-300">{r.rank}</span>
              <span className="font-mono text-[10px] text-lo">{r.date}</span>
              <div className="flex items-center gap-2">
                {tab !== "Approved" && <button className="flex items-center gap-1 rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-2.5 py-1 text-xs text-emerald-400 hover:bg-emerald-400/10"><Check className="h-3 w-3" /> Approve</button>}
                {tab !== "Rejected" && <button className="flex items-center gap-1 rounded-lg border border-rose-400/20 bg-rose-400/5 px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-400/10"><XCircle className="h-3 w-3" /> Reject</button>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================================ LIVE BRACKETS */
export function LiveBracketsManager() {
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);

  return (
    <div className="relative h-full min-h-[80vh]">
      <PageHead crumb={["Organizer", "Live Brackets"]} title="Interactive Bracket" sub="WinterCup 2026 — Double Elimination" actions={<><Button variant="outline" size="md" icon={FastForward}>Auto Progress</Button><Button variant="primary" size="md" icon={Edit2}>Manual Override</Button></>} />
      
      <div className="absolute inset-x-0 bottom-0 top-24 overflow-hidden rounded-3xl glass-card border border-cyan-400/20 shadow-[inset_0_0_80px_rgba(34,211,238,0.05)] cursor-grab active:cursor-grabbing">
        <div className="absolute left-6 top-6 flex items-center gap-2 z-10">
          <div className="rounded-lg bg-void-900/80 px-3 py-2 text-xs text-hi border border-white/10 backdrop-blur">Zoom: 100%</div>
          <button className="grid h-8 w-8 place-items-center rounded-lg bg-void-900/80 border border-white/10 text-hi hover:text-cyan-300 backdrop-blur">+</button>
          <button className="grid h-8 w-8 place-items-center rounded-lg bg-void-900/80 border border-white/10 text-hi hover:text-cyan-300 backdrop-blur">-</button>
        </div>

        {/* Scaled interactive SVG Bracket */}
        <div className="absolute inset-0 flex items-center justify-center min-w-[800px] overflow-auto p-12">
          <svg viewBox="0 0 600 300" className="w-full h-auto drop-shadow-lg">
            <g stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none"><path d="M120 40H170V100H120"/><path d="M120 160H170V220H120"/><path d="M330 70H390V190H330"/><path d="M280 70H330V190"/></g>
            <g stroke="rgba(34,211,238,0.5)" strokeWidth="2" fill="none"><path d="M120 100H170V70H280V130H390V130H470" className="animate-pulse" /></g>
            
            {/* Round 1 */}
            {[{x:10,y:28,n:"Vanta Black",s:"2",w:true,id:1},{x:10,y:88,n:"Helix Apex",s:"0",w:false,id:1},{x:10,y:148,n:"Nexus Prime",s:"1",w:false,id:2},{x:10,y:208,n:"Orbit.gg",s:"2",w:true,id:2}].map((t,i) => (
              <g key={i} onClick={() => setSelectedMatch(t.id)} className="cursor-pointer hover:opacity-80 transition-opacity">
                <rect x={t.x} y={t.y} width="110" height="24" rx="4" fill="rgba(10,10,24,0.95)" stroke={t.w ? "rgba(34,211,238,0.6)" : "rgba(255,255,255,0.1)"} />
                <text x={t.x+12} y={t.y+16} fontSize="10" fontFamily="JetBrains Mono,monospace" fill={t.w ? "#a5f3fc" : "#888"}>{t.n}</text>
                <text x={t.x+95} y={t.y+16} fontSize="10" fontFamily="JetBrains Mono,monospace" fill={t.w ? "#22d3ee" : "#555"}>{t.s}</text>
              </g>
            ))}
            
            {/* Semis */}
            {[{x:170,y:58,n:"Vanta Black",s:"LIVE",w:true,id:3},{x:170,y:178,n:"Orbit.gg",s:"LIVE",w:false,id:3}].map((t,i) => (
              <g key={i} onClick={() => setSelectedMatch(t.id)} className="cursor-pointer">
                <rect x={t.x} y={t.y} width="110" height="24" rx="4" fill="rgba(10,10,24,0.95)" stroke="rgba(244,63,94,0.6)" className="animate-pulse" />
                <text x={t.x+12} y={t.y+16} fontSize="10" fontFamily="JetBrains Mono,monospace" fill="#fff">{t.n}</text>
                <text x={t.x+85} y={t.y+16} fontSize="9" fontFamily="JetBrains Mono,monospace" fill="#f43f5e">{t.s}</text>
              </g>
            ))}

            {/* Finals */}
            <g><rect x="390" y="118" width="110" height="24" rx="4" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeDasharray="4 2" /><text x="402" y="134" fontSize="10" fontFamily="JetBrains Mono,monospace" fill="#555">TBD</text></g>
          </svg>
        </div>

        {/* Context Menu / Match Editor Overlay */}
        <AnimatePresence>
          {selectedMatch && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="absolute right-6 top-6 bottom-6 w-80 rounded-2xl glass-strong border border-cyan-400/20 p-5 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
                <h3 className="font-semibold text-hi">Match M-{selectedMatch} Details</h3>
                <button onClick={() => setSelectedMatch(null)} className="text-lo hover:text-hi"><XCircle className="h-4 w-4" /></button>
              </div>
              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between bg-void-950/50 p-3 rounded-xl border border-white/5">
                  <span className="text-sm font-medium text-hi">Vanta Black</span>
                  <input type="number" defaultValue={2} className="w-12 bg-white/10 border border-white/20 rounded px-2 py-1 text-center text-cyan-300 font-mono" />
                </div>
                <div className="flex items-center justify-between bg-void-950/50 p-3 rounded-xl border border-white/5">
                  <span className="text-sm font-medium text-hi">Orbit.gg</span>
                  <input type="number" defaultValue={0} className="w-12 bg-white/10 border border-white/20 rounded px-2 py-1 text-center text-hi font-mono" />
                </div>
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <Button variant="outline" size="sm" className="w-full justify-start" icon={Flag}>Resolve Dispute</Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-amber-400 hover:text-amber-300" icon={Users}>Assign Referee</Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-rose-400 hover:text-rose-300" icon={Radio}>Force Winner</Button>
                </div>
              </div>
              <Button variant="primary" size="md" className="w-full">Save & Update Bracket</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================================ AUTOMATION & BOT */
export function AutomationManager() {
  return (
    <div>
      <PageHead crumb={["Organizer", "Automation"]} title="Automation Engine" sub="Manage Tournament OS Bot synchronization and triggers." />
      
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <div className="rounded-3xl glass-card p-6 border-cyan-400/20 shadow-[0_0_40px_rgba(34,211,238,0.05)]">
            <h3 className="text-lg font-semibold text-hi mb-4 flex items-center gap-2"><Bot className="h-5 w-5 text-cyan-400" /> Discord Bot Integration</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4"><p className="font-mono text-[10px] text-lo uppercase mb-1">Status</p><p className="text-emerald-400 font-bold flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"/>{botStatus.status}</p></div>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4"><p className="font-mono text-[10px] text-lo uppercase mb-1">Latency</p><p className="text-hi font-bold font-mono">{botStatus.ping}ms</p></div>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4"><p className="font-mono text-[10px] text-lo uppercase mb-1">Sync</p><p className="text-hi font-bold text-sm mt-1">{botStatus.lastSync}</p></div>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4"><p className="font-mono text-[10px] text-lo uppercase mb-1">Shards</p><p className="text-hi font-bold text-sm mt-1">{botStatus.shards} Active</p></div>
            </div>
            <div className="flex gap-3">
              <Button variant="primary" size="sm" icon={Activity}>Force Sync</Button>
              <Button variant="outline" size="sm" icon={Settings}>Bot Settings</Button>
            </div>
          </div>

          <div className="rounded-2xl glass-card p-6">
            <h3 className="text-sm font-semibold text-hi mb-4">Event Triggers</h3>
            <div className="space-y-3">
              {[
                { n: "Auto-provision Match Threads", d: "Creates Discord threads when matches are generated.", v: true },
                { n: "Auto-assign Roles", d: "Assigns @Participant role upon verification.", v: true },
                { n: "Auto-advance Bracket", d: "Moves winners forward on score confirmation.", v: true },
                { n: "Auto-close Check-in", d: "Closes check-in strictly at deadline.", v: false },
              ].map(t => (
                <div key={t.n} className="flex items-center justify-between border border-white/5 bg-void-950/50 p-4 rounded-xl">
                  <div><p className="text-sm font-medium text-hi">{t.n}</p><p className="text-xs text-mid mt-0.5">{t.d}</p></div>
                  <button className={cn("relative h-6 w-11 rounded-full border transition-colors", t.v ? "border-cyan-400/60 bg-cyan-400/20" : "border-white/15 bg-white/5")}>
                    <span className={cn("absolute top-0.5 h-5 w-5 rounded-full transition-transform", t.v ? "translate-x-5 bg-cyan-400" : "translate-x-0.5 bg-white/25")} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl glass-card p-5 h-fit">
          <h3 className="text-sm font-semibold text-hi mb-4 flex items-center gap-2"><Activity className="h-4 w-4 text-amber-400" /> Execution Log</h3>
          <div className="space-y-3 font-mono text-[10px] text-mid relative before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
            {["[08:42:01] Discord API: Assigned @Participant to 42 users.", "[08:41:15] Webhook: Triggered match.start for M-12.", "[08:40:00] Engine: Check-in window closed.", "[08:35:22] Bot: Sync optimal."].map((l, i) => (
              <div key={i} className="relative pl-5">
                <span className="absolute left-0 top-1 h-3 w-3 rounded-full bg-void-900 border-2 border-cyan-400/50" />
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ GUILD MANAGER */
export function GuildManager() {
  return (
    <div>
      <PageHead crumb={["Organizer", "Guild Settings"]} title="Guild Management" sub="Configure your organization's public profile and branding." actions={<Button variant="primary" size="md" icon={Check}>Save Changes</Button>} />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl glass-card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-hi border-b border-white/10 pb-2">Branding</h3>
            <div><label className="block text-xs text-mid mb-1.5">Guild Name</label><input defaultValue="Vanta Esports" className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-hi focus:border-cyan-400/50 focus:outline-none" /></div>
            <div><label className="block text-xs text-mid mb-1.5">Guild Tag</label><input defaultValue="VNTA" className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-hi focus:border-cyan-400/50 focus:outline-none" /></div>
            <div><label className="block text-xs text-mid mb-1.5">Description</label><textarea defaultValue="Europe's premier competitive collective." rows={3} className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-hi focus:border-cyan-400/50 focus:outline-none" /></div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-2xl glass-card p-6 space-y-4">
            <h3 className="text-sm font-semibold text-hi border-b border-white/10 pb-2">Permissions & Roles</h3>
            <div className="flex items-center justify-between p-3 border border-white/5 bg-void-950/50 rounded-xl">
              <div><p className="text-sm text-hi">Moderator Role</p><p className="text-xs text-mid">Discord role ID for event admins</p></div>
              <span className="font-mono text-xs text-cyan-300 bg-cyan-400/10 px-2 py-1 rounded">@TO_Admin</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-white/5 bg-void-950/50 rounded-xl">
              <div><p className="text-sm text-hi">Participant Role</p><p className="text-xs text-mid">Assigned on verification</p></div>
              <span className="font-mono text-xs text-cyan-300 bg-cyan-400/10 px-2 py-1 rounded">@Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ GENERIC STUBS FOR REMAINING */
export function SchedulerManager() {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const events = [
    { day: 3, time: "17:00", name: "WinterCup 2026 · Round of 16", kind: "match" },
    { day: 3, time: "19:00", name: "Orbit Open · Check-in window opens", kind: "checkin" },
    { day: 5, time: "16:30", name: "Nexus Q · Group stage", kind: "match" },
    { day: 8, time: "18:00", name: "Vanguard League · Semifinals", kind: "match" },
    { day: 10, time: "15:00", name: "WinterCup 2026 · Grand Finals", kind: "final" },
  ];
  const todays = selected
    ? events.filter((e) => e.day === selected.getDate())
    : [];
  return (
    <div>
      <PageHead crumb={["Organizer", "Scheduler"]} title="Scheduler" sub="Interactive calendar and conflict detection engine." />
      <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
        <div className="rounded-2xl glass-card p-5">
          <CalendarPicker
            mode="single"
            selected={selected}
            onSelect={setSelected}
            className="rounded-xl border border-white/8"
          />
        </div>
        <div className="rounded-2xl glass-card p-5">
          <p className="mb-4 text-sm font-semibold text-hi">
            {selected ? selected.toDateString() : "Select a date"}
          </p>
          {todays.length === 0 ? (
            <p className="rounded-xl border border-white/6 bg-white/[0.01] p-6 text-center text-sm text-mid">
              No events scheduled. Select another day or create a new schedule.
            </p>
          ) : (
            <div className="space-y-2">
              {todays.map((e) => (
                <div key={e.name} className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.01] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className={cn("grid h-8 w-8 place-items-center rounded-lg font-mono text-[10px] uppercase",
                      e.kind === "final" ? "bg-amber-400/15 text-amber-300" : e.kind === "checkin" ? "bg-emerald-400/15 text-emerald-300" : "bg-cyan-400/15 text-cyan-300")}>
                      {e.kind}
                    </span>
                    <span className="text-sm text-hi">{e.name}</span>
                  </div>
                  <span className="font-mono text-xs text-mid">{e.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export function MatchThreadsManager() { return <Placeholder title="Match Threads" desc="Manage active Discord match threads and disputes." icon={MessageSquare} />; }
export function AnnouncementsManager() { return <Placeholder title="Announcements" desc="Multi-channel broadcasting tools." icon={Radio} />; }
export function OrganizerAnalytics() {
  const weekly = [
    { week: "W1", matches: 86, players: 420 }, { week: "W2", matches: 104, players: 512 },
    { week: "W3", matches: 98, players: 486 }, { week: "W4", matches: 132, players: 640 },
    { week: "W5", matches: 158, players: 774 }, { week: "W6", matches: 146, players: 712 },
    { week: "W7", matches: 184, players: 901 }, { week: "W8", matches: 210, players: 1034 },
  ];
  const regions = [
    { name: "EU-West", registrations: 1284 }, { name: "NA-East", registrations: 1102 },
    { name: "APAC", registrations: 864 }, { name: "NA-West", registrations: 738 },
    { name: "LATAM", registrations: 512 }, { name: "MEA", registrations: 296 },
  ];
  return (
    <div>
      <PageHead crumb={["Organizer", "Analytics"]} title="Analytics" sub="Growth, attendance, and match metrics." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl glass-card p-4"><Metric>1,284</Metric><p className="font-mono text-[10px] uppercase tracking-wider text-lo">Peak concurrency</p></div>
        <div className="rounded-2xl glass-card p-4"><Metric>4,206</Metric><p className="font-mono text-[10px] uppercase tracking-wider text-lo">Active players</p></div>
        <div className="rounded-2xl glass-card p-4"><Metric>27m</Metric><p className="font-mono text-[10px] uppercase tracking-wider text-lo">Avg match length</p></div>
        <div className="rounded-2xl glass-card p-4"><Metric>94K</Metric><p className="font-mono text-[10px] uppercase tracking-wider text-lo">Viewer-minutes</p></div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl glass-card p-5">
          <p className="mb-4 text-sm font-semibold text-hi">Matches & players · last 8 weeks</p>
          <AreaChart
            data={weekly}
            index="week"
            categories={["matches", "players"]}
            colors={["cyan", "amber"]}
            valueFormatter={(v) => Intl.NumberFormat("en-US").format(v)}
            showLegend
            className="h-64"
          />
        </div>
        <div className="rounded-2xl glass-card p-5">
          <p className="mb-4 text-sm font-semibold text-hi">Registrations by region</p>
          <BarChart
            data={regions}
            index="name"
            categories={["registrations"]}
            colors={["cyan"]}
            layout="vertical"
            valueFormatter={(v) => Intl.NumberFormat("en-US").format(v)}
            className="h-64"
          />
        </div>
      </div>
    </div>
  );
}
export function ReportsManager() { return <Placeholder title="Reports" desc="Exportable CSVs, payout sheets, and sponsor decks." icon={FileText} />; }
export function OrganizerSettings() { return <Placeholder title="Settings" desc="General organizer preferences and API keys." icon={Settings} />; }
export function VerificationManager() { return <Placeholder title="Verification Queue" desc="Review player eligibility and anti-smurf flags." icon={ShieldCheck} />; }
export function CheckInManager() { return <Placeholder title="Check-in Manager" desc="Real-time check-in board and no-show enforcement." icon={CheckSquare} />; }

function Placeholder({ title, desc, icon: Icon }: { title: string, desc: string, icon: any }) {
  return (
    <div>
      <PageHead crumb={["Organizer", title]} title={title} sub={desc} />
      <div className="relative grid place-items-center overflow-hidden rounded-3xl glass-card px-6 py-20 text-center">
        <span className="pointer-events-none absolute -top-16 left-1/2 h-32 w-64 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300"><Icon className="h-6 w-6" /></span>
          <p className="mt-5 text-lg font-semibold text-hi">{title} Module</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-mid">{desc}</p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" /> Planned for v2.x
          </span>
          <p className="mt-4 text-xs text-lo">Wired into routing &amp; navigation — content ships with the next release.</p>
        </div>
      </div>
    </div>
  );
}
