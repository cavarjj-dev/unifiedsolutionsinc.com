#!/usr/bin/env python3
"""Copy root index.html into SPA route folders for GitHub Pages HTTP 200s.

GitHub Pages does not honor netlify.toml rewrites. Without these copies,
/about, /coaching, etc. return HTTP 404 (404.html JS recovery only).

Usage (from repo root):
  python scripts/sync-spa-routes.py
"""
from __future__ import annotations

import shutil
import sys
from pathlib import Path

ROUTES = ("about", "coaching", "resources", "assessment", "book", "privacy")


def main() -> int:
    root = Path(__file__).resolve().parent.parent
    src = root / "index.html"
    if not src.is_file():
        print(f"ERROR: missing {src}", file=sys.stderr)
        return 1

    for route in ROUTES:
        dest_dir = root / route
        dest_dir.mkdir(parents=True, exist_ok=True)
        dest = dest_dir / "index.html"
        shutil.copyfile(src, dest)
        print(f"synced {dest.relative_to(root)} ({dest.stat().st_size} bytes)")

    print(f"done — {len(ROUTES)} SPA routes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
