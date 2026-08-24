/**
 * ADDITIVE Apps Script snippet — do not replace the live webhook with this file.
 *
 * Live web app (already working from this machine):
 *   https://script.google.com/macros/s/AKfycbx5eHYEMTSyN4trCBNiMKQVkcGYB3tFIkXtaRTsol-KyYgmV3YVrr1lWOXX43hJG6Dt/exec
 *
 * Existing types (keep them):
 *   (none) / health          → {status:"USI logging webhook is live"}
 *   article_clicks           → Sheet rollup
 *   ga4_article_clicks       → GA4 article_click by event_label
 *
 * Paste the functions below into the SAME project, then:
 *   1. Services (+) → Google Analytics Data API (already added if ga4_article_clicks works)
 *   2. Confirm Script Property GA4_PROPERTY_ID = 540138354
 *   3. Deploy → Manage deployments → Edit (pencil) → New version → Update
 *
 * After deploy, the admin panel requests:
 *   ?type=ga4_overview       → 7-day site totals
 *   ?type=ga4_article_pages  → 7d + 28d + lifetime /articles/* pageviews
 *
 * Until those types are deployed, the admin panel falls back to
 * /data/ga4-article-pages.json (refreshed every Monday by ga4-weekly-pull.py).
 *
 * Exact click-by-click paste steps:
 *   C:/Users/BizDev/HQ/unifiedsolutionsinc.com/scripts/APPS-SCRIPT-PASTE-STEPS.md
 */

function handleGa4ArticlePages() {
  var propertyId = PropertiesService.getScriptProperties().getProperty('GA4_PROPERTY_ID');
  if (!propertyId) {
    return { success: false, error: 'GA4_PROPERTY_ID script property is not set. Use the numeric property id 540138354, not G-JES4VXETRS.' };
  }
  function pull(startDate) {
    var req = {
      dateRanges: [{ startDate: startDate, endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'averageSessionDuration' },
        { name: 'engagementRate' }
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: { matchType: 'CONTAINS', value: '/articles/' }
        }
      },
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 100
    };
    var resp = AnalyticsData.Properties.runReport('properties/' + propertyId, req);
    var rows = [];
    (resp.rows || []).forEach(function (r) {
      rows.push({
        path: r.dimensionValues[0].value,
        views: Number(r.metricValues[0].value),
        users: Number(r.metricValues[1].value),
        sessions: Number(r.metricValues[2].value),
        avgDurationSec: Number(r.metricValues[3].value),
        engagementRate: Number(r.metricValues[4].value)
      });
    });
    return rows;
  }
  return {
    success: true,
    source: 'ga4',
    range: '2026-07-21-today',
    dayZero: '2026-07-21',
    pages7d: pull('7daysAgo'),
    pages28d: pull('28daysAgo'),
    pagesLifetime: pull('2026-07-21'),
    fetchedAt: new Date().toISOString()
  };
}

function handleGa4Overview() {
  var propertyId = PropertiesService.getScriptProperties().getProperty('GA4_PROPERTY_ID');
  if (!propertyId) {
    return { success: false, error: 'GA4_PROPERTY_ID script property is not set. Use the numeric property id 540138354, not G-JES4VXETRS.' };
  }
  var request = {
    dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
    metrics: [
      { name: 'sessions' },
      { name: 'totalUsers' },
      { name: 'screenPageViews' },
      { name: 'eventCount' },
      { name: 'engagementRate' }
    ]
  };
  var response = AnalyticsData.Properties.runReport('properties/' + propertyId, request);
  var row = (response.rows && response.rows[0]) || null;
  var m = row ? row.metricValues : [];
  function num(i) {
    return m[i] ? Number(m[i].value) : 0;
  }
  var eventReq = {
    dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    limit: 20
  };
  var eventResp = AnalyticsData.Properties.runReport('properties/' + propertyId, eventReq);
  var events = {};
  (eventResp.rows || []).forEach(function (r) {
    var name = r.dimensionValues[0].value;
    events[name] = {
      name: name,
      count: Number(r.metricValues[0].value),
      users: Number(r.metricValues[1].value)
    };
  });
  var pageReq = {
    dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 12
  };
  var pageResp = AnalyticsData.Properties.runReport('properties/' + propertyId, pageReq);
  var pages = [];
  (pageResp.rows || []).forEach(function (r) {
    pages.push({
      path: r.dimensionValues[0].value,
      views: Number(r.metricValues[0].value),
      users: Number(r.metricValues[1].value)
    });
  });
  return {
    success: true,
    source: 'ga4',
    range: '7daysAgo-today',
    sessions: num(0),
    users: num(1),
    pageviews: num(2),
    events: num(3),
    engagementRate: m[4] ? Number(m[4].value) : 0,
    eventBreakdown: events,
    topPages: pages,
    fetchedAt: new Date().toISOString()
  };
}

/**
 * Inside the existing doGet(e), add these branches next to ga4_article_clicks:
 *
 *   if (type === 'ga4_overview') {
 *     return ContentService
 *       .createTextOutput(JSON.stringify(handleGa4Overview()))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 *   if (type === 'ga4_article_pages') {
 *     return ContentService
 *       .createTextOutput(JSON.stringify(handleGa4ArticlePages()))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 */
