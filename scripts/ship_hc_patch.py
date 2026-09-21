#!/usr/bin/env python3
"""Surgical SPA: add Honest Calibration™ nav+footer (+ hard nav). Also write OG if b64 parts present."""
from pathlib import Path
import base64

ROOT = Path(".")
SPA_FILES = [
    "index.html",
    "about/index.html",
    "assessment/index.html",
    "book/index.html",
    "coaching/index.html",
    "privacy/index.html",
    "resources/index.html",
]

OLD_LINKS = """    { id:\"home\", label:\"Home\" },{ id:\"about\", label:\"About\" },
    { id:\"coaching\", label:\"Coaching\" },{ id:\"resources\", label:\"Resources\" },
    { id:\"assessment\", label:\"Assessment\" },"""

NEW_LINKS = """    { id:\"home\", label:\"Home\" },{ id:\"about\", label:\"About\" },
    { id:\"honestCalibration\", label:\"Honest Calibration™\" },
    { id:\"coaching\", label:\"Coaching\" },{ id:\"resources\", label:\"Resources\" },
    { id:\"assessment\", label:\"Assessment\" },"""

OLD_NAV_BTN = """{links.map(l => (
            <button key={l.id} onClick={() => setPage(l.id)} style={{ background:\"none\", border:\"none\", cursor:\"pointer\", fontFamily:DM, fontSize:16, fontWeight: page===l.id?600:400, color: page===l.id?C.gold:textCol, padding:\"6px 12px\", transition:\"color 0.2s\" }}>{l.label}</button>"""

NEW_NAV_BTN = """{links.map(l => (
            <button key={l.id} onClick={() => { if (l.id === \"honestCalibration\") { window.location.href = \"/honest-calibration\"; return; } setPage(l.id); }} style={{ background:\"none\", border:\"none\", cursor:\"pointer\", fontFamily:DM, fontSize:16, fontWeight: page===l.id?600:400, color: page===l.id?C.gold:textCol, padding:\"6px 12px\", transition:\"color 0.2s\" }}>{l.label}</button>"""

OLD_FOOTER_ITEMS = """[[\"Home\",\"home\"],[\"About\",\"about\"],[\"Coaching\",\"coaching\"],[\"Resources\",\"resources\"],[\"Assessment\",\"assessment\"],[\"Inquire\",\"book\"],[\"Privacy Policy\",\"privacy\"]]"""

NEW_FOOTER_ITEMS = """[[\"Home\",\"home\"],[\"About\",\"about\"],[\"Honest Calibration™\",\"honestCalibration\"],[\"Coaching\",\"coaching\"],[\"Resources\",\"resources\"],[\"Assessment\",\"assessment\"],[\"Inquire\",\"book\"],[\"Privacy Policy\",\"privacy\"]]"""

OLD_FOOTER_BTN = """{page ? <button onClick={() => setPage(page)} style={{ background:\"none\", border:\"none\", cursor:\"pointer\", fontFamily:DM, fontSize:16, color:\"rgba(255,255,255,0.5)\", padding:0, textAlign:\"left\" }}>{label}</button>"""

NEW_FOOTER_BTN = """{page ? <button onClick={() => { if (page === \"honestCalibration\") { window.location.href = \"/honest-calibration\"; return; } setPage(page); }} style={{ background:\"none\", border:\"none\", cursor:\"pointer\", fontFamily:DM, fontSize:16, color:\"rgba(255,255,255,0.5)\", padding:0, textAlign:\"left\" }}>{label}</button>"""


def patch_one(path: Path) -> bool:
    t = path.read_text(encoding="utf-8")
    orig = t
    if 'id:"honestCalibration"' in t:
        t = t.replace('label:"Approach"', 'label:"Honest Calibration™"')
        t = t.replace('["Approach","honestCalibration"]', '["Honest Calibration™","honestCalibration"]')
        if 'window.location.href = "/honest-calibration"' not in t:
            # upgrade click handlers if missing
            if OLD_NAV_BTN in t:
                t = t.replace(OLD_NAV_BTN, NEW_NAV_BTN, 1)
            if OLD_FOOTER_BTN in t:
                t = t.replace(OLD_FOOTER_BTN, NEW_FOOTER_BTN, 1)
    else:
        if OLD_LINKS not in t:
            raise SystemExit(f"links block not found in {path}")
        t = t.replace(OLD_LINKS, NEW_LINKS, 1)
        if OLD_NAV_BTN not in t:
            raise SystemExit(f"nav button block not found in {path}")
        t = t.replace(OLD_NAV_BTN, NEW_NAV_BTN, 1)
        if OLD_FOOTER_ITEMS not in t:
            raise SystemExit(f"footer items not found in {path}")
        t = t.replace(OLD_FOOTER_ITEMS, NEW_FOOTER_ITEMS, 1)
        if OLD_FOOTER_BTN not in t:
            raise SystemExit(f"footer button not found in {path}")
        t = t.replace(OLD_FOOTER_BTN, NEW_FOOTER_BTN, 1)
    if t == orig:
        return False
    path.write_text(t, encoding="utf-8")
    return True

changed = 0
for rel in SPA_FILES:
    p = ROOT / rel
    if not p.exists():
        print("skip missing", rel)
        continue
    if patch_one(p):
        print("patched", rel)
        changed += 1
    else:
        print("unchanged", rel)
print("spa changed", changed)

parts_dir = ROOT / "assets" / "og-parts"
out = ROOT / "assets" / "og-honest-calibration.jpg"
if parts_dir.exists():
    parts = sorted(parts_dir.glob("og-honest-calibration.b64.*"), key=lambda p: int(p.name.rsplit(".", 1)[-1]))
    if parts:
        data = base64.b64decode("".join(p.read_text().strip() for p in parts))
        assert data[:3] == bytes([0xFF, 0xD8, 0xFF]), data[:10]
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_bytes(data)
        print("wrote OG", len(data))
        for p in parts:
            p.unlink()
        try:
            parts_dir.rmdir()
        except OSError:
            pass
elif out.exists():
    print("OG already present", out.stat().st_size)
else:
    print("WARN: no OG parts and no existing OG")
