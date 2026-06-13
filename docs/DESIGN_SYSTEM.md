# TRAGUIN Design System

## Brand Identity

**Theme:** Luxury Travel Meets Modern Technology

**Personality:** Cinematic, editorial, minimal, immersive, storytelling-focused

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--background` | `#0B0B0B` | Page background |
| `--surface` | `#111111` | Section backgrounds |
| `--surface-elevated` | `#1A1A1A` | Elevated cards |
| `--foreground` | `#F8F6F1` | Primary text |
| `--muted` | `#A8A29E` | Secondary text |
| `--gold` | `#D4AF37` | Primary accent, CTAs |
| `--gold-light` | `#E8C547` | Hover states |
| `--ocean` | `#0A84FF` | Secondary accent |
| `--sand` | `#D9C7A5` | Tertiary accent |
| `--glass` | `rgba(255,255,255,0.05)` | Glassmorphism fill |
| `--glass-border` | `rgba(255,255,255,0.08)` | Glass borders |

## Typography

| Role | Font | Class |
|------|------|-------|
| Headings | Helvetica Neue / Helvetica | `font-display` |
| Body | Helvetica Neue / Helvetica | `font-body` |

**Heading scale:** `text-4xl` → `text-8xl` for hero, `text-2xl` → `text-3xl` for section titles

**Tracking:** Headlines use `tracking-[0.2em]` to `tracking-[0.4em]` for labels

## Components

### MagneticButton
Primary interaction element with GSAP magnetic hover effect.
- Variants: `primary` (gold fill), `secondary` (glass), `ghost`

### Glass Cards
`.glass` — Standard glassmorphism
`.glass-strong` — Navigation/footer heavy blur

### Section Layout
`.section-padding` — Responsive vertical/horizontal padding
`.luxury-gradient` — Subtle gold/ocean/sand gradient overlay
`.luxury-gradient-text` — Gold gradient text fill

## Motion Principles

1. **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` for luxury feel
2. **Duration:** 0.5–0.8s for UI, 1–2s for reveals
3. **Stagger:** 0.05–0.15s between elements
4. **Scroll:** Pin + scrub for storytelling sections
5. **3D:** Subtle perspective transforms, never aggressive

## Spacing

- Section gaps: `clamp(4rem, 10vw, 8rem)`
- Card padding: `p-6` to `p-8`
- Grid gaps: `gap-4` to `gap-8`

## Responsive Breakpoints

Standard Tailwind: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px

Mobile adaptations:
- Custom cursor disabled
- Split sections stack vertically
- Horizontal scroll sections remain swipeable
- Reduced 3D interaction complexity
