import { motion } from "framer-motion";
import { PageHeader } from "../components/site/PageHeader";
import { FeatureGrid, StatBand, CTABand, PageSection, Breadcrumb } from "../components/site/blocks";
import { Button } from "../components/ui";
import { ArrowRight } from "lucide-react";
import type { MarketingPage as PageConfig } from "@/lib/pages";

function HoloVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/15 via-transparent to-amber-500/10 blur-2xl" />
      <div className="relative grid h-full place-items-center rounded-3xl border border-white/8 bg-void-900/60 backdrop-blur-xl">
        <div className="absolute inset-4 rounded-2xl bg-grid-fine opacity-30" />
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-cyan-400/30"
            style={{ width: `${40 + i * 26}%`, height: `${40 + i * 26}%` }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 20 + i * 8, repeat: Infinity, ease: "linear" }}
          />
        ))}
        <motion.div
          className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 glow-cyan"
          animate={{ scale: [1, 1.08, 1], rotate: [0, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

export function MarketingPage({ config, breadcrumb }: { config: PageConfig; breadcrumb: { label: string; to?: string }[] }) {
  return (
    <>
      <PageHeader eyebrow={config.eyebrow} title={config.title} description={config.description}>
        <div className="flex flex-col gap-4">
          <Breadcrumb items={breadcrumb} />
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="lg" href="/pricing" iconRight={ArrowRight}>Get started free</Button>
            <Button variant="secondary" size="lg" href="/explore">See it live</Button>
          </div>
        </div>
      </PageHeader>

      {config.stats && (
        <PageSection>
          <StatBand stats={config.stats} />
        </PageSection>
      )}

      <PageSection eyebrow="Capabilities" heading={<>Everything, <span className="text-hi">handled.</span></>}>
        <FeatureGrid items={config.features} />
      </PageSection>

      {config.bullets && (
        <PageSection>
          <div className="grid items-center gap-10 rounded-3xl glass-card p-8 lg:grid-cols-2 sm:p-12">
            <div>
              <h3 className="text-2xl font-bold text-hi sm:text-3xl">Built to run itself.</h3>
              <ul className="mt-6 space-y-3">
                {config.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-hi">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-cyan-400/15">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    </span>{b}
                  </li>
                ))}
              </ul>
            </div>
            <HoloVisual />
          </div>
        </PageSection>
      )}

      <CTABand />
    </>
  );
}
