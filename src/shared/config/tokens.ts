/* ============================================================================
   TOURNAMENT OS DESIGN TOKENS — single source of truth
   ----------------------------------------------------------------------------
   The ONLY place hex values, easings, and durations may live. `index.css`
   mirrors these via Tailwind v4 `@theme`; TS code imports from here.
   ============================================================================ */

export const color = {
  void: {
    950: "#030308", 900: "#060610", 850: "#0a0a18", 800: "#0e0e22",
    750: "#12122c", 700: "#1a1a3a", 600: "#252550", 500: "#363668", 400: "#4e4e80",
  },
  cyan: { 200: "#a5f3fc", 300: "#67e8f9", 400: "#22d3ee", 500: "#06b6d4", 600: "#0891b2" },
  amber: { 300: "#fcd34d", 400: "#fbbf24", 500: "#f59e0b" },
  rose: { 400: "#fb7185", 500: "#f43f5e" },
  emerald: { 400: "#34d399", 500: "#10b981" },
  /* semantic — text.lo bumped to #8f8fb0 (WCAG AA 4.6:1 on void-950) */
  text: { hi: "#f0f0f8", mid: "#9898b8", lo: "#8f8fb0", inverse: "#030308" },
  surface: { 0: "#030308", 1: "#060610", 2: "#0a0a18", 3: "#0e0e22", 4: "#1a1a3a" },
  border: {
    subtle: "rgba(255,255,255,0.06)",
    default: "rgba(255,255,255,0.10)",
    strong: "rgba(255,255,255,0.18)",
    focus: "#22d3ee",
  },
  status: {
    success: "#34d399", warning: "#fbbf24", danger: "#f43f5e", info: "#22d3ee", live: "#fb7185",
  },
} as const;

export const space = {
  section: "clamp(4rem, 8vw, 8rem)",
  container: "80rem",
  card: "1rem",
  panel: "1.5rem",
} as const;

export const radius = { card: "1rem", panel: "1.5rem", pill: "999px" } as const;

export const elevation = {
  1: "0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)",
  2: "0 8px 28px -8px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
  3: "0 32px 64px -20px rgba(0,0,0,0.8), 0 12px 24px -8px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
} as const;

export const font = {
  display: '"Space Grotesk Variable", "Space Grotesk", "Inter", ui-sans-serif, system-ui, sans-serif',
  sans: '"Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
} as const;

export const z = {
  base: 0, ambient: 1, content: 10, sticky: 40, nav: 60, drawer: 80, palette: 95, toast: 100,
} as const;

export const motion = {
  durBase: 240,
  durFast: 160,
  durCinematic: 680,
  easeEmphasized: [0.16, 1, 0.3, 1] as [number, number, number, number],
  easeSpring: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
} as const;
