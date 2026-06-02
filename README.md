# Traguin Luxury Travel Platform

A world-class luxury travel experience platform built with Next.js, Three.js, GSAP, and Framer Motion.

## Features

- **Cinematic homepage** with 12 immersive sections
- **3D interactive globe** with travel routes and mouse-reactive camera
- **Premium loading experience** with rotating Earth and progress animation
- **Smooth scrolling** via Lenis integrated with GSAP ScrollTrigger
- **Luxury design system** — dark editorial aesthetic with gold accents
- **Full business pages** — Hotels, Domestic/International Packages, Concierge, Contact, Login

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- GSAP + ScrollTrigger
- Framer Motion
- Three.js + React Three Fiber + Drei
- Lenis smooth scroll

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for component architecture, animation patterns, and Three.js setup.

See [docs/SITEMAP.md](./docs/SITEMAP.md) for route map.

See [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) for colors, typography, and motion principles.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with all 12 sections |
| `/hotels` | Luxury hotel discovery |
| `/packages/domestic` | India packages |
| `/packages/international` | World packages |
| `/always-on-demand` | Luxury concierge |
| `/contact` | Contact form |
| `/login` | Client portal |

## Performance

- Three.js components are dynamically imported (no SSR)
- Images lazy-loaded where appropriate
- Code splitting per route via App Router

## License

Private — Traguin Luxury Travel
