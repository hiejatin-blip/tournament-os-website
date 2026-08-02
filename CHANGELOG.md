# Changelog — Tournament OS v2 UI/UX Rebuild

## v2.0.0 (2026-08-02) — UI/UX Nuclear Redesign (Phases 0–5 executed)

### Foundation
- `tokens.ts` + `motion-tokens.ts`: single source of truth for colors, spacing, elevation, typography, z-index, motion.
- `MotionProvider` (`MotionConfig reducedMotion="user"`): global reduced-motion enforcement.
- `SearchProvider`: ONE command palette for the whole app (was 3 mounts + 3 ⌘K listeners); `quickActions` registry activated.
- Sonner dark toaster replaces the custom (unused) ToastProvider; fixed latent `useTheme()` crash.
- Self-hosted fonts (Inter/ Space Grotesk/ JetBrains Mono variable) — Google Fonts CDN links removed.

### Dead code purge (~19,400 lines)
- Deleted: mockup-sandbox app, duplicated `lib/kokonutui` + `lib/uiverse`, `attached_assets`, dead 404 page, dead routes/breadcrumbs pair, 48 unused shadcn files, 37 unused UIverse CSS, dead exports (navLinks, footerNav, TiltCard, LoginPage shadow), `cn` duplicate, `recharts` + `next-themes` + deprecated `@studio-freight/lenis`.

### Baseline repair (95 → 0 type errors)
- `@react-three/fiber` v9 + `drei` v10 (React 19 JSX types), animejs ambient types, csstype augmentation, next/image + next/link shims for vendored KokonutUI.

### Components & features
- ProfileMenu (Radix DropdownMenu) shared across SiteNav + DashboardLayout.
- Role from AuthContext; real unread notification count; `aria-current` on sidebar links.
- SiteNav: mega-menu keyboard parity (focus-within + aria-expanded), drawer Escape-to-close + scroll lock + `role="dialog"`.
- MagicUI patterns: NumberTicker (hero stats + analytics — one counter system), Marquee live match ticker (Home + portal), BorderBeam (pricing featured), ShimmerButton (hero CTA), AnimatedList (portal panels), Dock (portal quick access), Confetti (match wins), ScrambleText (player ratings).
- StatCard kit (activity ring + count-up) replaces static portal stats.
- Spotlight handlers consolidated (8 inline → 1 shared helper); focus-cards dimming; avatar circles trust bar.
- Pricing: shared BorderBeam on featured tier, accessible Accordion FAQ.
- Placeholder modules upgraded to first-class "Planned for v2.x" states.
- content-visibility on below-fold Home sections; `.decor`-scoped reduced-motion override; `text-lo` contrast fixed to WCAG AA (#8f8fb0).

### Remaining (mapped in UI_UX_REPLACEMENT_EXECUTION_PLAN.md)
- Phases 3–6 leftovers: MorphicNavbar swap, SmoothDrawer adoption, DataTable wiring into admin tables, shadcn Form for auth, LampEffect hero, MacbookScroll showcase, Globe, TracingBeam lifecycle, PlayerPortal file split, inline-transition token sweep, Lighthouse/axe browser QA.
