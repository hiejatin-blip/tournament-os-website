import { motion } from "framer-motion";
import { Cpu, MessageCircle, Twitch, Webhook, Plug, Bot, Radio } from "lucide-react";
import { SectionHeading } from "./ui";
import { OrbitNode } from "@/components/magic/orbiting-circles";
import { ease } from "@/shared/motion/motion-tokens";

/* ============================================================================
   IntegrationsOrbit — the integration ecosystem as an orbiting diagram:
   Tournament OS core, with Discord / Twitch / Webhooks / API / Bots /
   Scheduler satellites circling on rings. Pure CSS motion.
   ============================================================================ */

const RINGS = [
  { radius: 170, duration: 24, reverse: false, satellites: [
    { icon: MessageCircle, label: "Discord", angle: 0, color: "text-cyan-300 border-cyan-400/30 bg-cyan-400/10" },
    { icon: Twitch, label: "Twitch", angle: 90, color: "text-violet-300 border-violet-400/30 bg-violet-400/10" },
    { icon: Bot, label: "Bots", angle: 180, color: "text-amber-300 border-amber-400/30 bg-amber-400/10" },
    { icon: Plug, label: "API", angle: 270, color: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10" },
  ]},
  { radius: 240, duration: 36, reverse: true, satellites: [
    { icon: Webhook, label: "Webhooks", angle: 40, color: "text-rose-300 border-rose-400/30 bg-rose-400/10" },
    { icon: Radio, label: "Scheduler", angle: 130, color: "text-cyan-300 border-cyan-400/30 bg-cyan-400/10" },
  ]},
];

export function IntegrationsOrbit() {
  return (
    <section id="integrations" className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Native integrations"
              title={<>The whole ecosystem, <span className="text-gradient-cyan">in orbit.</span></>}
              description="Tournament OS isn't another bot bolted onto your stack — it's infrastructure that speaks to everything you already run. Discord, Twitch, webhooks, a full API, and automation everywhere."
            />
            <ul className="mt-8 space-y-4">
              {[
                "Discord-native: roles, channels, threads — provisioned automatically",
                "Public REST API + webhooks for your own tooling",
                "Twitch-ready overlays for broadcasters",
                "Bot fleet handles the busywork; you handle the game",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-mid">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Orbit diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease: ease.emphasized }}
            className="relative mx-auto grid w-full max-w-[520px] place-items-center"
          >
            {/* faint guide rings */}
            <div className="absolute aspect-square w-full rounded-full border border-white/[0.05]" />
            <div className="absolute aspect-square w-[72%] rounded-full border border-white/[0.06]" />
            <div className="absolute aspect-square w-[44%] rounded-full border border-white/[0.07]" />

            {/* Core */}
            <div className="relative z-10 grid h-28 w-28 place-items-center rounded-3xl border border-cyan-400/30 bg-void-900 shadow-[0_0_60px_-10px_rgba(34,211,238,0.6)]">
              <Cpu className="h-9 w-9 text-cyan-300" />
              <span className="absolute -bottom-6 font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-300/80">core</span>
            </div>

            {/* Satellites */}
            {RINGS.map((ring) =>
              ring.satellites.map((s) => (
                <OrbitNode key={s.label} radius={ring.radius} duration={ring.duration} reverse={ring.reverse} angle={s.angle}>
                  <div
                    role="img"
                    aria-label={s.label}
                    className={`grid h-14 w-14 place-items-center rounded-2xl border backdrop-blur transition-transform duration-300 hover:scale-110 ${s.color}`}
                  >
                    <s.icon className="h-6 w-6" />
                  </div>
                  <span className="mt-1.5 block text-center font-mono text-[9px] uppercase tracking-[0.14em] text-lo">
                    {s.label}
                  </span>
                </OrbitNode>
              )),
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
