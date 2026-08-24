#!/usr/bin/env python
"""EXIF-correct load -> rembg cutout -> 4:5 head+shoulders crop.

Source defaults to public/about/lucas.jpg (the suit photo). Outputs
portrait.png (4:5 crop, 1200x1500 RGBA) next to this script -- that file is
committed and is the source of truth for gazi_ascii.py. Intermediates
(cutout_full.png, portrait_on_{light,dark}.png) go to --outdir, which is
gitignored.
"""
import argparse
import os

import numpy as np
from PIL import Image, ImageOps, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_SRC = os.path.normpath(
    os.path.join(HERE, "..", "..", "public", "about", "lucas.jpg"))


def largest_component(alpha, thresh=100):
    """Keep only the biggest blob of alpha > thresh; zero the rest.

    rembg occasionally leaves specks (a hand at the frame edge, background
    texture read as subject). The face anchor and the crop maths both key off
    the alpha bbox, so one stray speck would drag the crop off the head.
    """
    from scipy import ndimage
    m = alpha > thresh
    lab, n = ndimage.label(m)
    if n <= 1:
        print(f"components: {n} (no pruning needed)")
        return alpha
    sizes = ndimage.sum(m, lab, range(1, n + 1))
    keep = int(np.argmax(sizes)) + 1
    print(f"components: {n}, keeping #{keep} "
          f"({int(sizes[keep - 1])}px of {int(sizes.sum())}px)")
    out = alpha.copy()
    out[lab != keep] = 0
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default=DEFAULT_SRC)
    ap.add_argument("--out", default=os.path.join(HERE, "portrait.png"))
    ap.add_argument("--outdir", default=os.path.join(HERE, "out"))
    ap.add_argument("--model", default="u2net_human_seg")
    a = ap.parse_args()
    os.makedirs(a.outdir, exist_ok=True)

    raw = Image.open(a.src)
    print("src", a.src)
    print("raw size", raw.size, "exif orientation", raw.getexif().get(274))
    img = ImageOps.exif_transpose(raw).convert("RGB")
    print("upright size", img.size)

    from rembg import remove, new_session
    sess = new_session(a.model)
    small = img.resize((img.width // 2, img.height // 2), Image.LANCZOS)
    cut_s = remove(small, session=sess, post_process_mask=True).convert("RGBA")
    mask = Image.fromarray(np.asarray(cut_s)[:, :, 3]).resize(img.size, Image.LANCZOS)
    mask = mask.filter(ImageFilter.GaussianBlur(2))
    cut = img.convert("RGBA")
    arr = np.asarray(cut).copy()
    arr[:, :, 3] = largest_component(np.asarray(mask))
    cut = Image.fromarray(arr)
    cut.save(os.path.join(a.outdir, "cutout_full.png"))

    alpha = np.asarray(cut)[:, :, 3]
    W, H = cut.size
    m = alpha > 100
    rows = np.where(m.sum(axis=1) > 8)[0]
    cols = np.where(m.sum(axis=0) > 8)[0]
    top, bot = int(rows.min()), int(rows.max())
    print("subject rows", top, bot, "cols", int(cols.min()), int(cols.max()))

    # ---- skin-tone face anchor ----
    rgb = np.asarray(img).astype(np.float32)
    R, G, B = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    Y = 0.299 * R + 0.587 * G + 0.114 * B
    Cb = 128 - 0.168736 * R - 0.331264 * G + 0.5 * B
    Cr = 128 + 0.5 * R - 0.418688 * G - 0.081312 * B
    skin = m & (Cb > 77) & (Cb < 130) & (Cr > 135) & (Cr < 180) & (Y > 60)
    band = np.zeros_like(skin)
    band[top:top + int((bot - top) * 0.55)] = True
    skin = skin & band
    from scipy import ndimage
    skin = ndimage.binary_opening(skin, np.ones((9, 9)))
    lab, n = ndimage.label(skin)
    sizes = ndimage.sum(skin, lab, range(1, n + 1))
    k = int(np.argmax(sizes)) + 1
    ys, xs = np.where(lab == k)
    fx0, fx1, fy0, fy1 = xs.min(), xs.max(), ys.min(), ys.max()
    fcx = (fx0 + fx1) // 2
    face_h = fy1 - fy0
    print(f"face bbox x[{fx0},{fx1}] y[{fy0},{fy1}] cx={fcx} h={face_h}")

    # ---- 4:5 crop: head + shoulders, a little headroom ----
    colband = m[:, max(0, fcx - face_h // 2): fcx + face_h // 2]
    hair_top = int(np.where(colband.sum(axis=1) > 5)[0].min())
    headroom = int(face_h * 0.26)
    y0 = max(0, hair_top - headroom)
    ch = int(face_h * 2.00)   # head + shoulders; tuned against Gazi coverage
    y1 = min(H, y0 + ch)
    ch = y1 - y0
    cw = int(round(ch * 0.8))          # 4:5
    if cw > W:                          # never overflow the frame into transparency
        cw = W
        ch = int(round(cw / 0.8))
        y1 = min(H, y0 + ch)
        y0 = max(0, y1 - ch)
        ch = y1 - y0
        cw = int(round(ch * 0.8))
    x0 = fcx - cw // 2
    x0 = max(0, min(x0, W - cw))
    x1 = x0 + cw
    box = (x0, y0, x1, y1)
    print("crop box", box, "->", (x1 - x0, y1 - y0), "ratio", (x1 - x0) / (y1 - y0))
    c = cut.crop(box)
    c = c.resize((1200, 1500), Image.LANCZOS)
    c.save(a.out)
    for name, bg in (("light", (247, 249, 248)), ("dark", (26, 27, 38))):
        p = Image.new("RGB", c.size, bg)
        p.paste(c, (0, 0), c)
        p.save(os.path.join(a.outdir, f"portrait_on_{name}.png"))
    print("wrote", a.out, c.size)


if __name__ == "__main__":
    main()
