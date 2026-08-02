/* ============================================================================
   TOURNAMENT OS — CENTRAL NAVIGATION REGISTRY
   ----------------------------------------------------------------------------
   Single source of truth for every navigation domain in the platform.
   Designed to scale to 100+ pages across Marketing, Public, and Portal domains.

   Domains:
     - marketingNav  : top-level mega-menu (public marketing site)
     - publicTabs     : sub-navigation inside the Explore/public platform
     - portalNav      : role-based sidebar navigation (player/organizer/admin)
     - footerColumns  : global footer sitemap
     - utilityNav     : profile menu, quick actions, search entry
   ============================================================================ */
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Cpu, CalendarClock, GitBranch, MessagesSquare, BarChart3,
  ShieldCheck, Users, UserCheck, CheckSquare, Bell, FileText, Trophy, Building2,
  GraduationCap, Server, Globe2, Network, Gauge, Settings, Key, Activity, Calendar,
  Rocket, Search, LogOut, User, HelpCircle, Sparkles, Swords, Megaphone, Boxes,
  CreditCard, Plug, Database, SlidersHorizontal, ScrollText, Users2, ClipboardList,
} from "lucide-react";

export type NavLink = { label: string; to: string; desc?: string; icon?: LucideIcon; badge?: string };
export type NavGroup = { heading: string; links: NavLink[] };
export type MegaItem = { label: string; to?: string; groups?: NavGroup[] };

/* ------------------------------------------------------------------ MARKETING */
export const marketingNav: MegaItem[] = [
  {
    label: "Platform",
    groups: [
      {
        heading: "Core systems",
        links: [
          { label: "Overview", to: "/platform", desc: "The full operating system", icon: LayoutDashboard },
          { label: "Automation Engine", to: "/platform/automation", desc: "Event-driven orchestration", icon: Cpu },
          { label: "Tournament Engine", to: "/platform/tournament-engine", desc: "Formats & brackets", icon: Trophy },
          { label: "Scheduler", to: "/platform/scheduler", desc: "Conflict-aware timing", icon: CalendarClock },
        ],
      },
      {
        heading: "Live operations",
        links: [
          { label: "Matchmaking", to: "/platform/matchmaking", desc: "Seeding & pairing", icon: Gauge },
          { label: "Live Brackets", to: "/platform/live-brackets", desc: "Real-time trees", icon: GitBranch },
          { label: "Discord Integration", to: "/platform/discord", desc: "Native, not a bot", icon: MessagesSquare },
          { label: "Analytics", to: "/platform/analytics", desc: "Structured data", icon: BarChart3 },
        ],
      },
      {
        heading: "Trust",
        links: [
          { label: "Architecture", to: "/platform/architecture", desc: "How it's built", icon: Network },
          { label: "Security", to: "/platform/security", desc: "SOC 2 · ISO 27001", icon: ShieldCheck },
        ],
      },
    ],
  },
  {
    label: "Features",
    groups: [
      {
        heading: "Entry",
        links: [
          { label: "Registration", to: "/features/registration", icon: FileText },
          { label: "Verification", to: "/features/verification", icon: ShieldCheck },
          { label: "Check-in", to: "/features/check-in", icon: CheckSquare },
          { label: "Team Management", to: "/features/teams", icon: Users },
        ],
      },
      {
        heading: "Operations",
        links: [
          { label: "Brackets", to: "/features/brackets", icon: GitBranch },
          { label: "Scheduling", to: "/features/scheduling", icon: CalendarClock },
          { label: "Match Threads", to: "/features/match-threads", icon: MessagesSquare },
          { label: "Automation", to: "/features/automation", icon: Cpu },
        ],
      },
      {
        heading: "Insight",
        links: [
          { label: "Dashboard", to: "/features/dashboard", icon: LayoutDashboard },
          { label: "Notifications", to: "/features/notifications", icon: Bell },
          { label: "Reports", to: "/features/reports", icon: BarChart3 },
        ],
      },
    ],
  },
  {
    label: "Solutions",
    groups: [
      {
        heading: "Communities",
        links: [
          { label: "Discord Communities", to: "/solutions/discord", icon: MessagesSquare },
          { label: "Online Leagues", to: "/solutions/leagues", icon: Globe2 },
          { label: "LAN Events", to: "/solutions/lan", icon: Server },
        ],
      },
      {
        heading: "Organizations",
        links: [
          { label: "Esports Orgs", to: "/solutions/esports", icon: Trophy },
          { label: "Colleges & Universities", to: "/solutions/education", icon: GraduationCap },
          { label: "Enterprise", to: "/solutions/enterprise", icon: Building2 },
        ],
      },
    ],
  },
  { label: "Explore", to: "/explore" },
  { label: "Pricing", to: "/pricing" },
];

/* ------------------------------------------------------------------ PUBLIC PLATFORM */
export const publicTabs: NavLink[] = [
  { label: "Overview", to: "/explore", icon: Sparkles },
  { label: "Tournaments", to: "/explore/tournaments", icon: Trophy },
  { label: "Guilds", to: "/explore/guilds", icon: Building2 },
  { label: "Teams", to: "/explore/teams", icon: Users2 },
  { label: "Players", to: "/explore/players", icon: UserCheck },
];

/* ------------------------------------------------------------------ PORTALS (role-based) */
export type PortalRole = "player" | "organizer" | "admin";

export const portalMeta: Record<PortalRole, { label: string; base: string; accent: string }> = {
  player: { label: "Player", base: "/app/player", accent: "cyan" },
  organizer: { label: "Organizer", base: "/app/organizer", accent: "cyan" },
  admin: { label: "Admin", base: "/app/admin", accent: "amber" },
};

/* Role-based sidebar navigation. Grouped so it scales to dozens of items. */
export const portalNav: Record<PortalRole, NavGroup[]> = {
  player: [
    {
      heading: "Overview",
      links: [
        { label: "Dashboard", to: "/app/player", icon: LayoutDashboard },
        { label: "My Tournaments", to: "/app/player/tournaments", icon: Trophy },
        { label: "My Teams", to: "/app/player/teams", icon: Users },
      ],
    },
    {
      heading: "Competition",
      links: [
        { label: "Registrations", to: "/app/player/registrations", icon: ClipboardList },
        { label: "Check-ins", to: "/app/player/check-ins", icon: CheckSquare },
        { label: "Verification", to: "/app/player/verification", icon: ShieldCheck },
        { label: "Match History", to: "/app/player/matches", icon: Swords },
      ],
    },
    {
      heading: "Profile",
      links: [
        { label: "Statistics", to: "/app/player/stats", icon: BarChart3 },
        { label: "Achievements", to: "/app/player/achievements", icon: Trophy },
        { label: "Notifications", to: "/app/player/notifications", icon: Bell },
        { label: "Settings", to: "/app/player/settings", icon: Settings },
      ],
    },
  ],
  organizer: [
    {
      heading: "Overview",
      links: [
        { label: "Dashboard", to: "/app/organizer", icon: LayoutDashboard },
        { label: "Live Ops", to: "/app/organizer/live", icon: Activity, badge: "LIVE" },
        { label: "Bot Control", to: "/app/organizer/bot", icon: Cpu },
        { label: "Guild Manager", to: "/app/organizer/guild", icon: Building2 },
        { label: "Tournament Manager", to: "/app/organizer/tournaments", icon: Trophy },
      ],
    },
    {
      heading: "Operations",
      links: [
        { label: "Registration", to: "/app/organizer/registration", icon: FileText },
        { label: "Verification", to: "/app/organizer/verification", icon: ShieldCheck },
        { label: "Check-in", to: "/app/organizer/check-in", icon: CheckSquare },
        { label: "Scheduler", to: "/app/organizer/scheduler", icon: Calendar },
        { label: "Automation", to: "/app/organizer/automation", icon: Cpu },
        { label: "Live Brackets", to: "/app/organizer/brackets", icon: GitBranch },
      ],
    },
    {
      heading: "Engagement",
      links: [
        { label: "Match Threads", to: "/app/organizer/threads", icon: MessagesSquare },
        { label: "Announcements", to: "/app/organizer/announcements", icon: Megaphone },
        { label: "Notifications", to: "/app/organizer/notifications", icon: Bell },
        { label: "Analytics", to: "/app/organizer/analytics", icon: BarChart3 },
        { label: "Reports", to: "/app/organizer/reports", icon: FileText },
        { label: "Settings", to: "/app/organizer/settings", icon: Settings },
      ],
    },
    {
      heading: "Intelligence",
      links: [
        { label: "AI Copilot", to: "/app/organizer/ai", icon: Sparkles, badge: "NEW" },
        { label: "Advanced Analytics", to: "/app/organizer/analytics-pro", icon: BarChart3 },
        { label: "Reporting Center", to: "/app/organizer/reporting", icon: FileText },
      ],
    },
  ],
  admin: [
    {
      heading: "Overview",
      links: [
        { label: "Dashboard", to: "/app/admin", icon: LayoutDashboard },
        { label: "Guild Management", to: "/app/admin/guilds", icon: Server },
        { label: "User Management", to: "/app/admin/users", icon: UserCheck },
        { label: "Tournaments", to: "/app/admin/tournaments", icon: Trophy },
      ],
    },
    {
      heading: "Access & billing",
      links: [
        { label: "Roles & Permissions", to: "/app/admin/roles", icon: ShieldCheck },
        { label: "Subscription & Billing", to: "/app/admin/billing", icon: CreditCard },
        { label: "API Keys", to: "/app/admin/api-keys", icon: Key },
        { label: "Integrations", to: "/app/admin/integrations", icon: Plug },
      ],
    },
    {
      heading: "System",
      links: [
        { label: "Security", to: "/app/admin/security", icon: ShieldCheck },
        { label: "Audit Logs", to: "/app/admin/audit", icon: ScrollText },
        { label: "Monitoring", to: "/app/admin/monitoring", icon: Activity },
        { label: "Database Tools", to: "/app/admin/database", icon: Database },
        { label: "Feature Flags", to: "/app/admin/flags", icon: SlidersHorizontal },
        { label: "Platform Settings", to: "/app/admin/settings", icon: Settings },
      ],
    },
  ],
};

/* Portal switcher (shown in dashboard chrome) */
export const portalSwitcher: NavLink[] = [
  { label: "Player Portal", to: "/app/player", icon: UserCheck, desc: "Your tournaments & career" },
  { label: "Organizer Portal", to: "/app/organizer", icon: LayoutDashboard, desc: "Run events end to end" },
  { label: "Admin Portal", to: "/app/admin", icon: ShieldCheck, desc: "Platform control" },
];

/* Profile dropdown (utility nav) */
export const profileMenu: NavLink[] = [
  { label: "Your profile", to: "/app/player", icon: User },
  { label: "Settings", to: "/app/player/settings", icon: Settings },
  { label: "Help center", to: "/docs", icon: HelpCircle },
  { label: "Sign out", to: "/login", icon: LogOut },
];

/* ------------------------------------------------------------------ FOOTER */
export const footerColumns: NavGroup[] = [
  {
    heading: "Platform",
    links: [
      { label: "Overview", to: "/platform" },
      { label: "Automation Engine", to: "/platform/automation" },
      { label: "Live Brackets", to: "/platform/live-brackets" },
      { label: "Analytics", to: "/platform/analytics" },
      { label: "Security", to: "/platform/security" },
    ],
  },
  {
    heading: "Product",
    links: [
      { label: "Explore", to: "/explore" },
      { label: "Player Portal", to: "/app/player" },
      { label: "Organizer Portal", to: "/app/organizer" },
      { label: "Admin Portal", to: "/app/admin" },
      { label: "Pricing", to: "/pricing" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Documentation", to: "/docs" },
      { label: "API Reference", to: "/docs/api" },
      { label: "Changelog", to: "/changelog" },
      { label: "Roadmap", to: "/roadmap" },
      { label: "Blog", to: "/blog" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Careers", to: "/careers" },
      { label: "Contact", to: "/contact" },
      { label: "Status", to: "/status" },
      { label: "Login", to: "/login" },
    ],
  },
];

/* Quick actions surfaced in the command bar / search entry */
export const quickActions: NavLink[] = [
  { label: "Create tournament", to: "/app/organizer/tournaments", icon: Rocket },
  { label: "Explore tournaments", to: "/explore/tournaments", icon: Trophy },
  { label: "Open dashboard", to: "/app/organizer", icon: LayoutDashboard },
  { label: "Browse guilds", to: "/explore/guilds", icon: Boxes },
  { label: "Search everything", to: "/explore", icon: Search },
];
