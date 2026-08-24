# lucasrocchetti.com v2 — Terminal design spec

Approved 2026-08-24 (plan `synthetic-popping-pebble`). Supersedes the visual sections of the 2026-08-22 draft (`2026-08-22-portfolio-v2-design.md`); that draft's §2 hard rules, §6 data layer, §7 ASCII pipeline and §8 engineering targets still bind.

## Context

The 2026-08-22 draft design (navy/aqua, Gazi-style) was rejected in favour of a **terminal-themed** portfolio carrying the same section content. References: kuber.studio (interactive prompt), Clifolio Framer template (styled sectioned page, `$ cat …` headings, boxed cards, top/bottom status bars). Outcome: a clean, unique single-page site that reads as a terminal without being a green-screen cliché, plus an all-time visitor counter.

## Decisions locked with Lucas (2026-08-24)

| Topic | Decision |
|---|---|
| Interaction | **Hybrid** — scrollable sectioned page styled as a terminal + hidden command palette (`/` primary, `~` alias; `>_` button on touch). Nothing gated behind typing. |
| Palette | **Dracula, disciplined.** Purple `#bd93f9` is the ONE accent; pink `#ff79c6` only for the `$` glyph + active nav; cyan `#8be9fd` only for links; green `#50fa7b` only for the status dot. Variant A ground `#1a1b26` ships; Variant B ground `#16161e` + accent `#c9a6ff` stays in the CSS block as a one-block swap. |
| Repo | `portfolio-v2`. The data layer, ASCII pipeline, tests, SEO, security headers and JSON-LD carry over from the 2026-08-22 draft; the UI layer is new. |
| Font | JetBrains Mono (next/font/google, 400/700) for everything. Body 15px/1.6. |
| Chrome | ONE frame: fixed 40px top bar (LR logo 20px · `lucas@portfolio:~$` · nav · `press / for commands`) and fixed 40px bottom bar (status dot · `lucasrocchetti.com` · © · `v2.0.0` · `visitors: N` · GitHub/LinkedIn). Content column max 1040px with 1px side borders ≥1040px. **No macOS traffic lights.** |
| Hero | figlet banner `LUCAS` / `ROCCHETTI` (accent, build-time generated) + `$ whoami` box (Name / Based in: Toronto, Canada / Role: Software Engineer / one-line lede). Right: ASCII portrait in a box titled `~/lucas.jpg`. No buttons in hero. |
| ASCII portrait | Generated from the suit photo `public/about/lucas.jpg` (rembg cutout, largest-component mask, head+shoulders), ` .:-=+*#%@` glyphs, purple tint, cursor-repel hover. About is text-only. |
| Sections | Hero → About (`$ cat ~/about.md`) → Projects (`$ ls ~/projects`, all 6, GasMap featured first) → Experience (`$ cat ~/experience.log`, log list) → Skills (`$ cat ~/.skills`, 6 core, icons, no dots) → Education (`$ ls ~/education`) → Contact (`$ mail lucas`). **No `/projects` route — the site is one page.** |
| Palette commands | help, about, projects, experience, skills, education, contact, github, linkedin, whoami, clear. Tab completion, Esc, `command not found: x`. No easter eggs. |
| Résumé | No link/command on site. **PDF stays in `public/`** (do NOT delete). |
| Memoji | Dropped. |
| Visitor counter | Upstash for Redis (Vercel Marketplace). `POST /api/visit`: INCR once per browser/24h via httpOnly cookie; bottom bar shows `visitors: 1,204`; hides itself if env missing; never breaks the build. Marketplace install and env wiring is an owner step. |
| Still-binding content rules | Dark only; no self-promo role labels; no "open to work"; GasMap confidentiality (product facts only, never fetch its API); one sentence per project; banned: particle bg, typewriter body text, tilt cards, glassmorphism, gradient text, blurred blobs, box-shadows, uppercase-tracked eyebrows, Geist, blue-500. The `BANNED` regex in `tests/data.test.ts` enforces the text half of this. |
| Muted contrast | `#6272a4` is 3.6:1 on `#1a1b26`, so it carries only box titles and hints; dates, tech lists and other meta text use `--muted-strong: #8b98c9`. |

## Design tokens (`app/globals.css`, one block)

```css
:root {
  --bg:#1a1b26; --fg:#f8f8f2;
  --muted:#6272a4; --muted-strong:#8b98c9; --border:rgba(248,248,242,.12);
  --accent:#bd93f9; --accent-rgb:189 147 249; --accent-tint:rgba(189,147,249,.10);
  --pink:#ff79c6; --cyan:#8be9fd; --green:#50fa7b; --selection:rgba(189,147,249,.25);
  /* Variant B (swap): --bg:#16161e; --accent:#c9a6ff; --accent-rgb:201 166 255; */
}
```
Base: `body` mono 15px/1.6 bg/fg; `a { color: var(--cyan) }`; `:focus-visible` 2px accent; `[id]{scroll-margin-top:56px}`; radius ≤ 4px (`.tbox`); no shadow/blur/gradient. Reduced-motion kills caret blink + smooth scroll.

## Amendments made during the build (controller rulings)

- Bottom bar shows `● lucasrocchetti.com` (green dot = site status), never "available" — the no-availability rule beats the plan text.
- Nav strip / short prompt / `>_` button breakpoint is 860px (full nav clipped 768–840px). Nav anchors are `/#id` off the home route.
- Banner uses figlet **"Standard"** (ASCII-only, 53 cols) in JetBrains Mono, cap 16px; "ANSI Shadow" block glyphs seamed in every fallback mono.
- ASCII portrait ships the **`baseline`** sampler variant (not `tone`) under the `tone_*` filenames; `--fill 0.92`, `--headroom 0.12`, `--erode 7`, alpha rounded to 2 dp (gzip ≤ 8 KB). The Gazi tone LUT is baked in `scripts/ascii/gazi_tone_lut.json` for regeneration.
- Heading invariant: 1 `h1` (hero banner) + 6 `h2` (one per section).
- OG card font: `@fontsource/jetbrains-mono` WOFF read at build time in the nodejs OG route; no binary committed.
- `getRedis()` never throws (malformed URL → null); env read per call; `||` fallback so empty `UPSTASH_*` falls through to `KV_*`.
- Owner step still pending: `vercel link` → `vercel integration add upstash/upstash-kv` → `vercel env pull .env.development.local`; until then the counter hides itself.
- `POST /api/visit` is unauthenticated and unthrottled by design at launch; a Vercel WAF rate-limit rule on `/api/visit` is the recommended owner step.
- Hero flips to two columns at 900px (not 768) so the text column never drops below ~408px (measured at a 900px layout width).
