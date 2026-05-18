/**
 * SEHANOOR — Google Apps Script (Container-Bound)
 * ─────────────────────────────────────────────────
 * POST → يحفظ التوقيع الجديد (مع صورة التوقيع)
 * GET  → يرجع قائمة الموقّعين
 */

// ── POST: حفظ توقيع جديد ─────────────────────────────────
function doPost(e) {
  try {
    // البيانات تأتي في حقل payload كـ JSON string من form submission
    var raw  = (e.parameter && e.parameter.payload) ? e.parameter.payload
             : (e.postData  && e.postData.contents)  ? e.postData.contents
             : '{}';
    var data = JSON.parse(raw);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    var sig = String(data.signature || '');
    if (sig.length > 49000) sig = sig.substring(0, 49000);

    sheet.appendRow([
      data.date      || new Date().toISOString(),
      data.name      || '',
      data.classroom || '',
      data.contact   || '',
      data.id        || '',
      sig
    ]);

    return jsonOut({ success: true });
  } catch (err) {
    return jsonOut({ success: false, error: err.toString() });
  }
}

// ── GET: إرجاع البيانات حسب الطلب ───────────────────────
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'list';

  if (action === 'count') return handleCount();  // عدد فقط (خفيف)
  return handleList();                           // القائمة الكاملة
}

// العدد فقط — سريع جداً
function handleCount() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var count = Math.max(0, sheet.getLastRow() - 1); // اطرح سطر العناوين
    return jsonOut({ success: true, count: count });
  } catch (err) {
    return jsonOut({ success: false, error: err.toString() });
  }
}

// القائمة الكاملة مع التوقيعات
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
        id:        r[4] || String(i),
        signature: r[5] || null
      });
    }

    list.reverse();
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
