# lucasrocchetti.com v2 — Design & Build Spec

Approved 2026-08-22 (spec v4 + follow-up decisions). This document is the source of truth for implementers. The v1 site (`rocchettilucas/portfolio`) stays in production until v2 is ready to swap.

## 1. Intent

A clean, single-theme, content-first developer portfolio in the spirit of gazijarin.com — quiet motion, one accent that pops, the work shown clearly — with none of its gimmicks (no game mode, no art section, no carousel, no theme toggle). Every description is short. Nothing describes the author's role; product facts and metrics do the talking.

## 2. Hard rules (from the owner)

- **Dark only.** No theme toggle, no light mode, no `prefers-color-scheme` branching.
- **No self-promotional labels** ("sole engineer", "co-founder"). Product metrics are welcome (500+ monthly players, App Store rating, 23,000+ players, test counts).
- **No "open to work" anywhere visible.** Metadata may keep the phrase.
- **GasMap confidentiality:** show only the product, platforms, store links, rating, and a high-level stack (React Native/Expo, Fastify, PostgreSQL/PostGIS, Redis). Nothing about how data is collected, scrapers, schedulers, internal endpoints, DB sizes, or user counts. Never fetch a GasMap API from the site.
- **NHL Dashboard** live site is being fixed by the owner; link it, do not touch its repo.
- **Keep the existing logos** for RocSpace, WinLane, NHL; use the **updated PathwayR** mark. Keep the **LR logo** in the nav.
- **One sentence per project description.** Section titled **Software**, not Work.
- **No AI-default patterns:** no particle backgrounds, typewriters, bouncing scroll cues, tilt/float cards, glassmorphism, gradient text, blurred blobs, uppercase-tracked mono "eyebrows", Tailwind blue-500, Geist.

## 3. Design tokens

```css
:root {
  --bg:      #0B1526;   /* page ground (ink navy) */
  --surface: #121D33;   /* cards, spotlight ground */
  --hover:   #1A2742;   /* card hover */
  --text:    #E6ECF5;
  --muted:   #8D9BB5;
  --accent:  #5AEBCA;   /* Aqua, brightened from #4FE3C1 toward Gazi-level pop */
  --accent-tint: rgba(90, 235, 202, 0.10);
  --rule:    rgba(230, 236, 245, 0.12);
}
```

- **Type:** IBM Plex Sans 400 / 500 / 600 via `next/font/google`. No other family except `ui-monospace` inside the ASCII fallback `<pre>`. Sentence case everywhere; no letter-spacing tricks; weight never above 600.
- **Scale:** h1 56 (mobile 40) / h2 34 / h3 21 / body 17 / small 14 / card text 15.5. Line-height 1.5–1.6 for text, 1.1 for h1.
- **Layout:** single centered column, `max-width: 1000px`, gutters 40px (20px mobile). Sections `padding: 80px 0` (60px mobile). `[id] { scroll-margin-top: 80px }`.
- **Section header:** `h2` + a 1px rule (`--rule`, 260px, `margin-left: 20px`) in a flex row; rule hidden below 800px.
- **Surfaces:** cards `border-radius: 16px`, spotlight `20px`, buttons/tags `4px`, photo `10px`. **No borders on cards, no box-shadows anywhere.** Depth = `--surface` on `--bg`, hover = `--hover`.
- **Motion (the only motion on the site):**
  - Hover: `translateY(-5px)` + background `--surface → --hover`, `250ms cubic-bezier(0.645, 0.045, 0.355, 1)`. Arrow links `translateX(5px)`. Link color `200ms ease`.
  - Scroll reveal: once-only `opacity 0→1` + `translateY(20px→0)`, `600ms cubic-bezier(0.16, 1, 0.3, 1)`, IntersectionObserver with `unobserve` after first fire; children may stagger 80ms up to 4 items. **Above-the-fold content (nav, hero) never starts at opacity 0.**
  - `@media (prefers-reduced-motion: reduce)`: all transitions/animations disabled; reveals render in their final state.
  - Nothing else animates. No canvas loops, no rAF.
- **Accent jobs:** links, link icons, outlined buttons, the ASCII portrait, the card folder icon, active nav underline, focus ring. Never a background fill larger than a button hover tint.
- **Focus:** `:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }` globally.

## 4. Page structure — `/` (home)

Nav → Hero → Software → Experience → About → Education → Contact → Footer.

### Nav
Fixed, 64px, `--bg` at 85% with `backdrop-filter: blur(10px)`, 1px `--rule` bottom. Left: LR logo (32px, optimized from `public/logo.png`) + "Lucas Rocchetti" (link to `/`). Right: Software · Experience · About · Contact (hash links, active one underlined in accent based on scroll position) and an outlined **Résumé** button (accent border, opens `/Lucas_Rocchetti_Resume.pdf` in a new tab). Mobile: hamburger with `aria-expanded`/`aria-controls`, Escape closes, focus returns to the button, body scroll locked while open; the panel slides down 200ms.

### Hero
Two columns (text left, portrait right; stacks on mobile, portrait first). `min-height: 80vh`.
- h1: `👋 Hi, I'm Lucas` (emoji is a `<span aria-hidden>` before the text; the accessible name is "Hi, I'm Lucas").
- Lede (muted, max 520px): *I'm a software engineer in Toronto. I build apps and tools that people actually use — from a gas-price app on iOS and Android to a desktop workspace for coding agents.*
- Links row: GitHub · LinkedIn · Email (text links, accent).
- **ASCII portrait** — see §7. 400px desktop / 280px ≤768 / 220px ≤480. Static.

### Software
Header "Software" + rule, with a right-aligned "View all projects →" link to `/projects`.
1. **Spotlight — GasMap.** Full-width, `aspect-ratio: 2/1` (4/3 on mobile), radius 20px, `--surface`. Background image `public/projects/gasmap-spotlight.png` (2000×1000, already includes the logo and the All Stations screen with the bottom scrim baked in; `next/image` with `priority` false, `sizes="(max-width: 1000px) 100vw, 1000px"`). Caption overlaid bottom-center: h3 "GasMap" 32px · one line *Find the cheapest gas nearby, with live prices and trends for every station around you.* · tech *React Native, Expo, Fastify, PostgreSQL* (muted) · buttons **App Store** and **Google Play** (outlined accent, 4px radius, open in new tab) · an external-link icon to gasmap.ai. Meta line above the title, small and muted: *iOS and Android · 5.0 on the App Store*. The spotlight image itself is a known "revisit later" item; build the component so the image is swappable.
2. **Two cards** (3-column grid with the third column empty on desktop is wrong — use a 2-column grid here): **RocSpace** and **WinLane.GG**. Card anatomy (Gazi's): logo 40px top-left (`public/projects/*-192.png`), icons top-right (GitHub and/or external link, 20px, accent, each an `<a aria-label>`), h3 title, one-sentence description (muted, 15.5px), tech line (muted, 13.5px) pinned to the bottom. Whole card is not a link; only the icons are.
   - RocSpace — *A desktop workspace for running Claude Code, Codex and other coding agents side by side.* — Rust, Tauri, React, TypeScript — GitHub.
   - WinLane.GG — *Counter-pick analytics for League of Legends, used by 500+ players every month.* — React, Python, FastAPI, PostgreSQL — GitHub (if public; else omit) + site.

### Experience
Gazi's vertical-tab pattern: left rail of employer names (1px `--rule` right border; active item accent with a 2px accent indicator), right panel with *Title @ Company* (company in accent), a muted date line, and 2–4 bullets using an accent `▹` marker. Keyboard: tabs are `role="tablist"` with arrow-key navigation. ≤768px: tabs become a horizontal scrollable row. Content from `lib/data.ts`:
- **WinLane.GG** — Software Engineer — 2025 – present — bullets from the resume: 500+ monthly players; versioned REST API over a normalized Postgres schema; daily precompute pipeline bringing responses under 5 s; deployed on Vercel + Render with rate limiting.
- **City of Mississauga** — Technical Operations — Jun 2023 – present — 70+ live events (Raptors 905, Toronto Rock, Steelheads, Scotties Tournament of Hearts) for 5,000+ attendees; coordination across 5+ departments.
- **Best Buy — Geek Squad** — Consultation Agent — dates from `lib/data.ts` — root-cause diagnosis across Windows/macOS/mobile; OS installs, upgrades, data recovery; explaining findings to non-technical customers.

### About
Two columns: photo left (`public/about/lucas.jpg`, 220×280 cover, radius 10px), text right.
- Paragraph: *I'm a recent Computer Science graduate from the University of Toronto. I got into programming through games — I wanted better data on League of Legends matchups than existed, so I built it — and I've been building products since. Lately that's meant Rust and native apps.*
- "Technologies I work with most:" then a 2-column list with **self-hosted SVG icons** (18px, from the `devicon` npm package copied into `public/icons/`, no CDN): TypeScript · React & React Native · Rust · Python & FastAPI · PostgreSQL · Node.js.
- No memoji.

### Education
Two rows in card style: **University of Toronto** — Honours Bachelor of Science, Computer Science & Information Technology, 2026 — GPA 3.78 / 4.00, Dean's List — coursework line (Data Structures, Algorithms, Operating Systems, Machine Learning, AI). Second row: **GDSC UTM** — role/dates from data — DeerHacks Top 3. Logos: `public/uoft.png`, `public/gdsc.png` (optimized).

### Contact
Centered: h2 "Get in touch" (no accent period), one line *Hiring, or just want to talk hockey analytics? I read everything.*, then an outlined **Say hi** mail button and text links GitHub · LinkedIn · Résumé.

### Footer
Two centered muted lines: "Built and designed by Lucas Rocchetti." / "© 2026". Nothing else.

## 5. `/projects` — All projects

Nav (same component) + header "All projects" with a "← Back home" link. A vertical stack of **large spotlight-style cards** (same component as the GasMap spotlight, `aspect-ratio: 2/1`, radius 20px), one per project, each with an image, meta line, title, one sentence, tech, and link icons/buttons:
1. **NHL Player Dashboard** — *Career and game-by-game stats for 23,000+ NHL players, with live scores and comparisons.* — React, JavaScript, NHL API — GitHub + site. Image: logo-only tile for now (`public/projects/nhl-192.png` centered on `--surface`) until the owner's fix ships and a screenshot exists.
2. **PathwayR** — *Authentication and role-based access for a research platform used by students at five universities.* — React, TypeScript — site. Image: the PathwayR homepage capture from the handoff folder, framed like the GasMap one (window bleed, scrim).
3. **Portfolio v2** — *This site — the second iteration of my portfolio, rebuilt from the ground up. The previous version is still on GitHub.* — Next.js, React, TypeScript, Tailwind — GitHub (this repo; v1 link in the sentence). Image: an accent folder glyph on `--surface`.
Data-driven: adding a project = adding an entry in `lib/data.ts`. Page has its own `title`, description, canonical and OG.

## 6. Data layer (`lib/data.ts`)

Typed exports: `site` (name, url, email, socials[]), `projects: Project[]` (slug, title, blurb, tech[], links {github?, site?, appStore?, googlePlay?}, image {src, alt, kind: 'spotlight' | 'logo' | 'folder'}, meta?, featured: 'spotlight' | 'card' | 'all'), `experience: Role[]`, `education: School[]`, `coreStack: {name, icon}[]`. Remove `SocialLink` duplication, `Experience.tag`, `imageContain`, the `"#"` sentinel URLs, and the roles typing array. One `siteUrl` used by layout, robots, sitemap.

## 7. ASCII portrait

Static, precomputed, Gazi's algorithm. Data: `lib/ascii/tone_{400,280,220}.json` (particle lists `{c, x, y, a}`; gzip ≈ 5 KB, 5 KB, 3 KB) generated by `scripts/ascii/gazi_ascii.py` from `scripts/ascii/portrait.png` (cutout of the selfie); keep the script and the cutout in the repo so the art can be regenerated. Component `AsciiPortrait` (client): picks the size by breakpoint (Gazi's `calculateSize`), sets `canvas.width = size * dpr` (dpr capped at 2), `ctx.scale(dpr,dpr)`, `font = 7px ui-monospace` (5px at ≤280), `textAlign = "center"`, `textBaseline = "middle"`, and draws every particle **once** with `fillStyle = rgba(accent, a)`. No rAF, no pointer handling. Re-draws only on a debounced resize that changes the size bucket. `aria-hidden="true"` on the canvas; a visually-hidden `<span>` "Portrait of Lucas Rocchetti rendered in ASCII" beside it; `<noscript><pre>` fallback from `tone_400.txt` with `letter-spacing: .098em; line-height: 1.1` so the grid isn't squashed. The SSR output reserves the canvas box (width/height set) so there is no layout shift.

## 8. Engineering targets

- `next@16.3.2` (clears the 6 high audit findings), `lucide-react` latest, Tailwind v4 stays; **framer-motion removed**; devicon CDN removed.
- Every section a server component; client components only: `Nav` (scroll state + mobile menu), `AsciiPortrait`, `ExperienceTabs`, `Reveal` (IntersectionObserver wrapper).
- Images through `next/image` (no `unoptimized`); `public/logo.png` and `app/icon.png` regenerated at 512px / < 20 KB; delete `public/projects/league-of-counters.png`, `pathwayr.png`, `pathwayr.svg`, `nhl-dashboard-logo.svg` (replaced by the 192px PNGs), memoji PNGs.
- Homepage transfer < 400 KB; LCP < 1 s (hero never hidden); CLS ≤ 0.01.
- Accessibility: skip link to `#main`; semantic `header/nav/main/section[aria-labelledby]/footer`; one h1; `:focus-visible` everywhere; 24px+ targets; decorative images `alt=""`; mobile menu contract as in §4; reduced-motion honored.
- SEO: `title.template`, description, `metadataBase`, per-page canonical (`/`, `/projects`), `app/opengraph-image.tsx` via `next/og` (navy ground, name, aqua rule), `twitter-image` same, `app/sitemap.ts` with both routes and a fixed `lastModified`, `robots.ts`, `theme-color #0B1526`, `app/manifest.ts`, `app/apple-icon.png`, `app/not-found.tsx` with the site chrome, JSON-LD `Person` (jobTitle "Software Engineer") and `SoftwareApplication` for GasMap and RocSpace.
- `next.config.ts`: `poweredByHeader: false`, security headers (CSP allowing self + Google Fonts, `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy`), `images.formats: ['image/avif','image/webp']`.
- `npm run lint`, `npx tsc --noEmit`, `npm run build` all clean.

## 9. Out of scope (for now)

Case-study pages, blog, analytics, contact form, the GasMap spotlight image rework (owner will revisit), NHL screenshot (after the owner's fix), deployment/domain swap from v1.

## 10. Review gate

Every implementer task is reviewed by Fable 5 against this spec and a slop checklist (§2 list + §3 tokens) before the next task that depends on it starts. Visual review is done on the running dev server with desktop (1440) and mobile (390) screenshots.
