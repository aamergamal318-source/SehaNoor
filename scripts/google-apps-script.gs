/**
 * SEHANOOR — Google Apps Script (container-bound to the pledges sheet)
 * ─────────────────────────────────────────────────────────────────────
 * POST → saves a new pledge (name, class, signature image)
 * GET  → ?action=count  → { success, count }
 *        (default)      → { success, signatories:[{date,name,classroom,id,signature}] }
 *
 * PRIVACY (2026 update):
 *  - The site no longer sends contact details; column D stays empty for new rows.
 *  - The public GET never returns column D (contact), even for older rows
 *    that still contain an email or phone number.
 *  - After pasting this file: Deploy → Manage deployments → Edit → Version: New
 *    → Deploy. The /exec URL stays the same.
 */

var MAX_SIGNATURE_CHARS = 49000;
var MAX_TEXT_CHARS = 80;

// ── POST: save a new pledge ───────────────────────────────────────────
function doPost(e) {
  try {
    var raw  = (e.parameter && e.parameter.payload) ? e.parameter.payload
             : (e.postData  && e.postData.contents)  ? e.postData.contents
             : '{}';
    var data = JSON.parse(raw);
    var name = clip(data.name);
    if (name.length < 2) return jsonOut({ success: false, error: 'name required' });

    var sig = String(data.signature || '');
    if (sig.indexOf('data:image/png;base64,') !== 0 || sig.length > MAX_SIGNATURE_CHARS) sig = '';

    SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().appendRow([
      data.date || new Date().toISOString(),
      name,
      clip(data.classroom),
      '',                       // contact: no longer collected
      clip(data.id),
      sig
    ]);
    return jsonOut({ success: true });
  } catch (err) {
    return jsonOut({ success: false, error: String(err) });
  }
}

// ── GET ───────────────────────────────────────────────────────────────
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'list';
  return action === 'count' ? handleCount() : handleList();
}

function handleCount() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    return jsonOut({ success: true, count: Math.max(0, sheet.getLastRow() - 1) });
  } catch (err) {
    return jsonOut({ success: false, error: String(err) });
  }
}

function handleList() {
  try {
    var rows = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getDataRange().getValues();
    var list = [];
    for (var i = 1; i < rows.length; i++) {
      var r = rows[i];
      if (!r[1]) continue;
      list.push({
        date:      r[0],
        name:      r[1],
        classroom: r[2],
        // r[3] (contact) is intentionally never returned
        id:        r[4] || String(i),
        signature: r[5] || null
      });
    }
    list.reverse();
    return jsonOut({ success: true, signatories: list });
  } catch (err) {
    return jsonOut({ success: false, error: String(err) });
  }
}

// ── helpers ───────────────────────────────────────────────────────────
function clip(v) { return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, MAX_TEXT_CHARS); }

function jsonOut(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
