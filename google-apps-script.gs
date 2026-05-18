/**
 * SEHANOOR — Google Apps Script (Container-Bound)
 * ─────────────────────────────────────────────────
 * يُستخدم هذا الكود من داخل Google Sheets مباشرةً
 * Extensions > Apps Script > Delete all > Paste this
 */

// ── نقطة الدخول الوحيدة ──────────────────────────────────
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'list';
  if (action === 'save') return handleSave(e.parameter);
  return handleList();
}

// ── حفظ توقيع جديد ───────────────────────────────────────
function handleSave(p) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      new Date().toISOString(),
      p.name      || '',
      p.classroom || '',
      p.contact   || '',
      p.id        || ''
    ]);
    return jsonOut({ success: true });
  } catch (err) {
    return jsonOut({ success: false, error: err.toString() });
  }
}

// ── إرجاع كل التوقيعات ───────────────────────────────────
function handleList() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rows  = sheet.getDataRange().getValues();
    var list  = [];

    for (var i = 1; i < rows.length; i++) {
      var r = rows[i];
      if (!r[1]) continue;
      list.push({
        date:      r[0],
        name:      r[1],
        classroom: r[2],
        contact:   r[3],
        id:        r[4] || String(i)
      });
    }

    list.reverse(); // أحدث أولاً
    return jsonOut({ success: true, signatories: list });
  } catch (err) {
    return jsonOut({ success: false, error: err.toString() });
  }
}

// ── مساعد ─────────────────────────────────────────────────
function jsonOut(data) {
  var out = ContentService.createTextOutput(JSON.stringify(data));
  out.setMimeType(ContentService.MimeType.JSON);
  return out;
}
