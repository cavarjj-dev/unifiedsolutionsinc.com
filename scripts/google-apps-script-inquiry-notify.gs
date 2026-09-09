/**
 * ADDITIVE Apps Script — do not replace the live webhook with this file.
 *
 * Live web app (keep this URL; do not create a second deployment):
 *   https://script.google.com/macros/s/AKfycbx5eHYEMTSyN4trCBNiMKQVkcGYB3tFIkXtaRTsol-KyYgmV3YVrr1lWOXX43hJG6Dt/exec
 *
 * Bound Sheet: USI Activity Log
 *   https://docs.google.com/spreadsheets/d/19drfHMGxAEV0gyB14SbQxvFVYZGlyh8b4ys36oQcXnQ/edit
 *
 * Why this exists (2026-09-09):
 *   POST type=inquiry currently returns {"success":false,"error":"Unknown event type: inquiry"}.
 *   The public /book form still paints "Received." anyway. Leads vanish. No owner email.
 *   assessment_complete and article_click already succeed. Do not touch those writes.
 *
 * Paste into the SAME project as doGet/doPost. Then wire the two branches below.
 * Deploy → Manage deployments → existing Web app → New version. Do not new-URL.
 *
 * Exact click-by-click: scripts/APPS-SCRIPT-PASTE-STEPS.md (inquiry section).
 */

var USI_NOTIFY_TO = 'julian@unifiedsolutionsinc.com';
var USI_SHEET_URL = 'https://docs.google.com/spreadsheets/d/19drfHMGxAEV0gyB14SbQxvFVYZGlyh8b4ys36oQcXnQ/edit';

function jsonOut_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function notifyOwner_(subject, body, replyTo) {
  var payload = {
    to: USI_NOTIFY_TO,
    subject: subject,
    body: body
  };
  if (replyTo && String(replyTo).indexOf('@') !== -1) {
    payload.replyTo = String(replyTo).trim();
  }
  MailApp.sendEmail(payload);
}

function getOrCreateTab_(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * POST type=inquiry
 * Wire inside existing doPost, after JSON parse, BEFORE the unknown-type error:
 *
 *   if (data.type === 'inquiry') {
 *     return handleInquiryPost(data);
 *   }
 */
function handleInquiryPost(data) {
  data = data || {};
  var ts = data.timestamp || new Date().toISOString();
  var name = String(data.name || '');
  var email = String(data.email || '');
  var org = String(data.organization || '');
  var role = String(data.role || '');
  var door = String(data.door || '');
  var situation = String(data.situation || '');
  var location = String(data.location || '');
  var notified = false;
  var notifyError = '';

  var body = [
    'A fit inquiry landed on unifiedsolutionsinc.com.',
    '',
    'Name: ' + name,
    'Email: ' + email,
    'Organization: ' + org,
    'Seat: ' + role,
    'Door: ' + door,
    'Page: ' + location,
    '',
    'Situation:',
    situation,
    '',
    'Sheet: ' + USI_SHEET_URL,
    '',
    'If it is a fit, times follow. If it is not, say so.'
  ].join('\n');

  try {
    notifyOwner_('Fit inquiry' + (name ? ' — ' + name : ''), body, email);
    notified = true;
  } catch (err) {
    notifyError = String(err && err.message ? err.message : err);
  }

  var sheet = getOrCreateTab_('Inquiries', [
    'timestamp', 'name', 'email', 'organization', 'role', 'door', 'situation', 'location', 'notified'
  ]);
  sheet.appendRow([ts, name, email, org, role, door, situation, location, notified ? 'yes' : ('no: ' + notifyError)]);

  return jsonOut_({
    success: true,
    event: 'inquiry',
    notified: notified
  });
}

/**
 * GET ?type=inquiries
 * Wire inside existing doGet, same style as article_clicks:
 *
 *   if (type === 'inquiries') {
 *     return handleInquiryGet();
 *   }
 */
function handleInquiryGet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Inquiries');
  if (!sheet) {
    return jsonOut_({ success: true, rows: [], total: 0, source: 'sheet' });
  }
  var values = sheet.getDataRange().getValues();
  if (!values || values.length < 2) {
    return jsonOut_({ success: true, rows: [], total: 0, source: 'sheet' });
  }
  var headers = values[0].map(function (h) { return String(h); });
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      var cell = values[i][j];
      row[headers[j]] = (cell instanceof Date) ? cell.toISOString() : cell;
    }
    rows.push(row);
  }
  return jsonOut_({ success: true, rows: rows, total: rows.length, source: 'sheet' });
}

/**
 * OPTIONAL — call from the existing assessment_complete branch AFTER the row is written.
 * Do not duplicate the assessment write.
 *
 *   notifyAssessment_(data);
 *
 * Safe no-op if mail fails; never fail the assessment write because of mail.
 */
function notifyAssessment_(data) {
  data = data || {};
  var email = String(data.email || '');
  var primary = String(data.primaryDomain || '');
  try {
    notifyOwner_(
      'Assessment complete' + (email ? ' — ' + email : ''),
      [
        'An assessment completed on unifiedsolutionsinc.com.',
        '',
        'Email: ' + email,
        'Primary domain: ' + primary,
        'Consent: ' + String(data.consentGiven),
        '',
        'Scores: ' + JSON.stringify(data.scores || {}),
        '',
        'Sheet: ' + USI_SHEET_URL
      ].join('\n'),
      email
    );
  } catch (err) {
    // swallow — assessment row already exists
  }
}

/**
 * Run this ONCE from the Apps Script editor (Run ▶) after paste.
 * It forces the Gmail permission prompt so the web app can send.
 * Delete the test row from the Inquiries tab after.
 */
function testInquiryNotify() {
  handleInquiryPost({
    type: 'inquiry',
    location: 'apps-script-editor',
    name: 'TRE AUTH TEST',
    email: 'julian@unifiedsolutionsinc.com',
    organization: 'USI',
    role: 'owner',
    door: 'not-sure',
    situation: 'Permission probe. Delete this row. Not a lead.',
    timestamp: new Date().toISOString()
  });
}
