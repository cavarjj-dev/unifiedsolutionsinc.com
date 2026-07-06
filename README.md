# Unified Solutions Inc. — Website

ICF PCC Executive Coach | Holistic Leadership Coaching | Julian Johnson  
[unifiedsolutionsinc.com](https://unifiedsolutionsinc.com)

---

## Deployment (Netlify)

1. Replace all files in this repo with the files in this folder
2. Commit and push to `main`
3. Netlify auto-deploys — no build step, no npm, no config needed
4. `netlify.toml` handles all routing and security headers automatically

**File structure:**
```
/
├── index.html          ← Full single-page app (all 6 pages)
├── netlify.toml        ← Routing rules + security headers (required)
├── 404.html            ← Fallback for non-Netlify hosts (GitHub Pages)
├── README.md
└── assets/             ← Add your images here
    ├── og-home.jpg     ← 1200×630 social share image
    └── headshot.jpg    ← Your headshot (add when ready)
```

---

## Netlify Analytics — Per-Page Tracking

The site uses `history.pushState` so each page navigation updates the URL:

| Page | URL |
|------|-----|
| Home | `/` |
| About | `/about` |
| Coaching | `/coaching` |
| Resources | `/resources` |
| Assessment | `/assessment` |
| Book a Call | `/book` |

Netlify Analytics (server-side) reads these as distinct page hits — you'll see
per-page traffic, bounce rate, and top pages in your Netlify dashboard.

The `netlify.toml` redirect rules (`status = 200`) ensure that visiting
`/about` directly or refreshing any page serves `index.html` without a 404,
while keeping the URL clean in the browser bar.

---

## Activating the Video (When Ready)

1. Open `index.html` in any text editor
2. Search for `id="intro-video"`
3. Change `display:"none"` → `display:"block"`
4. For YouTube: set `src="https://www.youtube.com/embed/YOUR_VIDEO_ID"`
5. For Vimeo: set `src="https://player.vimeo.com/video/YOUR_VIMEO_ID"`
6. For self-hosted MP4: upload as `videos/julian-intro.mp4`, then replace
   the `<iframe>` with `<video controls src="./videos/julian-intro.mp4" />`

Full instructions also in the `<!-- VIDEO PLACEHOLDER -->` comment at the
top of `index.html`.

---

## Admin Access (Assessment CRM Dashboard)

1. Go to `unifiedsolutionsinc.com/assessment`
2. Scroll to the bottom of the intro page
3. Click the subtle "Admin Access" link
4. Enter PIN: `USC2026`
   *(to change: find `const ADMIN_PIN = "USC2026"` in index.html)*

**First-time setup — Notion sync:**
- In the Admin dashboard, paste your Anthropic API key in the field at the top
- Key is saved to your browser's localStorage only (never stored elsewhere)
- Enables "Sync" button on each submission → pushes to your Notion CRM

---

## CMS / Content Editing

1. Click the ✏️ icon in the top-right of the nav bar
2. Any editable text shows a gold dashed outline — click to edit
3. Click "Save Changes" in the gold bar at the top
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
If you want faster first-load (~1–2s improvement), run once:
```bash
npx @babel/core --presets @babel/preset-react index.html > index.min.html
```
Then swap the file and remove the `<script src="...babel...">` tag.

**Analytics:** Netlify server-side analytics reads real page URLs.
For additional event tracking (CTA clicks, assessment completions),
add Plausible or a `gtag` call — the hooks are already in the component.

---

© 2026 Unified Solutions Inc. · Plymouth, MN · ICF PCC · ACTC · ExecOnline & Emeritus Faculty
