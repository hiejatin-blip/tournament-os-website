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
    <section id="how-it-works" className="relative overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.05),transparent_60%)]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="How it works"
          title={<>Create to champion in four steps.</>}
          description="A tournament moves through four stages. No manual bracket math at any of them."
        />
        {/* numbered timeline rows — no icon boxes, big index, hairline */}
        <div className="mt-14">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.5, ease: ease.emphasized }}
              className="group flex flex-col gap-3 border-b border-white/6 py-8 sm:flex-row sm:items-baseline sm:gap-8"
            >
              <span className="font-display text-5xl font-bold leading-none text-white/[0.08] transition-colors duration-300 group-hover:text-cyan-400/30 sm:w-20">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/70">{s.tag}</span>
                <h3 className="mt-1 font-display text-2xl font-bold text-hi">{s.title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mid sm:text-base">{s.desc}</p>
              </div>
              <div className="hidden shrink-0 items-center gap-2 font-mono text-[11px] text-lo sm:flex">
                <span className="h-px w-10 bg-white/10" />
                automated
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
