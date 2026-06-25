from pathlib import Path
import sys

from PIL import Image


PROP_NAMES = [
    "floor-a", "floor-b", "wall", "box",
    "bomb", "explosion", "orb-energy", "orb-speed",
    "orb-range", "orb-bomb", "orb-shield", "orb-core",
]


def fit_asset(image, size, padding=2):
    alpha = image.getchannel("A")
    bounds = alpha.getbbox()
    if not bounds:
        return Image.new("RGBA", size, (0, 0, 0, 0))
    image = image.crop(bounds)
    max_width = size[0] - padding * 2
    max_height = size[1] - padding * 2
    image.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    x = (size[0] - image.width) // 2
    y = size[1] - padding - image.height
    canvas.alpha_composite(image, (x, y))
    return canvas


def slice_grid(source_path, output_dir, prefix, columns, rows, names, sizes, inset=0):
    source = Image.open(source_path).convert("RGBA")
    for index, name in enumerate(names):
        col = index % columns
        row = index // columns
        left = round(source.width * col / columns)
        right = round(source.width * (col + 1) / columns)
        top = round(source.height * row / rows)
        bottom = round(source.height * (row + 1) / rows)
        asset = fit_asset(source.crop((left + inset, top + inset, right - inset, bottom - inset)), sizes.get(name, (40, 40)))
        asset.save(output_dir / f"{prefix}-{name}.png", optimize=True)


def main():
    if len(sys.argv) == 4 and sys.argv[1] == "fit":
        source = Image.open(sys.argv[2]).convert("RGBA")
        fit_asset(source, (56, 56), padding=2).save(sys.argv[3], optimize=True)
        return
    if len(sys.argv) != 5:
        raise SystemExit("usage: slice-theme-assets.py <props-alpha> <enemies-alpha> <output-dir> <prefix>")
    props_path, enemies_path, output_dir, prefix = sys.argv[1:]
    output = Path(output_dir)
    output.mkdir(parents=True, exist_ok=True)
    sizes = {name: (40, 40) for name in PROP_NAMES}
    sizes["explosion"] = (56, 56)
    slice_grid(props_path, output, prefix, 4, 3, PROP_NAMES, sizes)
    slice_grid(enemies_path, output, prefix, 3, 1, ["enemy-0", "enemy-1", "enemy-2"], {
        "enemy-0": (44, 44), "enemy-1": (44, 44), "enemy-2": (44, 44),
    }, inset=6)


if __name__ == "__main__":
    main()
