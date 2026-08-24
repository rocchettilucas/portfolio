#!/usr/bin/env python
"""ASCII portrait sampler for the v3 terminal portfolio.

Faithful port of gazijarin.com's AsciiPortrait.jsx sampling loop.

Reference algorithm (Gazi-V2 / AsciiPortrait.jsx):
    size      = 400 desktop | 280 tablet | 220 mobile   (square canvas)
    draw      = image aspect-fit into `size`, times 0.8, centred
    fontSize  = 7  (5 when size <= 280)
    colGap    = fontSize * 0.7
    rowGap    = fontSize * 1.1
    for y in 0..size step rowGap:
      for x in 0..size step colGap:
        px = imageData at (x, y)
        if px.a <= 128: continue
        b   = (r + g + b) / (3 * 255)
        ch  = CHARS[floor(b * (len(CHARS) - 1))]
        a   = 0.4 + b * 0.6
        fillStyle = accent @ a ; fillText(ch, x, y)   # alphabetic baseline

Outputs, per (size, variant):
    <stem>.json   particle list  [{"c":char,"x":x,"y":y,"a":alpha}, ...]
    <stem>.txt    plain character grid for a <pre> fallback (alpha dropped)
and per (size, variant, palette):
    <stem>.png    true-size preview, Menlo, per-glyph alpha, on the ground colour

The "tone" variants histogram-match the source luminance to a reference profile.
That reference is baked into the committed gazi_tone_lut.json, so no reference
photo has to live in the repo. Pass --profile <png> to rebuild the LUT from an
image instead, and --save-lut <json> to write the rebuilt LUT back out.
"""
import argparse
import gzip
import json
import math
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))

CHARS = " .:-=+*#%@"          # sparse -> dense, exactly as in AsciiPortrait.jsx
MENLO = ("/System/Library/Fonts/Menlo.ttc", 0)

PALETTES = {
    # name: (ground, accent)
    "P1": ("#131518", "#E6B85C"),
    "P2": ("#0E1B1E", "#7ED4C3"),
    "P3": ("#0E1420", "#8FB8F5"),
    "GZ": ("#0a192f", "#64ffda"),   # Gazi's own colours, calibration reference
    "DR": ("#1a1b26", "#bd93f9"),   # v3 terminal: Dracula ground + purple accent
}

VARIANTS = {
    # name: (gamma, font-size delta, tone)
    #   tone "none" -> use the source luminance as-is (exact Gazi pipeline)
    #   tone "gazi" -> histogram-match the source luminance to the reference
    #                  distribution in gazi_tone_lut.json before sampling, so
    #                  the char histogram lands on the ~85% "." look. Same
    #                  algorithm, normalised input.
    "baseline": (1.0, 0, "none"),
    "gain": (0.8, 0, "none"),
    "big": (1.0, 1, "none"),
    "tone": (1.0, 0, "gazi"),
    "tonebig": (1.0, 1, "gazi"),
}

TONE_LUT_JSON = os.path.join(HERE, "gazi_tone_lut.json")


def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def default_font_size(size):
    """Gazi: 7px, dropping to 5px on the small canvases."""
    return 5 if size <= 280 else 7


def masked_brightness(im):
    """(r+g+b)/(3*255) for every pixel with alpha > 128."""
    a = np.asarray(im.convert("RGBA"))
    m = a[:, :, 3] > 128
    b = a[:, :, :3].astype(np.float32).sum(axis=2) / (3 * 255.0)
    return b, m


def gazi_tone_lut(ref_path, bins=512):
    """Build a `bins`-entry LUT that maps our luminance onto the reference
    photo's luminance distribution (classic histogram matching over the
    alpha-masked region)."""
    rb, rm = masked_brightness(Image.open(ref_path))
    ref = np.sort(rb[rm])
    # target value for each quantile q in [0,1]
    q = np.linspace(0, 1, bins)
    tgt = np.interp(q, np.linspace(0, 1, len(ref)), ref)
    return q, tgt


def load_tone_lut(profile=None, path=TONE_LUT_JSON):
    """The baked LUT by default; rebuilt from `profile` (a PNG) when given."""
    if profile:
        return gazi_tone_lut(profile)
    with open(path) as f:
        d = json.load(f)
    return np.asarray(d["q"], dtype=np.float64), \
        np.asarray(d["tgt"], dtype=np.float64)


def save_tone_lut(lut, path=TONE_LUT_JSON):
    q, tgt = lut
    with open(path, "w") as f:
        json.dump({
            "note": "Histogram-matching LUT for the 'tone' variants: quantile "
                    "q -> target masked luminance. Baked from the reference "
                    "profile photo; rebuild with --profile <png> --save-lut.",
            "bins": len(q),
            "q": [round(float(v), 6) for v in q],
            "tgt": [round(float(v), 6) for v in tgt],
        }, f)
    return path


def apply_gazi_tone(im, lut, strength=1.0):
    """Return a copy of `im` whose masked luminance histogram matches the
    reference distribution held in `lut`.
    Chroma is preserved by scaling RGB about the new luminance.
    `strength` blends between the original luminance (0) and the full match (1);
    values below 1 keep more of the face's own contrast."""
    q, tgt = lut
    a = np.asarray(im.convert("RGBA")).astype(np.float32)
    m = a[:, :, 3] > 128
    b = a[:, :, :3].sum(axis=2) / (3 * 255.0)
    src = np.sort(b[m])
    # our value -> its quantile -> Gazi's value at that quantile
    ranks = np.interp(b, src, np.linspace(0, 1, len(src)))
    newb = np.interp(ranks, q, tgt)
    if strength != 1.0:
        newb = b * (1.0 - strength) + newb * strength
    scale = np.where(b > 1e-4, newb / np.maximum(b, 1e-4), 0.0)[..., None]
    rgb = np.clip(a[:, :, :3] * scale, 0, 255)
    # outside the mask the pixels are transparent anyway; leave them be
    out = a.copy()
    out[:, :, :3] = np.where(m[..., None], rgb, a[:, :, :3])
    return Image.fromarray(out.astype(np.uint8), "RGBA")


def compose(src, size):
    """Aspect-fit `src` into a size x size RGBA canvas at scale 0.8, centred.

    Mirrors ctx.drawImage(img, dx, dy, dw, dh) on a transparent canvas.
    """
    iw, ih = src.size
    scale = min(size / iw, size / ih) * 0.8
    dw, dh = max(1, int(round(iw * scale))), max(1, int(round(ih * scale)))
    dx, dy = int(round((size - dw) / 2)), int(round((size - dh) / 2))
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.paste(src.resize((dw, dh), Image.LANCZOS), (dx, dy))
    return canvas


def sample(canvas, font_size, gamma=1.0, gain=1.0):
    """The AsciiPortrait sampling loop. Returns (particles, grid_rows, stats)."""
    size = canvas.size[0]
    arr = np.asarray(canvas)                      # (H, W, 4) uint8
    col_gap = font_size * 0.7
    row_gap = font_size * 1.1

    particles = []
    rows = []
    hist = {c: 0 for c in CHARS}
    n_rows = int(math.ceil(size / row_gap))
    n_cols = int(math.ceil(size / col_gap))

    for j in range(n_rows):
        y = j * row_gap
        py = min(int(y), size - 1)
        line = []
        for i in range(n_cols):
            x = i * col_gap
            px = min(int(x), size - 1)
            r, g, b, a = (int(v) for v in arr[py, px])
            if a <= 128:                          # Gazi: alpha > 128 only
                line.append(" ")
                continue
            bright = (r + g + b) / (3 * 255.0)
            if gamma != 1.0:
                bright = bright ** gamma
            if gain != 1.0:
                bright = bright * gain
            bright = min(1.0, max(0.0, bright))
            ch = CHARS[int(math.floor(bright * (len(CHARS) - 1)))]
            alpha = 0.4 + bright * 0.6
            line.append(ch)
            hist[ch] += 1
            particles.append({
                "c": ch,
                "x": round(x, 2),
                "y": round(y, 2),
                "a": round(alpha, 3),
            })
        rows.append("".join(line).rstrip())

    # trim fully blank leading/trailing rows for the <pre> version
    while rows and not rows[0].strip():
        rows.pop(0)
    while rows and not rows[-1].strip():
        rows.pop()

    drawn = sum(v for k, v in hist.items() if k != " ")
    stats = {
        "size": size,
        "font_size": font_size,
        "col_gap": round(col_gap, 3),
        "row_gap": round(row_gap, 3),
        "grid": [n_cols, n_rows],
        "particles": len(particles),
        "visible_glyphs": drawn,
        "hist": {k: v for k, v in hist.items() if v},
        "pct": {k: round(100.0 * v / max(1, len(particles)), 1)
                for k, v in hist.items() if v},
    }
    return particles, rows, stats


def render(particles, size, font_size, ground, accent, ss=4):
    """True-size PNG. Supersampled then box-filtered, approximating a retina
    browser render viewed at 1x. Per-glyph alpha, source-over accumulation."""
    W = size * ss
    font = ImageFont.truetype(MENLO[0], font_size * ss, index=MENLO[1])

    # bucket glyphs by alpha so we need only N draw passes
    NB = 24
    buckets = [[] for _ in range(NB)]
    for p in particles:
        if p["c"] == " ":
            continue
        k = min(NB - 1, int(p["a"] * NB))
        buckets[k].append(p)

    acc = np.zeros((W, W), dtype=np.float32)
    for k, items in enumerate(buckets):
        if not items:
            continue
        layer = Image.new("L", (W, W), 0)
        d = ImageDraw.Draw(layer)
        for p in items:
            # Gazi sets ctx.textAlign="center" + ctx.textBaseline="middle"
            # -> PIL anchor "mm"
            d.text((p["x"] * ss, p["y"] * ss), p["c"], font=font, fill=255,
                   anchor="mm")
        cov = np.asarray(layer, dtype=np.float32) / 255.0
        a = np.mean([p["a"] for p in items], dtype=np.float32) * cov
        acc = acc + a * (1.0 - acc)          # source-over

    acc_img = Image.fromarray((np.clip(acc, 0, 1) * 255).astype(np.uint8), "L")
    acc_img = acc_img.resize((size, size), Image.LANCZOS)
    A = np.asarray(acc_img, dtype=np.float32)[..., None] / 255.0

    gr = np.array(hex_rgb(ground), dtype=np.float32)
    ac = np.array(hex_rgb(accent), dtype=np.float32)
    out = gr * (1 - A) + ac * A
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), "RGB")


_TONE_CACHE = {}


def build(src_path, outdir, size, variant, palettes, ss=4, write_data=True,
          lut=None):
    gamma, dfs, tone = VARIANTS[variant]
    fs = default_font_size(size) + dfs
    key = (src_path, tone)
    if key not in _TONE_CACHE:
        im = Image.open(src_path).convert("RGBA")
        if tone == "gazi":
            im = apply_gazi_tone(im, lut if lut is not None else load_tone_lut())
        _TONE_CACHE[key] = im
    src = _TONE_CACHE[key]
    canvas = compose(src, size)
    particles, rows, stats = sample(canvas, fs, gamma=gamma)
    stats["variant"] = variant
    stats["gamma"] = gamma
    stats["tone"] = tone

    os.makedirs(outdir, exist_ok=True)
    stem = f"{variant}_{size}"
    if write_data:
        jpath = os.path.join(outdir, stem + ".json")
        payload = {
            "size": size, "fontSize": fs, "colGap": stats["col_gap"],
            "rowGap": stats["row_gap"], "chars": CHARS,
            "particles": particles,
        }
        raw = json.dumps(payload, separators=(",", ":")).encode()
        with open(jpath, "wb") as f:
            f.write(raw)
        with open(os.path.join(outdir, stem + ".txt"), "w") as f:
            f.write("\n".join(rows) + "\n")
        stats["json_raw"] = len(raw)
        stats["json_gzip"] = len(gzip.compress(raw, 9))

    pngs = {}
    for pname in palettes:
        ground, accent = PALETTES[pname]
        im = render(particles, size, fs, ground, accent, ss=ss)
        p = os.path.join(outdir, f"{stem}_{pname}.png")
        im.save(p)
        pngs[pname] = p
    stats["pngs"] = pngs
    return stats


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default=os.path.join(HERE, "portrait.png"))
    ap.add_argument("--outdir", default=os.path.join(HERE, "out"))
    ap.add_argument("--sizes", default="400,280,220")
    ap.add_argument("--variants", default="baseline,gain,big,tone,tonebig")
    ap.add_argument("--palettes", default="DR")
    ap.add_argument("--ss", type=int, default=4)
    ap.add_argument("--profile", default=None,
                    help="rebuild the tone LUT from this reference PNG "
                         "instead of loading gazi_tone_lut.json")
    ap.add_argument("--save-lut", nargs="?", const=TONE_LUT_JSON, default=None,
                    help="write the LUT built from --profile to this path "
                         f"(default {TONE_LUT_JSON})")
    a = ap.parse_args()

    sizes = [int(s) for s in a.sizes.split(",")]
    variants = a.variants.split(",")
    palettes = a.palettes.split(",")

    lut = None
    if any(VARIANTS[v][2] == "gazi" for v in variants) or a.save_lut:
        lut = load_tone_lut(a.profile)
        if a.save_lut:
            print("wrote", save_tone_lut(lut, a.save_lut))

    all_stats = []
    for v in variants:
        for s in sizes:
            st = build(a.src, a.outdir, s, v, palettes, ss=a.ss, lut=lut)
            all_stats.append(st)
            print(f"{v:9s} {s:3d}px font={st['font_size']}px "
                  f"grid={st['grid'][0]}x{st['grid'][1]} "
                  f"particles={st['particles']:5d} "
                  f"json={st['json_raw']:6d}B gz={st['json_gzip']:5d}B "
                  f"pct={st['pct']}")
    with open(os.path.join(a.outdir, "stats.json"), "w") as f:
        json.dump(all_stats, f, indent=2)


if __name__ == "__main__":
    main()
