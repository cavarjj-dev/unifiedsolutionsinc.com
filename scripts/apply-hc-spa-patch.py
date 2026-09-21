#!/usr/bin/env python3
"""Apply Honest Calibration™ SPA nav/CTA patch to root index.html (Netlify build)."""
from __future__ import annotations
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"

REPLACEMENTS = [
    (
        """  const links = [
    { id:"home", label:"Home" },{ id:"about", label:"About" },
    { id:"coaching", label:"Coaching" },{ id:"resources", label:"Resources" },
    { id:"assessment", label:"Assessment" },
  ];""",
        """  const links = [
    { id:"home", label:"Home" },{ id:"about", label:"About" },
    { id:"honestCalibration", label:"Approach" },
    { id:"coaching", label:"Coaching" },{ id:"resources", label:"Resources" },
    { id:"assessment", label:"Assessment" },
  ];""",
    ),
    (
        """            <button key={l.id} onClick={() => setPage(l.id)} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:DM, fontSize:16, fontWeight: page===l.id?600:400, color: page===l.id?C.gold:textCol, padding:"6px 12px", transition:"color 0.2s" }}>{l.label}</button>""",
        """            <button key={l.id} onClick={() => { if (l.id === "honestCalibration") { window.location.href = "/honest-calibration"; return; } setPage(l.id); }} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:DM, fontSize:16, fontWeight: page===l.id?600:400, color: page===l.id?C.gold:textCol, padding:"6px 12px", transition:"color 0.2s" }}>{l.label}</button>""",
    ),
    (
        """              <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                <Btn onClick={() => { window.track && window.track("book_call_click",{location:"hero"}); setPage("book"); }}>
                  Inquire
                </Btn>
                <Btn variant="white" onClick={() => setPage("assessment")}>
                  Pressure Point Assessment
                </Btn>
              </div>""",
        """              <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                <Btn onClick={() => { window.track && window.track("book_call_click",{location:"hero"}); setPage("book"); }}>
                  Inquire
                </Btn>
                <Btn variant="white" onClick={() => { window.location.href = "/honest-calibration"; }}>
                  Honest Calibration™
                </Btn>
                <Btn variant="white" onClick={() => setPage("assessment")}>
                  Pressure Point Assessment
                </Btn>
              </div>""",
    ),
    (
        'ref={el => window.bindSectionView && window.bindSectionView(el, "unified_method", "Unified Method")}',
        'ref={el => window.bindSectionView && window.bindSectionView(el, "honest_calibration_pillars", "Honest Calibration™")}',
    ),
    (
        '<div style={{ fontFamily:DM, fontSize:12, letterSpacing:3, color:C.gold, textTransform:"uppercase", marginBottom:12 }}>How the work is done</div>',
        '<div style={{ fontFamily:DM, fontSize:12, letterSpacing:3, color:C.gold, textTransform:"uppercase", marginBottom:12 }}>Honest Calibration™ · flagship method</div>',
    ),
    (
        'text={content.method?.subtitle||"Four pillars behind the work. I use them. I put them down. I do not teach another course."}',
        'text={content.method?.subtitle||"Unified Solutions is the firm. Honest Calibration™ is the flagship method. Whole-person catalyst is the stance inside it. Four pillars behind the work."}',
    ),
    (
        '>The Unified Method</div>',
        '>Honest Calibration™</div>',
    ),
    (
        '{ head:"Navigation", items:[["Home","home"],["About","about"],["Coaching","coaching"],["Resources","resources"],["Assessment","assessment"],["Inquire","book"],["Privacy Policy","privacy"]] }',
        '{ head:"Navigation", items:[["Home","home"],["About","about"],["Approach","honestCalibration"],["Coaching","coaching"],["Resources","resources"],["Assessment","assessment"],["Inquire","book"],["Privacy Policy","privacy"]] }',
    ),
    (
        '{page ? <button onClick={() => setPage(page)} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:DM, fontSize:16, color:"rgba(255,255,255,0.5)", padding:0, textAlign:"left" }}>{label}</button>',
        '{page ? <button onClick={() => { if (page === "honestCalibration") { window.location.href = "/honest-calibration"; return; } setPage(page); }} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:DM, fontSize:16, color:"rgba(255,255,255,0.5)", padding:0, textAlign:"left" }}>{label}</button>',
    ),
]


def main() -> int:
    text = INDEX.read_text(encoding="utf-8")
    if 'label:"Approach"' in text and 'window.location.href = "/honest-calibration"' in text and "The Unified Method" not in text:
        print("index.html already patched for Honest Calibration™")
        return 0
    for old, new in REPLACEMENTS:
        if old not in text:
            if new in text or new[:40] in text:
                continue
            print(f"ERROR: expected snippet not found:\n{old[:120]}...")
            return 1
        text = text.replace(old, new, 1)
    if "Honest Calibration®" in text:
        print("ERROR: found Honest Calibration®")
        return 1
    INDEX.write_text(text, encoding="utf-8")
    print(f"patched {INDEX} ({INDEX.stat().st_size} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
