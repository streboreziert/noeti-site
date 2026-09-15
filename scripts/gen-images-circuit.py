"""Circuit-flavoured imagery: a PCB render for the hero, scope screens for the plan covers,
and instrument-style detail images. Overwrites the files in src/assets/.

Run: python3 scripts/gen-images-circuit.py
"""
import math, random, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops

OUT = os.path.join(os.path.dirname(__file__), "..", "src", "assets")
SS = 2
BONE = (239, 236, 228)
GOLD = (201, 162, 39)
PHOS = (96, 245, 170)
SIM = (120, 200, 255)
COPPER = (150, 110, 60)
MASK = (18, 24, 20)


def base(w, h, a=(12, 12, 10), b=(22, 24, 18), angle=30, vignette=0.6):
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    t = x * math.cos(math.radians(angle)) + y * math.sin(math.radians(angle))
    t = (t - t.min()) / (t.max() - t.min())
    img = np.zeros((h, w, 3), np.float32)
    for i in range(3):
        img[..., i] = a[i] * (1 - t) + b[i] * t
    cx, cy = w / 2, h / 2
    d = np.sqrt(((x - cx) / cx) ** 2 + ((y - cy) / cy) ** 2)
    img *= (1 - vignette * np.clip(d - 0.35, 0, 1) ** 1.6)[..., None]
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))


def noise(img, amount=4):
    arr = np.asarray(img).astype(np.int16)
    arr = np.clip(arr + np.random.normal(0, amount, arr.shape[:2])[..., None], 0, 255).astype(np.uint8)
    return Image.fromarray(arr)


def glow(img, draw_fn, blur, gain=1.0):
    layer = Image.new("RGB", img.size, (0, 0, 0))
    draw_fn(ImageDraw.Draw(layer))
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    if gain != 1.0:
        layer = layer.point(lambda p: min(255, int(p * gain)))
    return ImageChops.screen(img, layer)


def finish(img, name, w, h, q=86):
    img = img.resize((w, h), Image.LANCZOS)
    img = noise(img, 3)
    img.save(os.path.join(OUT, name), "JPEG", quality=q, optimize=True, progressive=True)
    print("wrote", name)


# ---------------------------------------------------------------- PCB render
def pcb(name="hero.jpg", w=1920, h=1080, seed=4, density=1.0):
    W, H = w * SS, h * SS
    img = base(W, H, (10, 14, 11), (20, 30, 22), angle=20)
    rnd = random.Random(seed)
    g = 24 * SS  # routing grid
    d = ImageDraw.Draw(img)

    # ground fill hatch
    for x in range(0, W, g):
        d.line([(x, 0), (x, H)], fill=(24, 34, 26), width=1)
    for y in range(0, H, g):
        d.line([(0, y), (W, y)], fill=(24, 34, 26), width=1)

    # IC footprints
    ics = []
    for _ in range(int(7 * density)):
        cw, ch = rnd.choice([(10, 10), (14, 8), (8, 14), (6, 6), (18, 12)])
        x0, y0 = rnd.randrange(2, W // g - cw - 2) * g, rnd.randrange(2, H // g - ch - 2) * g
        ics.append((x0, y0, x0 + cw * g, y0 + ch * g))
    for x0, y0, x1, y1 in ics:
        d.rectangle([x0, y0, x1, y1], fill=(14, 16, 14), outline=(60, 62, 56), width=2 * SS)
        # pins
        for x in range(x0 + g, x1, g):
            d.rectangle([x - 4 * SS, y0 - 10 * SS, x + 4 * SS, y0], fill=COPPER)
            d.rectangle([x - 4 * SS, y1, x + 4 * SS, y1 + 10 * SS], fill=COPPER)
        for y in range(y0 + g, y1, g):
            d.rectangle([x0 - 10 * SS, y - 4 * SS, x0, y + 4 * SS], fill=COPPER)
            d.rectangle([x1, y - 4 * SS, x1 + 10 * SS, y + 4 * SS], fill=COPPER)
        d.ellipse([x0 + 6 * SS, y0 + 6 * SS, x0 + 14 * SS, y0 + 14 * SS], outline=(90, 92, 86), width=SS)

    # traces: mostly orthogonal buses with short 45° jogs
    traces = []
    for _ in range(int(70 * density)):
        x, y = rnd.randrange(0, W, g), rnd.randrange(0, H, g)
        horiz = rnd.random() < 0.5
        pts = [(x, y)]
        for _ in range(rnd.randint(2, 5)):
            n = rnd.randint(3, 12) * g
            if horiz:
                x += n * rnd.choice([-1, 1])
            else:
                y += n * rnd.choice([-1, 1])
            pts.append((x, y))
            # 45° jog then continue in the other axis
            jx, jy = rnd.choice([-1, 1]) * g * rnd.randint(1, 2), rnd.choice([-1, 1]) * g * rnd.randint(1, 2)
            x, y = x + jx, y + jy
            pts.append((x, y))
            horiz = not horiz
        # bus: 2-4 parallel copies
        for k in range(rnd.randint(1, 4)):
            off = k * 6 * SS
            traces.append([(px + off, py + off) for px, py in pts])
    for pts in traces:
        d.line(pts, fill=(44, 60, 46), width=int(5 * SS))
        d.line(pts, fill=COPPER, width=int(2.5 * SS))
        for p in (pts[0], pts[-1]):
            r = 6 * SS
            d.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill=COPPER)
            d.ellipse([p[0] - r * 0.4, p[1] - r * 0.4, p[0] + r * 0.4, p[1] + r * 0.4], fill=(12, 12, 10))

    # passives
    for _ in range(int(90 * density)):
        x, y = rnd.randrange(0, W, g), rnd.randrange(0, H, g)
        horiz = rnd.random() < 0.5
        L, T = 14 * SS, 7 * SS
        if horiz:
            d.rectangle([x - L, y - T, x + L, y + T], fill=(28, 30, 28), outline=(70, 72, 66))
            d.rectangle([x - L, y - T, x - L + 6 * SS, y + T], fill=COPPER)
            d.rectangle([x + L - 6 * SS, y - T, x + L, y + T], fill=COPPER)
        else:
            d.rectangle([x - T, y - L, x + T, y + L], fill=(28, 30, 28), outline=(70, 72, 66))
            d.rectangle([x - T, y - L, x + T, y - L + 6 * SS], fill=COPPER)
            d.rectangle([x - T, y + L - 6 * SS, x + T, y + L], fill=COPPER)

    # silkscreen labels
    for i in range(int(50 * density)):
        x, y = rnd.randrange(0, W, g), rnd.randrange(0, H, g)
        d.text((x + 3 * SS, y - 12 * SS), rnd.choice(["R", "C", "U", "J", "Q", "L"]) + str(rnd.randint(1, 48)), fill=(120, 124, 112))

    # a probe point glowing: the measured net
    px, py = W * 0.62, H * 0.46
    def probe(dd):
        dd.ellipse([px - 40 * SS, py - 40 * SS, px + 40 * SS, py + 40 * SS], fill=(40, 120, 80))
    img = glow(img, probe, 70 * SS, 1.2)
    d = ImageDraw.Draw(img)
    d.ellipse([px - 7 * SS, py - 7 * SS, px + 7 * SS, py + 7 * SS], outline=PHOS, width=2 * SS)
    d.ellipse([px - 2 * SS, py - 2 * SS, px + 2 * SS, py + 2 * SS], fill=PHOS)

    # gold warm light from the top-left
    def warm(dd):
        dd.ellipse([-W * 0.2, -H * 0.4, W * 0.5, H * 0.5], fill=(60, 44, 10))
    img = glow(img, warm, 260 * SS, 1.0)
    finish(img, name, w, h)


# ---------------------------------------------------------------- scope screens
def scope(name, fns, w=1200, h=800, seed=1, expected=None, note_hue=PHOS):
    W, H = w * SS, h * SS
    img = base(W, H, (8, 10, 9), (12, 18, 14), angle=90, vignette=0.5)
    d = ImageDraw.Draw(img)
    for i in range(11):
        x = W * i / 10
        d.line([(x, 0), (x, H)], fill=(18, 40, 30) if i != 5 else (26, 60, 44), width=SS)
    for i in range(9):
        y = H * i / 8
        d.line([(0, y), (W, y)], fill=(18, 40, 30) if i != 4 else (26, 60, 44), width=SS)
    for i in range(51):
        x = W * i / 50
        d.line([(x, H / 2 - 4 * SS), (x, H / 2 + 4 * SS)], fill=(26, 60, 44), width=SS)

    def path(fn, n=900):
        return [(W * i / n, H / 2 - fn(i / n) * H / 2 * 0.8) for i in range(n + 1)]

    if expected is not None:
        pts = path(expected)
        for i in range(0, len(pts) - 8, 16):
            d.line(pts[i:i + 8], fill=GOLD, width=int(1.5 * SS))
    for fn, col, wgt in fns:
        pts = path(fn)
        def tr(dd, pts=pts, col=col, wgt=wgt):
            dd.line(pts, fill=col, width=int(wgt * 4 * SS))
        img = glow(img, tr, 16 * SS, 0.9)
        ImageDraw.Draw(img).line(pts, fill=tuple(min(255, c + 60) for c in col), width=int(wgt * 1.6 * SS))
    finish(img, name, w, h)


TAU = math.tau
sq = lambda c: (lambda t: 1 if math.sin(TAU * c * t) >= 0 else -1)
def rc(c, tau):
    def f(t):
        period = 1 / c; half = period / 2
        ph = t % period; k = int(ph // half); loc = ph - k * half
        target = 1 if k == 0 else -1
        start = -target * math.tanh(half / (2 * tau))
        return target + (start - target) * math.exp(-loc / tau)
    return f
def ring(c):
    def f(t):
        period = 1 / c; half = period / 2
        ph = t % period; k = int(ph // half); loc = ph - k * half
        target = 1 if k == 0 else -1
        return target * (1 + 0.5 * math.exp(-loc / (half * 0.2)) * math.cos(TAU * loc * c * 14))
    return f
sine = lambda c, a=1: (lambda t: a * math.sin(TAU * c * t))
clip = lambda f, lo, hi: (lambda t: max(lo, min(hi, f(t))))


def eye(name, w=1200, h=800, seed=3):
    W, H = w * SS, h * SS
    img = base(W, H, (8, 10, 9), (12, 18, 14), angle=90)
    rnd = random.Random(seed)
    d = ImageDraw.Draw(img)
    for i in range(11):
        d.line([(W * i / 10, 0), (W * i / 10, H)], fill=(18, 40, 30), width=SS)
    for i in range(9):
        d.line([(0, H * i / 8), (W, H * i / 8)], fill=(18, 40, 30), width=SS)
    layer = Image.new("RGB", img.size, (0, 0, 0))
    ld = ImageDraw.Draw(layer)
    for _ in range(140):
        a, b = rnd.choice([-1, 1]), rnd.choice([-1, 1])
        jit = rnd.uniform(-0.06, 0.06)
        pts = []
        for i in range(0, 401):
            t = i / 400
            s = 1 / (1 + math.exp(-(t - 0.5 + jit) * 30))
            v = a + (b - a) * s + rnd.uniform(-0.02, 0.02)
            pts.append((W * t, H / 2 - v * H / 2 * 0.6))
        ld.line(pts, fill=(30, 90, 60), width=int(1.2 * SS))
    img = ImageChops.screen(img, layer.filter(ImageFilter.GaussianBlur(3 * SS)))
    img = ImageChops.screen(img, layer.point(lambda p: int(p * 0.9)))
    finish(img, name, w, h)


def fft(name, w=1200, h=800, seed=8):
    W, H = w * SS, h * SS
    img = base(W, H, (8, 10, 9), (12, 18, 14), angle=90)
    rnd = random.Random(seed)
    d = ImageDraw.Draw(img)
    for i in range(9):
        d.line([(0, H * i / 8), (W, H * i / 8)], fill=(18, 40, 30), width=SS)
    n = 160
    bw = W / n
    layer = Image.new("RGB", img.size, (0, 0, 0))
    ld = ImageDraw.Draw(layer)
    for i in range(n):
        f = i / n
        v = 0.08 + 0.1 * rnd.random() + 0.75 * math.exp(-((f - 0.12) ** 2) / 0.0006) + 0.4 * math.exp(-((f - 0.36) ** 2) / 0.0004) + 0.25 * math.exp(-((f - 0.6) ** 2) / 0.0004)
        v = min(0.95, v)
        col = GOLD if 0.33 < f < 0.39 else PHOS
        ld.rectangle([i * bw + SS, H * 0.9 - v * H * 0.8, (i + 1) * bw - SS, H * 0.9], fill=col)
    img = ImageChops.screen(img, layer.filter(ImageFilter.GaussianBlur(14 * SS)).point(lambda p: int(p * 0.6)))
    img = ImageChops.screen(img, layer)
    finish(img, name, w, h)


if __name__ == "__main__":
    pcb("hero.jpg", 1920, 1080, seed=4)
    scope("model-solo.jpg", [(rc(3, 0.05), PHOS, 1.0)], expected=sq(3), seed=1)
    scope("model-desk.jpg", [(ring(2.5), PHOS, 1.0), (lambda t: 0.5 * math.sin(TAU * 2 * t) - 0.55, SIM, 0.7)], expected=sq(2.5), seed=2)
    scope("model-studio.jpg", [(clip(sine(2, 0.8), -0.1, 1), PHOS, 1.0), (lambda t: 0.35 + 0.25 * (((t * 4) % 1) - 0.5), GOLD, 0.6), (lambda t: -0.6 + 0.15 * math.sin(TAU * 12 * t), SIM, 0.5)], seed=3)
    scope("detail-wave.jpg", [(rc(3, 0.16), PHOS, 1.0)], expected=sq(3), seed=5)
    eye("detail-particles.jpg")
    fft("detail-hex.jpg")
    pcb("detail-rack.jpg", 1200, 800, seed=9, density=0.6)
