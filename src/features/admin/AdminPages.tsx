import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ShieldCheck, Key, Plug,
  Settings, Search, Download,
  Eye, Edit2, Trash2, Plus, Database, SlidersHorizontal,
  CreditCard, MapPin, Check,
} from "lucide-react";
import { DashboardCrumb } from "@/app/layouts/DashboardLayout";
import { Button } from "@/components/ui";
import { DataTable } from "@/components/ui/kit/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

/* Shared */
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

/* ============================================================ GUILD MANAGEMENT (Admin) */
export function AdminGuildManager() {
  const [search, setSearch] = useState("");
  const guilds = [
    { id: "g_vanta", name: "Vanta Esports", tag: "VNTA", region: "EU-West", members: 12840, tournaments: 340, verified: true, status: "Active" },
    { id: "g_apex", name: "Apex League", tag: "APX", region: "Global", members: 8920, tournaments: 210, verified: true, status: "Active" },
    { id: "g_helix", name: "Helix Circuit", tag: "HLX", region: "NA-East", members: 6410, tournaments: 156, verified: true, status: "Active" },
    { id: "g_orbit", name: "OrbitGG", tag: "ORB", region: "EU-West", members: 5230, tournaments: 128, verified: true, status: "Active" },
    { id: "g_pulse", name: "Pulse Arena", tag: "PLS", region: "NA-West", members: 4180, tournaments: 96, verified: false, status: "Suspended" },
  ];
  const filtered = guilds.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <PageHead crumb={["Admin", "Guild Management"]} title="Guild Management" sub={`${guilds.length} guilds registered on the platform.`} actions={<Button variant="primary" size="md" icon={Plus}>Add Guild</Button>} />
      
      <div className="mb-6 flex max-w-sm items-center gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2">
        <Search className="h-4 w-4 text-lo" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search guilds..." className="w-full bg-transparent text-sm text-hi placeholder:text-lo focus:outline-none" />
      </div>

      <div className="overflow-hidden rounded-2xl glass-card">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 border-b border-white/6 px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-lo">
          <span>Guild</span><span>Region</span><span>Members</span><span>Tournaments</span><span>Actions</span>
        </div>
        <AnimatePresence>
          {filtered.map((g) => (
            <motion.div key={g.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="group grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 border-b border-white/4 px-5 py-4 last:border-0 hover:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-500/25 to-blue-600/10 font-display text-xs font-bold text-hi ring-1 ring-white/10">{g.tag}</span>
                <div><p className="text-sm font-medium text-hi">{g.name}</p><div className="flex items-center gap-2 mt-0.5"><span className={cn("rounded-full border px-1.5 font-mono text-[9px]", g.verified ? "border-cyan-400/40 text-cyan-300" : "border-amber-400/40 text-amber-300")}>{g.verified ? "Verified" : "Unverified"}</span><span className={cn("rounded-full border px-1.5 font-mono text-[9px]", g.status === "Active" ? "border-emerald-400/40 text-emerald-300" : "border-rose-400/40 text-rose-300")}>{g.status}</span></div></div>
              </div>
              <span className="flex items-center gap-1 font-mono text-xs text-mid"><MapPin className="h-3 w-3" />{g.region}</span>
              <span className="font-mono text-sm text-hi">{g.members.toLocaleString()}</span>
              <span className="font-mono text-sm text-cyan-300">{g.tournaments}</span>
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-cyan-300 hover:bg-cyan-400/10 rounded-md" title="View"><Eye className="h-4 w-4" /></button>
                <button className="p-1.5 text-mid hover:bg-white/10 hover:text-hi rounded-md" title="Edit"><Edit2 className="h-4 w-4" /></button>
                <button className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-md" title="Suspend"><Trash2 className="h-4 w-4" /></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================================ USER MANAGEMENT */
type AdminUser = { id: string; name: string; handle: string; role: string; guild: string; status: string; joined: string };

export function AdminUserManager() {
  const users: AdminUser[] = [
    { id: "u1", name: "Kai Nakamura", handle: "Phantom", role: "Organizer", guild: "Vanta Esports", status: "Active", joined: "Mar 2021" },
    { id: "u2", name: "Elena Rossi", handle: "Vertex", role: "Player", guild: "Helix Circuit", status: "Active", joined: "Sep 2021" },
    { id: "u3", name: "Marcus Okonkwo", handle: "Cipher", role: "Player", guild: "Nexus", status: "Active", joined: "Jan 2022" },
    { id: "u4", name: "Sofia Vargas", handle: "Nova", role: "Moderator", guild: "OrbitGG", status: "Suspended", joined: "Apr 2022" },
    { id: "u5", name: "Dmitri Volkov", handle: "Raze", role: "Player", guild: "Pulse Arena", status: "Active", joined: "Jul 2022" },
  ];

  const columns: ColumnDef<AdminUser, unknown>[] = [
    {
      accessorKey: "handle",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-cyan-500/20 to-amber-500/10 text-[10px] font-bold text-hi ring-1 ring-white/10">{row.original.handle.slice(0, 2).toUpperCase()}</span>
          <div>
            <p className="text-sm font-medium text-hi">{row.original.handle}</p>
            <p className="text-xs text-lo">{row.original.name} · Joined {row.original.joined}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="rounded-md border border-cyan-400/30 bg-cyan-400/5 px-2 py-0.5 font-mono text-[10px] text-cyan-300">{row.original.role}</span>
      ),
    },
    { accessorKey: "guild", header: "Guild", cell: ({ row }) => <span className="font-mono text-xs text-mid">{row.original.guild}</span> },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status;
        return (
          <span className={cn("rounded-full border px-2 py-0.5 font-mono text-[10px]", s === "Active" ? "border-emerald-400/40 bg-emerald-400/5 text-emerald-300" : "border-rose-400/40 bg-rose-400/5 text-rose-300")}>{s}</span>
        );
      },
    },
  ];

  return (
    <div>
      <PageHead crumb={["Admin", "User Management"]} title="User Management" sub={`${users.length} total users.`} actions={<Button variant="primary" size="md" icon={Download}>Export Users</Button>} />
      <DataTable
        columns={columns}
        data={users}
        searchColumn="handle"
        searchPlaceholder="Search users…"
      />
    </div>
  );
}

/* ============================================================ ROLES & PERMISSIONS */
const ALL_PERMISSIONS = [
  "tournament.create", "tournament.edit", "tournament.delete",
  "registration.approve", "registration.reject",
  "verification.manage", "checkin.manage",
  "match.generate", "match.update", "match.delete",
  "guild.settings", "guild.branding", "guild.members",
  "role.manage", "analytics.view", "billing.manage",
  "bot.controls", "audit.view"
];

const roles = [
  { id: "owner", name: "Owner", color: "text-amber-300", desc: "Full platform control" },
  { id: "admin", name: "Administrator", color: "text-cyan-300", desc: "Manage guilds and users" },
  { id: "organizer", name: "Organizer", color: "text-emerald-300", desc: "Run tournaments" },
  { id: "moderator", name: "Moderator", color: "text-violet-300", desc: "Moderate events" },
];

export function AdminRolesManager() {
  const [selectedRole, setSelectedRole] = useState("owner");
  const [perms, setPerms] = useState<Record<string, string[]>>({
    owner: ALL_PERMISSIONS,
    admin: ALL_PERMISSIONS.filter(p => !["billing.manage", "bot.controls"].includes(p)),
    organizer: ["tournament.create", "tournament.edit", "registration.approve", "registration.reject", "verification.manage", "checkin.manage", "match.generate", "match.update", "analytics.view"],
    moderator: ["registration.approve", "registration.reject", "match.update", "analytics.view"],
  });

  const togglePerm = (perm: string) => {
    setPerms(prev => {
      const cur = prev[selectedRole];
      const next = cur.includes(perm) ? cur.filter(p => p !== perm) : [...cur, perm];
      return { ...prev, [selectedRole]: next };
    });
  };

  return (
    <div>
      <PageHead crumb={["Admin", "Roles & Permissions"]} title="Roles & Permissions" sub="Granular permission matrix for every role." actions={<Button variant="primary" size="md" icon={Check}>Save Changes</Button>} />
      
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="space-y-1">
          {roles.map((r) => (
            <button key={r.id} onClick={() => setSelectedRole(r.id)} className={cn("flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors", selectedRole === r.id ? "glass bg-cyan-400/10 border border-cyan-400/20" : "hover:bg-white/[0.03]")}>
              <span className={cn("grid h-8 w-8 place-items-center rounded-lg bg-white/[0.04] text-sm", r.color)}>{r.name[0]}</span>
              <div><p className="text-sm font-medium text-hi">{r.name}</p><p className="text-xs text-lo">{r.desc}</p></div>
            </button>
          ))}
        </div>

        <div className="rounded-2xl glass-card p-6">
          <h3 className="text-sm font-semibold text-hi mb-4">Permission Matrix</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {ALL_PERMISSIONS.map((perm) => {
              const active = perms[selectedRole]?.includes(perm);
              return (
                <button key={perm} onClick={() => togglePerm(perm)} className={cn("flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs transition-colors", active ? "border-cyan-400/30 bg-cyan-400/5 text-hi" : "border-white/8 text-mid hover:border-white/20")}>
                  <span className={cn("grid h-5 w-5 place-items-center rounded border transition-colors", active ? "border-cyan-400/60 bg-cyan-400/20 text-cyan-300" : "border-white/15 bg-white/[0.02]")}>{active && <Check className="h-3 w-3" />}</span>
                  {perm}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ AUDIT LOGS */
const auditEntries = [
  { id: "a1", action: "role.updated", user: "Phantom", target: "Raze", guild: "Vanta Esports", detail: "Changed Raze role from Player to Moderator", timestamp: "12m ago" },
  { id: "a2", action: "tournament.created", user: "Phantom", target: "WinterCup 2026", guild: "Vanta Esports", detail: "Created new Double Elimination tournament", timestamp: "2h ago" },
  { id: "a3", action: "guild.settings", user: "Vertex", target: "Helix Circuit", guild: "Helix Circuit", detail: "Updated guild banner and branding", timestamp: "4h ago" },
  { id: "a4", action: "registration.approved", user: "Phantom", target: "Nova", guild: "OrbitGG", detail: "Approved registration for Orbit Open", timestamp: "5h ago" },
  { id: "a5", action: "match.result", user: "Cipher", target: "M-12", guild: "Nexus", detail: "Forced winner on disputed match", timestamp: "Yesterday" },
];

export function AdminAuditLogs() {
  const [filter, setFilter] = useState("All");
  const actions = ["All", ...new Set(auditEntries.map(e => e.action))];

  return (
    <div>
      <PageHead crumb={["Admin", "Audit Logs"]} title="Audit Logs" sub="Immutable record of every platform action." actions={<Button variant="outline" size="md" icon={Download}>Export Logs</Button>} />
      
      <div className="mb-6 flex gap-1 rounded-xl glass-card p-1.5 w-fit overflow-x-auto no-scrollbar">
        {actions.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn("shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", filter === f ? "bg-cyan-400/10 text-cyan-300" : "text-mid hover:text-hi")}>{f}</button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl glass-card">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-white/6 px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-lo">
          <span>Event</span><span>User</span><span>Guild</span><span>Time</span>
        </div>
        <AnimatePresence>
          {auditEntries.filter(e => filter === "All" || e.action === filter).map((e) => (
            <motion.div key={e.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-white/4 px-5 py-4 last:border-0 hover:bg-white/[0.02]">
              <div>
                <div className="flex items-center gap-2"><span className="rounded-md bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-cyan-300">{e.action}</span><span className="text-xs text-lo">{e.target}</span></div>
                <p className="mt-1 text-xs text-mid">{e.detail}</p>
              </div>
              <span className="text-sm text-hi font-medium">{e.user}</span>
              <span className="font-mono text-xs text-mid">{e.guild}</span>
              <span className="font-mono text-[10px] text-lo">{e.timestamp}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================================ API KEYS */
export function AdminAPIKeys() {
  const keys = [
    { id: "k1", name: "Vanta Production", key: "sk_live_...aB3x", created: "Mar 2023", lastUsed: "Now", status: "Active" },
    { id: "k2", name: "Apex Testing", key: "sk_test_...zY7w", created: "Jan 2024", lastUsed: "3 days ago", status: "Active" },
    { id: "k3", name: "Legacy Access", key: "sk_old_...mF2k", created: "Sep 2022", lastUsed: "6 months ago", status: "Revoked" },
  ];

  return (
    <div>
      <PageHead crumb={["Admin", "API Keys"]} title="API Keys" sub="Manage platform-wide API access." actions={<Button variant="primary" size="md" icon={Plus}>Generate Key</Button>} />
      <div className="overflow-hidden rounded-2xl glass-card">
        {keys.map((k) => (
          <div key={k.id} className="flex items-center justify-between gap-4 border-b border-white/4 px-5 py-4 last:border-0 hover:bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-cyan-400" />
              <div><p className="text-sm font-medium text-hi">{k.name}</p><p className="font-mono text-[10px] text-mid">{k.key}</p></div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-lo">Created: {k.created}</span>
              <span className={cn("rounded-full border px-2 py-0.5 font-mono text-[10px]", k.status === "Active" ? "border-emerald-400/40 text-emerald-300" : "border-rose-400/40 text-rose-300")}>{k.status}</span>
              <button className="text-xs text-cyan-300 hover:text-cyan-200">Rotate</button>
              <button className="text-xs text-rose-400 hover:text-rose-300">Revoke</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================ PLATFORM MONITORING */
export function AdminMonitoring() {
  const metrics = [
    { label: "CPU", val: 34, unit: "%", color: "bg-emerald-400" },
    { label: "Memory", val: 68, unit: "%", color: "bg-amber-400" },
    { label: "Disk I/O", val: 12, unit: "MB/s", color: "bg-cyan-400" },
    { label: "Network", val: 2.4, unit: "Gbps", color: "bg-cyan-400" },
    { label: "DB Connections", val: 142, unit: "active", color: "bg-violet-400" },
    { label: "Queue Depth", val: 8, unit: "msg", color: "bg-emerald-400" },
  ];

  return (
    <div>
      <PageHead crumb={["Admin", "Monitoring"]} title="Platform Monitoring" sub="Real-time infrastructure health." />
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-2xl glass-card p-5">
            <p className="font-mono text-[10px] uppercase text-lo">{m.label}</p>
            <div className="mt-2 flex items-baseline gap-2"><span className="font-display text-2xl font-bold text-hi">{m.val}</span><span className="font-mono text-sm text-mid">{m.unit}</span></div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-white/8"><div className={cn("h-full rounded-full", m.color, m.val > 60 ? "animate-pulse" : "")} style={{ width: `${Math.min(m.val, 100)}%` }} /></div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl glass-card p-6">
        <h3 className="text-sm font-semibold text-hi mb-4">Recent Incidents</h3>
        <div className="space-y-2 font-mono text-xs text-mid">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]"><span>Edge network routing delay (SFO-04)</span><span className="text-emerald-400">Resolved</span></div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]"><span>API rate limiting spike (EU-W)</span><span className="text-amber-400">Monitoring</span></div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02]"><span>Bot shard reconnection (4 shards)</span><span className="text-emerald-400">Resolved</span></div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ ADDITIONAL ADMIN STUBS */
function Placeholder({ title, desc, icon: Icon }: { title: string, desc: string, icon: any }) {
  return (
    <div>
      <PageHead crumb={["Admin", title]} title={title} sub={desc} />
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

export const AdminTournaments = () => <Placeholder title="Tournaments" desc="Platform-wide tournament oversight." icon={LayoutDashboard} />;
export const AdminBilling = () => <Placeholder title="Subscription & Billing" desc="Manage enterprise plans and invoices." icon={CreditCard} />;
export const AdminIntegrations = () => <Placeholder title="Integrations" desc="Third-party connections." icon={Plug} />;
export const AdminSecurity = () => <Placeholder title="Security" desc="Global security configuration." icon={ShieldCheck} />;
export const AdminDatabase = () => <Placeholder title="Database Tools" desc="Maintenance and backups." icon={Database} />;
export const AdminFeatureFlags = () => <Placeholder title="Feature Flags" desc="Toggle platform features." icon={SlidersHorizontal} />;
export const AdminSettings = () => <Placeholder title="Platform Settings" desc="Global configuration." icon={Settings} />;
