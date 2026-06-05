# TRAGUIN — Architecture Overview

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS v4
- **Animation:** GSAP + ScrollTrigger, Framer Motion
- **3D:** Three.js, React Three Fiber, @react-three/drei
- **Scroll:** Lenis smooth scroll

## Folder Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout, fonts, providers
│   ├── page.tsx            # Homepage (client, loading screen)
│   ├── sitemap.ts          # SEO sitemap generation
│   ├── hotels/
│   ├── packages/
│   ├── always-on-demand/
│   ├── contact/
│   └── login/
├── components/
│   ├── providers/          # Lenis, page transitions
│   ├── layout/             # Nav, footer, cursor
│   ├── ui/                 # MagneticButton, TextReveal
│   ├── three/              # Globe, particles (dynamic import)
│   ├── home/               # 12 homepage sections
│   ├── packages/           # Package explorer
│   ├── hotels/             # Hotel discovery
│   ├── concierge/          # Always On Demand
│   ├── contact/
│   └── auth/
├── data/                   # Static content (destinations, packages, hotels)
├── lib/                    # Utilities (cn, formatPrice)
└── types/                  # TypeScript interfaces
```

## Animation Architecture

### Global Layer
- **LenisProvider** — Smooth scroll integrated with GSAP ScrollTrigger via scrollerProxy
- **PageTransition** — Framer Motion route transitions (opacity + y-axis)
- **DynamicCursor** — Custom cursor with magnetic hover states (desktop only)

### Section Layer
- **GSAP ScrollTrigger** — Pinned sections (DestinationShowcase, FeaturedExperiences, JourneyProcess)
- **GSAP timelines** — Hero text reveals, stat counters, stagger animations
- **Framer Motion** — Modals, mobile nav, loading screen exit

### 3D Layer
- All Three.js components use `dynamic(..., { ssr: false })`
- **Globe** — Earth texture, travel route arcs, cloud layer, mouse-reactive camera
- **Particles** — Ambient gold particle field for hero/atmosphere

## Three.js Architecture

```
Globe.tsx
├── GlobeMesh          # Earth sphere + bump map + cloud layer
├── TravelRoutes       # Quadratic bezier flight paths between cities
├── CameraController   # Mouse-reactive camera lerp
└── LoadingGlobe       # Progress-scaled globe for loading screen

Particles.tsx
└── ParticleField      # Instanced point cloud with slow rotation
```

## Performance Strategy

- Dynamic imports for all WebGL components
- Lazy loading on gallery images
- Lenis + ScrollTrigger batched via requestAnimationFrame
- Mobile: cursor disabled, simplified 3D interactions
- Image optimization via Next.js remote patterns (Unsplash)

## Data Flow

Static data lives in `src/data/`. Pages filter client-side for:
- Package region/mood/price filters
- Hotel region filters
- AI planner recommendation matching

Future: Replace static data with CMS/API without changing component interfaces.
