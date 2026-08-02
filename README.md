# Tournament OS — Website

**The operating system for competitive tournaments.**

Dark-void + cyan glassmorphism esports platform. Automate registration, verification, brackets, scheduling, and live match operations end to end — so your staff run the event, not the logistics.

![Stack](https://img.shields.io/badge/React-19.1-22d3ee) ![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-v4-22d3ee) ![Vite](https://img.shields.io/badge/Vite-7-22d3ee) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-22d3ee)

---

## ✨ Highlights

- **No-boot instant hero** — Lamp-lit headline ("Competition, on autopilot."), holographic gradient, confetti CTA, live match chips
- **MacbookScroll product demo** — the real dashboard scrolls inside a MacBook
- **Live match ticker** across Home and the portal
- **Global ⌘K command palette** with quick actions
- **Portal dashboards** — activity-ring stat cards, animated feeds, floating dock, confetti on wins
- **Tremor analytics** — charts, metrics, status page
- **Aceternity narrative sections** — TracingBeam how-it-works, Timeline changelog, Compare before/after slider, InfiniteMovingCards testimonials
- **Fully tokenized design system** — `src/shared/config/tokens.ts` + `src/shared/motion/motion-tokens.ts`

## 🧰 Stack

| Layer | Tech |
|---|---|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 + custom design tokens |
| Motion | Framer Motion (MotionConfig reduced-motion="user") |
| Base UI | shadcn/ui (Radix primitives) |
| Component patterns | MagicUI · Aceternity · KokonutUI · React Bits · Tremor · TanStack Table |

## 🚀 Quick start

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm typecheck    # TypeScript gate
pnpm build        # production build → dist/
```

## 📁 Structure

```
src/
├── app/                  # routing + layouts
├── components/
│   ├── magic/            # MagicUI patterns (ticker, marquee, dock, confetti…)
│   ├── aceternity/       # Aceternity patterns (lamp, macbook-scroll, tracing-beam…)
│   ├── reactbits/        # React Bits patterns (scramble text…)
│   ├── ui/               # shadcn/ui primitives
│   ├── ui/kit/           # composable kits (StatCard, DataTable, ProfileMenu…)
│   ├── ui-lib/kokonutui/ # vendored KokonutUI
│   ├── archive/          # archived boot sequence (preserved, not rendered)
│   └── site/             # nav, footer, ticker, shared site blocks
├── features/             # auth · player · organizer · admin · liveops · ai · portal
├── pages/                # home · marketing · pricing · explore · misc
├── shared/               # config (tokens) · motion · search · system · hooks
├── styles/uiverse/       # curated UIverse CSS (5 components)
└── lib/                  # data, queries, directories
```

## 📜 Scripts

| Script | Purpose |
|---|---|
| `pnpm dev` | Vite dev server (host 0.0.0.0, port from `PORT` or 5173) |
| `pnpm build` | Production build |
| `pnpm serve` | Preview the production build |
| `pnpm typecheck` | TypeScript check (gate: 0 errors) |

## 🎨 Design system

- **Colors** — void black (`#030308`) + cyan accent (`#22d3ee`) + semantic status colors
- **Tokens** — single source of truth in `src/shared/config/tokens.ts`
- **Motion** — `src/shared/motion/motion-tokens.ts` (durations, easings, springs, variants)
- **Reduced motion** — global `MotionConfig reducedMotion="user"` + `.decor` CSS scope

## 📄 License

Private / proprietary. All component patterns are MIT-licensed (MagicUI, Aceternity, KokonutUI, React Bits, shadcn/ui, Tremor).
