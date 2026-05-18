/**
 * SEHANOOR — Google Apps Script Backend (النسخة النهائية)
 * ─────────────────────────────────────────────────────────
 * كل شيء يعمل عبر GET لتجنب مشكلة CORS
 * Everything works via GET to avoid CORS issues
 */

var SHEET_NAME = 'Pledges';
var FILE_NAME  = 'SehaNoor — توقيعات الميثاق';

// ── نقطة الدخول الوحيدة (GET) ────────────────────────────
function doGet(e) {
  var action = (e.parameter && e.parameter.action) ? e.parameter.action : 'list';

  if (action === 'save') {
    return handleSave(e.parameter);
  } else {
    return handleList();
  }
}

// ── حفظ توقيع جديد ───────────────────────────────────────
function handleSave(p) {
  try {
    var sheet = getSheet();
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
    var sheet = getSheet();
    var rows  = sheet.getDataRange().getValues();

    var list = [];
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

// ── مساعد: احصل على الورقة أو أنشئها ─────────────────────
function getSheet() {
  var props = PropertiesService.getScriptProperties();
  var ssId  = props.getProperty('SS_ID');
  var ss;

  if (ssId) {
    try { ss = SpreadsheetApp.openById(ssId); } catch (e) { ss = null; }
  }

  if (!ss) {
    ss = SpreadsheetApp.create(FILE_NAME);
    props.setProperty('SS_ID', ss.getId());
    Logger.log('Sheet URL: ' + ss.getUrl());
  }

  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.getActiveSheet();
    sheet.setName(SHEET_NAME);
    sheet.appendRow(['التاريخ', 'الاسم الكامل', 'الصف', 'التواصل', 'المعرف']);
    sheet.setFrozenRows(1);
    sheet.setColumnWidths(1, 5, 180);
  }

  return sheet;
}

// ── مساعد: إرجاع JSON ─────────────────────────────────────
function jsonOut(data) {
  var out = ContentService.createTextOutput(JSON.stringify(data));
  out.setMimeType(ContentService.MimeType.JSON);
  return out;
}
