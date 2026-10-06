# -*- coding: utf-8 -*-
"""
重抓 DataV 行政区划，生成**层级正确**的坐标库：
- 省级 json 里的 feature：adcode 末两位==00 且非省本级 → 地级市（需再抓一层）
                         adcode 末两位!=00            → 省直辖县/区（直接收录）
- 地级市 json 里的 feature → 该市下辖县/区/县级市
输出 travel-board/js/county-coords.js（含 adcode 与 省/市/区 三级归属）
"""
import json, os, time, urllib.request

BASE = "https://geo.datav.aliyun.com/areas_v3/bound/%s_full.json"
ROOT = os.path.dirname(os.path.abspath(__file__))
TB = os.path.join(ROOT, "travel-board")
PROV_DIR = os.path.join(TB, "data", "prov")

# 台湾省县市（DataV 无省级 json，手工补齐）
TW = [
    ("台北市", 121.5654, 25.0330), ("新北市", 121.4650, 25.0120), ("桃园市", 121.2168, 24.9937),
    ("台中市", 120.6736, 24.1477), ("台南市", 120.2014, 22.9908), ("高雄市", 120.3014, 22.6273),
    ("基隆市", 121.7406, 25.1283), ("新竹市", 120.9686, 24.8039), ("嘉义市", 120.4473, 23.4801),
    ("宜兰县", 121.8300, 24.7553), ("新竹县", 121.0050, 24.8387), ("苗栗县", 120.9417, 24.5700),
    ("彰化县", 120.5162, 24.0512), ("南投县", 120.6886, 23.8318), ("云林县", 120.5430, 23.7090),
    ("嘉义县", 120.5740, 23.4580), ("屏东县", 120.4870, 22.5520), ("台东县", 121.1500, 22.7580),
    ("花莲县", 121.5540, 23.9870), ("澎湖县", 119.5690, 23.5720), ("金门县", 118.3500, 24.4500),
    ("连江县", 120.2300, 26.1600),
]

def fetch(code, retry=3):
    for i in range(retry):
        try:
            req = urllib.request.Request(BASE % code, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=45) as r:
                return json.loads(r.read().decode("utf-8"))
        except Exception as e:
            if i == retry - 1:
                print("  [FAIL]", code, e)
                return None
            time.sleep(1.2)
    return None

PROV_NAME = {
    "110000": "北京市", "120000": "天津市", "130000": "河北省", "140000": "山西省",
    "150000": "内蒙古自治区", "210000": "辽宁省", "220000": "吉林省", "230000": "黑龙江省",
    "310000": "上海市", "320000": "江苏省", "330000": "浙江省", "340000": "安徽省",
    "350000": "福建省", "360000": "江西省", "370000": "山东省", "410000": "河南省",
    "420000": "湖北省", "430000": "湖南省", "440000": "广东省", "450000": "广西壮族自治区",
    "460000": "海南省", "500000": "重庆市", "510000": "四川省", "520000": "贵州省",
    "530000": "云南省", "540000": "西藏自治区", "610000": "陕西省", "620000": "甘肃省",
    "630000": "青海省", "640000": "宁夏回族自治区", "650000": "新疆维吾尔自治区",
    "710000": "台湾省", "810000": "香港特别行政区", "820000": "澳门特别行政区",
}


def cache(code):
    p = os.path.join(PROV_DIR, "%s.json" % code)
    if os.path.exists(p) and os.path.getsize(p) > 3000:
        return json.load(open(p, encoding="utf-8"))
    return None

prov_names = {}   # adcode -> 省名
rows = []         # [name, lng, lat, provName, cityName, adcode, level]
prefectures = []  # [(adcode, name, provName)]

print("== 阶段1：解析省级结构 ==")
for fn in sorted(os.listdir(PROV_DIR)):
    if not fn.endswith(".json") or fn.startswith("_") or fn.startswith("100000"):
        continue
    code = fn[:-5]
    if not code.endswith("0000"):
        continue
    data = json.load(open(os.path.join(PROV_DIR, fn), encoding="utf-8"))
    pname = PROV_NAME.get(code)
    if not pname:
        for ft in data.get("features", []):
            pr = ft.get("properties", {})
            if str(pr.get("adcode")) == code:
                pname = pr.get("name")
                break
    if not pname:
        print("  [SKIP] 无省名", code)
        continue
    prov_names[code] = pname
    for ft in data.get("features", []):
        pr = ft.get("properties", {})
        ad = str(pr.get("adcode"))
        nm = pr.get("name")
        ct = pr.get("center") or pr.get("centroid")
        if not ad or not nm or not ct:
            continue
        if ad == code:
            continue
        lng, lat = round(float(ct[0]), 4), round(float(ct[1]), 4)
        if ad.endswith("00"):
            prefectures.append((ad, nm, pname))
            # 地级市自身：city 记自己（后面它的下辖县区会归到它名下）
            rows.append([nm, lng, lat, pname, nm, ad, "city"])
        else:
            rows.append([nm, lng, lat, pname, pname, ad, "county"])
print("  省 %d 个 / 地级条目 %d 个 / 省直辖县区 %d 条" % (len(prov_names), len(prefectures), sum(1 for r in rows if r[6] == 'county')))

print("== 阶段2：抓取各地级市下辖县区 ==")
n = len(prefectures)
for i, (ad, nm, pname) in enumerate(prefectures, 1):
    # 直辖市(11/12/31/50)本身已是区一级，跳过再下钻
    if ad[:2] in ("11", "12", "31", "50"):
        continue
    d = cache(ad) or fetch(ad)
    cnt = 0
    if d:
        for ft in d.get("features", []):
            pr = ft.get("properties", {})
            cad = str(pr.get("adcode"))
            cnm = pr.get("name")
            ct = pr.get("center") or pr.get("centroid")
            if cad == ad or not cnm or not ct:
                continue
            rows.append([cnm, round(float(ct[0]), 4), round(float(ct[1]), 4), pname, nm, cad, "county"])
            cnt += 1
    if i % 40 == 0 or i == n:
        print("  [%d/%d] %s(%s) +%d  累计 %d" % (i, n, nm, pname, cnt, len(rows)))

print("== 阶段3：补台湾省 ==")
for nm, lng, lat in TW:
    rows.append([nm, lng, lat, "台湾省", nm, "", "city"])

print("== 阶段4：去重并输出 ==")
seen = {}
out = []
# 优先保留 level=city，其次 county（避免重名时被县覆盖）
order = {"city": 0, "county": 1}
rows.sort(key=lambda r: order.get(r[6], 9))
for r in rows:
    if r[0] in seen:
        continue
    seen[r[0]] = 1
    out.append(r)

# 索引：省 -> 市 -> 县区
hier = {}
for nm, lng, lat, pv, ct, ad, lv in out:
    hier.setdefault(pv, {})
    hier[pv].setdefault(ct, []).append(nm)

js = "/* 全国省 / 市 / 县区 中心坐标库（DataV 行政区划，离线内置） */\n"
js += "window.COUNTY_DATA = " + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n"
js += "window.COUNTY_COORDS = (function(){var m={};window.COUNTY_DATA.forEach(function(r){m[r[0]]=[r[1],r[2]];});return m;})();\n"
js += "window.COUNTY_INFO = (function(){var m={};window.COUNTY_DATA.forEach(function(r){m[r[0]]={p:r[3],c:r[4],a:r[5],lv:r[6]};});return m;})();\n"
js += "window.REGION_TREE = " + json.dumps(hier, ensure_ascii=False, separators=(",", ":")) + ";\n"
open(os.path.join(TB, "js", "county-coords.js"), "w", encoding="utf-8").write(js)

print("完成：条目 %d 条，省级 %d 个" % (len(out), len(hier)))
for pv in ["四川省", "云南省", "北京市", "海南省", "台湾省"]:
    if pv in hier:
        ks = list(hier[pv].keys())
        print("  %s -> %d 个二级：%s…" % (pv, len(ks), ks[:6]))
