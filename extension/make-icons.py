#!/usr/bin/env python3
"""Generate the FullHex extension/store icons. No external assets, no deps but Pillow.

Design: a gold hexagon tile with four arrows pushing outward to the corners
("expand the board to fill the window"), flat, on a warm near-black rounded
square. Drawn once at high resolution and downsampled with LANCZOS so every
size has crisp, anti-aliased edges.

Run:  python3 make-icons.py
Writes icon-16.png, icon-32.png, icon-48.png, icon-128.png to the repo root.
"""
import os

from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))

# Palette
CHARCOAL = (39, 35, 32, 255)    # #272320  warm near-black background
GOLD = (239, 192, 74, 255)      # #EFC04A  the mark

# Geometry in a 128x128 design space.
CORNER_RADIUS = 24              # rounded-square radius (~19%)
STROKE = 6                      # arrow stub thickness

# Pointy-top hexagon, centered at (64, 64), circumradius 30.
HEX = [(64, 34), (89.98, 49), (89.98, 79), (64, 94), (38.02, 79), (38.02, 49)]

# Simplified mark for tiny sizes (16px): a larger hex, no arrows, so it stays
# legible when the arrows would collapse into unreadable corner specks.
HEX_SMALL = [(64, 20), (102.1, 42), (102.1, 86), (64, 108), (25.9, 86), (25.9, 42)]

# Four corner "expand" arrows: (stub_start, stub_end, arrowhead_triangle).
ARROWS = [
    ((41, 41), (25, 25), [(18, 18), (18, 33), (33, 18)]),        # NW
    ((87, 41), (103, 25), [(110, 18), (95, 18), (110, 33)]),     # NE
    ((87, 87), (103, 103), [(110, 110), (110, 95), (95, 110)]),  # SE
    ((41, 87), (25, 103), [(18, 110), (33, 110), (18, 95)]),     # SW
]

SUPERSAMPLE = 8                 # master is 128 * 8 = 1024px
# size -> use the simplified (hex-only) mark? Tiny sizes drop the arrows.
SIZES = {128: False, 48: False, 32: False, 16: True}


def draw_master(scale, simple=False):
    """Render the icon at 128*scale px as RGBA (transparent outside the square)."""
    n = 128 * scale
    img = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    def s(p):
        return (p[0] * scale, p[1] * scale)

    d.rounded_rectangle([0, 0, n - 1, n - 1], radius=CORNER_RADIUS * scale, fill=CHARCOAL)

    if simple:
        d.polygon([s(p) for p in HEX_SMALL], fill=GOLD)
        return img

    d.polygon([s(p) for p in HEX], fill=GOLD)
    w = STROKE * scale
    r = w / 2.0
    for start, end, head in ARROWS:
        a, b = s(start), s(end)
        d.line([a, b], fill=GOLD, width=int(round(w)))
        for c in (a, b):  # round caps
            d.ellipse([c[0] - r, c[1] - r, c[0] + r, c[1] + r], fill=GOLD)
        d.polygon([s(p) for p in head], fill=GOLD)

    return img


def main():
    full = draw_master(SUPERSAMPLE, simple=False)
    simple = draw_master(SUPERSAMPLE, simple=True)
    for sz, use_simple in SIZES.items():
        out = os.path.join(HERE, "icon-%d.png" % sz)
        master = simple if use_simple else full
        master.resize((sz, sz), Image.LANCZOS).save(out)
        print("wrote", os.path.basename(out))


if __name__ == "__main__":
    main()
