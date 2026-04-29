# Hafiy Harizan — AI Portfolio

Personal portfolio for Hafiy Harizan, Software & Data Engineer based in Perth, AU. Built with Next.js 16, Tailwind CSS v4, and Framer Motion.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Database | Supabase (endorsements, contact) |
| Fonts | Geist Sans + JetBrains Mono |
| Deployment | Vercel |

## Features

- **Hero** — animated word-reveal headline, floating avatar portrait, particle atmosphere
- **About** — bento grid with live Perth clock, animated experience counter, shimmer education card, expandable interests
- **Projects** — cinematic 3D carousel (FocusRail) with browser-chrome screenshot cards; toggles to a full grid view
- **Experience / Education / Skills** — timeline and tag-cloud sections
- **Testimonials** — endorsement cards with Supabase-backed submission
- **Ask AI** — chat interface powered by Claude API
- **Contact** — form with Supabase submission
- **Themes** — light/dark mode + three accent presets (Forest Green, Electric Purple, Electric Green) with custom hue slider

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and fill in the Supabase and Anthropic keys.

## Project Structure

```
src/
  app/
    globals.css       # Design tokens (CSS vars), bento grid, animations
    layout.tsx        # Root layout with SSR-safe theme hydration
    page.tsx          # Section assembly
  components/
    sections/         # Hero, About, Projects, Experience, Skills, Contact …
    ui/               # FocusRail carousel, BentoCard, SectionHeading, badges …
    atmosphere.tsx    # Particle canvas + gradient blobs
  lib/
    constants.ts      # Project data (PERSONAL_PROJECTS, PROFESSIONAL_PROJECTS)
    theme.ts          # Theme persistence and CSS variable injection
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
```
