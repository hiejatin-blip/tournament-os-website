import { MarketingPage } from "@/pages/MarketingPage";
import { platformPages } from "@/lib/pages";

export function PlatformOverviewPage() {
  return (
    <MarketingPage
      breadcrumb={[{ label: "Platform" }]}
      config={{
        eyebrow: "Platform",
        title: <>The complete <span className="text-gradient-cyan">tournament operating system.</span></>,
        description: "Ten deeply integrated systems working as one — from the automation engine to live brackets, analytics, and enterprise security.",
        stats: [{ value: "10", label: "Core systems" }, { value: "99.99%", label: "Uptime" }, { value: "28", label: "Edge regions" }, { value: "~38ms", label: "Latency" }],
        features: [
          { icon: platformPages.automation.features[0].icon, title: "Automation Engine", desc: "Event-driven orchestration that reacts in real time." },
          { icon: platformPages["tournament-engine"].features[0].icon, title: "Tournament Engine", desc: "Every format, generated and recomputed live." },
          { icon: platformPages.scheduler.features[0].icon, title: "Scheduler", desc: "Conflict-aware timing across timezones." },
          { icon: platformPages.matchmaking.features[0].icon, title: "Matchmaking", desc: "Rating-aware seeding and pairing." },
          { icon: platformPages["live-brackets"].features[0].icon, title: "Live Brackets", desc: "Real-time trees for infinite spectators." },
          { icon: platformPages.discord.features[0].icon, title: "Discord Integration", desc: "Native provisioning, not a bot." },
          { icon: platformPages.analytics.features[0].icon, title: "Analytics", desc: "Every match becomes structured data." },
          { icon: platformPages.security.features[0].icon, title: "Security", desc: "SOC 2, SSO, and full audit trails." },
        ],
      }}
    />
  );
}
