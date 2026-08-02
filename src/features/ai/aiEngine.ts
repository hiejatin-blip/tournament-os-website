/* ============================================================================
   TOURNAMENT OS — AI INTELLIGENCE ENGINE
   ----------------------------------------------------------------------------
   Deterministic client-side model that derives predictions, insights,
   recommendations, and smart alerts from Tournament OS telemetry + directory
   data. Shape maps 1:1 onto a production LLM/backend so swapping the source
   is a drop-in change.
   ============================================================================ */

export type Confidence = "high" | "medium" | "low";
export type Severity = "info" | "success" | "warning" | "critical";

export type Insight = {
  id: string;
  category: "operations" | "registration" | "scheduling" | "verification" | "automation" | "growth" | "risk";
  title: string;
  body: string;
  confidence: Confidence;
  metric?: string;
  actionLabel?: string;
  ts: number;
};

export type Prediction = {
  id: string;
  label: string;
  value: string;
  confidence: Confidence;
  delta?: string;
  detail: string;
  category: "registration" | "attendance" | "duration" | "load" | "conflict" | "workload";
};

export type Recommendation = {
  id: string;
  title: string;
  reason: string;
  impact: "high" | "medium" | "low";
  effort: "low" | "medium" | "high";
  category: "reminder" | "announcement" | "moderator" | "scheduling" | "automation";
  approved?: boolean;
};

export type SmartAlert = {
  id: string;
  severity: Severity;
  title: string;
  body: string;
  confidence: Confidence;
  ts: number;
  action?: { label: string; to?: string };
};

export type CopilotMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  ts: number;
  chips?: { label: string; prompt: string }[];
};

/* ------------------------------------------------------------------ INSIGHTS */
const INSIGHT_SEED: Omit<Insight, "id" | "ts">[] = [
  { category: "registration", title: "Registration ramping ahead of forecast",  body: "Apex Circuit S7 is 12% ahead of typical pace at this stage. Expect to sell out 6h before deadline.",             confidence: "high",   metric: "+12%", actionLabel: "Publish waitlist" },
  { category: "verification", title: "Verification queue growing faster than throughput",   body: "Queue has grown 3× in the last hour. Current review pace suggests a 40-minute delay before start.",  confidence: "high",   metric: "23 pending", actionLabel: "Add reviewer" },
  { category: "scheduling",   title: "Two matches share a broadcast slot",        body: "M-14 and M-15 are both scheduled for the main stream at 18:30. Consider staggering by 25 minutes.",              confidence: "high",   metric: "conflict",  actionLabel: "Auto-restage" },
  { category: "operations",   title: "Check-in likely to close with 8 no-shows",  body: "Based on the last five tournaments, expect ~4% no-show rate. 2 substitutes are eligible for promotion.",       confidence: "medium", metric: "~8 no-shows", actionLabel: "Notify subs" },
  { category: "automation",   title: "Automation could handle dispute triage",    body: "94% of disputes filed this season matched an existing template. Enabling auto-triage would save ~40 min/event.", confidence: "medium", metric: "94% match", actionLabel: "Enable triage" },
  { category: "growth",       title: "Guild member retention up week-over-week",  body: "Vanta Esports 30-day active retention rose from 71% → 76% following the WinterCup opening.",                    confidence: "high",   metric: "+5pp",      actionLabel: "Explore cohort" },
  { category: "risk",         title: "Peak load forecast exceeds shard headroom", body: "Predicted peak concurrent matches at 21:00 UTC exceeds current shard capacity by ~14%.",                        confidence: "medium", metric: "+14% over",  actionLabel: "Pre-warm shards" },
];

let _id = 0;
export function generateInsights(): Insight[] {
  return INSIGHT_SEED.map((s) => ({ ...s, id: `insight_${_id++}`, ts: Date.now() - Math.floor(Math.random() * 3_600_000) }));
}

/* ------------------------------------------------------------------ PREDICTIONS */
export function generatePredictions(): Prediction[] {
  return [
    { id: "p1", label: "Expected registrations",         value: "218",   confidence: "high",   delta: "+34 vs avg", detail: "Based on the last 8 tournaments at this game/tier.",        category: "registration" },
    { id: "p2", label: "Likely no-show %",                value: "4.2%",  confidence: "high",   delta: "-1.1pp",     detail: "Reduced from typical 5.3% thanks to reminder cadence.",     category: "attendance" },
    { id: "p3", label: "Expected tournament duration",    value: "6h 42m", confidence: "medium", delta: "+18m",       detail: "Increased due to bo3 semifinals and 3-map finals.",         category: "duration" },
    { id: "p4", label: "Peak server load (21:00 UTC)",    value: "68 rps", confidence: "high",   delta: "+12%",       detail: "Concurrent matches align with EU-W prime time.",            category: "load" },
    { id: "p5", label: "Scheduling conflicts predicted",  value: "2",     confidence: "medium", delta: "1 resolvable", detail: "Streaming slot overlap + one casted room double-book.",    category: "conflict" },
    { id: "p6", label: "Organizer workload (next 24h)",   value: "High",  confidence: "medium",                        detail: "Estimated 4.5h of manual review at current pace.",         category: "workload" },
  ];
}

/* ------------------------------------------------------------------ RECOMMENDATIONS */
export function generateRecommendations(): Recommendation[] {
  return [
    { id: "r1", title: "Send a T-1h reminder to unchecked players",        reason: "12 players haven't checked in and reminder open rates are 87% at this cadence.", impact: "high",   effort: "low",    category: "reminder" },
    { id: "r2", title: "Post 'Registration closing soon' announcement",   reason: "Apex S7 is 73% full and past events see a 22% closing surge after this post.",   impact: "high",   effort: "low",    category: "announcement" },
    { id: "r3", title: "Assign a second moderator to Nexus dispute queue", reason: "Average response time is 14m; adding a reviewer typically halves it.",             impact: "medium", effort: "low",    category: "moderator" },
    { id: "r4", title: "Stagger M-14 and M-15 by 25 minutes",              reason: "Both matches share a broadcast slot at 18:30.",                                   impact: "high",   effort: "medium", category: "scheduling" },
    { id: "r5", title: "Enable auto-triage for standard disputes",         reason: "94% of recent disputes matched an existing rule template.",                       impact: "medium", effort: "medium", category: "automation" },
    { id: "r6", title: "Set bracket seeding to 'rating-aware'",            reason: "This game/tier historically produces 18% closer matches with rating-aware seeds.", impact: "medium", effort: "low",    category: "scheduling" },
  ];
}

/* ------------------------------------------------------------------ SMART ALERTS */
export function generateSmartAlerts(): SmartAlert[] {
  return [
    { id: "sa1", severity: "warning",  title: "Registration is slower than expected",       body: "Orbit Open is 22% below pace vs. the last three Orbit events.",           confidence: "high",   ts: Date.now() - 4 * 60_000,  action: { label: "Open tournament", to: "/explore/tournaments/orbit-open" } },
    { id: "sa2", severity: "critical", title: "Verification queue may become overloaded",   body: "Growth rate exceeds review pace. Expected overflow in ~18 minutes.",      confidence: "high",   ts: Date.now() - 2 * 60_000,  action: { label: "Add reviewer" } },
    { id: "sa3", severity: "warning",  title: "Round generation may be delayed",             body: "Bracket engine is currently at 82% CPU due to concurrent seeding jobs.", confidence: "medium", ts: Date.now() - 12 * 60_000, action: { label: "View brackets", to: "/app/organizer/brackets" } },
    { id: "sa4", severity: "info",     title: "High probability of player no-shows",         body: "8 registered players have not opened the last 3 reminders.",              confidence: "medium", ts: Date.now() - 20 * 60_000, action: { label: "Notify subs" } },
    { id: "sa5", severity: "warning",  title: "Automation queue growing",                    body: "Background jobs pending 32 · normal baseline is 8–14.",                  confidence: "high",   ts: Date.now() - 30 * 60_000, action: { label: "Bot Control", to: "/app/organizer/bot" } },
    { id: "sa6", severity: "info",     title: "Guild activity declining in APAC region",     body: "APAC weekly active players fell 6% week-over-week.",                     confidence: "medium", ts: Date.now() - 55 * 60_000, action: { label: "View cohort" } },
    { id: "sa7", severity: "success",  title: "Check-in completion above target",           body: "Current tournament check-in rate is 97% — above the 94% goal.",           confidence: "high",   ts: Date.now() - 90 * 60_000 },
  ];
}

/* ------------------------------------------------------------------ ANALYTICS SERIES */
export type Series = { label: string; data: number[]; color: string; hint?: string };

export function generateAnalytics(): Record<string, Series> {
  const seed = (base: number, spread: number, len = 24) =>
    Array.from({ length: len }, (_, i) => Math.max(0, Math.round(base + Math.sin(i * 0.4 + base) * spread + (Math.random() - 0.5) * spread * 0.6)));
  return {
    guildGrowth:        { label: "Guild growth",         data: seed(24, 6),   color: "#22d3ee", hint: "New guilds / week" },
    tournamentGrowth:   { label: "Tournament growth",    data: seed(48, 12),  color: "#a78bfa", hint: "New tournaments / week" },
    playerRetention:    { label: "Player retention",     data: seed(76, 4),   color: "#34d399", hint: "30-day active %" },
    registrationTrend:  { label: "Registration trend",   data: seed(1240, 200), color: "#22d3ee", hint: "Registrations / day" },
    checkinRate:        { label: "Check-in rate",        data: seed(94, 3),   color: "#34d399", hint: "% checked in on time" },
    attendanceTrend:    { label: "Attendance trend",     data: seed(88, 5),   color: "#fbbf24", hint: "% attending matches" },
    completionRate:     { label: "Completion rate",      data: seed(96, 2),   color: "#34d399", hint: "% finishing tournaments" },
    matchDuration:      { label: "Avg. match duration",  data: seed(32, 6),   color: "#a78bfa", hint: "Minutes" },
    peakHours:          { label: "Peak activity hours",  data: [8, 12, 24, 32, 46, 62, 78, 84, 76, 62, 48, 24], color: "#fbbf24", hint: "% of daily activity" },
    modPerformance:     { label: "Moderator performance", data: seed(88, 4),  color: "#22d3ee", hint: "Avg. resolution score" },
    orgPerformance:     { label: "Organizer performance", data: seed(91, 3),  color: "#a78bfa", hint: "Overall event score" },
    automationEff:      { label: "Automation efficiency", data: seed(97, 2),  color: "#34d399", hint: "% of events fully automated" },
    systemUtilization:  { label: "System utilization",    data: seed(58, 15), color: "#22d3ee", hint: "% capacity used" },
  };
}

/* ------------------------------------------------------------------ COPILOT REPLY GENERATOR */
const REPLIES: Record<string, string> = {
  "conflict":       "I found 2 potential scheduling conflicts. M-14 and M-15 share the main stream at 18:30. I recommend staggering M-15 by 25 minutes — that keeps casters focused and avoids overlap.",
  "no-show":        "Based on the last 5 tournaments at this tier, expect ~4.2% no-shows. That's about 8 players out of 192. I've flagged 3 substitutes who are eligible to fill in.",
  "grow":           "Vanta Esports is growing at ~5.2% MoM — above the platform average of 3.1%. Retention drives most of it; new-signup rate is roughly flat.",
  "verification":   "Verification queue has 23 pending. At current review pace you'll clear it in ~24 min. If you want to keep the start on time, adding a reviewer would cut that to ~11 min.",
  "recommend":      "Top three suggestions: (1) Send a T-1h reminder to the 12 unchecked players. (2) Post the 'registration closing soon' announcement — historically drives a 22% surge. (3) Enable auto-triage for standard disputes.",
  "report":         "I can generate a Post-Event Report covering registrations, attendance, match duration, disputes, and MVP stats. Do you want PDF, CSV, or both?",
  "peak":           "Peak load is projected at 21:00 UTC — about 68 rps and 42 concurrent matches. That's ~14% over comfortable shard headroom; consider pre-warming an extra shard.",
  "default":        "I can help with scheduling, registration, verification, automation, and analytics. Try asking about the verification queue, no-show rates, or growth trends.",
};

export function generateCopilotReply(prompt: string): CopilotMessage {
  const q = prompt.toLowerCase();
  const key =
    q.includes("conflict") || q.includes("schedule") || q.includes("overlap") ? "conflict" :
    q.includes("no-show") || q.includes("no show") || q.includes("attendance") ? "no-show" :
    q.includes("grow") || q.includes("retention") || q.includes("guild") ? "grow" :
    q.includes("verify") || q.includes("verification") || q.includes("queue") ? "verification" :
    q.includes("recommend") || q.includes("suggest") ? "recommend" :
    q.includes("report") || q.includes("export") ? "report" :
    q.includes("peak") || q.includes("load") || q.includes("performance") ? "peak" :
    "default";
  return {
    id: `copilot_${Date.now()}`,
    role: "assistant",
    content: REPLIES[key],
    ts: Date.now(),
    chips: [
      { label: "Show recommendations", prompt: "Show me your top recommendations" },
      { label: "Generate report",       prompt: "Generate a post-event report" },
      { label: "Peak load forecast",    prompt: "What's the predicted peak load?" },
    ],
  };
}

export const suggestedPrompts = [
  "Are there any scheduling conflicts?",
  "How many no-shows should I expect?",
  "What's my registration pace looking like?",
  "Recommend automation improvements",
  "Summarize this week's guild activity",
];

/* ------------------------------------------------------------------ REPORTS */
export type ReportTemplate = {
  id: string;
  name: string;
  category: "Tournament" | "Guild" | "Player" | "Team" | "Moderator" | "Operational" | "Analytics";
  description: string;
  sections: string[];
  formats: ("PDF" | "CSV" | "JSON")[];
  lastGenerated?: string;
};

export const reportTemplates: ReportTemplate[] = [
  { id: "tr_post",   name: "Post-Event Report",          category: "Tournament",  description: "Full tournament recap: placements, prize distribution, dispute log, MVP stats.", sections: ["Overview", "Placements", "Match log", "Disputes", "MVPs"],       formats: ["PDF", "CSV"], lastGenerated: "2h ago" },
  { id: "tr_reg",    name: "Registration Report",        category: "Tournament",  description: "Registration cohort with verification results and check-in outcomes.",           sections: ["Cohort", "Verification", "Check-in"],                              formats: ["CSV", "JSON"] },
  { id: "gr_health", name: "Guild Health Report",        category: "Guild",       description: "Member growth, retention, tournament cadence, and top contributors.",             sections: ["Growth", "Retention", "Cadence", "Contributors"],                  formats: ["PDF"] },
  { id: "gr_finance", name: "Guild Financial Report",    category: "Guild",       description: "Prize pool distributions and payout audit trail for the reporting period.",       sections: ["Payouts", "Audit trail"],                                          formats: ["PDF", "CSV"] },
  { id: "pr_career", name: "Player Career Report",       category: "Player",      description: "Individual player career recap with rating trend, wins, losses, and earnings.",   sections: ["Career", "Rating trend", "Match log", "Earnings"],                 formats: ["PDF"] },
  { id: "tm_perf",   name: "Team Performance Report",    category: "Team",        description: "Team roster, match record, tournament placements, and head-to-head splits.",      sections: ["Roster", "Record", "Placements", "H2H"],                          formats: ["PDF", "CSV"] },
  { id: "mr_activity", name: "Moderator Activity Report", category: "Moderator", description: "Moderator actions, dispute resolutions, and response-time metrics.",              sections: ["Actions", "Disputes", "Response time"],                            formats: ["CSV"] },
  { id: "op_daily",  name: "Daily Operations Report",    category: "Operational", description: "24h operational snapshot: incidents, automation triggers, and bot health.",       sections: ["Incidents", "Automation", "Bot health", "Latency"],               formats: ["PDF", "JSON"], lastGenerated: "8h ago" },
  { id: "an_trends", name: "Weekly Analytics Report",    category: "Analytics",   description: "Weekly platform analytics rollup with cohort comparisons.",                       sections: ["Growth", "Retention", "Utilization", "Cohorts"],                   formats: ["PDF", "CSV"] },
];

export function relTime(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}
