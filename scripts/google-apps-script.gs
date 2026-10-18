/**
 * SEHANOOR — Google Apps Script (container-bound to the pledges sheet)
 * ─────────────────────────────────────────────────────────────────────
 * POST → saves a new pledge (name, class, signature image)
 * GET  → ?action=count  → { success, count }
 *        (default)      → { success, signatories:[{date,name,classroom,id,signature}] }
 *
 * Sheet columns: A date · B full name · C class · D (empty, legacy contact)
 *                E id · F signature PNG · G hide (moderation)
 *
 * PRIVACY
 *  - Contact details are no longer collected. Column D is never returned,
 *    even for older rows that still contain an email or phone number.
 *  - The public list returns only "First L." — never the full name.
 *
 * MODERATION
 *  - Type anything (e.g. x) in column G of a row to hide it from the honor
 *    board and the count. Delete the row to remove it completely.
 *
 * ABUSE PREVENTION
 *  - Same validation as the website (letters-only names, 2–40 chars;
 *    class ≤ 20 chars; PNG signatures only), a honeypot field, duplicate-id
 *    rejection, protection against spreadsheet formulas, and a global rate
 *    limit of 30 pledges per 10 minutes.
 *
 * DEPLOY: paste this file → Deploy → Manage deployments → Edit →
 *         Version: New version → Deploy. The /exec URL stays the same.
 */

var MAX_SIGNATURE_CHARS = 49000;
var RATE_MAX = 30;            // pledges …
var RATE_WINDOW_SEC = 600;    // … per 10 minutes, across all devices
var NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s'’.\-]{1,39}$/u;
var CLASS_RE = /^[\p{L}\p{M}\p{N}\s"'״׳.\-\/]{0,20}$/u;
var ID_RE = /^[a-z0-9]{6,20}$/;

// ── POST: save a new pledge ───────────────────────────────────────────
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(5000);
    var raw  = (e.parameter && e.parameter.payload) ? e.parameter.payload
             : (e.postData  && e.postData.contents)  ? e.postData.contents
             : '{}';
    if (raw.length > 60000) return jsonOut({ success: false, error: 'too large' });
    var data = JSON.parse(raw);

    if (data.website) return jsonOut({ success: true });           // honeypot: pretend success

    var name = clean(data.name);
    var letters = (name.match(/\p{L}/gu) || []).length;
    if (!NAME_RE.test(name) || letters < 2) return jsonOut({ success: false, error: 'invalid name' });

    var classroom = clean(data.classroom);
    if (!CLASS_RE.test(classroom)) classroom = '';

    var id = String(data.id || '');
    if (!ID_RE.test(id)) id = Utilities.getUuid().replace(/-/g, '').slice(0, 12);

    var sig = String(data.signature || '');
    if (!/^data:image\/png;base64,[A-Za-z0-9+\/=]+$/.test(sig) || sig.length > MAX_SIGNATURE_CHARS) sig = '';

    if (!rateOk()) return jsonOut({ success: false, error: 'rate limit' });

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var last = sheet.getLastRow();
    if (last > 1) {
      var ids = sheet.getRange(2, 5, last - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) if (String(ids[i][0]) === id) return jsonOut({ success: true, duplicate: true });
    }

    var date = new Date(data.date);
    if (isNaN(date) || Math.abs(date - new Date()) > 864e5) date = new Date();

    sheet.appendRow([date.toISOString(), safe(name), safe(classroom), '', id, sig, '']);
    return jsonOut({ success: true });
  } catch (err) {
    return jsonOut({ success: false, error: 'server error' });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

// ── GET ───────────────────────────────────────────────────────────────
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'list';
  return action === 'count' ? handleCount() : handleList();
}

function visibleRows() {
  var rows = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getDataRange().getValues();
  var out = [];
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (!r[1] || String(r[6] || '').trim()) continue;     // empty or hidden by moderation
    out.push({ row: i, r: r });
  }
  return out;
}

function handleCount() {
  try {
    return jsonOut({ success: true, count: visibleRows().length });
  } catch (err) {
    return jsonOut({ success: false, error: 'server error' });
  }
}

function handleList() {
  try {
    var list = visibleRows().map(function (x) {
      var r = x.r;
      return {
        date:      r[0],
        name:      displayName(r[1]),   // never the full name
        classroom: r[2],
        id:        r[4] || String(x.row),
        signature: r[5] || null
        // r[3] (legacy contact) is intentionally never returned
      };
    });
    list.reverse();
    return jsonOut({ success: true, signatories: list });
  } catch (err) {
    return jsonOut({ success: false, error: 'server error' });
  }
}

// ── helpers ───────────────────────────────────────────────────────────
function clean(v) { return String(v == null ? '' : v).replace(/\s+/g, ' ').trim().slice(0, 60); }

/* Stop text from being interpreted as a spreadsheet formula */
function safe(v) { return /^[=+\-@]/.test(v) ? "'" + v : v; }

function displayName(name) {
  var parts = String(name || '').replace(/^'/, '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  if (parts.length === 1) return parts[0];
  return parts[0] + ' ' + parts[parts.length - 1].charAt(0) + '.';
}

function rateOk() {
  var cache = CacheService.getScriptCache();
  var n = Number(cache.get('pledge_rate') || 0);
  if (n >= RATE_MAX) return false;
  cache.put('pledge_rate', String(n + 1), RATE_WINDOW_SEC);
  return true;
}

function jsonOut(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
