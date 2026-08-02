import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, Info, CheckCircle2, AlertCircle, Pin, Search,
  Bell, Trash2, CheckCheck,
} from "lucide-react";
import { DashboardCrumb } from "@/app/layouts/DashboardLayout";
import { cn } from "@/lib/utils";

type Priority = "critical" | "warning" | "info" | "success";
type Notif = {
  id: number; priority: Priority; title: string; body: string;
  group: string; time: string; unread: boolean; pinned: boolean;
};

const SEED: Notif[] = [
  { id: 1, priority: "critical", title: "Player disconnect · M-14", body: "Nexus Prime player dropped mid-match. Match auto-paused pending reconnect.", group: "Matches", time: "2m ago", unread: true, pinned: true },
  { id: 2, priority: "warning", title: "Check-in closing soon", body: "WinterCup 2026 check-in window closes in 5 minutes. 12 players not checked in.", group: "Tournaments", time: "4m ago", unread: true, pinned: false },
  { id: 3, priority: "success", title: "Bracket auto-advanced", body: "Quarterfinals complete. Semifinal bracket seeded automatically.", group: "Automation", time: "12m ago", unread: true, pinned: false },
  { id: 4, priority: "info", title: "New registration surge", body: "Apex Circuit S7 received 40 registrations in the last hour.", group: "Registrations", time: "28m ago", unread: false, pinned: false },
  { id: 5, priority: "warning", title: "Dispute escalated", body: "Match M-09 result disputed by Orbit.gg. Awaiting moderator review.", group: "Matches", time: "1h ago", unread: false, pinned: false },
  { id: 6, priority: "success", title: "Verification batch cleared", body: "42 players verified · region + anti-smurf checks passed.", group: "Verification", time: "2h ago", unread: false, pinned: false },
  { id: 7, priority: "info", title: "Scheduler dispatched reminders", body: "Reminder pings sent to 128 players across 12 timezones.", group: "Automation", time: "3h ago", unread: false, pinned: false },
  { id: 8, priority: "critical", title: "Shard reconnect", body: "Bot shard #07 reconnecting. Command latency temporarily elevated.", group: "System", time: "4h ago", unread: false, pinned: false },
];

const prioMeta: Record<Priority, { icon: any; color: string; ring: string; label: string }> = {
  critical: { icon: AlertTriangle, color: "text-rose-300", ring: "border-l-rose-500", label: "Critical" },
  warning: { icon: AlertCircle, color: "text-amber-300", ring: "border-l-amber-400", label: "Warning" },
  info: { icon: Info, color: "text-cyan-300", ring: "border-l-cyan-400", label: "Info" },
  success: { icon: CheckCircle2, color: "text-emerald-300", ring: "border-l-emerald-400", label: "Success" },
};

export function NotificationCenter2() {
  const [items, setItems] = useState<Notif[]>(SEED);
  const [filter, setFilter] = useState<"all" | "unread" | "pinned" | Priority>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return items.filter((n) => {
      if (filter === "unread" && !n.unread) return false;
      if (filter === "pinned" && !n.pinned) return false;
      if (["critical", "warning", "info", "success"].includes(filter) && n.priority !== filter) return false;
      if (query && !(`${n.title} ${n.body} ${n.group}`.toLowerCase().includes(query.toLowerCase()))) return false;
      return true;
    });
  }, [items, filter, query]);

  const grouped = useMemo(() => {
    const g: Record<string, Notif[]> = {};
    for (const n of filtered) (g[n.group] ||= []).push(n);
    return g;
  }, [filtered]);

  const unreadCount = items.filter((n) => n.unread).length;

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  const togglePin = (id: number) => setItems((prev) => prev.map((n) => n.id === id ? { ...n, pinned: !n.pinned } : n));
  const dismiss = (id: number) => setItems((prev) => prev.filter((n) => n.id !== id));

  const filters: { id: typeof filter; label: string }[] = [
    { id: "all", label: "All" }, { id: "unread", label: `Unread · ${unreadCount}` }, { id: "pinned", label: "Pinned" },
    { id: "critical", label: "Critical" }, { id: "warning", label: "Warning" }, { id: "info", label: "Info" }, { id: "success", label: "Success" },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/8 pb-5">
        <div>
          <DashboardCrumb trail={["Organizer", "Notifications"]} />
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-2xl font-bold uppercase tracking-[0.1em] text-hi sm:text-3xl">Notification Center</h1>
            {unreadCount > 0 && <span className="rounded-full bg-rose-500/15 px-2.5 py-1 font-mono text-[10px] text-rose-300">{unreadCount} unread</span>}
          </div>
          <p className="mt-1 font-mono text-xs text-lo">// priority-based · grouped · real-time</p>
        </div>
        <button onClick={markAllRead} className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2 text-sm text-mid transition-colors hover:border-cyan-400/25 hover:text-hi">
          <CheckCheck className="h-4 w-4" /> Mark all read
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2">
          <Search className="h-4 w-4 text-lo" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notifications…" className="w-full bg-transparent text-sm text-hi placeholder:text-lo focus:outline-none" />
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)} className={cn("rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors", filter === f.id ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300" : "border-white/8 text-mid hover:border-white/20 hover:text-hi")}>{f.label}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="grid place-items-center rounded-2xl glass-card px-6 py-20 text-center">
          <Bell className="h-8 w-8 text-lo" />
          <p className="mt-4 text-sm text-hi">No notifications match this filter.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([group, list]) => (
            <div key={group}>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-lo">{group} <span className="text-white/20">· {list.length}</span></p>
              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {list.map((n) => {
                    const meta = prioMeta[n.priority];
                    const Icon = meta.icon;
                    return (
                      <motion.div
                        key={n.id} layout
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }}
                        className={cn("group flex items-start gap-3 rounded-xl border border-l-2 border-white/6 bg-void-900/40 p-4 backdrop-blur transition-colors hover:bg-void-900/70", meta.ring, n.unread && "bg-white/[0.02]")}
                      >
                        <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", meta.color)} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-hi">{n.title}</p>
                            {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                            {n.pinned && <Pin className="h-3 w-3 text-amber-300" />}
                          </div>
                          <p className="mt-0.5 text-xs leading-relaxed text-mid">{n.body}</p>
                          <p className="mt-1 font-mono text-[10px] text-lo">{n.time}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button onClick={() => togglePin(n.id)} className={cn("grid h-7 w-7 place-items-center rounded-md hover:bg-white/10", n.pinned ? "text-amber-300" : "text-lo")}><Pin className="h-3.5 w-3.5" /></button>
                          <button onClick={() => dismiss(n.id)} className="grid h-7 w-7 place-items-center rounded-md text-lo hover:bg-rose-500/10 hover:text-rose-300"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
