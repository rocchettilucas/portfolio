# ASCII portrait pipeline

Regenerates the hero portrait data in `lib/ascii/`. Only needed when the source
photo changes — the generated files are committed, so a normal build never runs
this.

Setup once (see `requirements.txt`; `.venv/` and `out/` are gitignored):

```
python3 -m venv scripts/ascii/.venv && scripts/ascii/.venv/bin/pip install -r scripts/ascii/requirements.txt
```

Then, from the repo root:

```bash
# 1. cutout: public/about/lucas.jpg -> scripts/ascii/portrait.png (1200x1500, 4:5)
scripts/ascii/.venv/bin/python scripts/ascii/cutout3.py

# 2. generate: portrait.png -> scripts/ascii/out/tone_{400,280,220}.{json,txt} + DR previews
scripts/ascii/.venv/bin/python scripts/ascii/gazi_ascii.py --variants tone --sizes 400,280,220 --palettes DR

# 3. copy into the app, then regenerate the <noscript> fallback module
cp scripts/ascii/out/tone_{400,280,220}.json scripts/ascii/out/tone_400.txt lib/ascii/
```

After step 3, rewrite `lib/ascii/tone400.ts` so its `ASCII_TXT` template literal
holds `lib/ascii/tone_400.txt` verbatim (keep the header comment), then run
`npm test` — `tests/ascii-data.test.ts` checks the shape, the char ramp, the
bounds and that `tone400.ts` and `tone_400.txt` still agree.

## Notes

- `cutout3.py --src <path>` overrides the source photo. It keeps only the
  largest connected alpha component, so stray rembg specks cannot drag the
  head-and-shoulders crop off centre. Intermediates land in `out/`.
- The `tone`/`tonebig` variants histogram-match the portrait's luminance to a
  reference distribution baked into `gazi_tone_lut.json`, which is why no
  reference photo lives in the repo. `--profile <png>` rebuilds that LUT from an
  image and `--save-lut` writes it back.
- `--palettes DR` is the v3 terminal palette (ground `#1a1b26`, accent
  `#bd93f9`); previews are only a visual check and are never shipped.
- Keep `lib/ascii/tone_400.json` under 8 KB gzipped (`gzip -c
  lib/ascii/tone_400.json | wc -c`) — it ships to every visitor.
