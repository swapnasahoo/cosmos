# cosmos

A cosmology education website that walks you through 13.8 billion years — from the Big Bang to the present day. Interactive timeline, physics sandbox, CMB explorer, blog, and admin panel.

## What's inside

### Interactive timeline
Eight cosmic epochs as you scroll: Planck → Inflation → Quark → Hadron → Lepton → Nucleosynthesis → Recombination → Dark Ages → Modern Era. Each with time, temperature, physics milestones, and imagery.

### Physics sandbox
A real-time Canvas-based simulation that runs through four phases:

| Phase | Time | Scene |
|---|---|---|
| 1 | 0–6.5B yrs | Cosmic web — N-body gravity particles collapse into filaments. Dark energy slider pushes them apart |
| 2 | 6.5–10B yrs | Planetary accretion — dust orbits a young Sun, coalesces into planets (Mercury through Neptune, Saturn with rings) |
| 3 | 10–12.8B yrs | Earth-Moon — 3D-like spherical Earth with texture mapping, lunar orbit with behind/in-front occlusion, atmospheric glow |
| 4 | 12.8–13.8B yrs | Biosphere — rising fireflies, tree silhouettes, observers with telescope, Carl Sagan quote |

Controls for dark energy, gravity, particle count, speed, and three presets (Big Crunch / Big Freeze / Balanced). Web Audio ambient sound, speech synthesis narration, voice selector.

### CMB explorer
Interactive cosmic microwave background map with three telescope filters (COBE 1989, WMAP 2001, Planck 2013) at different resolutions. Anisotropy contrast slider. Magnifying glass on hover with live coordinates and temperature fluctuation readout. Three Pillars of Evidence section.

### Blog
Cosmology articles with markdown rendering, cover images, reading time calculation. Search by title or author. Comment system on each post. Authenticated authors can preview drafts before publishing.

### Admin dashboard
Role-based access (writer / admin). Manage posts (CRUD, publish/draft toggle), manage users (admin only — create/edit writers and admins), change password, edit site settings, moderate comments. All mutations are Next.js Server Actions.

## Tech

| Layer | What |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS v4 |
| Icons | lucide-react |
| Database / Auth | Supabase (SSR, service role for admin) |
| Fonts | Outfit + Space Grotesk via next/font |
| Visualization | Canvas API (simulator, CMB, starfield) |

## Getting started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The main page is at `src/app/page.tsx`.

## Environment

Requires Supabase credentials in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for admin user management)

## Project structure

```
src/
├── app/
│   ├── page.tsx          # Main landing page (scroll-based SPA)
│   ├── layout.tsx        # Root layout with dynamic metadata
│   ├── blog/             # Blog listing + individual posts
│   └── admin/            # Login, dashboard, server actions
├── components/
│   ├── Starfield.tsx     # Animated particle starfield
│   ├── Header.tsx        # Fixed nav with scroll-spy
│   ├── Hero.tsx          # Big Bang hero section
│   ├── Chronology.tsx    # 8-epoch interactive timeline
│   ├── CmbExplorer.tsx   # CMB map with telescope filters
│   ├── Simulator.tsx     # Full physics sandbox
│   ├── Faq.tsx           # FAQ accordion + footer
│   ├── BlogView.tsx      # Blog listing grid
│   ├── CommentForm.tsx   # Blog comment form
│   └── DashboardView.tsx # Admin dashboard UI
├── lib/
│   ├── auth.ts           # Supabase session
│   ├── db.ts             # All database operations
│   └── markdown.ts       # Custom markdown parser
└── utils/supabase/
    ├── client.ts         # Browser client
    └── server.ts         # Server + admin client
```

## Deploy

Push to Vercel. See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).
