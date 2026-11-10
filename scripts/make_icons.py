"""Regenerate icons/icon{16,48,128}.png. Usage: python3 scripts/make_icons.py"""
from pathlib import Path

from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "icons"
RED = (230, 33, 23, 255)
WHITE = (255, 255, 255, 255)


def draw(size: int) -> Image.Image:
    scale = 8
    s = size * scale
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    pad = s * 0.06
    d.rounded_rectangle([pad, s * 0.16, s - pad, s * 0.84], radius=s * 0.2, fill=RED)
    d.polygon([(s * 0.40, s * 0.33), (s * 0.40, s * 0.67), (s * 0.68, s * 0.50)], fill=WHITE)
    w = s * 0.09
    d.line([(s * 0.14, s * 0.86), (s * 0.86, s * 0.14)], fill=WHITE, width=int(w * 1.8))
    d.line([(s * 0.14, s * 0.86), (s * 0.86, s * 0.14)], fill=RED, width=int(w))
    return img.resize((size, size), Image.LANCZOS)


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    for size in (16, 48, 128):
        draw(size).save(OUT / f"icon{size}.png")
    print(f"wrote icons to {OUT}")
