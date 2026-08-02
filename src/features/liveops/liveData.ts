/* ============================================================================
   TOURNAMENT OS — LIVE OPERATIONS TELEMETRY
   ----------------------------------------------------------------------------
   A client-side real-time simulation layer. In production every value here is
   fed by the Tournament OS Bot / backend over WebSocket. The shapes map 1:1
   onto those payloads so swapping the source is a one-line change.
   ============================================================================ */
import { useState } from "react";
import { useVisibleInterval, useVisibleLoop } from "@/shared/system/useVisibleInterval";

/* ------------------------------------------------------------------ types */
export type ServiceState = "operational" | "degraded" | "down" | "syncing";

export type SystemService = {
  id: string;
  name: string;
  state: ServiceState;
  latency: number;      // ms
  uptime: number;       // %
};

export type LiveEvent = {
  id: number;
  kind:
    | "register" | "team" | "match_start" | "match_end" | "verify"
    | "checkin" | "publish" | "mod" | "automation" | "bot" | "scheduler" | "alert";
  message: string;
  actor: string;
  guild: string;
  ts: number;           // epoch ms
  severity: "info" | "success" | "warning" | "critical";
};

export type LiveMatch = {
  id: string;
  round: string;
  a: string;
  b: string;
  scoreA: number;
  scoreB: number;
  state: "live" | "paused" | "pending" | "delayed";
  map: string;
  clock: number;        // seconds elapsed
  viewers: number;
};

export type Telemetry = {
  activeGuilds: number;
  activeTournaments: number;
  liveRegistrations: number;
  playersOnline: number;
  teamsOnline: number;
  liveMatches: number;
  pendingReviews: number;
  verificationQueue: number;
  checkinQueue: number;
  systemAlerts: number;
  botPing: number;
  botCpu: number;
  botMemory: number;
  commandSuccess: number;
  schedulerQueue: number;
  backgroundJobs: number;
  apiRps: number;
  services: SystemService[];
  matches: LiveMatch[];
  latencyHistory: number[];
  throughputHistory: number[];
};

/* ------------------------------------------------------------------ seed */
const GUILDS = ["Vanta Esports", "Apex League", "Helix Circuit", "OrbitGG", "Nexus", "Pulse Arena"];
const ACTORS = ["Phantom", "Vertex", "Cipher", "Nova", "Raze", "Echo", "system", "TO-Bot", "scheduler"];

const EVENT_TEMPLATES: { kind: LiveEvent["kind"]; severity: LiveEvent["severity"]; make: () => string }[] = [
  { kind: "register", severity: "info", make: () => `New player registered for WinterCup 2026` },
  { kind: "team", severity: "success", make: () => `Team roster approved · ${pick(["Vanta Black", "Helix Apex", "Nexus Prime"])}` },
  { kind: "match_start", severity: "info", make: () => `Match started · QF ${pick(["M-12", "M-14", "M-15"])}` },
  { kind: "match_end", severity: "success", make: () => `Match finished · ${pick(["Vanta Black", "Orbit.gg"])} advances` },
  { kind: "verify", severity: "success", make: () => `Verification approved · region + anti-smurf clear` },
  { kind: "checkin", severity: "warning", make: () => `Check-in window closing in 5 minutes` },
  { kind: "publish", severity: "info", make: () => `Tournament published · ${pick(["Orbit Open", "Spectra Cup"])}` },
  { kind: "mod", severity: "warning", make: () => `Moderator action · dispute escalated to review` },
  { kind: "automation", severity: "success", make: () => `Automation trigger · bracket auto-advanced` },
  { kind: "bot", severity: "info", make: () => `Bot heartbeat · all shards nominal` },
  { kind: "scheduler", severity: "info", make: () => `Scheduler event · reminder dispatched to 42 players` },
  { kind: "alert", severity: "critical", make: () => `Player disconnect detected · M-14 paused` },
];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function jitter(base: number, spread: number) { return Math.max(0, Math.round(base + (Math.random() - 0.5) * spread)); }

function seedTelemetry(): Telemetry {
  return {
    activeGuilds: 24180,
    activeTournaments: 318,
    liveRegistrations: 1284,
    playersOnline: 48210,
    teamsOnline: 6402,
    liveMatches: 42,
    pendingReviews: 7,
    verificationQueue: 23,
    checkinQueue: 58,
    systemAlerts: 1,
    botPing: 12,
    botCpu: 34,
    botMemory: 62,
    commandSuccess: 99.7,
    schedulerQueue: 8,
    backgroundJobs: 14,
    apiRps: 2410,
    services: [
      { id: "api", name: "API Gateway", state: "operational", latency: 38, uptime: 99.99 },
      { id: "db", name: "Database", state: "operational", latency: 4, uptime: 99.99 },
      { id: "redis", name: "Redis Cache", state: "operational", latency: 1, uptime: 100 },
      { id: "gateway", name: "Discord Gateway", state: "operational", latency: 42, uptime: 99.95 },
      { id: "workers", name: "Background Workers", state: "operational", latency: 120, uptime: 99.9 },
      { id: "scheduler", name: "Scheduler", state: "operational", latency: 15, uptime: 99.98 },
      { id: "automation", name: "Automation Engine", state: "operational", latency: 22, uptime: 99.97 },
      { id: "notify", name: "Notification Queue", state: "syncing", latency: 210, uptime: 99.8 },
      { id: "storage", name: "Object Storage", state: "operational", latency: 68, uptime: 99.99 },
    ],
    matches: [
      { id: "M-12", round: "Quarterfinal", a: "Vanta Black", b: "Helix Apex", scoreA: 2, scoreB: 1, state: "live", map: "Ascent", clock: 1840, viewers: 12840 },
      { id: "M-14", round: "Quarterfinal", a: "Nexus Prime", b: "Orbit.gg", scoreA: 1, scoreB: 1, state: "delayed", map: "Bind", clock: 920, viewers: 8210 },
      { id: "M-15", round: "Quarterfinal", a: "Pulse Arena", b: "Meridian", scoreA: 0, scoreB: 0, state: "pending", map: "Haven", clock: 0, viewers: 0 },
      { id: "M-16", round: "Quarterfinal", a: "Titan Core", b: "Frost North", scoreA: 2, scoreB: 0, state: "paused", map: "Split", clock: 1420, viewers: 5610 },
    ],
    latencyHistory: Array.from({ length: 40 }, () => jitter(38, 20)),
    throughputHistory: Array.from({ length: 40 }, () => jitter(2400, 900)),
  };
}

let _id = 1;
function makeEvent(): LiveEvent {
  const t = pick(EVENT_TEMPLATES);
  return { id: _id++, kind: t.kind, message: t.make(), actor: pick(ACTORS), guild: pick(GUILDS), ts: Date.now(), severity: t.severity };
}

export function seedEvents(n = 14): LiveEvent[] {
  return Array.from({ length: n }, () => {
    const e = makeEvent();
    e.ts = Date.now() - Math.floor(Math.random() * 60000);
    return e;
  }).sort((a, b) => b.ts - a.ts);
}

/* ------------------------------------------------------------------ hooks */

/** Global ticking telemetry. Values drift every `interval` ms to feel live. */
export function useLiveTelemetry(interval = 2000): Telemetry {
  const [t, setT] = useState<Telemetry>(seedTelemetry);
  // Visibility-aware: pauses automatically when the tab is backgrounded.
  useVisibleInterval(() => {
    setT((prev) => {
      const nextLatency = jitter(38, 26);
      const nextTp = jitter(2400, 1000);
      return {
        ...prev,
        liveRegistrations: jitter(prev.liveRegistrations, 60),
        playersOnline: jitter(prev.playersOnline, 400),
        teamsOnline: jitter(prev.teamsOnline, 60),
        liveMatches: jitter(42, 6),
        checkinQueue: jitter(prev.checkinQueue, 8),
        verificationQueue: jitter(prev.verificationQueue, 4),
        botPing: jitter(12, 8),
        botCpu: Math.min(96, jitter(34, 14)),
        botMemory: Math.min(94, jitter(62, 8)),
        apiRps: nextTp,
        schedulerQueue: jitter(8, 4),
        backgroundJobs: jitter(14, 5),
        latencyHistory: [...prev.latencyHistory.slice(1), nextLatency],
        throughputHistory: [...prev.throughputHistory.slice(1), nextTp],
        matches: prev.matches.map((m) =>
          m.state === "live"
            ? { ...m, clock: m.clock + interval / 1000, viewers: jitter(m.viewers, 300) }
            : m,
        ),
      };
    });
  }, interval);
  return t;
}

/** Streaming event feed — prepends a new event on an irregular cadence.
    Visibility-aware: does not accumulate events while the tab is hidden. */
export function useLiveFeed(max = 40): LiveEvent[] {
  const [events, setEvents] = useState<LiveEvent[]>(() => seedEvents());
  useVisibleLoop(
    () => setEvents((prev) => [makeEvent(), ...prev].slice(0, max)),
    () => 1400 + Math.random() * 2600,
  );
  return events;
}

export function relTime(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 5) return "now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

export function fmtClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
