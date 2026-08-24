# Apps Script paste steps — live refresh for published article reads

Do this only if you want the admin panel to query Google Analytics on every open.
You do **not** need this for lifetime counts to work. Monday already refreshes
`/data/ga4-article-pages.json` and the panel reads that file.

Do **not** open Drive project **The Watcher**. That is the BD feed.

## What you are editing

The live webhook the site already uses:

`https://script.google.com/macros/s/AKfycbx5eHYEMTSyN4trCBNiMKQVkcGYB3tFIkXtaRTsol-KyYgmV3YVrr1lWOXX43hJG6Dt/exec`

That project is bound to the Sheet **USI Activity Log**. Open the Sheet, then
open its script — do not create a new project.

Sheet:
https://docs.google.com/spreadsheets/d/19drfHMGxAEV0gyB14SbQxvFVYZGlyh8b4ys36oQcXnQ/edit

## Open the right editor

1. Open the Sheet link above while signed in as `cavarjj@gmail.com`.
2. Menu: **Extensions → Apps Script**.
3. Confirm the editor title is the logging project, **not** The Watcher.
4. Left sidebar: you should already see a file that handles `doGet` and
   `ga4_article_clicks`. Stay in that project.

## Confirm the Analytics service (usually already on)

1. Left sidebar: **Services** (plus icon).
2. If **Google Analytics Data API** is already listed, leave it.
3. If it is missing: Add → Google Analytics Data API → Add.
4. Project Settings (gear) → **Script properties**.
5. Confirm `GA4_PROPERTY_ID` = `540138354` (the number, **not** `G-JES4VXETRS`).
   Add it if missing.

## Paste the two functions

1. Open this file on disk and copy **everything from `function handleGa4ArticlePages` through the end of `function handleGa4Overview`**:
   `C:\Users\BizDev\HQ\unifiedsolutionsinc.com\scripts\google-apps-script-ga4-overview.gs`
2. In the Apps Script editor, scroll to the **bottom** of the existing `.gs` file.
3. Paste. Do **not** delete `doGet`, `doPost`, `article_clicks`, or `ga4_article_clicks`.

## Wire the two new types inside `doGet`

Find the existing `doGet` function. Near the branch that already handles
`ga4_article_clicks`, add these two blocks (same style as the ones already there):

```javascript
if (type === 'ga4_overview') {
  return ContentService
    .createTextOutput(JSON.stringify(handleGa4Overview()))
    .setMimeType(ContentService.MimeType.JSON);
}
if (type === 'ga4_article_pages') {
  return ContentService
    .createTextOutput(JSON.stringify(handleGa4ArticlePages()))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Save (Ctrl+S / Cmd+S).

## Deploy a new version of the SAME web app

1. Top right: **Deploy → Manage deployments**.
2. Find the existing **Web app** deployment (the one whose URL ends in the long
   `AKfycbx5eHYEMTSyN4trCBNiMKQVkcGYB3tFIkXtaRTsol-...` string).
3. Pencil (Edit).
4. **Version → New version**.
5. Description: `ga4_article_pages lifetime`.
6. Leave Execute as / Who has access unchanged.
7. **Deploy**.
8. Do **not** create a second web app. A new URL would break the site.

## Prove it

In a browser (or ask Tre):

`https://script.google.com/macros/s/AKfycbx5eHYEMTSyN4trCBNiMKQVkcGYB3tFIkXtaRTsol-KyYgmV3YVrr1lWOXX43hJG6Dt/exec?type=ga4_article_pages`

You should see JSON with `pagesLifetime`, `pages28d`, and `pages7d`.
If you still see `{"status":"USI logging webhook is live"}`, the new branches
were not saved or the new version was not deployed.

Then: hard refresh `/assessment` → Ctrl+Shift+A → CRM → **Published article reads**.
The footer should say Google Analytics, not snapshot.

## If anything looks wrong

Stop. Message Tre. Do not overwrite The Watcher. Do not create a new project.
