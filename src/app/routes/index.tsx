import { Routes, Route } from "react-router-dom";

/* Layouts */
import { RootLayout } from "@/app/layouts/RootLayout";
import { HomeLayout } from "@/app/layouts/HomeLayout";
import { MarketingLayout } from "@/app/layouts/MarketingLayout";
import { PublicLayout } from "@/app/layouts/PublicLayout";
import { DashboardLayout } from "@/app/layouts/DashboardLayout";
import { AuthLayout } from "@/app/layouts/AuthLayout";

/* Auth */
import { ProtectedRoute, LoginPage, SignupPage, ForgotPasswordPage, ResetPasswordPage, EmailVerificationPage } from "@/features/auth";

/* Player portal pages (Phase 3) */
import {
  PlayerDashboard, MyTournaments, MyTeams, Registrations, CheckIns,
  Verification, MatchHistory, PlayerStats, Achievements, NotificationCenter, AccountSettings,
} from "@/features/player/PlayerPortal";

/* Marketing domain barrel */
import {
  HomePage, MarketingPage, PlatformOverviewPage, PricingPage,
  ChangelogPage, RoadmapPage, ContentPage, StatusPage, NotFoundPage,
  platformPages, featurePages, solutionPages,
} from "@/features/marketing";

/* Public platform barrel */
import {
  ExplorePage, TournamentsDirectory, GuildsDirectory, PlayersDirectory, TeamsDirectory,
  TournamentProfile, GuildProfile, PlayerProfile, TeamProfile,
} from "@/features/public";

/* Organizer/admin portal stubs (rendered by PortalDashboard system) */
import { PortalDashboard } from "@/features/portal/PortalDashboard";
import {
  TournamentManager, RegistrationManager, LiveBracketsManager, AutomationManager, GuildManager,
  SchedulerManager, MatchThreadsManager, AnnouncementsManager, OrganizerAnalytics, ReportsManager,
  OrganizerSettings, VerificationManager, CheckInManager
} from "@/features/organizer";
import {
  AdminGuildManager, AdminUserManager, AdminRolesManager, AdminAuditLogs,
  AdminAPIKeys, AdminTournaments, AdminBilling,
  AdminIntegrations, AdminSecurity, AdminDatabase, AdminFeatureFlags, AdminSettings,
} from "@/features/admin";
/* Live Operations Center (Phase 6) */
import { LiveOpsCenter, BotControlCenter, SystemHealth, NotificationCenter2 } from "@/features/liveops";
/* AI Intelligence Layer (Phase 7) */
import { AIInsightsPage, AdvancedAnalytics, ReportingCenter } from "@/features/ai";
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>

        {/* ---------------- HOME (cinematic) ---------------- */}
        <Route element={<HomeLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* ---------------- MARKETING ---------------- */}
        <Route element={<MarketingLayout />}>
          <Route path="/platform" element={<PlatformOverviewPage />} />
          {Object.entries(platformPages).map(([slug, cfg]) => (
            <Route key={slug} path={`/platform/${slug}`} element={<MarketingPage config={cfg} breadcrumb={[{ label: "Platform", to: "/platform" }, { label: cfg.eyebrow }]} />} />
          ))}
          {Object.entries(featurePages).map(([slug, cfg]) => (
            <Route key={slug} path={`/features/${slug}`} element={<MarketingPage config={cfg} breadcrumb={[{ label: "Features" }, { label: cfg.eyebrow }]} />} />
          ))}
          {Object.entries(solutionPages).map(([slug, cfg]) => (
            <Route key={slug} path={`/solutions/${slug}`} element={<MarketingPage config={cfg} breadcrumb={[{ label: "Solutions" }, { label: cfg.eyebrow }]} />} />
          ))}
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/about" element={<ContentPage eyebrow="About" title={<>Building the standard for <span className="text-gradient-cyan">competition.</span></>} description="Tournament OS exists to make world-class tournament operations available to everyone — from Discord communities to global esports organizations." />} />
          <Route path="/careers" element={<ContentPage eyebrow="Careers" title={<>Build the future of <span className="text-gradient-cyan">esports infrastructure.</span></>} description="We're a small, senior team obsessed with craft. If you love systems, motion, and competition — let's talk." />} />
          <Route path="/contact" element={<ContentPage eyebrow="Contact" title={<>Let's <span className="text-gradient-cyan">talk.</span></>} description="Reach our team for sales, support, or partnership inquiries." />} />
          <Route path="/docs" element={<ContentPage eyebrow="Documentation" title={<>Everything you need to <span className="text-gradient-cyan">build.</span></>} description="Guides, references, and tutorials for operating Tournament OS." />} />
          <Route path="/docs/api" element={<ContentPage eyebrow="API Reference" title={<>The Tournament OS <span className="text-gradient-cyan">API.</span></>} description="A fully typed REST + webhook API for deep integrations." />} />
          <Route path="/blog" element={<ContentPage eyebrow="Blog" title={<>Notes from the <span className="text-gradient-cyan">arena.</span></>} description="Product updates, engineering deep-dives, and competitive insights." />} />
        </Route>

        {/* ---------------- PUBLIC PLATFORM ---------------- */}
        <Route element={<PublicLayout />}>
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/explore/tournaments" element={<TournamentsDirectory />} />
          <Route path="/explore/tournaments/:slug" element={<TournamentProfile />} />
          <Route path="/explore/guilds" element={<GuildsDirectory />} />
          <Route path="/explore/guilds/:slug" element={<GuildProfile />} />
          <Route path="/explore/teams" element={<TeamsDirectory />} />
          <Route path="/explore/teams/:slug" element={<TeamProfile />} />
          <Route path="/explore/players" element={<PlayersDirectory />} />
          <Route path="/explore/players/:slug" element={<PlayerProfile />} />
        </Route>

        {/* ---------------- PLAYER PORTAL (protected + Phase 3 pages) ---------------- */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/app/player" index element={<PlayerDashboard />} />
          <Route path="/app/player/tournaments" element={<MyTournaments />} />
          <Route path="/app/player/teams" element={<MyTeams />} />
          <Route path="/app/player/registrations" element={<Registrations />} />
          <Route path="/app/player/check-ins" element={<CheckIns />} />
          <Route path="/app/player/verification" element={<Verification />} />
          <Route path="/app/player/matches" element={<MatchHistory />} />
          <Route path="/app/player/stats" element={<PlayerStats />} />
          <Route path="/app/player/achievements" element={<Achievements />} />
          <Route path="/app/player/notifications" element={<NotificationCenter />} />
          <Route path="/app/player/settings" element={<AccountSettings />} />
        </Route>

        {/* ---------------- ORGANIZER PORTAL (protected + Phase 4 pages) ---------------- */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/app/organizer" index element={<PortalDashboard role="organizer" />} />
          <Route path="/app/organizer/live" element={<LiveOpsCenter />} />
          <Route path="/app/organizer/bot" element={<BotControlCenter />} />
          <Route path="/app/organizer/tournaments" element={<TournamentManager />} />
          <Route path="/app/organizer/registration" element={<RegistrationManager />} />
          <Route path="/app/organizer/verification" element={<VerificationManager />} />
          <Route path="/app/organizer/check-in" element={<CheckInManager />} />
          <Route path="/app/organizer/brackets" element={<LiveBracketsManager />} />
          <Route path="/app/organizer/automation" element={<AutomationManager />} />
          <Route path="/app/organizer/guild" element={<GuildManager />} />
          <Route path="/app/organizer/scheduler" element={<SchedulerManager />} />
          <Route path="/app/organizer/threads" element={<MatchThreadsManager />} />
          <Route path="/app/organizer/announcements" element={<AnnouncementsManager />} />
          <Route path="/app/organizer/notifications" element={<NotificationCenter2 />} />
          <Route path="/app/organizer/ai" element={<AIInsightsPage />} />
          <Route path="/app/organizer/analytics-pro" element={<AdvancedAnalytics />} />
          <Route path="/app/organizer/reporting" element={<ReportingCenter />} />
          <Route path="/app/organizer/analytics" element={<OrganizerAnalytics />} />
          <Route path="/app/organizer/reports" element={<ReportsManager />} />
          <Route path="/app/organizer/settings" element={<OrganizerSettings />} />
        </Route>

        {/* ---------------- ADMIN PORTAL (protected + Phase 5 pages) ---------------- */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/app/admin" index element={<PortalDashboard role="admin" />} />
          <Route path="/app/admin/guilds" element={<AdminGuildManager />} />
          <Route path="/app/admin/users" element={<AdminUserManager />} />
          <Route path="/app/admin/tournaments" element={<AdminTournaments />} />
          <Route path="/app/admin/roles" element={<AdminRolesManager />} />
          <Route path="/app/admin/billing" element={<AdminBilling />} />
          <Route path="/app/admin/api-keys" element={<AdminAPIKeys />} />
          <Route path="/app/admin/integrations" element={<AdminIntegrations />} />
          <Route path="/app/admin/security" element={<AdminSecurity />} />
          <Route path="/app/admin/audit" element={<AdminAuditLogs />} />
          <Route path="/app/admin/monitoring" element={<SystemHealth />} />
          <Route path="/app/admin/database" element={<AdminDatabase />} />
          <Route path="/app/admin/flags" element={<AdminFeatureFlags />} />
          <Route path="/app/admin/settings" element={<AdminSettings />} />
        </Route>

        {/* ---------------- AUTH ---------------- */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/verify-email" element={<EmailVerificationPage />} />
        </Route>

        {/* ---------------- 404 ---------------- */}
        <Route path="*" element={<MarketingLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
