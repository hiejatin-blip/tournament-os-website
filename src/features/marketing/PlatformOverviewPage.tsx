import { PageHeader } from "@/components/site/PageHeader";
import { PageSection } from "@/components/site/blocks";
import { StickyScrollReveal } from "@/components/aceternity/sticky-scroll-reveal";
import { platformPages } from "@/lib/pages";

export function PlatformOverviewPage() {
  const pillars = [
    { icon: platformPages.automation.features[0].icon, title: "Automation Engine", description: "Event-driven orchestration that reacts in real time — every registration, check-in, and score ripples through dependent systems instantly, no human in the loop." },
    { icon: platformPages["tournament-engine"].features[0].icon, title: "Tournament Engine", description: "Single, double, Swiss, round-robin, gauntlet, and multi-stage combinations — generated, seeded, and recomputed live as results land." },
    { icon: platformPages.scheduler.features[0].icon, title: "Scheduler", description: "Conflict-aware timing across timezones, streams, and staff availability. Windows, reminders, and escalations run precisely on time." },
    { icon: platformPages.matchmaking.features[0].icon, title: "Matchmaking", description: "Rating-aware seeding and pairing with region and stream-conflict avoidance built into every placement decision." },
    { icon: platformPages["live-brackets"].features[0].icon, title: "Live Brackets", description: "Real-time trees that recompute in under a second — perfect for infinite spectators and zero manual edits." },
    { icon: platformPages.discord.features[0].icon, title: "Discord Integration", description: "Roles, channels, threads, and permissions provisioned natively. It lives inside Discord — infrastructure, not a bot." },
    { icon: platformPages.analytics.features[0].icon, title: "Analytics", description: "Every match becomes structured, auditable data — player histories, head-to-heads, org-wide dashboards, and exports." },
    { icon: platformPages.security.features[0].icon, title: "Security", description: "SOC 2 discipline, SSO, role-based access, and a full audit trail on every automated decision." },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Platform"
        title={<>The complete <span className="text-gradient-cyan">tournament operating system.</span></>}
        description="Ten deeply integrated systems working as one — scroll through the pillars of the platform."
      />
      <PageSection>
        <StickyScrollReveal content={pillars} />
      </PageSection>
    </>
  );
}
