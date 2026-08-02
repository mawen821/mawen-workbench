# -*- coding: utf-8 -*-
import os

OUT = "C:/Users/Lenovo/WorkBuddy/2026-07-24-21-08-06/workspace/assets/board-icons"
os.makedirs(OUT, exist_ok=True)

def mix(c, t=0.78):
    return tuple(round(ch + (255 - ch) * t) for ch in c)

def hexc(c):
    return "#%02X%02X%02X" % c

# 国风色族
INK    = (123, 155, 196)   # 黛蓝
ROUGE  = (201, 155, 181)   # 胭脂粉
LOTUS  = (138, 108, 176)   # 青莲紫
LOTUS2 = (155, 123, 192)   # 浅青莲
BAMBOO = (127, 176, 154)   # 竹青
OCHRE  = (217, 179, 107)   # 赭金
VERM   = (200, 85, 61)     # 朱砂
VERM2  = (217, 139, 123)   # 浅朱

# (name, color, body_fmt, detail_fmt)
ICONS = [
    ("overview", INK,
     '<rect x="11" y="11" width="11" height="11" rx="3"/><rect x="26" y="11" width="11" height="11" rx="3"/>'
     '<rect x="11" y="26" width="11" height="11" rx="3"/><rect x="26" y="26" width="11" height="11" rx="3"/>',
     ''),

    ("checkin", VERM2,
     '<rect x="10" y="11" width="28" height="27" rx="4"/><circle cx="18" cy="11" r="2.4"/><circle cx="30" cy="11" r="2.4"/>',
     '<path d="M17 25 L21.5 29.5 L31 19" fill="none" stroke="{T}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>'),

    ("ledger", ROUGE,
     '<ellipse cx="24" cy="27" rx="14" ry="10.5"/><ellipse cx="35" cy="26" rx="4.5" ry="5.5"/>'
     '<path d="M16 16 q-2 -7 4 -7 q3 0 3 5 z"/><rect x="13" y="35" width="4" height="5" rx="2"/><rect x="31" y="35" width="4" height="5" rx="2"/>',
     '<circle cx="36" cy="24" r="1.6" fill="{T}"/><path d="M33 23 h4" stroke="{T}" stroke-width="2" stroke-linecap="round"/>'
     '<circle cx="18" cy="26" r="1.4" fill="{T}"/>'),

    ("review", LOTUS,
     '<rect x="11" y="9" width="22" height="30" rx="4"/>',
     '<g stroke="{T}" stroke-width="2" stroke-linecap="round" fill="none"><path d="M15 16 h14"/><path d="M15 22 h14"/><path d="M15 28 h9"/></g>'
     '<path d="M31 14 l4 10 -3 1 -4 -10 z" fill="{T}"/>'),

    ("sport", BAMBOO,
     '<path d="M9 33 Q9 22 20 22 L30 22 Q39 22 39 30 L39 33 Q39 35 35 35 L13 35 Q9 35 9 33 Z"/>',
     '<path d="M9 33 L39 33 L39 35 Q39 37 35 37 L13 37 Q9 37 9 35 Z" fill="{T}"/>'
     '<g stroke="{T}" stroke-width="1.8" stroke-linecap="round" fill="none"><path d="M22 24 l4 4"/><path d="M27 24 l4 4"/></g>'),

    ("english", LOTUS2,
     '<path d="M11 11 h26 a5 5 0 0 1 5 5 v13 a5 5 0 0 1 -5 5 H22 l-7 6 v-6 h-4 a5 5 0 0 1 -5 -5 V16 a5 5 0 0 1 5 -5 z"/>',
     '<text x="24" y="26" font-family="Arial, sans-serif" font-size="13" font-weight="700" text-anchor="middle" fill="{T}">abc</text>'),

    ("finance", OCHRE,
     '<circle cx="24" cy="24" r="14"/><circle cx="24" cy="24" r="11" fill="none" stroke="{T}" stroke-width="1.6"/>',
     '<text x="24" y="30" font-family="Arial, sans-serif" font-size="16" font-weight="700" text-anchor="middle" fill="{T}">¥</text>'),

    ("news", INK,
     '<rect x="10" y="9" width="28" height="30" rx="4"/>',
     '<rect x="13" y="12" width="22" height="6" rx="1.5" fill="{T}"/><rect x="13" y="21" width="9" height="9" rx="1.5" fill="{T}"/>'
     '<g stroke="{T}" stroke-width="2" stroke-linecap="round" fill="none"><path d="M25 22 h9"/><path d="M25 27 h9"/><path d="M13 33 h22"/><path d="M13 37 h14"/></g>'),

    ("book", BAMBOO,
     '<path d="M24 13 C18 9 10 9 8 13 L8 35 C10 31 18 31 24 35 Z"/>'
     '<path d="M24 13 C30 9 38 9 40 13 L40 35 C38 31 30 31 24 35 Z"/>',
     '<path d="M24 13 V35" stroke="{T}" stroke-width="1.6" fill="none"/>'
     '<g stroke="{T}" stroke-width="1.4" stroke-linecap="round" fill="none"><path d="M11 18 h10"/><path d="M11 23 h10"/><path d="M27 18 h10"/><path d="M27 23 h10"/></g>'),

    ("zimeiti-pet", ROUGE,
     '<ellipse cx="24" cy="29" rx="9" ry="8"/><circle cx="14" cy="18" r="4"/><circle cx="22" cy="14" r="4"/>'
     '<circle cx="31" cy="15" r="4"/><circle cx="37" cy="21" r="3.6"/>',
     '<circle cx="21" cy="27" r="1.6" fill="{T}"/><circle cx="27" cy="27" r="1.6" fill="{T}"/>'),

    ("zimeiti-goods", VERM2,
     '<rect x="13" y="20" width="22" height="19" rx="3"/><rect x="10" y="14" width="28" height="8" rx="2.5"/>',
     '<rect x="22" y="14" width="4" height="25" fill="{T}"/>'
     '<path d="M24 14 q-7 -8 -11 -2 q-2 4 4 5 z" fill="{T}"/><path d="M24 14 q7 -8 11 -2 q2 4 -4 5 z" fill="{T}"/>'),

    ("ai", LOTUS,
     '<rect x="13" y="14" width="22" height="18" rx="6"/><rect x="8" y="19" width="5" height="8" rx="2.5"/>'
     '<rect x="35" y="19" width="5" height="8" rx="2.5"/><rect x="22.5" y="8" width="3" height="6" rx="1.5"/><circle cx="24" cy="7" r="2.4"/>',
     '<circle cx="20" cy="23" r="2.4" fill="{T}"/><circle cx="28" cy="23" r="2.4" fill="{T}"/>'
     '<path d="M20 29 h8" stroke="{T}" stroke-width="2" fill="none" stroke-linecap="round"/>'),

    ("common", OCHRE,
     '<path d="M24 9 C16 9 12 15 12 21 C12 26 15 29 18 31 L18 34 L30 34 L30 31 C33 29 36 26 36 21 C36 15 32 9 24 9 Z"/>'
     '<rect x="19" y="34" width="10" height="5" rx="2"/>',
     '<path d="M19 22 q5 -5 10 0" fill="none" stroke="{T}" stroke-width="2"/>'
     '<path d="M24 19 v8" stroke="{T}" stroke-width="2" fill="none" stroke-linecap="round"/>'),

    ("shenlun", VERM,
     '<rect x="13" y="11" width="22" height="22" rx="4"/>',
     '<text x="24" y="28" font-family="KaiTi, STKaiti, SimSun, serif" font-size="15" font-weight="700" text-anchor="middle" fill="{T}">政</text>'),

    ("search", INK,
     '<circle cx="21" cy="21" r="11"/><rect x="29" y="29" width="13" height="5.5" rx="2.75" transform="rotate(45 35.5 31.5)"/>',
     '<path d="M16 17 a6 6 0 0 1 8 -2" fill="none" stroke="{T}" stroke-width="2.4" stroke-linecap="round"/>'),

    ("misc", LOTUS2,
     '<path d="M24 8 C25 18 30 23 40 24 C30 25 25 30 24 40 C23 30 18 25 8 24 C18 23 23 18 24 8 Z"/>',
     '<circle cx="14" cy="14" r="2" fill="{T}"/><circle cx="36" cy="33" r="2" fill="{T}"/>'
     '<path d="M40 12 c.4 2 1.6 3.6 3.6 4 c-2 .4 -3.2 2 -3.6 4 c-.4 -2 -1.6 -3.6 -3.6 -4 c2 -.4 3.2 -2 3.6 -4 z" fill="{T}"/>'),

    ("skill", BAMBOO,
     '<path d="M24 13 L41 22 L24 31 L7 22 Z"/><rect x="18" y="31" width="12" height="5" rx="2"/>',
     '<path d="M41 22 v8" stroke="{T}" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="41" cy="31" r="2" fill="{T}"/>'
     '<circle cx="24" cy="13" r="2" fill="{T}"/>'),

    ("tenmin", ROUGE,
     '<circle cx="24" cy="26" r="13"/><rect x="21" y="9" width="6" height="5" rx="2"/>',
     '<path d="M24 26 V16" stroke="{T}" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
     '<path d="M24 26 L31 30" stroke="{T}" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
     '<circle cx="24" cy="26" r="2.2" fill="{T}"/>'),

    ("beauty", ROUGE,
     '<rect x="18" y="31" width="12" height="9" rx="2.5"/><rect x="21" y="17" width="6" height="15" rx="2"/>'
     '<path d="M21 17 q3 -8 6 0 z"/>',
     '<path d="M23 19 v11" stroke="{T}" stroke-width="1.6" fill="none" stroke-linecap="round"/>'
     '<path d="M33 14 c.5 1.6 2.2 2.8 4 3 c-1.8.2 -3 1.4 -3.4 3 c-.4 -1.6 -1.6 -2.8 -3.4 -3 c1.8 -.2 3.5 -1.4 4 -3 z" fill="{T}"/>'),

    ("pet", INK,
     '<path d="M13 16 L10 9 L18 14 Z"/><path d="M35 16 L38 9 L30 14 Z"/><circle cx="24" cy="25" r="14"/>',
     '<circle cx="19" cy="24" r="2.2" fill="{T}"/><circle cx="29" cy="24" r="2.2" fill="{T}"/>'
     '<path d="M24 28 l-2 2 h4 z" fill="{T}"/>'
     '<path d="M24 30 v2 M24 32 q-3 2 -6 1 M24 32 q3 2 6 1" stroke="{T}" stroke-width="1.4" fill="none" stroke-linecap="round"/>'),

    ("country", LOTUS,
     '<circle cx="24" cy="24" r="14"/>',
     '<g fill="none" stroke="{T}" stroke-width="1.4"><path d="M10 24 h28"/><path d="M24 10 v28"/>'
     '<path d="M13 15 q11 9 22 0"/><path d="M13 33 q11 -9 22 0"/></g>'
     '<path d="M24 17 l1.4 3 3.2.2 -2.4 2 1 3 -2.2 -1.6 -2.2 1.6 1 -3 -2.4 -2 3.2 -.2 z" fill="{T}"/>'),

    ("travel", OCHRE,
     '<rect x="9" y="13" width="30" height="22" rx="4"/>',
     '<path d="M19 13 v22 M29 13 v22" stroke="{T}" stroke-width="1.4" fill="none"/>'
     '<path d="M24 16 c-3 0 -5 2 -5 5 c0 4 5 8 5 8 c0 0 5 -4 5 -8 c0 -3 -2 -5 -5 -5 z" fill="{T}"/>'
     '<circle cx="24" cy="21" r="2" fill="{C}"/>'),
]

def icon(name, color, body, detail):
    ch = hexc(color)
    th = hexc(mix(color))
    parts = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">',
             '<rect width="48" height="48" rx="13" fill="%s"/>' % th,
             '<g fill="%s">%s</g>' % (ch, body.format(C=ch, T=th))]
    if detail:
        parts.append('<g fill="%s">%s</g>' % (th, detail.format(C=ch, T=th)))
    parts.append('</svg>')
    with open(os.path.join(OUT, name + ".svg"), "w", encoding="utf-8") as f:
        f.write("".join(parts))
    print("wrote", name)

for nm, col, bd, dt in ICONS:
    icon(nm, col, bd, dt)

print("TOTAL", len(ICONS))
