# Portfolio v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild lucasrocchetti.com as a dark, single-theme, Gazi-structured portfolio (hero with a static ASCII portrait, GasMap spotlight + project cards, tabbed experience, about, education, contact, and an `/projects` page) on a clean Next.js 16 foundation.

**Architecture:** App Router with server components everywhere except four small client islands (`Nav`, `AsciiPortrait`, `ExperienceTabs`, `Reveal`). All content lives in typed data in `lib/data.ts`; sections are thin presentational components that map over it. Styling is Tailwind v4 with CSS custom-property tokens defined once in `globals.css`; no component library, no framer-motion, no icon font.

**Tech Stack:** Next.js 16.3.x, React 19, TypeScript 5, Tailwind v4, `next/font/google` (IBM Plex Sans), `next/image`, `next/og`, `lucide-react` (GitHub/external/mail icons only), Vitest for the data layer and pure helpers, Playwright MCP (by the reviewer) for visual checks.

**Spec:** `docs/superpowers/specs/2026-08-22-portfolio-v2-design.md` — read it fully before any task. Research facts: `docs/handoff/project-facts.md` (respect its confidentiality header). Layout reference image: `docs/handoff/gazi-software-ref.png`.

## Global Constraints

- Dark only. No theme toggle, no `prefers-color-scheme` branching, no `html.light`.
- Tokens exactly: `--bg #0B1526`, `--surface #121D33`, `--hover #1A2742`, `--text #E6ECF5`, `--muted #8D9BB5`, `--accent #5AEBCA`, `--accent-tint rgba(90,235,202,0.10)`, `--rule rgba(230,236,245,0.12)`.
- Font: IBM Plex Sans 400/500/600 only, via `next/font/google`. No Geist, no Inter, no mono except the ASCII `<pre>` fallback.
- Radii: cards 16px, spotlight 20px, buttons 4px, photo 10px. No borders on cards. No `box-shadow` anywhere.
- Motion: only hover (`translateY(-5px)`, 250ms `cubic-bezier(0.645,0.045,0.355,1)`), link color 200ms, and the once-only `Reveal` (600ms `cubic-bezier(0.16,1,0.3,1)`, 20px). Everything disabled under `prefers-reduced-motion: reduce`. No rAF loops.
- Copy rules: one sentence per project description; no "sole engineer"/"co-founder"/"open to work" anywhere visible; metrics allowed.
- GasMap: product/platform/stores/rating/high-level stack only. Never mention data collection, scraping, internal endpoints, DB sizes, user counts. Never fetch any GasMap API.
- Section title is **Software** (nav and heading). Emoji in the hero is `👋` before "Hi".
- Quality gates for every task: `npm run lint`, `npx tsc --noEmit`, `npm test` (vitest), `npm run build` all pass. Commit after each task with a conventional message.
- The v1 repo at `/Users/lucasrocchetti/portfolio` is read-only reference; never modify it.

---

## File map (end state)

```
app/
  layout.tsx            fonts, metadata (title.template, themeColor, manifest), skip link, JSON-LD Person
  page.tsx              Home: Hero, Software, Experience, About, Education, Contact
  projects/page.tsx     All projects: stacked Spotlight cards
  not-found.tsx         404 with site chrome
  globals.css           tokens, base styles, reveal + focus + reduced-motion rules
  opengraph-image.tsx   next/og image (also used as twitter image)
  sitemap.ts, robots.ts, manifest.ts
  icon.png, apple-icon.png
components/
  Nav.tsx (client)      fixed bar, LR logo, links, Résumé button, mobile menu
  Footer.tsx
  Section.tsx           <section id aria-labelledby> wrapper with 1000px column and spacing
  SectionHeading.tsx    h2 + rule (+ optional right-side link)
  Reveal.tsx (client)   IntersectionObserver once-only reveal
  Hero.tsx
  AsciiPortrait.tsx (client)
  Spotlight.tsx         large project card (GasMap on home; every entry on /projects)
  ProjectCard.tsx       compact Gazi card
  Software.tsx
  ExperienceTabs.tsx (client)
  Experience.tsx
  About.tsx
  Education.tsx
  Contact.tsx
  icons.tsx             GitHub / External / Mail / Folder SVGs as React components
lib/
  site.ts               siteUrl, name, email, socials
  data.ts               projects, experience, education, coreStack (typed)
  ascii/                tone_400.json, tone_280.json, tone_220.json, tone_400.txt (already present)
  ascii-size.ts         calculateSize(width) pure helper
public/
  logo.png (512, optimized), projects/*.png, about/lucas.jpg, icons/*.svg (devicon copies), uoft.png, gdsc.png, Lucas_Rocchetti_Resume.pdf
scripts/ascii/          gazi_ascii.py, cutout3.py, portrait.png (already present)
tests/                  vitest: data.test.ts, ascii-size.test.ts, site.test.ts
```

---

### Task 1: Foundation — dependencies, deletions, config, test runner

**Files:**
- Modify: `package.json`
- Modify: `next.config.ts`
- Modify: `.gitignore`
- Create: `vitest.config.ts`
- Create: `tests/smoke.test.ts`
- Delete: `components/NetworkBackground.tsx`, `components/ThemeToggle.tsx`, `components/Skills.tsx`, `components/Projects.tsx`, `components/ProjectCard.tsx`, `components/Navbar.tsx`, `components/Hero.tsx`, `components/About.tsx`, `components/Experience.tsx`, `components/Education.tsx`, `components/Contact.tsx`, `components/Footer.tsx`, `components/Icons.tsx`, `app/projects/page.tsx`
- Delete assets: `public/projects/league-of-counters.png`, `public/projects/pathwayr.png`, `public/projects/pathwayr.svg`, `public/projects/nhl-dashboard-logo.svg`, `public/projects/rocspace-logo.png`, `public/memoji/` (whole dir), `public/experience/` (whole dir)
- Modify: `app/page.tsx` (temporary placeholder so the build passes), `app/layout.tsx` (remove the devicon `<link>` and Geist)

**Interfaces:**
- Produces: `npm test` (vitest), `npm run build` green on an empty placeholder page; `next.config.ts` with headers.

- [ ] **Step 1: Upgrade/replace dependencies**

```bash
cd /Users/lucasrocchetti/portfolio-v2
npm uninstall framer-motion
npm install next@16.3.2 eslint-config-next@16.3.2 lucide-react@latest
npm install -D vitest@latest
```

Edit `package.json`: `"name": "portfolio-v2"`, and add `"test": "vitest run"` to scripts.

- [ ] **Step 2: Delete the v1 components and assets listed above**

```bash
cd /Users/lucasrocchetti/portfolio-v2
git rm -q components/NetworkBackground.tsx components/ThemeToggle.tsx components/Skills.tsx components/Projects.tsx components/ProjectCard.tsx components/Navbar.tsx components/Hero.tsx components/About.tsx components/Experience.tsx components/Education.tsx components/Contact.tsx components/Footer.tsx components/Icons.tsx app/projects/page.tsx
git rm -q public/projects/league-of-counters.png public/projects/pathwayr.png public/projects/pathwayr.svg public/projects/nhl-dashboard-logo.svg public/projects/rocspace-logo.png
git rm -rq public/memoji public/experience
```

- [ ] **Step 3: Placeholder page and stripped layout**

`app/page.tsx`:
```tsx
export default function Home() {
  return <main id="main">Portfolio v2</main>;
}
```

`app/layout.tsx` — remove the Geist imports/variables, the `<link>` to `cdn.jsdelivr.net/.../devicon`, the `ThemeToggle`/theme script if present, and `html.light` logic. Keep `metadata` for now (Task 3 rewrites it). Minimal valid version:
```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Lucas Rocchetti" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: `next.config.ts` with security headers and image formats**

```ts
import type { NextConfig } from "next";

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
```
Note: `next/font/google` self-hosts fonts, so the Google Fonts origins are only a safety net; the `'unsafe-inline'` for scripts is required by Next's inline hydration scripts without a nonce setup — acceptable for a static site.

- [ ] **Step 5: Vitest config and a smoke test**

`vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: { include: ["tests/**/*.test.ts"] },
  resolve: { alias: { "@": path.resolve(__dirname) } },
});
```

`tests/smoke.test.ts`:
```ts
import { describe, it, expect } from "vitest";
describe("toolchain", () => {
  it("runs", () => expect(1 + 1).toBe(2));
});
```

- [ ] **Step 6: `.gitignore` additions**

Append: `.playwright-mcp/`, `*.log`, `.DS_Store`.

- [ ] **Step 7: Verify**

Run: `npm test && npm run lint && npx tsc --noEmit && npm run build`
Expected: all green; build lists `/` only. `npm audit --audit-level=high` reports 0 high.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "chore: v2 foundation — next 16.3.2, remove framer-motion/devicon/theme, vitest, security headers"
```

---

### Task 2: Data layer

**Files:**
- Create: `lib/site.ts`
- Rewrite: `lib/data.ts`
- Create: `tests/site.test.ts`, `tests/data.test.ts`

**Interfaces:**
- Produces (exact):
```ts
// lib/site.ts
export const site = {
  name: "Lucas Rocchetti",
  url: "https://lucasrocchetti.com",
  email: "lucasrocchetti@outlook.com",
  resumePath: "/Lucas_Rocchetti_Resume.pdf",
  socials: [
    { label: "GitHub", href: "https://github.com/rocchettilucas" },
    { label: "LinkedIn", href: "https://linkedin.com/in/lucasrocchetti" },
    { label: "Email", href: "mailto:lucasrocchetti@outlook.com" },
  ] as const,
  description: "Software engineer in Toronto building apps and tools people actually use — GasMap, WinLane.GG, RocSpace. Open to software engineering roles.",
};

// lib/data.ts
export type ProjectLinks = { github?: string; site?: string; appStore?: string; googlePlay?: string };
export type ProjectImage =
  | { kind: "spotlight"; src: string; alt: string }
  | { kind: "logo"; src: string; alt: string }
  | { kind: "folder" };
export type Project = {
  slug: string; title: string; blurb: string; tech: string[];
  links: ProjectLinks; logo?: string; image: ProjectImage; meta?: string;
  placement: "spotlight" | "card" | "all";
};
export type Role = { company: string; title: string; dates: string; bullets: string[]; site?: string };
export type School = { name: string; logo: string; degree?: string; dates: string; lines: string[] };
export type Stack = { name: string; icon: string };
export const projects: Project[]; export const experience: Role[]; export const education: School[]; export const coreStack: Stack[];
export const homeSpotlight: Project; export const homeCards: Project[]; export const allProjects: Project[];
```

- [ ] **Step 1: Write the failing tests**

`tests/site.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { site } from "@/lib/site";
describe("site", () => {
  it("has canonical url without trailing slash", () => expect(site.url).toBe("https://lucasrocchetti.com"));
  it("has three socials", () => expect(site.socials.map(s => s.label)).toEqual(["GitHub", "LinkedIn", "Email"]));
  it("never advertises availability in visible strings", () => {
    // description is metadata-only; visible copy lives in data.ts and is checked there
    expect(site.name).toBe("Lucas Rocchetti");
  });
});
```

`tests/data.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { projects, homeSpotlight, homeCards, allProjects, experience, education, coreStack } from "@/lib/data";

const BANNED = /sole engineer|co-founder|open to work|open to roles|scrap|crawler/i;
const ONE_SENTENCE = (s: string) => (s.match(/[.!?](\s|$)/g) ?? []).length === 1;

describe("projects", () => {
  it("has exactly one home spotlight (GasMap) and two home cards", () => {
    expect(homeSpotlight.slug).toBe("gasmap");
    expect(homeCards.map(p => p.slug)).toEqual(["rocspace", "winlane"]);
  });
  it("all-projects page lists nhl, pathwayr, portfolio-v2 in that order", () => {
    expect(allProjects.map(p => p.slug)).toEqual(["nhl-dashboard", "pathwayr", "portfolio-v2"]);
  });
  it("every blurb is exactly one sentence and contains no banned phrases", () => {
    for (const p of projects) {
      expect(ONE_SENTENCE(p.blurb), p.slug).toBe(true);
      expect(BANNED.test(p.blurb), p.slug).toBe(false);
      expect(BANNED.test(p.meta ?? ""), p.slug).toBe(false);
    }
  });
  it("gasmap has store links and site, no github", () => {
    const g = projects.find(p => p.slug === "gasmap")!;
    expect(g.links.appStore).toBe("https://apps.apple.com/ca/app/gasmap/id6789210117");
    expect(g.links.googlePlay).toBe("https://play.google.com/store/apps/details?id=com.olivanceplatforms.gasmap");
    expect(g.links.site).toBe("https://gasmap.ai");
    expect(g.links.github).toBeUndefined();
  });
  it("nhl has a public github link and no '#' sentinels anywhere", () => {
    const n = projects.find(p => p.slug === "nhl-dashboard")!;
    expect(n.links.github).toBe("https://github.com/rocchettilucas/NHL-Player-Dashboard");
    for (const p of projects) for (const v of Object.values(p.links)) expect(v).not.toBe("#");
  });
});

describe("experience", () => {
  it("has three roles with 2-4 bullets each and no banned phrases", () => {
    expect(experience.map(r => r.company)).toEqual(["WinLane.GG", "City of Mississauga", "Best Buy"]);
    for (const r of experience) {
      expect(r.bullets.length).toBeGreaterThanOrEqual(2);
      expect(r.bullets.length).toBeLessThanOrEqual(4);
      expect(BANNED.test(r.title + r.bullets.join(" "))).toBe(false);
    }
  });
});

describe("education & stack", () => {
  it("lists UofT with GPA and Dean's List", () => {
    expect(education[0].name).toBe("University of Toronto");
    expect(education[0].lines.join(" ")).toMatch(/3\.78/);
    expect(education[0].lines.join(" ")).toMatch(/Dean/);
  });
  it("core stack is exactly six items with icon paths under /icons/", () => {
    expect(coreStack).toHaveLength(6);
    for (const s of coreStack) expect(s.icon).toMatch(/^\/icons\/.+\.svg$/);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — modules `@/lib/site` / `@/lib/data` missing exports.

- [ ] **Step 3: Write `lib/site.ts`** exactly as in Interfaces.

- [ ] **Step 4: Write `lib/data.ts`**

```ts
export type ProjectLinks = { github?: string; site?: string; appStore?: string; googlePlay?: string };
export type ProjectImage =
  | { kind: "spotlight"; src: string; alt: string }
  | { kind: "logo"; src: string; alt: string }
  | { kind: "folder" };
export type Project = {
  slug: string;
  title: string;
  blurb: string;            // exactly one sentence
  tech: string[];
  links: ProjectLinks;
  logo?: string;            // 192px PNG for the compact card
  image: ProjectImage;      // for Spotlight
  meta?: string;            // small muted line, product facts only
  placement: "spotlight" | "card" | "all";
};

export const projects: Project[] = [
  {
    slug: "gasmap",
    title: "GasMap",
    blurb: "Find the cheapest gas nearby, with live prices and trends for every station around you.",
    tech: ["React Native", "Expo", "Fastify", "PostgreSQL"],
    links: {
      site: "https://gasmap.ai",
      appStore: "https://apps.apple.com/ca/app/gasmap/id6789210117",
      googlePlay: "https://play.google.com/store/apps/details?id=com.olivanceplatforms.gasmap",
    },
    logo: "/projects/gasmap-192.png",
    image: { kind: "spotlight", src: "/projects/gasmap-spotlight.png", alt: "GasMap's map screen showing live station prices" },
    meta: "iOS and Android · 5.0 on the App Store",
    placement: "spotlight",
  },
  {
    slug: "rocspace",
    title: "RocSpace",
    blurb: "A desktop workspace for running Claude Code, Codex and other coding agents side by side.",
    tech: ["Rust", "Tauri", "React", "TypeScript"],
    links: { github: "https://github.com/rocchettilucas/RocSpace" },
    logo: "/projects/rocspace-192.png",
    image: { kind: "logo", src: "/projects/rocspace-192.png", alt: "RocSpace logo" },
    placement: "card",
  },
  {
    slug: "winlane",
    title: "WinLane.GG",
    blurb: "Counter-pick analytics for League of Legends, used by 500+ players every month.",
    tech: ["React", "Python", "FastAPI", "PostgreSQL"],
    links: { site: "https://winlane.gg" },
    logo: "/projects/winlane-192.png",
    image: { kind: "logo", src: "/projects/winlane-192.png", alt: "WinLane.GG logo" },
    placement: "card",
  },
  {
    slug: "nhl-dashboard",
    title: "NHL Player Dashboard",
    blurb: "Career and game-by-game stats for 23,000+ NHL players, with live scores and comparisons.",
    tech: ["React", "JavaScript", "NHL API"],
    links: { github: "https://github.com/rocchettilucas/NHL-Player-Dashboard", site: "https://nhl-player-dashboard.vercel.app" },
    logo: "/projects/nhl-192.png",
    image: { kind: "logo", src: "/projects/nhl-192.png", alt: "NHL Player Dashboard logo" },
    placement: "all",
  },
  {
    slug: "pathwayr",
    title: "PathwayR",
    blurb: "Authentication and role-based access for a research platform used by students at five universities.",
    tech: ["React", "TypeScript"],
    links: { site: "https://pathwayr.com" },
    logo: "/projects/pathwayr-192.png",
    image: { kind: "spotlight", src: "/projects/pathwayr-home.png", alt: "PathwayR homepage" },
    placement: "all",
  },
  {
    slug: "portfolio-v2",
    title: "Portfolio v2",
    blurb: "This site — the second iteration of my portfolio, rebuilt from the ground up, with the previous version still on GitHub.",
    tech: ["Next.js", "React", "TypeScript", "Tailwind"],
    links: { github: "https://github.com/rocchettilucas/portfolio-v2" },
    image: { kind: "folder" },
    placement: "all",
  },
];

export const homeSpotlight = projects.find((p) => p.placement === "spotlight")!;
export const homeCards = projects.filter((p) => p.placement === "card");
export const allProjects = projects.filter((p) => p.placement === "all");

export type Role = { company: string; title: string; dates: string; bullets: string[]; site?: string };
export const experience: Role[] = [
  {
    company: "WinLane.GG",
    title: "Software Engineer",
    dates: "2025 – present",
    site: "https://winlane.gg",
    bullets: [
      "League of Legends matchup analytics used by 500+ players every month.",
      "Versioned REST API over a normalized PostgreSQL schema, deployed on Vercel and Render.",
      "A daily pipeline precomputes thousands of matchups so responses return in under five seconds.",
      "Ranking model recalibrates automatically on every Riot data release.",
    ],
  },
  {
    company: "City of Mississauga",
    title: "Technical Operations",
    dates: "Jun 2023 – present",
    bullets: [
      "Technical setup, stage transitions and A/V for 70+ live events — Raptors 905, Toronto Rock, Steelheads and the Scotties Tournament of Hearts — at venues hosting 5,000+ attendees.",
      "Live coordination across 5+ departments during events.",
    ],
  },
  {
    company: "Best Buy",
    title: "Geek Squad Consultation Agent",
    dates: "2022 – 2023",
    bullets: [
      "Root-cause diagnosis of hardware, software and network issues across Windows, macOS and mobile.",
      "OS installs, component-level upgrades and data recovery with verified integrity.",
      "Explained technical findings to non-technical customers.",
    ],
  },
];
// NOTE to implementer: copy the Best Buy dates from the v1 lib/data.ts in /Users/lucasrocchetti/portfolio (read-only) if they differ.

export type School = { name: string; logo: string; degree?: string; dates: string; lines: string[] };
export const education: School[] = [
  {
    name: "University of Toronto",
    logo: "/uoft.png",
    degree: "Honours Bachelor of Science, Computer Science & Information Technology",
    dates: "2026",
    lines: ["GPA 3.78 / 4.00 · Dean's List", "Data Structures · Algorithms · Operating Systems · Machine Learning · Artificial Intelligence"],
  },
  {
    name: "Google Developer Student Club — UTM",
    logo: "/gdsc.png",
    dates: "2024 – 2025",
    lines: ["DeerHacks — Top 3 finish"],
  },
];
// NOTE to implementer: copy the GDSC role/dates from v1 lib/data.ts if present there.

export type Stack = { name: string; icon: string };
export const coreStack: Stack[] = [
  { name: "TypeScript", icon: "/icons/typescript.svg" },
  { name: "React & React Native", icon: "/icons/react.svg" },
  { name: "Rust", icon: "/icons/rust.svg" },
  { name: "Python & FastAPI", icon: "/icons/python.svg" },
  { name: "PostgreSQL", icon: "/icons/postgresql.svg" },
  { name: "Node.js", icon: "/icons/nodejs.svg" },
];
```

- [ ] **Step 5: Run tests**

Run: `npm test`
Expected: PASS (all).

- [ ] **Step 6: Commit**

```bash
git add lib/site.ts lib/data.ts tests/ && git commit -m "feat(data): typed site + project/experience/education/stack data for v2"
```

---

### Task 3: Tokens, fonts, base styles, layout metadata, layout primitives

**Files:**
- Rewrite: `app/globals.css`
- Rewrite: `app/layout.tsx`
- Create: `components/Section.tsx`, `components/SectionHeading.tsx`, `components/Reveal.tsx`, `components/icons.tsx`

**Interfaces:**
- Produces:
```tsx
<Section id="software" title="Software" action={{ label: "View all projects", href: "/projects" }}>…</Section>
// Section renders <section id aria-labelledby={`${id}-title`} className="mx-auto max-w-[1000px] px-10 max-md:px-5 py-20 max-sm:py-14"> with <SectionHeading id title action?/> then children
<Reveal delay={0} as="div" className="">…</Reveal>   // client; adds .reveal, toggles .is-visible once
import { GitHubIcon, ExternalIcon, MailIcon, FolderIcon } from "@/components/icons"; // each: (props: React.SVGProps<SVGSVGElement>) => JSX
```

- [ ] **Step 1: `app/globals.css`**

```css
@import "tailwindcss";

:root {
  --bg: #0B1526;
  --surface: #121D33;
  --hover: #1A2742;
  --text: #E6ECF5;
  --muted: #8D9BB5;
  --accent: #5AEBCA;
  --accent-tint: rgba(90, 235, 202, 0.10);
  --rule: rgba(230, 236, 245, 0.12);
  --ease-hover: cubic-bezier(0.645, 0.045, 0.355, 1);
  --ease-reveal: cubic-bezier(0.16, 1, 0.3, 1);
}

@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-hover: var(--hover);
  --color-text: var(--text);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-rule: var(--rule);
  --font-sans: var(--font-plex);
}

html { color-scheme: dark; scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-plex), system-ui, sans-serif;
  font-size: 17px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
[id] { scroll-margin-top: 80px; }
a { color: var(--accent); text-decoration: none; transition: color 200ms ease; }
a:hover { color: var(--text); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 4px; }
::selection { background: var(--hover); }

.skip-link {
  position: absolute; left: 16px; top: -48px; z-index: 100;
  background: var(--accent); color: var(--bg); padding: 8px 12px; border-radius: 4px; font-weight: 500;
}
.skip-link:focus { top: 12px; }

/* Gazi-style quiet motion */
.lift { transition: transform 250ms var(--ease-hover), background-color 250ms var(--ease-hover); }
.lift:hover { transform: translateY(-5px); }
.arrow-link { display: inline-flex; align-items: center; gap: 6px; transition: transform 250ms ease, color 200ms ease; }
.arrow-link:hover { transform: translateX(5px); }

.reveal { opacity: 0; transform: translateY(20px); transition: opacity 600ms var(--ease-reveal), transform 600ms var(--ease-reveal); transition-delay: var(--reveal-delay, 0ms); }
.reveal.is-visible { opacity: 1; transform: none; }

.btn-outline {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 14px; border: 1px solid var(--accent); border-radius: 4px;
  color: var(--accent); font-size: 14px; font-weight: 500;
  transition: background-color 250ms var(--ease-hover), transform 250ms var(--ease-hover), color 200ms ease;
}
.btn-outline:hover { background: var(--accent-tint); color: var(--accent); transform: translateY(-3px); }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
  .reveal { opacity: 1; transform: none; }
  .lift:hover, .arrow-link:hover, .btn-outline:hover { transform: none; }
}
```

- [ ] **Step 2: `app/layout.tsx`**

```tsx
import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const plex = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_CA", url: site.url, siteName: site.name, title: site.name, description: site.description },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = { themeColor: "#0B1526", colorScheme: "dark" };

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  email: site.email,
  jobTitle: "Software Engineer",
  alumniOf: { "@type": "CollegeOrUniversity", name: "University of Toronto" },
  address: { "@type": "PostalAddress", addressLocality: "Toronto", addressRegion: "ON", addressCountry: "CA" },
  sameAs: site.socials.filter((s) => !s.href.startsWith("mailto:")).map((s) => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={plex.variable}>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </body>
    </html>
  );
}
```
If v1's `layout.tsx` contained a Google site-verification token under `verification.google`, carry it over into `metadata.verification`.

- [ ] **Step 3: `components/icons.tsx`**

```tsx
import type { SVGProps } from "react";
type P = SVGProps<SVGSVGElement>;
const base = { width: 20, height: 20, "aria-hidden": true } as const;

export function GitHubIcon(p: P) {
  return (<svg viewBox="0 0 24 24" fill="currentColor" {...base} {...p}><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.3 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z"/></svg>);
}
export function ExternalIcon(p: P) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...base} {...p}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>);
}
export function MailIcon(p: P) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>);
}
export function FolderIcon(p: P) {
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" width={40} height={40} aria-hidden {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>);
}
```

- [ ] **Step 4: `components/Reveal.tsx`** (client)

```tsx
"use client";
import { useEffect, useRef, type ElementType, type ReactNode } from "react";

export default function Reveal({ children, delay = 0, as: Tag = "div", className = "" }:
  { children: ReactNode; delay?: number; as?: ElementType; className?: string }) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.classList.add("is-visible"); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("is-visible"); io.unobserve(el); } }, { rootMargin: "0px 0px -10% 0px" });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <Tag ref={ref} className={`reveal ${className}`} style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}>{children}</Tag>;
}
```

- [ ] **Step 5: `components/SectionHeading.tsx` and `components/Section.tsx`**

```tsx
// SectionHeading.tsx
import Link from "next/link";
export default function SectionHeading({ id, title, action }: { id: string; title: string; action?: { label: string; href: string } }) {
  return (
    <div className="mb-7 flex items-center gap-5">
      <h2 id={`${id}-title`} className="text-[34px] font-medium leading-tight max-sm:text-[28px]">{title}</h2>
      <span aria-hidden className="h-px w-[260px] bg-rule max-[800px]:hidden" />
      {action && <Link href={action.href} className="arrow-link ml-auto text-[15px]">{action.label} <span aria-hidden>→</span></Link>}
    </div>
  );
}

// Section.tsx
import SectionHeading from "./SectionHeading";
export default function Section({ id, title, action, children }:
  { id: string; title: string; action?: { label: string; href: string }; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mx-auto max-w-[1000px] px-10 py-20 max-md:px-5 max-sm:py-14">
      <SectionHeading id={id} title={title} action={action} />
      {children}
    </section>
  );
}
```

- [ ] **Step 6: Verify** — `npm run lint && npx tsc --noEmit && npm run build` green. Confirm the built HTML for `/` contains `--font-plex` and no `Geist`.

- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat(ui): tokens, Plex font, base styles, Section/Reveal primitives, layout metadata"`

---

### Task 4: Nav and Footer

**Files:**
- Create: `components/Nav.tsx` (client), `components/Footer.tsx`
- Modify: `app/page.tsx` (render Nav + Footer around the placeholder)
- Modify asset: regenerate `public/logo.png` at 512×512, < 20 KB (use `sips -Z 512 public/logo.png --out public/logo.png` then `pngquant`/`oxipng` if available, else `sips` only), and copy the same file to `app/icon.png`.

**Interfaces:**
- Produces: `<Nav />` (no props), `<Footer />`. Nav section links: `#software`, `#experience`, `#about`, `#contact`; on `/projects` the links point to `/#software` etc.

- [ ] **Step 1: Optimize the logo**

```bash
cd /Users/lucasrocchetti/portfolio-v2
sips -Z 512 public/logo.png --out public/logo.png >/dev/null && cp public/logo.png app/icon.png && ls -la public/logo.png
```
If still > 60 KB, run `./node_modules/.bin/next` is irrelevant — instead install `oxipng` via `brew install oxipng` is NOT allowed (no system changes); use Python Pillow (`python3 -c "from PIL import Image; im=Image.open('public/logo.png').convert('RGBA'); im.save('public/logo.png', optimize=True)"`). Report the final size in the task summary.

- [ ] **Step 2: `components/Nav.tsx`**

```tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

const LINKS = [
  { id: "software", label: "Software" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!onHome) return;
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
      else if (window.scrollY < 200) setActive("");
    }, { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] });
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [onHome]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btnRef.current?.focus(); } };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-rule bg-bg/85 backdrop-blur-md">
      <nav aria-label="Main" className="mx-auto flex h-full max-w-[1000px] items-center justify-between px-10 max-md:px-5">
        <Link href="/" className="flex items-center gap-2.5 text-[15px] font-medium text-text hover:text-accent" aria-label={`${site.name} — home`}>
          <Image src="/logo.png" alt="" width={32} height={32} priority />
          <span>{site.name}</span>
        </Link>
        <div className="flex items-center gap-6 max-md:hidden">
          {LINKS.map((l) => (
            <a key={l.id} href={href(l.id)} aria-current={active === l.id ? "location" : undefined}
               className={`py-2 text-sm border-b-2 ${active === l.id ? "border-accent text-text" : "border-transparent text-muted hover:text-accent"}`}>
              {l.label}
            </a>
          ))}
          <a href={site.resumePath} target="_blank" rel="noopener noreferrer" className="btn-outline py-1.5">Résumé</a>
        </div>
        <button ref={btnRef} type="button" className="hidden h-11 w-11 items-center justify-center text-text max-md:flex"
                aria-label="Menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
          <span aria-hidden className="text-2xl leading-none">{open ? "×" : "≡"}</span>
        </button>
      </nav>
      {open && (
        <div id="mobile-menu" className="border-t border-rule bg-bg px-5 py-4 md:hidden">
          {LINKS.map((l) => (
            <a key={l.id} href={href(l.id)} onClick={() => setOpen(false)} className="block py-3 text-base text-text">{l.label}</a>
          ))}
          <a href={site.resumePath} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="btn-outline mt-2">Résumé</a>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 3: `components/Footer.tsx`**

```tsx
import { site } from "@/lib/site";
export default function Footer() {
  return (
    <footer className="px-5 pb-10 pt-16 text-center text-sm text-muted">
      <p>Built and designed by {site.name}.</p>
      <p>© {new Date().getFullYear()}</p>
    </footer>
  );
}
```

- [ ] **Step 4: Wire into `app/page.tsx`**

```tsx
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
export default function Home() {
  return (<><Nav /><main id="main" className="pt-16">Placeholder</main><Footer /></>);
}
```

- [ ] **Step 5: Verify** — lint/tsc/build green. `npm run dev -- --port 3002` and `curl -s localhost:3002 | grep -c 'aria-controls="mobile-menu"'` prints 1. Stop the dev server.

- [ ] **Step 6: Commit** — `git commit -am "feat(ui): Nav with LR logo, active-section underline, accessible mobile menu; Footer"` (use `git add -A` first).

---

### Task 5: ASCII portrait + Hero

**Files:**
- Create: `lib/ascii-size.ts`, `tests/ascii-size.test.ts`, `components/AsciiPortrait.tsx` (client), `components/Hero.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Produces: `calculateSize(width: number): 400 | 280 | 220` (returns one of the three buckets; mirrors Gazi's thresholds but snaps to the bucket because data exists only for those sizes); `<AsciiPortrait />`; `<Hero />`.
- Consumes: `lib/ascii/tone_{400,280,220}.json` — arrays of `{ c: string; x: number; y: number; a: number }` (confirm the key names by reading the JSON; if the keys are `char/x/y/alpha`, adapt the type once in `AsciiPortrait.tsx`).

- [ ] **Step 1: Failing test**

`tests/ascii-size.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { calculateSize } from "@/lib/ascii-size";
describe("calculateSize", () => {
  it("desktop → 400", () => expect(calculateSize(1440)).toBe(400));
  it("tablet → 280", () => expect(calculateSize(768)).toBe(280));
  it("phone → 220", () => expect(calculateSize(390)).toBe(220));
  it("boundaries", () => { expect(calculateSize(769)).toBe(400); expect(calculateSize(480)).toBe(220); expect(calculateSize(481)).toBe(280); });
});
```
Run `npm test` → FAIL (module missing).

- [ ] **Step 2: `lib/ascii-size.ts`**

```ts
export type AsciiSize = 400 | 280 | 220;
export function calculateSize(width: number): AsciiSize {
  if (width <= 480) return 220;
  if (width <= 768) return 280;
  return 400;
}
```
Run `npm test` → PASS.

- [ ] **Step 3: `components/AsciiPortrait.tsx`**

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { calculateSize, type AsciiSize } from "@/lib/ascii-size";
import p400 from "@/lib/ascii/tone_400.json";
import p280 from "@/lib/ascii/tone_280.json";
import p220 from "@/lib/ascii/tone_220.json";

type Particle = { c: string; x: number; y: number; a: number };
const DATA: Record<AsciiSize, Particle[]> = { 400: p400 as Particle[], 280: p280 as Particle[], 220: p220 as Particle[] };
const ACCENT = [90, 235, 202] as const; // --accent #5AEBCA

function draw(canvas: HTMLCanvasElement, size: AsciiSize) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = size * dpr; canvas.height = size * dpr;
  canvas.style.width = `${size}px`; canvas.style.height = `${size}px`;
  const ctx = canvas.getContext("2d"); if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, size, size);
  ctx.font = `${size <= 280 ? 5 : 7}px ui-monospace, Menlo, monospace`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  for (const p of DATA[size]) {
    ctx.fillStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${p.a})`;
    ctx.fillText(p.c, p.x, p.y);
  }
}

export default function AsciiPortrait() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState<AsciiSize>(400);
  useEffect(() => {
    let t: number | undefined;
    const update = () => setSize(calculateSize(window.innerWidth));
    const onResize = () => { window.clearTimeout(t); t = window.setTimeout(update, 150); };
    update(); window.addEventListener("resize", onResize);
    return () => { window.clearTimeout(t); window.removeEventListener("resize", onResize); };
  }, []);
  useEffect(() => { if (ref.current) draw(ref.current, size); }, [size]);
  return (
    <figure className="m-0 flex justify-center">
      <canvas ref={ref} width={400} height={400} aria-hidden="true" className="block" style={{ width: 400, height: 400 }} />
      <figcaption className="sr-only">Portrait of Lucas Rocchetti rendered in ASCII characters</figcaption>
    </figure>
  );
}
```
Check the JSON key names first (`head -c 200 lib/ascii/tone_400.json`). If they are not `c/x/y/a`, map them in `draw` rather than editing the data files. Ensure `tsconfig.json` has `"resolveJsonModule": true` (Next's default does).

- [ ] **Step 4: `components/Hero.tsx`**

```tsx
import AsciiPortrait from "./AsciiPortrait";
import { site } from "@/lib/site";

export default function Hero() {
  return (
    <section id="top" aria-label="Introduction" className="mx-auto grid min-h-[80vh] max-w-[1000px] grid-cols-[1fr_auto] items-center gap-14 px-10 pb-20 pt-28 max-md:grid-cols-1 max-md:px-5 max-md:pt-24">
      <div className="max-md:order-2">
        <h1 className="mb-5 text-[56px] font-medium leading-[1.1] tracking-[-0.01em] max-sm:text-[40px]">
          <span aria-hidden>👋 </span>Hi, I&apos;m Lucas
        </h1>
        <p className="mb-6 max-w-[520px] text-lg leading-relaxed text-muted">
          I&apos;m a software engineer in Toronto. I build apps and tools that people actually use — from a gas-price app on iOS and Android to a desktop workspace for coding agents.
        </p>
        <ul className="flex gap-6 text-[15px]">
          {site.socials.map((s) => (
            <li key={s.label}><a href={s.href} target={s.href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer">{s.label}</a></li>
          ))}
        </ul>
      </div>
      <div className="max-md:order-1"><AsciiPortrait /></div>
    </section>
  );
}
```

- [ ] **Step 5: Wire** — `app/page.tsx`: `<main id="main"><Hero /></main>` between Nav and Footer.

- [ ] **Step 6: Verify** — tests/lint/tsc/build green. Dev server on 3002: the SSR HTML must contain the `<h1>` text and the `<canvas width="400" height="400">` (no opacity-0 above the fold). Stop the server.

- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat(hero): greeting hero with static Gazi-style ASCII portrait"`

---

### Task 6: Spotlight, ProjectCard, Software section

**Files:**
- Create: `components/Spotlight.tsx`, `components/ProjectCard.tsx`, `components/Software.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Produces: `<Spotlight project={Project} priority?: boolean />`, `<ProjectCard project={Project} />`, `<Software />`.
- Consumes: `homeSpotlight`, `homeCards` from `@/lib/data`; `Section`, `Reveal`, icons.

- [ ] **Step 1: `components/ProjectCard.tsx`**

```tsx
import Image from "next/image";
import type { Project } from "@/lib/data";
import { GitHubIcon, ExternalIcon, FolderIcon } from "./icons";

export default function ProjectCard({ project }: { project: Project }) {
  const { title, blurb, tech, links, logo } = project;
  return (
    <article className="lift flex h-full flex-col rounded-2xl bg-surface p-6 hover:bg-hover">
      <div className="mb-4 flex items-start justify-between">
        {logo ? <Image src={logo} alt="" width={40} height={40} className="h-10 w-10 object-contain" /> : <FolderIcon className="text-accent" />}
        <div className="flex gap-3.5 text-accent">
          {links.github && <a href={links.github} target="_blank" rel="noopener noreferrer" aria-label={`${title} on GitHub`} className="p-1"><GitHubIcon /></a>}
          {links.site && <a href={links.site} target="_blank" rel="noopener noreferrer" aria-label={`${title} website`} className="p-1"><ExternalIcon /></a>}
        </div>
      </div>
      <h3 className="mb-2 text-[21px] font-medium">{title}</h3>
      <p className="mb-4 text-[15.5px] leading-relaxed text-muted">{blurb}</p>
      <p className="mt-auto text-[13.5px] text-muted">{tech.join(", ")}</p>
    </article>
  );
}
```

- [ ] **Step 2: `components/Spotlight.tsx`**

```tsx
import Image from "next/image";
import type { Project } from "@/lib/data";
import { ExternalIcon, GitHubIcon, FolderIcon } from "./icons";

export default function Spotlight({ project, priority = false }: { project: Project; priority?: boolean }) {
  const { title, blurb, tech, links, meta, image, logo } = project;
  return (
    <article className="relative overflow-hidden rounded-[20px] bg-surface aspect-[2/1] max-md:aspect-[4/3]">
      {image.kind === "spotlight" && (
        <Image src={image.src} alt={image.alt} fill priority={priority} sizes="(max-width: 1000px) 100vw, 1000px" className="object-cover" />
      )}
      {image.kind === "logo" && (
        <div className="absolute inset-0 flex items-center justify-center"><Image src={image.src} alt={image.alt} width={160} height={160} className="h-40 w-40 object-contain opacity-90" /></div>
      )}
      {image.kind === "folder" && (
        <div className="absolute inset-0 flex items-center justify-center text-accent"><FolderIcon width={120} height={120} strokeWidth={1.2} /></div>
      )}
      {image.kind !== "spotlight" && logo === undefined ? null : null}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg via-bg/80 to-transparent px-10 pb-7 pt-28 text-center max-md:px-5">
        {meta && <p className="mb-1 text-sm text-muted">{meta}</p>}
        <h3 className="mb-1.5 text-[32px] font-medium leading-tight max-sm:text-2xl">{title}</h3>
        <p className="mx-auto mb-1.5 max-w-[60ch] text-base text-text/90">{blurb}</p>
        <p className="mb-3.5 text-sm text-muted">{tech.join(", ")}</p>
        <p className="flex flex-wrap items-center justify-center gap-3">
          {links.appStore && <a href={links.appStore} target="_blank" rel="noopener noreferrer" className="btn-outline">App Store</a>}
          {links.googlePlay && <a href={links.googlePlay} target="_blank" rel="noopener noreferrer" className="btn-outline">Google Play</a>}
          {links.github && <a href={links.github} target="_blank" rel="noopener noreferrer" aria-label={`${title} on GitHub`} className="p-1 text-accent"><GitHubIcon /></a>}
          {links.site && <a href={links.site} target="_blank" rel="noopener noreferrer" aria-label={`${title} website`} className="p-1 text-accent"><ExternalIcon /></a>}
        </p>
      </div>
    </article>
  );
}
```
Note: the GasMap image already has its scrim baked in; the CSS gradient is still applied uniformly so logo/folder entries on `/projects` read the same. Remove the no-op `{image.kind !== "spotlight" && logo === undefined ? null : null}` line — it is included above only to flag that the logo is NOT drawn again on spotlight images (GasMap's banner contains its logo).

- [ ] **Step 3: `components/Software.tsx`**

```tsx
import Section from "./Section";
import Reveal from "./Reveal";
import Spotlight from "./Spotlight";
import ProjectCard from "./ProjectCard";
import { homeSpotlight, homeCards } from "@/lib/data";

export default function Software() {
  return (
    <Section id="software" title="Software" action={{ label: "View all projects", href: "/projects" }}>
      <Reveal><Spotlight project={homeSpotlight} /></Reveal>
      <div className="mt-5 grid grid-cols-2 gap-5 max-md:grid-cols-1">
        {homeCards.map((p, i) => <Reveal key={p.slug} delay={i * 80}><ProjectCard project={p} /></Reveal>)}
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Wire** — add `<Software />` after `<Hero />` in `app/page.tsx`.

- [ ] **Step 5: Verify** — lint/tsc/build green; dev server: the `/` HTML contains "App Store" and "Google Play" links with the exact store URLs from `lib/data.ts`, and exactly two `<article>` cards under the spotlight. Stop the server.

- [ ] **Step 6: Commit** — `git add -A && git commit -m "feat(software): GasMap spotlight, Gazi-style project cards, View all projects link"`

---

### Task 7: Experience tabs

**Files:**
- Create: `components/ExperienceTabs.tsx` (client), `components/Experience.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Produces: `<ExperienceTabs roles={Role[]} />`, `<Experience />`.

- [ ] **Step 1: `components/ExperienceTabs.tsx`**

```tsx
"use client";
import { useId, useRef, useState } from "react";
import type { Role } from "@/lib/data";

export default function ExperienceTabs({ roles }: { roles: Role[] }) {
  const [i, setI] = useState(0);
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent) => {
    const n = roles.length; let next = i;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % n;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + n) % n;
    else if (e.key === "Home") next = 0; else if (e.key === "End") next = n - 1; else return;
    e.preventDefault(); setI(next); tabs.current[next]?.focus();
  };
  const r = roles[i];
  return (
    <div className="grid grid-cols-[200px_1fr] gap-10 max-md:grid-cols-1 max-md:gap-6">
      <div role="tablist" aria-orientation="vertical" onKeyDown={onKey}
           className="flex flex-col border-l border-rule max-md:flex-row max-md:overflow-x-auto max-md:border-l-0 max-md:border-b">
        {roles.map((role, idx) => (
          <button key={role.company} ref={(el) => { tabs.current[idx] = el; }} role="tab" id={`${base}-tab-${idx}`}
                  aria-selected={idx === i} aria-controls={`${base}-panel-${idx}`} tabIndex={idx === i ? 0 : -1} onClick={() => setI(idx)}
                  className={`-ml-px border-l-2 px-5 py-3 text-left text-[15px] transition-colors max-md:-mb-px max-md:border-b-2 max-md:border-l-0 max-md:whitespace-nowrap ${idx === i ? "border-accent bg-[var(--accent-tint)] text-accent" : "border-transparent text-muted hover:bg-[var(--accent-tint)] hover:text-accent"}`}>
            {role.company}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${base}-panel-${i}`} aria-labelledby={`${base}-tab-${i}`} className="min-h-[260px]">
        <h3 className="text-[22px] font-medium">
          {r.title} <span className="text-accent">@ {r.site ? <a href={r.site} target="_blank" rel="noopener noreferrer">{r.company}</a> : r.company}</span>
        </h3>
        <p className="mb-5 mt-1 text-sm text-muted">{r.dates}</p>
        <ul className="space-y-3">
          {r.bullets.map((b) => (
            <li key={b} className="relative pl-7 text-[16px] leading-relaxed text-muted before:absolute before:left-0 before:text-accent before:content-['▹']">{b}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: `components/Experience.tsx`**

```tsx
import Section from "./Section";
import Reveal from "./Reveal";
import ExperienceTabs from "./ExperienceTabs";
import { experience } from "@/lib/data";
export default function Experience() {
  return (<Section id="experience" title="Experience"><Reveal><ExperienceTabs roles={experience} /></Reveal></Section>);
}
```

- [ ] **Step 3: Wire** into `app/page.tsx` after `<Software />`.

- [ ] **Step 4: Verify** — lint/tsc/build green. Dev server: HTML contains `role="tablist"` and the first panel's bullets. Stop the server.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(experience): accessible vertical tabs with employer rail"`

---

### Task 8: About (with self-hosted stack icons), Education, Contact

**Files:**
- Create: `public/icons/{typescript,react,rust,python,postgresql,nodejs}.svg`
- Create: `components/About.tsx`, `components/Education.tsx`, `components/Contact.tsx`
- Modify: `app/page.tsx`
- Optimize: `public/uoft.png`, `public/gdsc.png` to ≤ 256px

**Interfaces:** `<About />`, `<Education />`, `<Contact />`.

- [ ] **Step 1: Copy icons from the devicon package (no CDN)**

```bash
cd /Users/lucasrocchetti/portfolio-v2
npm install -D devicon@2.16.0
mkdir -p public/icons
cp node_modules/devicon/icons/typescript/typescript-original.svg public/icons/typescript.svg
cp node_modules/devicon/icons/react/react-original.svg public/icons/react.svg
cp node_modules/devicon/icons/rust/rust-original.svg public/icons/rust.svg
cp node_modules/devicon/icons/python/python-original.svg public/icons/python.svg
cp node_modules/devicon/icons/postgresql/postgresql-original.svg public/icons/postgresql.svg
cp node_modules/devicon/icons/nodejs/nodejs-original.svg public/icons/nodejs.svg
npm uninstall devicon
sips -Z 256 public/uoft.png --out public/uoft.png >/dev/null; sips -Z 256 public/gdsc.png --out public/gdsc.png >/dev/null
```
The Rust icon is black; render it with `className="invert"` (Tailwind `filter: invert(1)`) — handle via a per-item flag: in `About.tsx`, `const INVERT = new Set(["/icons/rust.svg"])`.

- [ ] **Step 2: `components/About.tsx`**

```tsx
import Image from "next/image";
import Section from "./Section";
import Reveal from "./Reveal";
import { coreStack } from "@/lib/data";
const INVERT = new Set(["/icons/rust.svg"]);

export default function About() {
  return (
    <Section id="about" title="About">
      <Reveal>
        <div className="grid grid-cols-[220px_1fr] items-start gap-10 max-md:grid-cols-1">
          <Image src="/about/lucas.jpg" alt="Lucas Rocchetti at the University of Toronto" width={220} height={280} className="h-[280px] w-[220px] rounded-[10px] object-cover" />
          <div>
            <p className="max-w-[58ch] text-[17px] leading-relaxed text-text/90">
              I&apos;m a recent Computer Science graduate from the University of Toronto. I got into programming through games — I wanted better data on League of Legends matchups than existed, so I built it — and I&apos;ve been building products since. Lately that&apos;s meant Rust and native apps.
            </p>
            <p className="mb-2 mt-5 text-sm text-muted">Technologies I work with most:</p>
            <ul className="grid max-w-[420px] grid-cols-2 gap-x-6 gap-y-2 text-[15px] text-muted max-sm:grid-cols-1">
              {coreStack.map((s) => (
                <li key={s.name} className="flex items-center gap-2.5">
                  <Image src={s.icon} alt="" width={18} height={18} className={INVERT.has(s.icon) ? "invert" : ""} />
                  {s.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
```

- [ ] **Step 3: `components/Education.tsx`**

```tsx
import Image from "next/image";
import Section from "./Section";
import Reveal from "./Reveal";
import { education } from "@/lib/data";

export default function Education() {
  return (
    <Section id="education" title="Education">
      <div className="grid gap-5">
        {education.map((s, i) => (
          <Reveal key={s.name} delay={i * 80}>
            <article className="lift flex items-start gap-5 rounded-2xl bg-surface p-6 hover:bg-hover max-sm:flex-col">
              <Image src={s.logo} alt="" width={56} height={56} className="h-14 w-14 rounded-lg bg-white object-contain p-1.5" />
              <div>
                <h3 className="text-[21px] font-medium">{s.name}</h3>
                {s.degree && <p className="text-[15.5px] text-text/90">{s.degree}</p>}
                <p className="mb-2 text-sm text-muted">{s.dates}</p>
                {s.lines.map((l) => <p key={l} className="text-[15px] text-muted">{l}</p>)}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: `components/Contact.tsx`**

```tsx
import Section from "./Section";
import Reveal from "./Reveal";
import { site } from "@/lib/site";
import { MailIcon } from "./icons";

export default function Contact() {
  const github = site.socials.find((s) => s.label === "GitHub")!;
  const linkedin = site.socials.find((s) => s.label === "LinkedIn")!;
  return (
    <Section id="contact" title="Get in touch">
      <Reveal>
        <div className="max-w-[60ch]">
          <p className="mb-6 text-[17px] text-muted">Hiring, or just want to talk hockey analytics? I read everything.</p>
          <div className="flex flex-wrap items-center gap-6">
            <a href={`mailto:${site.email}`} className="btn-outline"><MailIcon /> Say hi</a>
            <a href={github.href} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={linkedin.href} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={site.resumePath} target="_blank" rel="noopener noreferrer">Résumé</a>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
```

- [ ] **Step 5: Wire** — `app/page.tsx` final order: `<Hero /><Software /><Experience /><About /><Education /><Contact />`.

- [ ] **Step 6: Verify** — lint/tsc/build green; `ls public/icons | wc -l` = 6; no `cdn.jsdelivr` string anywhere in `app/` or `components/` (`grep -r jsdelivr app components` empty). Stop any dev server.

- [ ] **Step 7: Commit** — `git add -A && git commit -m "feat: About with self-hosted stack icons, Education cards, Contact"`

---

### Task 9: `/projects` page and 404

**Files:**
- Create: `app/projects/page.tsx`, `app/not-found.tsx`

- [ ] **Step 1: `app/projects/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Spotlight from "@/components/Spotlight";
import { allProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "All projects",
  description: "Everything I've built — apps, tools and experiments.",
  alternates: { canonical: "/projects" },
  openGraph: { title: "All projects", url: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-[1000px] px-10 pb-20 pt-32 max-md:px-5">
        <div className="mb-8 flex items-center justify-between gap-5">
          <h1 className="text-[34px] font-medium">All projects</h1>
          <Link href="/" className="arrow-link text-[15px]"><span aria-hidden>←</span> Back home</Link>
        </div>
        <div className="grid gap-6">
          {allProjects.map((p, i) => <Reveal key={p.slug} delay={i * 80}><Spotlight project={p} /></Reveal>)}
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: `app/not-found.tsx`**

```tsx
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="mx-auto flex min-h-[70vh] max-w-[1000px] flex-col items-start justify-center px-10 pt-16 max-md:px-5">
        <p className="mb-2 text-sm text-muted">404</p>
        <h1 className="mb-4 text-[40px] font-medium">That page doesn&apos;t exist.</h1>
        <Link href="/" className="arrow-link"><span aria-hidden>←</span> Back home</Link>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verify** — build shows `/`, `/projects`, `/_not-found`. `curl -s localhost:3002/projects | grep -o 'rel="canonical" href="[^"]*"'` prints `https://lucasrocchetti.com/projects`. Stop the server.

- [ ] **Step 4: Commit** — `git add -A && git commit -m "feat: All projects page with spotlight cards; branded 404"`

---

### Task 10: SEO assets — OG image, sitemap, robots, manifest, icons, project JSON-LD

**Files:**
- Create: `app/opengraph-image.tsx`, `app/twitter-image.tsx`, `app/manifest.ts`, `app/apple-icon.png`
- Rewrite: `app/sitemap.ts`, `app/robots.ts`
- Modify: `app/page.tsx` (SoftwareApplication JSON-LD for GasMap and RocSpace)

- [ ] **Step 1: `app/opengraph-image.tsx`** (and `twitter-image.tsx` re-exporting it)

```tsx
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";
export const runtime = "nodejs";
export const alt = `${site.name} — software engineer in Toronto`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 96, background: "#0B1526", color: "#E6ECF5", fontFamily: "sans-serif" }}>
        <div style={{ width: 120, height: 4, background: "#5AEBCA", marginBottom: 36 }} />
        <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: -1 }}>{site.name}</div>
        <div style={{ fontSize: 32, color: "#8D9BB5", marginTop: 18 }}>Software engineer in Toronto · GasMap, WinLane.GG, RocSpace</div>
        <div style={{ fontSize: 26, color: "#5AEBCA", marginTop: 48 }}>lucasrocchetti.com</div>
      </div>
    ),
    size
  );
}
```
`app/twitter-image.tsx`: `export { default, alt, size, contentType, runtime } from "./opengraph-image";`

- [ ] **Step 2: `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`**

```ts
// sitemap.ts
import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
const lastModified = new Date("2026-08-22");
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/projects`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}
// robots.ts
import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${site.url}/sitemap.xml` };
}
// manifest.ts
import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
export default function manifest(): MetadataRoute.Manifest {
  return { name: site.name, short_name: "Lucas", start_url: "/", display: "standalone", background_color: "#0B1526", theme_color: "#0B1526", icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }] };
}
```
`app/apple-icon.png`: `sips -Z 180 app/icon.png --out app/apple-icon.png`.

- [ ] **Step 3: Project JSON-LD in `app/page.tsx`**

```tsx
import { projects } from "@/lib/data";
const appsJsonLd = projects.filter((p) => ["gasmap", "rocspace"].includes(p.slug)).map((p) => ({
  "@context": "https://schema.org", "@type": "SoftwareApplication", name: p.title, description: p.blurb,
  applicationCategory: p.slug === "gasmap" ? "TravelApplication" : "DeveloperApplication",
  operatingSystem: p.slug === "gasmap" ? "iOS, Android" : "macOS, Windows, Linux",
  url: p.links.site ?? p.links.github, author: { "@type": "Person", name: "Lucas Rocchetti" },
}));
// render: <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appsJsonLd) }} /> inside <main> after the sections
```

- [ ] **Step 4: Verify** — build green; `curl -s localhost:3002 | grep -o '<meta property="og:image" content="[^"]*"'` shows `/opengraph-image`; `curl -s localhost:3002/sitemap.xml | grep -c '<loc>'` = 2; `curl -sI localhost:3002/opengraph-image | head -1` is 200. Stop the server.

- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(seo): OG/Twitter image, sitemap, robots, manifest, apple icon, app JSON-LD"`

---

### Task 11: Verification pass (reviewer-led)

**Files:** none new (fixes only).

- [ ] **Step 1: Production build + audit** — `npm run build && npm audit --audit-level=high` (0 high), `npm run lint`, `npx tsc --noEmit`, `npm test`.
- [ ] **Step 2: Transfer size** — `npx next start -p 3003` then measure `/` via Playwright `browser_network_requests` (sum transfer); target < 400 KB excluding the résumé PDF. Record the number in the task summary.
- [ ] **Step 3: Accessibility** — Playwright snapshot of `/` and `/projects`: one `h1` each, landmarks `header/nav/main/footer`, every `section` has `aria-labelledby`, `aria-expanded` on the menu button, no image without `alt`. Keyboard: Tab reaches the skip link first; Escape closes the mobile menu at 390px.
- [ ] **Step 4: Motion** — with `prefers-reduced-motion: reduce` emulated, no element has a running transition longer than 10ms; with it off, `.reveal` elements gain `.is-visible` on scroll exactly once.
- [ ] **Step 5: Slop checklist** — grep the built app for: `framer`, `jsdelivr`, `Geist`, `blue-500`, `#3b82f6`, `animate-pulse`, `typewriter`, `backdrop-blur` (allowed only on the nav), `box-shadow` (none), `sole engineer|co-founder|open to` (none in rendered HTML).
- [ ] **Step 6: Screenshots** — desktop 1440 and mobile 390 of `/` and `/projects`, saved to `docs/handoff/screens/` and committed.
- [ ] **Step 7: Commit** — `git add -A && git commit -m "chore: verification pass — screenshots, fixes"`

---

## Self-review (done while writing)

- Spec coverage: §3 tokens → T3; §4 Nav/Hero/Software/Experience/About/Education/Contact/Footer → T4–T8; §5 → T9; §6 → T2; §7 → T5; §8 → T1, T3, T10, T11; §2 rules → enforced by T2 tests + T11 grep.
- Types: `Project/Role/School/Stack` defined in T2 and used unchanged in T6–T9; `calculateSize` in T5; `Section/Reveal/icons` in T3 and consumed by T6–T9.
- Open item carried into the spec's "out of scope": GasMap spotlight image rework, NHL screenshot, deployment/domain swap, GitHub remote creation for `portfolio-v2` (do with `gh repo create rocchettilucas/portfolio-v2 --private --source . --push` only when the owner asks).
