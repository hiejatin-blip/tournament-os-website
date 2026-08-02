import { motion } from "framer-motion";
import { PenLine, UserCheck, Swords, Trophy } from "lucide-react";
import { SectionHeading } from "./ui";
import { TracingBeam } from "@/components/aceternity/tracing-beam";
import { ease } from "@/shared/motion/motion-tokens";

/* ============================================================================
   HowItWorks — 4-step tournament lifecycle narrated by an Aceternity
   TracingBeam: the glowing line traces the journey as the user scrolls.
   ============================================================================ */

const STEPS = [
  {
    icon: PenLine,
    title: "Create",
    desc: "Stand up a tournament in minutes — format, slots, schedule, rules. The engine builds the bracket skeleton instantly.",
    tag: "01 · Setup",
  },
  {
    icon: UserCheck,
    title: "Check-in",
    desc: "Players register, verify, and check in through Discord or the portal. No-shows are handled automatically by policy.",
    tag: "02 · Entry",
  },
  {
    icon: Swords,
    title: "Compete",
    desc: "Matches are seeded, scheduled, and scored in real time. Results propagate to brackets, threads, and standings instantly.",
    tag: "03 · Live",
  },
  {
    icon: Trophy,
    title: "Results",
    desc: "Champions crowned, stats archived, records published — every match becomes structured data your org can trust.",
    tag: "04 · Archive",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.05),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="How it works"
          title={<>From sign-up to <span className="text-gradient-cyan">champion.</span></>}
          description="Four stages. Zero manual bracket math. Scroll through the journey."
        />
        <TracingBeam className="mt-14">
          <div className="space-y-10">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, ease: ease.emphasized }}
                className="relative rounded-3xl glass-card p-7 sm:p-9"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-7">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300 shadow-[0_0_24px_-6px_rgba(34,211,238,0.5)]">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/80">{s.tag}</span>
                    <h3 className="mt-1 font-display text-2xl font-bold text-hi">{s.title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-mid sm:text-base">{s.desc}</p>
                  </div>
                  <span className="ml-auto hidden font-display text-5xl font-bold text-white/[0.04] sm:block">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </TracingBeam>
      </div>
    </section>
  );
}
