"""Generate on-brand imagery for the Noeti site: dark mesh / node renders.

Run: python3 scripts/gen-images.py
Outputs JPGs into src/assets/.
"""
import math, random, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops

OUT = os.path.join(os.path.dirname(__file__), "..", "src", "assets")
os.makedirs(OUT, exist_ok=True)
SS = 2  # supersample

# Palette
BG_A = (10, 14, 20)
BG_B = (18, 30, 34)
TEAL = (52, 211, 170)
MINT = (140, 240, 210)
AMBER = (255, 190, 90)
WHITE = (240, 246, 244)


def gradient_bg(w, h, a=BG_A, b=BG_B, angle=35, vignette=0.55):
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    t = (x * math.cos(math.radians(angle)) + y * math.sin(math.radians(angle)))
    t = (t - t.min()) / (t.max() - t.min())
    img = np.zeros((h, w, 3), np.float32)
    for i in range(3):
        img[..., i] = a[i] * (1 - t) + b[i] * t
    # vignette
    cx, cy = w / 2, h / 2
    d = np.sqrt(((x - cx) / cx) ** 2 + ((y - cy) / cy) ** 2)
    v = 1 - vignette * np.clip(d - 0.3, 0, 1) ** 1.5
    img *= v[..., None]
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))


def add_noise(img, amount=6):
    arr = np.asarray(img).astype(np.int16)
    n = np.random.normal(0, amount, arr.shape[:2])[..., None]
    arr = np.clip(arr + n, 0, 255).astype(np.uint8)
    return Image.fromarray(arr)


def glow_layer(size, draw_fn, blur):
    layer = Image.new("RGB", size, (0, 0, 0))
    d = ImageDraw.Draw(layer)
    draw_fn(d)
    return layer.filter(ImageFilter.GaussianBlur(blur))


def screen(base, layer):
    return ImageChops.screen(base, layer)


def draw_grid(img, step=80, color=(255, 255, 255), alpha=10):
    w, h = img.size
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for x in range(0, w, step):
        d.line([(x, 0), (x, h)], fill=color + (alpha,), width=1)
    for y in range(0, h, step):
        d.line([(0, y), (w, y)], fill=color + (alpha,), width=1)
    return Image.alpha_composite(img.convert("RGBA"), layer).convert("RGB")


def mesh(img, nodes, links, node_color=TEAL, link_color=TEAL, hub_ids=(), scale=1.0):
    """Draw nodes + links with a glow pass."""
    w, h = img.size

    def links_fn(d):
        for a, b, s in links:
            d.line([nodes[a], nodes[b]], fill=tuple(int(c * s) for c in link_color), width=int(3 * scale))

    def nodes_fn(d):
        for i, (x, y) in enumerate(nodes):
            r = (18 if i in hub_ids else 8) * scale
            d.ellipse([x - r, y - r, x + r, y + r], fill=node_color)

    img = screen(img, glow_layer(img.size, links_fn, 18 * scale))
    img = screen(img, glow_layer(img.size, nodes_fn, 30 * scale))
    # crisp layer
    d = ImageDraw.Draw(img)
    for a, b, s in links:
        c = tuple(int(255 * 0.55 * s + node_color[i] * 0.45 * s) for i, _ in enumerate(node_color))
        d.line([nodes[a], nodes[b]], fill=c, width=int(1.5 * scale))
    for i, (x, y) in enumerate(nodes):
        r = (9 if i in hub_ids else 4) * scale
        d.ellipse([x - r, y - r, x + r, y + r], fill=WHITE)
        r2 = r + 5 * scale
        d.ellipse([x - r2, y - r2, x + r2, y + r2], outline=node_color, width=int(1.5 * scale))
    return img


def random_mesh(w, h, n, seed, k=3, margin=0.08, hubs=1):
    rnd = random.Random(seed)
    pts = [(rnd.uniform(margin, 1 - margin) * w, rnd.uniform(margin, 1 - margin) * h) for _ in range(n)]
    links = []
    for i, p in enumerate(pts):
        dists = sorted(((math.dist(p, q), j) for j, q in enumerate(pts) if j != i))[:k]
        for dd, j in dists:
            if (j, i, None) not in [(a, b, None) for a, b, _ in links]:
                links.append((i, j, max(0.25, 1 - dd / (0.45 * w))))
    hub_ids = tuple(range(hubs))
    return pts, links, hub_ids


def finish(img, name, w, h):
    img = img.resize((w, h), Image.LANCZOS)
    img = add_noise(img, 4)
    img.save(os.path.join(OUT, name), "JPEG", quality=86, optimize=True, progressive=True)
    print("wrote", name)


# ---------- HERO ----------
def hero():
    w, h = 1920 * SS, 1080 * SS
    img = gradient_bg(w, h, (8, 12, 18), (14, 34, 36), angle=25)
    img = draw_grid(img, step=96 * SS, alpha=8)
    pts, links, hubs = random_mesh(w, h, 34, seed=7, k=3, hubs=3)
    img = mesh(img, pts, links, hub_ids=hubs, scale=SS)
    # big soft glow behind right side
    def g(d):
        d.ellipse([w * 0.55, h * 0.1, w * 1.05, h * 0.9], fill=(20, 80, 70))
    img = screen(img, glow_layer(img.size, g, 300 * SS))
    finish(img, "hero.jpg", 1920, 1080)


# ---------- MODEL COVERS ----------
def cover_solo():
    w, h = 1200 * SS, 800 * SS
    img = gradient_bg(w, h, (9, 13, 19), (16, 30, 40), angle=60)
    img = draw_grid(img, step=64 * SS, alpha=7)
    cx, cy = w * 0.5, h * 0.52
    pts = [(cx, cy)]
    rnd = random.Random(3)
    for i in range(6):
        a = i / 6 * math.tau + 0.3
        r = w * 0.22 + rnd.uniform(-30, 30) * SS
        pts.append((cx + math.cos(a) * r, cy + math.sin(a) * r * 0.7))
    links = [(0, i, 0.8) for i in range(1, 7)]
    img = mesh(img, pts, links, hub_ids=(0,), scale=SS * 1.3)
    finish(img, "model-solo.jpg", 1200, 800)


def cover_desk():
    w, h = 1200 * SS, 800 * SS
    img = gradient_bg(w, h, (9, 14, 18), (14, 34, 34), angle=140)
    img = draw_grid(img, step=64 * SS, alpha=7)
    cx, cy = w * 0.5, h * 0.5
    pts = [(cx, cy)]
    for i in range(5):
        a = i / 5 * math.tau - math.pi / 2
        pts.append((cx + math.cos(a) * w * 0.26, cy + math.sin(a) * h * 0.34))
    links = [(0, i, 0.9) for i in range(1, 6)] + [(i, i % 5 + 1, 0.45) for i in range(1, 6)]
    img = mesh(img, pts, links, hub_ids=(0,), scale=SS * 1.2)
    finish(img, "model-desk.jpg", 1200, 800)


def cover_studio():
    w, h = 1200 * SS, 800 * SS
    img = gradient_bg(w, h, (8, 12, 18), (18, 30, 44), angle=20)
    img = draw_grid(img, step=64 * SS, alpha=7)
    pts, links, hubs = random_mesh(w, h, 22, seed=11, k=3, margin=0.1, hubs=2)
    img = mesh(img, pts, links, hub_ids=hubs, scale=SS * 1.1)
    finish(img, "model-studio.jpg", 1200, 800)


# ---------- DETAIL IMAGES ----------
def detail_contours():
    w, h = 1200 * SS, 800 * SS
    img = gradient_bg(w, h, (8, 12, 16), (12, 26, 30), angle=90)
    y, x = np.mgrid[0:h, 0:w].astype(np.float32) / (w)
    f = (np.sin(x * 9 + np.cos(y * 7) * 2) + np.cos(y * 11 + np.sin(x * 5) * 3) + np.sin((x + y) * 6)) / 3
    lines = (np.abs(((f * 9) % 1) - 0.5) < 0.035).astype(np.uint8) * 255
    layer = Image.fromarray(np.stack([lines * 0.22, lines * 0.8, lines * 0.65], -1).astype(np.uint8))
    img = screen(img, layer.filter(ImageFilter.GaussianBlur(1.5 * SS)))
    img = screen(img, layer.filter(ImageFilter.GaussianBlur(12 * SS)).point(lambda p: p * 0.5))
    finish(img, "detail-contours.jpg", 1200, 800)


def detail_traces():
    w, h = 1200 * SS, 800 * SS
    img = gradient_bg(w, h, (9, 12, 17), (14, 28, 32), angle=200)
    img = draw_grid(img, step=40 * SS, alpha=6)
    rnd = random.Random(5)
    step = 40 * SS
    segs = []
    for _ in range(70):
        x, y = rnd.randrange(0, w, step), rnd.randrange(0, h, step)
        pts = [(x, y)]
        for _ in range(rnd.randint(3, 9)):
            dx, dy = rnd.choice([(step, 0), (-step, 0), (0, step), (0, -step), (step, step), (-step, -step)])
            x, y = x + dx * rnd.randint(1, 4), y + dy * rnd.randint(1, 4)
            pts.append((x, y))
        segs.append(pts)

    def fn(d):
        for pts in segs:
            d.line(pts, fill=TEAL, width=3 * SS)
            for p in (pts[0], pts[-1]):
                d.ellipse([p[0] - 6 * SS, p[1] - 6 * SS, p[0] + 6 * SS, p[1] + 6 * SS], fill=MINT)
    img = screen(img, glow_layer(img.size, fn, 14 * SS))
    d = ImageDraw.Draw(img)
    for pts in segs:
        d.line(pts, fill=(120, 200, 180), width=1 * SS)
        for p in (pts[0], pts[-1]):
            d.ellipse([p[0] - 3 * SS, p[1] - 3 * SS, p[0] + 3 * SS, p[1] + 3 * SS], fill=WHITE)
    finish(img, "detail-traces.jpg", 1200, 800)


def detail_hex():
    w, h = 1200 * SS, 800 * SS
    img = gradient_bg(w, h, (8, 12, 18), (16, 30, 40), angle=300)
    r = 46 * SS
    rnd = random.Random(9)
    layer = Image.new("RGB", img.size, (0, 0, 0))
    d = ImageDraw.Draw(layer)
    for row in range(-1, int(h / (r * 1.5)) + 2):
        for col in range(-1, int(w / (r * math.sqrt(3))) + 2):
            cx = col * r * math.sqrt(3) + (r * math.sqrt(3) / 2 if row % 2 else 0)
            cy = row * r * 1.5
            pts = [(cx + r * math.cos(math.radians(60 * i + 30)), cy + r * math.sin(math.radians(60 * i + 30))) for i in range(6)]
            v = rnd.random()
            if v > 0.93:
                d.polygon(pts, fill=(30, 110, 90))
            d.polygon(pts, outline=(40, 90, 80), width=1 * SS)
    img = screen(img, layer)
    img = screen(img, layer.filter(ImageFilter.GaussianBlur(20 * SS)).point(lambda p: p * 0.6))
    finish(img, "detail-hex.jpg", 1200, 800)


def detail_wave():
    w, h = 1200 * SS, 800 * SS
    img = gradient_bg(w, h, (8, 11, 16), (12, 28, 34), angle=70)
    layer = Image.new("RGB", img.size, (0, 0, 0))
    d = ImageDraw.Draw(layer)
    for i in range(48):
        t = i / 47
        pts = []
        for xi in range(0, w + 1, 12 * SS):
            xx = xi / w
            yy = h * (0.15 + 0.7 * t) + math.sin(xx * 7 + t * 5) * 40 * SS * (1 + t) + math.cos(xx * 3 - t * 4) * 30 * SS
            pts.append((xi, yy))
        c = int(60 + 150 * (1 - abs(t - 0.5) * 2))
        d.line(pts, fill=(int(c * 0.25), c, int(c * 0.8)), width=2 * SS)
    img = screen(img, layer.filter(ImageFilter.GaussianBlur(1 * SS)))
    img = screen(img, layer.filter(ImageFilter.GaussianBlur(18 * SS)).point(lambda p: p * 0.5))
    finish(img, "detail-wave.jpg", 1200, 800)


def detail_particles():
    w, h = 1200 * SS, 800 * SS
    img = gradient_bg(w, h, (8, 12, 18), (14, 30, 36), angle=10)
    rnd = random.Random(21)
    def fn(d):
        for _ in range(500):
            x, y = rnd.uniform(0, w), rnd.uniform(0, h)
            r = rnd.choice([1, 1, 2, 2, 3, 5]) * SS
            d.ellipse([x - r, y - r, x + r, y + r], fill=rnd.choice([TEAL, MINT, WHITE, AMBER]))
    layer = glow_layer(img.size, fn, 0)
    img = screen(img, layer.filter(ImageFilter.GaussianBlur(10 * SS)).point(lambda p: p * 0.8))
    img = screen(img, layer)
    finish(img, "detail-particles.jpg", 1200, 800)


def detail_rack():
    w, h = 1200 * SS, 800 * SS
    img = gradient_bg(w, h, (9, 12, 16), (14, 24, 30), angle=180)
    layer = Image.new("RGB", img.size, (0, 0, 0))
    d = ImageDraw.Draw(layer)
    rnd = random.Random(2)
    cols, rows = 14, 9
    bw, bh = w / cols, h / rows
    for r in range(rows):
        for c in range(cols):
            x0, y0 = c * bw + 8 * SS, r * bh + 8 * SS
            x1, y1 = (c + 1) * bw - 8 * SS, (r + 1) * bh - 8 * SS
            d.rounded_rectangle([x0, y0, x1, y1], radius=6 * SS, outline=(36, 60, 60), width=1 * SS)
            on = rnd.random()
            if on > 0.6:
                col = TEAL if on < 0.9 else AMBER
                d.ellipse([x0 + 10 * SS, y0 + 10 * SS, x0 + 18 * SS, y0 + 18 * SS], fill=col)
                d.rectangle([x0 + 26 * SS, y0 + 12 * SS, x0 + 26 * SS + rnd.uniform(0.2, 0.7) * (x1 - x0 - 40 * SS), y0 + 16 * SS], fill=(50, 90, 85))
    img = screen(img, layer.filter(ImageFilter.GaussianBlur(14 * SS)).point(lambda p: p * 0.7))
    img = screen(img, layer)
    finish(img, "detail-rack.jpg", 1200, 800)


if __name__ == "__main__":
    hero(); cover_solo(); cover_desk(); cover_studio()
    detail_contours(); detail_traces(); detail_hex(); detail_wave(); detail_particles(); detail_rack()
