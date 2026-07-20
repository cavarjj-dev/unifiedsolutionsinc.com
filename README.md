# Unified Solutions Inc. — Website

ICF PCC Executive Coach | Holistic Leadership Coaching | Julian Johnson  
[unifiedsolutionsinc.com](https://unifiedsolutionsinc.com)

---

## Deployment (GitHub Pages — live)

**Live host:** GitHub Pages (`Server: GitHub.com`) via repo `cavarjj-dev/unifiedsolutionsinc.com`, branch `main`, custom domain `unifiedsolutionsinc.com` (`CNAME`).

1. Edit source files in this repo (root `index.html` is the SPA source of truth)
2. After changing `index.html`, sync SPA route copies:
   ```bash
   python scripts/sync-spa-routes.py
   ```
3. Commit and push to `main`
4. GitHub Pages deploys automatically — no build step, no npm

**Why route copies exist:** GitHub Pages does not apply `netlify.toml` rewrites. Folders like `about/index.html` make `/about` return **HTTP 200** with the SPA. Without them, core routes return **HTTP 404** (only rescued in-browser via `404.html` + `sessionStorage`).

**File structure:**
```
/
├── index.html              ← SPA source of truth (all core pages)
├── about/index.html        ← GH Pages 200 copy (synced)
├── coaching/index.html
├── resources/index.html
├── assessment/index.html
├── book/index.html
├── privacy/index.html
├── articles/               ← Static article pages (real files)
├── 404.html                ← Legacy / unknown path recovery
├── netlify.toml            ← Optional Netlify config (CSP + rewrites if rehosted)
├── scripts/sync-spa-routes.py
├── sitemap.xml
├── robots.txt
├── llms.txt
├── CNAME
└── assets/
```

### Optional: Netlify

`netlify.toml` remains valid if the site is ever pointed at Netlify again (200 rewrites + security headers). Until then it is **inert on the live host**. Prefer keeping it in sync (especially CSP `frame-src` for `youtube-nocookie.com`) so a host move does not break embeds.

---

## Per-Page URLs

The site uses `history.pushState` so each page navigation updates the URL:

| Page | URL |
|------|-----|
| Home | `/` |
| About | `/about` |
| Coaching | `/coaching` |
| Resources | `/resources` |
| Assessment | `/assessment` |
| Book a Call | `/book` |
| Privacy | `/privacy` |

---

## Activating / Editing the Video

1. Open root `index.html` in any text editor
2. Search for `Two Minutes with Julian` / the About iframe
3. Privacy-enhanced embed uses `https://www.youtube-nocookie.com/embed/...`
4. Re-run `python scripts/sync-spa-routes.py` after edits
5. Commit and push

---

## Admin Access (Assessment CRM Dashboard)

1. Go to `unifiedsolutionsinc.com/assessment`
2. Use Ctrl+Shift+A for admin (no public nav link)
3. PIN is hashed client-side (see admin Security tab / code comments)

**First-time setup — Notion sync:**
- In the Admin dashboard, paste your Anthropic API key in the field at the top
- Key is saved to your browser's localStorage only (never stored elsewhere)
- Enables "Sync" button on each submission → pushes to your Notion CRM

---

## CMS / Content Editing

1. Enter admin mode (Ctrl+Shift+A)
2. Editable text shows a gold dashed outline — click to edit
3. Save changes in the gold bar
4. Changes persist in localStorage for this browser session

---

## Credentials Reference

| Credential | Full Name |
|---|---|
| ICF PCC | International Coaching Federation — Professional Certified Coach |
| ACTC | Advanced Certified Team Coach (ICF) |
| HPTI | High Performance Type Indicator — Thomas International (certified) |
| AgileBrain | Emotional & motivational needs assessment (certified) |

---

## Tech Notes

**Stack:** React 18 (CDN) · Babel Standalone · Google Fonts · localStorage

**No build step required.** Babel Standalone compiles JSX in the browser.

**Hosting truth:** Production is GitHub Pages. Do not assume Netlify redirects or headers are live unless DNS/hosting is switched.

**Articles expected in sitemap:** 19 (plus 7 core URLs = 26 total).

---

© 2026 Unified Solutions Inc. · Plymouth, MN · ICF PCC · ACTC · ExecOnline & Emeritus Faculty
