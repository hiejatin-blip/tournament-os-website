import type { LucideIcon } from "lucide-react";
import {
  ShieldCheck,
  CalendarClock,
  CalendarRange,
  GitBranch,
  Swords,
  BarChart3,
  LayoutDashboard,
  MessagesSquare,
  Bot,
  Users,
  BellRing,
  Zap,
  Rocket,
  Lock,
  KeyRound,
  BadgeCheck,
  Timer,
  Server,
  Globe2,
  Layers,
  Plug,
  Radio,
  TrendingUp,
  Crown,
  Gauge,
  Webhook,
  Sparkles,
  Trophy,
  Activity,
} from "lucide-react";

/* ---------------------------------------------------------------- nav */
export const heroStats: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
}[] = [
  { value: 12.4, decimals: 1, suffix: "M+", label: "Matches orchestrated" },
  { value: 318, suffix: "K+", label: "Tournaments automated" },
  { value: 99.99, decimals: 2, suffix: "%", label: "Platform uptime" },
  { value: 38, prefix: "~", suffix: "ms", label: "Automation latency" },
];

export const trustLogos: string[] = [
  "VANTA ESPORTS",
  "APEX LEAGUE",
  "NEXUS",
  "HELIX CIRCUIT",
  "ORBITGG",
  "VANGUARD",
  "PULSE ARENA",
  "MERIDIAN",
  "STRATA",
];

/* ---------------------------------------------------------------- paradigm */
export const pains: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Users,
    title: "Manual check-ins",
    desc: "A moderator pastes a roster into a spreadsheet at 2am and hopes nobody double-registers.",
  },
  {
    icon: BellRing,
    title: "DM chaos",
    desc: "Score reports, substitutions, and disputes scattered across a hundred private messages.",
  },
  {
    icon: CalendarClock,
    title: "Brittle brackets",
    desc: "Hand-built brackets that break the moment a single player no-shows.",
  },
  {
    icon: Lock,
    title: "No verification",
    desc: "Smurfs, region mismatches, and ineligible accounts discovered after the damage is done.",
  },
];

export const gains: string[] = [
  "Verified, gate-kept entry — automatically",
  "Brackets that recompute themselves in real time",
  "One control surface for the entire operation",
  "Every match becomes structured, auditable data",
];

/* ---------------------------------------------------------------- lifecycle */
export const lifecycle: {
  icon: LucideIcon;
  title: string;
  desc: string;
}[] = [
  { icon: Sparkles, title: "Create", desc: "Spin up a tournament from a reusable template in seconds." },
  { icon: Users, title: "Register", desc: "Controlled sign-ups with caps, waitlists, and custom fields." },
  { icon: ShieldCheck, title: "Verify", desc: "Account, region, and eligibility checks run on entry." },
  { icon: CalendarClock, title: "Check-in", desc: "Windowed check-ins with automatic no-show policy." },
  { icon: Gauge, title: "Seed", desc: "Conflict-aware seeding across timezones and streams." },
  { icon: GitBranch, title: "Bracket", desc: "Single, double, Swiss, round-robin — auto-generated." },
  { icon: Swords, title: "Go Live", desc: "Match threads, scores, and comms orchestrated live." },
  { icon: Trophy, title: "Resolve", desc: "Placements, payouts, stats, and recap — finalized." },
];

/* ---------------------------------------------------------------- automation log */
export const automationLog: {
  t: string;
  msg: string;
  tag: "init" | "ok" | "info" | "discord" | "live";
}[] = [
  { t: "00:00", msg: "Tournament WinterCup-2026 created from template", tag: "init" },
  { t: "00:02", msg: "Registration opened · 0 / 256 slots", tag: "ok" },
  { t: "00:14", msg: "256 entrants received · 0 duplicates flagged", tag: "ok" },
  { t: "00:15", msg: "Eligibility verified for 254 players", tag: "ok" },
  { t: "00:16", msg: "Check-in window opened", tag: "info" },
  { t: "00:31", msg: "256 / 256 checked in", tag: "ok" },
  { t: "00:32", msg: "Bracket seeded · double-elimination", tag: "ok" },
  { t: "00:33", msg: "Match channels provisioned · 128 threads", tag: "discord" },
  { t: "00:34", msg: "Captains notified across 12 timezones", tag: "info" },
  { t: "00:35", msg: "Tournament is LIVE", tag: "live" },
];

/* ---------------------------------------------------------------- modules */
export type Module = {
  icon: LucideIcon;
  name: string;
  desc: string;
  points: string[];
  featured?: boolean;
};

export const modules: Module[] = [
  {
    icon: ShieldCheck,
    name: "Registration & Verification",
    desc: "Verified, gate-kept sign-ups. Eligibility, region, and account integrity checks run automatically the instant a player enters — before they ever touch a bracket.",
    points: ["Account & region verification", "Anti-smurf & duplicate detection", "Custom entry requirements"],
    featured: true,
  },
  {
    icon: CalendarClock,
    name: "Check-in Engine",
    desc: "Windowed, automatic check-ins. Late arrivals, no-shows, and substitutes resolve by policy, not by a sleep-deprived moderator.",
    points: [],
  },
  {
    icon: CalendarRange,
    name: "Smart Scheduling",
    desc: "Conflict-aware seeding across timezones, streams, and courts. Reschedules ripple through every dependent match instantly.",
    points: [],
  },
  {
    icon: GitBranch,
    name: "Bracket Engine",
    desc: "Single & double elimination, Swiss, round-robin, and gauntlet. Brackets generate and recompute live as results land.",
    points: [],
  },
  {
    icon: Swords,
    name: "Live Match Ops",
    desc: "Match threads, score reporting, pause handling, and dispute comms — all inside Discord, all fully auditable.",
    points: [],
  },
  {
    icon: BarChart3,
    name: "Analytics",
    desc: "Player histories, head-to-head records, and org-wide dashboards. Every match becomes a structured data point.",
    points: [],
  },
  {
    icon: LayoutDashboard,
    name: "Staff Console",
    desc: "Granular roles, audit trails, and a unified control surface for operators running hundreds of events at once.",
    points: [],
  },
];

/* ---------------------------------------------------------------- dashboard tabs */
export const dashboardTabs: { id: string; label: string; icon: LucideIcon; sub: string }[] = [
  { id: "live", label: "Live Ops", icon: Activity, sub: "3 matches in progress" },
  { id: "bracket", label: "Bracket", icon: GitBranch, sub: "Round of 16 · double elim" },
  { id: "players", label: "Players", icon: Users, sub: "256 verified entrants" },
  { id: "analytics", label: "Analytics", icon: TrendingUp, sub: "Real-time overview" },
];

export const liveMatches = [
  { a: "VANTA Black", b: "Helix Apex", score: "2 – 1", round: "QF", live: true },
  { a: "Nexus Prime", b: "Orbit.gg", score: "1 – 0", round: "QF", live: true },
  { a: "Pulse Arena", b: "Meridian", score: "0 – 0", round: "QF", live: true },
];

/* ---------------------------------------------------------------- analytics */
export const analyticsMetrics: {
  icon: LucideIcon;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
}[] = [
  { icon: Activity, value: 94, suffix: "%", label: "Avg. check-in rate" },
  { icon: Timer, value: 11, prefix: "<", suffix: " min", label: "Start-to-live time" },
  { icon: Users, value: 4.2, decimals: 1, suffix: "x", label: "Player retention lift" },
  { icon: TrendingUp, value: 100, suffix: "%", label: "Automated, no manual ops" },
];

/* chart series (relative heights %) */
export const chartSeries = [38, 52, 44, 63, 58, 74, 68, 86, 79, 92, 88, 100];

/* ---------------------------------------------------------------- discord */
export const discordFeatures: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Webhook,
    title: "Auto-provisioning",
    desc: "Roles, channels, and permissions created the instant a tournament is born.",
  },
  {
    icon: MessagesSquare,
    title: "Match threads",
    desc: "Every match gets its own thread with scores, comms, and an audit trail.",
  },
  {
    icon: BellRing,
    title: "Smart notifications",
    desc: "Captains, staff, and players pinged only when it matters, across timezones.",
  },
  {
    icon: Bot,
    title: "Commands, not clutter",
    desc: "A clean slash-command surface — Tournament OS never feels like a bot.",
  },
];

/* ---------------------------------------------------------------- integrations / capabilities */
export const capabilities: { icon: LucideIcon; label: string }[] = [
  { icon: Globe2, label: "Global edge" },
  { icon: Server, label: "99.99% uptime" },
  { icon: Layers, label: "Multi-game" },
  { icon: Plug, label: "Webhooks & API" },
  { icon: KeyRound, label: "SSO / SAML" },
  { icon: Lock, label: "SOC 2 controls" },
  { icon: BadgeCheck, label: "Audit trails" },
  { icon: Radio, label: "Realtime sync" },
];

/* ---------------------------------------------------------------- testimonials */
export const testimonials: { quote: string; name: string; role: string; org: string }[] = [
  {
    quote:
      "We went from three admins pulling all-nighters to one operator running 40 concurrent brackets. Tournament OS didn't improve our workflow — it replaced it.",
    name: "Marina Okonkwo",
    role: "Director of Competitive",
    org: "Vanta Esports",
  },
  {
    quote:
      "The verification layer alone eliminated the smurfing problem we'd fought for years. It runs before a player can even enter a bracket.",
    name: "Daichi Mori",
    role: "League Commissioner",
    org: "Apex League",
  },
  {
    quote:
      "It finally feels like infrastructure. Brackets recompute themselves, check-ins happen on policy, and our staff actually sleep now.",
    name: "Elena Vasquez",
    role: "Head of Operations",
    org: "Helix Circuit",
  },
  {
    quote:
      "Our sponsors trust the numbers because they're structured and auditable from the first match to the final. That's worth more than any feature.",
    name: "Noah Bergstrom",
    role: "Partnerships Lead",
    org: "OrbitGG",
  },
];

/* ---------------------------------------------------------------- pricing */
export const pricingTiers: {
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  features: string[];
  cta: string;
  featured?: boolean;
  icon: LucideIcon;
}[] = [
  {
    name: "Operator",
    price: "$0",
    cadence: "free forever",
    tagline: "For grassroots communities getting organized.",
    features: [
      "Up to 64 players per event",
      "Automated registration & check-in",
      "Single & double elimination brackets",
      "Discord match threads",
      "Core analytics",
    ],
    cta: "Start free",
    icon: Rocket,
  },
  {
    name: "Scale",
    price: "$49",
    cadence: "per month",
    tagline: "For organizers running a real circuit.",
    features: [
      "Unlimited players & concurrent events",
      "Verification, seeding & Swiss formats",
      "Custom branding & domains",
      "Staff console with role-based access",
      "Full analytics & exports",
      "Priority automation lane",
    ],
    cta: "Start 14-day trial",
    featured: true,
    icon: Zap,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "annual",
    tagline: "For global esports organizations at scale.",
    features: [
      "Everything in Scale",
      "SSO / SAML & SOC 2 controls",
      "Dedicated infrastructure & SLAs",
      "Webhooks, API & data residency",
      "White-glove migration",
      "24/7 dedicated support",
    ],
    cta: "Talk to sales",
    icon: Crown,
  },
];

/* ---------------------------------------------------------------- faq */
export const faqs: { q: string; a: string }[] = [
  {
    q: "Is Tournament OS just another Discord bot?",
    a: "No. It integrates natively with Discord, but it is a full operating system for tournaments. Registration, verification, scheduling, brackets, live operations, and analytics all run on the platform itself — Discord is one of many surfaces it orchestrates.",
  },
  {
    q: "How fast can a tournament actually go live?",
    a: "From a saved template to a live, fully-seeded bracket with verified players and provisioned channels, most operators reach 'live' in well under fifteen minutes — most of which is simply players checking in.",
  },
  {
    q: "What formats are supported?",
    a: "Single elimination, double elimination, Swiss, round-robin, gauntlet, and custom stage combinations. Brackets recompute live as results are reported, so no-shows and substitutions never break the structure.",
  },
  {
    q: "How does verification work?",
    a: "Tournament OS runs account, region, and eligibility checks the moment a player registers. Anti-smurf and duplicate detection flag suspicious entries before they reach a bracket — fully automatic, configurable per event.",
  },
  {
    q: "Can multiple staff members run events together?",
    a: "Yes. The staff console provides granular, role-based access with full audit trails, so organizers, moderators, and admins each see exactly what they need across hundreds of concurrent events.",
  },
  {
    q: "Do you offer enterprise security and SLAs?",
    a: "Enterprise plans include SSO/SAML, SOC 2 controls, data residency, dedicated infrastructure, contractual SLAs, and a migration team to move you off whatever you run today.",
  },
];

/* ---------------------------------------------------------------- footer */
