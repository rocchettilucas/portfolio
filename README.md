# lucasrocchetti.com

Personal portfolio for Lucas Rocchetti, built as a terminal. One page — hero, projects,
experience, skills, education — where every section heading is the command that would
have produced it, framed by a fixed top and bottom status bar. The
hero pairs a build-time figlet banner with an ASCII portrait rendered to a canvas.
Pressing `/` (or `~`, or the `>_` button on touch) opens a command palette that scrolls
to any section, opens GitHub or LinkedIn, and answers `whoami`; nothing on the page is
gated behind typing into it.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4
- JetBrains Mono via `next/font/google` (self-hosted at build time)
- Vitest for the data layer and the pure helpers
- Upstash for Redis behind `POST /api/visit`, for the visitor counter
- `next/og` for the OpenGraph and Twitter cards

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest, once |
| `npm run banner` | Regenerate the hero's figlet banner into `lib/banner.ts` |

## Visitor counter

The counter in the bottom bar reads an Upstash Redis store. Add the Upstash integration
to the Vercel project and it sets either `KV_REST_API_URL` / `KV_REST_API_TOKEN` or
`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` depending on the store — the code
accepts either pair. See `.env.example`, and run `vercel env pull .env.development.local`
to work with real values locally.

With none of them set the counter renders nothing and the rest of the site is unaffected,
so local development needs no environment at all.

## Docs

- `scripts/ascii/README.md` — regenerating the ASCII portrait (cutout, sampler, tuning).
- `docs/superpowers/specs/2026-08-24-portfolio-v2-terminal-design.md` — the design spec
  this site was built to, including the amendments made during the build.
