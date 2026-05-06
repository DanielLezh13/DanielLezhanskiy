from pathlib import Path
from PIL import Image, ImageDraw


ROOT = Path("/Users/daniel/dev/philosophy")
OUT = ROOT / "assets" / "app-icons"
OUT.mkdir(parents=True, exist_ok=True)


def make_icon(path: Path, accent: tuple[int, int, int], stop: bool = False) -> None:
    size = 1024
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)

    stroke = max(28, size // 32)
    accent_rgba = (*accent, 255)
    muted = (242, 239, 232, 220)
    dark = (17, 17, 15, 230)

    # Soft transparent app tile.
    tile_margin = 96
    draw.rounded_rectangle(
        [tile_margin, tile_margin, size - tile_margin, size - tile_margin],
        radius=190,
        fill=(20, 20, 18, 214),
        outline=(*accent, 145),
        width=8,
    )

    # Glasses lenses.
    left = [215, 390, 475, 610]
    right = [549, 390, 809, 610]
    draw.rounded_rectangle(left, radius=92, outline=muted, width=stroke)
    draw.rounded_rectangle(right, radius=92, outline=muted, width=stroke)
    draw.line([475, 500, 549, 500], fill=muted, width=stroke, joint="curve")

    # Bridge / thought line.
    draw.arc([330, 275, 694, 725], start=205, end=335, fill=accent_rgba, width=stroke // 2)

    # Small brain-like circuit marks inside lenses.
    line_w = stroke // 3
    draw.line([290, 500, 350, 455, 430, 455], fill=accent_rgba, width=line_w)
    draw.ellipse([420, 445, 456, 481], fill=accent_rgba)
    draw.line([594, 455, 674, 455, 734, 500], fill=accent_rgba, width=line_w)
    draw.ellipse([568, 438, 604, 474], fill=accent_rgba)
    draw.ellipse([724, 490, 760, 526], fill=accent_rgba)

    # Center dot: evidence / focus point.
    draw.ellipse([size // 2 - 22, size // 2 - 22, size // 2 + 22, size // 2 + 22], fill=accent_rgba)

    if stop:
      # Stop badge.
      draw.ellipse([676, 208, 844, 376], fill=(218, 58, 58, 245), outline=dark, width=8)
      draw.rounded_rectangle([720, 252, 800, 332], radius=12, fill=(255, 245, 245, 255))

    image.save(path)


make_icon(OUT / "philosophy-icon.png", (214, 190, 136), stop=False)
make_icon(OUT / "philosophy-icon-red.png", (218, 58, 58), stop=True)
