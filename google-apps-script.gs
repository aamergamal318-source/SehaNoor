/**
 * SEHANOOR — Google Apps Script Backend
 * ─────────────────────────────────────
 * هذا الكود يُنسخ كاملاً في محرر Apps Script
 * Copy this entire file into your Google Apps Script editor
 *
 * SETUP:
 * 1. Go to: https://script.google.com
 * 2. Click "New project"
 * 3. Delete all existing code, paste this file
 * 4. Click Deploy > New deployment > Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Click Deploy, copy the URL
 * 6. Paste the URL into pledge.js and signatories.html where it says GAS_URL = ''
 */

var SHEET_NAME = 'Pledges';

// ── Receive a new pledge (POST) ──────────────────────────────────────────
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getOrCreateSheet();

    // Signatures are base64 — truncate if over 49 000 chars to fit cell limit
    var sig = (data.signature || '').toString();
    if (sig.length > 49000) sig = sig.substring(0, 49000);

    sheet.appendRow([
      new Date().toISOString(),   // A: date
      data.name      || '',       // B: full name
      data.classroom || '',       // C: class
      data.contact   || '',       // D: email / phone
      sig,                        // E: base64 signature image
      data.id        || ''        // F: unique id
    ]);

    return jsonOut({ success: true });
  } catch (err) {
    return jsonOut({ success: false, error: err.toString() });
  }
}

// ── Return all pledges (GET) ─────────────────────────────────────────────
function doGet(e) {
  try {
    var sheet = getOrCreateSheet();
    var rows  = sheet.getDataRange().getValues();

    var signatories = [];
    for (var i = 1; i < rows.length; i++) {   // skip header row (row 0)
      var r = rows[i];
      if (!r[1]) continue;                     // skip empty rows
      signatories.push({
        date:      r[0],
        name:      r[1],
        classroom: r[2],
        contact:   r[3],
        signature: r[4],
        id:        r[5] || String(i)
      });
    }

    // Return newest first
    signatories.reverse();

    return jsonOut({ success: true, signatories: signatories });
  } catch (err) {
    return jsonOut({ success: false, error: err.toString() });
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────
function getOrCreateSheet() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Add header row
    sheet.appendRow(['التاريخ', 'الاسم الكامل', 'الصف', 'التواصل', 'التوقيع (base64)', 'المعرف']);
    sheet.setFrozenRows(1);
    // Widen columns for readability
    sheet.setColumnWidth(1, 180);
    sheet.setColumnWidth(2, 160);
    sheet.setColumnWidth(3, 100);
    sheet.setColumnWidth(4, 160);
    sheet.setColumnWidth(5, 60);
    sheet.setColumnWidth(6, 120);
  }
  return sheet;
}

function jsonOut(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
