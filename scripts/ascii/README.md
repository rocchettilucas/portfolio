# ASCII portrait pipeline

Regenerates the hero portrait data in `lib/ascii/`. Only needed when the source
photo changes — the generated files are committed, so a normal build never runs
this.

**The shipped files are the `baseline` variant** (the exact Gazi pipeline, no
tone LUT). They keep the historical `tone_*` filenames because
`components/AsciiPortrait.tsx` imports those paths — do not rename them. The
`tone` variants histogram-match onto a front-lit reference; the suit photo is
backlit, so `tone` flattened the face into a silhouette and `baseline` keeps the
brow, eyes, jaw and collar readable.

Setup once (see `requirements.txt`; `.venv/` and `out/` are gitignored):

```
python3 -m venv scripts/ascii/.venv && scripts/ascii/.venv/bin/pip install -r scripts/ascii/requirements.txt
```

Then, from the repo root:

```bash
# 1. cutout: public/about/lucas.jpg -> scripts/ascii/portrait.png (1200x1500, 4:5)
scripts/ascii/.venv/bin/python scripts/ascii/cutout3.py --erode 7

# 2. generate: portrait.png -> scripts/ascii/out/baseline_{400,280,220}.{json,txt} + DR previews
scripts/ascii/.venv/bin/python scripts/ascii/gazi_ascii.py --variants baseline --sizes 400,280,220 --palettes DR --fill 0.92

# 3. copy into the app under the tone_* names the component imports
for s in 400 280 220; do cp scripts/ascii/out/baseline_$s.json lib/ascii/tone_$s.json; done
cp scripts/ascii/out/baseline_400.txt lib/ascii/tone_400.txt
```

After step 3, rewrite `lib/ascii/tone400.ts` so its `ASCII_TXT` template literal
holds `lib/ascii/tone_400.txt` verbatim (keep the header comment), then run
`npm test` — `tests/ascii-data.test.ts` checks the shape, the char ramp, the
bounds and that `tone400.ts` and `tone_400.txt` still agree.

## Notes

- `cutout3.py --src <path>` overrides the source photo. Its `clean_alpha()`
  pass zeroes all sub-threshold alpha, chokes the matte by `--erode` px
  (default 6) and keeps only the largest connected component. The erode is the
  one that matters visually: the mask is inferred at half resolution, upscaled
  and then blurred, which pulls the matte outward over the background, dragging
  a bright rim along the top of the dark suit shoulder into the cutout where it
  samples as stray glyphs. 6px is that boundary uncertainty (~2px from the
  half-res upscale, ~4px from the sigma-2 blur). **The shipped portrait uses 7**
  — at `--fill 0.92` the subject is drawn large enough that 6px still left one
  isolated glyph out at x=338 of 400, and the 7th pixel removes it for the cost
  of 11 of 1187 ink glyphs (the silhouette's bounds do not move).
  Intermediates land in `out/`.
- `--headroom` (default 0.12) is the empty space kept above the hair, as a
  fraction of the face height, and `--fill` (default 0.8 — Gazi's value; the
  shipped portrait uses **0.92**) is how much of the square the aspect-fit image
  covers. Both were loosened for v2: the hero frames the portrait in a box cut
  to the canvas, so Gazi's slack read as a dead strip above the head. Together
  they take the subject from 67% to 85% of the canvas height.
- The `tone`/`tonebig` variants (not shipped, kept for a future front-lit photo)
  histogram-match the portrait's luminance to a reference distribution baked
  into `gazi_tone_lut.json`, which is why no reference photo lives in the repo.
  `--profile <png>` rebuilds that LUT from an image and `--save-lut` writes it
  back.
- `--palettes DR` is the v2 terminal palette (ground `#1a1b26`, accent
  `#7aa2f7`); previews are only a visual check and are never shipped.
- Keep `lib/ascii/tone_400.json` under 8 KB gzipped (`gzip -c
  lib/ascii/tone_400.json | wc -c`) — it ships to every visitor. Currently
  7,783 B. Filling the canvas raised the particle count by ~45%, so the
  sampler now rounds each alpha to 2 dp rather than 3: the value is scaled by
  `ALPHA_GAIN` and painted into an 8-bit channel, where the third decimal is
  worth at most 1.5/255, and it was the payload's main source of entropy.
