from PIL import Image, ImageDraw
import math

LAKE = (138, 108, 176)   # 青莲紫
LILAC = (201, 155, 181)  # 胭脂粉
OUT = "C:/Users/Lenovo/WorkBuddy/2026-07-24-21-08-06/workspace/assets"

def gradient(size):
    img = Image.new('RGBA', (size, size))
    px = img.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * (size - 1))
            r = int(LAKE[0] + (LILAC[0] - LAKE[0]) * t)
            g = int(LAKE[1] + (LILAC[1] - LAKE[1]) * t)
            b = int(LAKE[2] + (LILAC[2] - LAKE[2]) * t)
            px[x, y] = (r, g, b, 255)
    return img

def rounded_mask(size, radius):
    m = Image.new('L', (size, size), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    return m

def sparkle(size, cx, cy, R, r, alpha=235):
    img = Image.new('RGBA', (size, size), 0)
    d = ImageDraw.Draw(img)
    pts = []
    for i in range(8):
        ang = math.pi / 2 * i / 2 - math.pi / 2
        rad = R if i % 2 == 0 else r
        pts.append((cx + rad * math.cos(ang), cy + rad * math.sin(ang)))
    d.polygon(pts, fill=(255, 255, 255, alpha))
    return img

def make_rounded(size):
    base = gradient(size)
    base.putalpha(rounded_mask(size, int(size * 0.22)))
    base = Image.alpha_composite(base, sparkle(size, size // 2, size // 2, int(size * 0.30), int(size * 0.11)))
    return base

def make_maskable(size):
    base = gradient(size)
    base = Image.alpha_composite(base, sparkle(size, size // 2, size // 2, int(size * 0.21), int(size * 0.082)))
    return base

make_rounded(192).save(OUT + "/icon-192.png")
make_rounded(512).save(OUT + "/icon-512.png")
make_maskable(512).save(OUT + "/icon-maskable-512.png")
print("icons generated")
