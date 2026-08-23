# Plan: hero/nav restructure (2026-08-23)

Owner decisions (Lucas, 2026-08-23):
- Portrait moves to the LEFT of the hero; text on the right.
- Hero paragraph (verbatim): "I'm a software developer based in Toronto, focused on designing and building full-stack applications. I recently graduated from the University of Toronto with a degree in Computer Science and Information Technology."
- "Lucas" in the h1 is accent-coloured.
- Hero text links (GitHub · LinkedIn · Email) are replaced by ONE boxed `btn-outline` button: mail icon + "Contact me" (mailto).
- Nav: LR logo · About · Selected Work · Contact · [GitHub icon] [LinkedIn icon]. No Résumé anywhere on the site.
- ASCII portrait: hover effect = glyphs near the cursor repel outward and brighten, ease back on leave. Canvas, gated on hover/fine-pointer and reduced-motion. Spec §3/§7 amended accordingly.
- Experience section removed (component, tabs, data, test block, nav link).
- "Software" → "Selected Work" (section id `work`).
- Page order: Hero → About → Selected Work → Education → Contact.
- Contact section: keep "Say hi" email button; remove GitHub/LinkedIn/Résumé text links.

## Work split (disjoint files, concurrent)
- A Hero: `components/Hero.tsx` only.
- B Portrait hover: `components/AsciiPortrait.tsx`, spec doc amendment.
- C Structure: `components/Nav.tsx`, `components/icons.tsx`, `components/Contact.tsx`, `components/Software.tsx`, `app/page.tsx`, delete `components/Experience.tsx` + `ExperienceTabs.tsx`, `lib/data.ts`, `tests/data.test.ts`, `lib/site.ts` (drop resumePath) + `tests/site.test.ts`.

Verification: `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`, Playwright screenshots at 1440 and 390.
