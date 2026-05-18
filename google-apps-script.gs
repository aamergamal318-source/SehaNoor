/**
 * SEHANOOR — Google Apps Script (Container-Bound)
 * ─────────────────────────────────────────────────
 * POST → يحفظ التوقيع الجديد (مع صورة التوقيع)
 * GET  → يرجع قائمة الموقّعين
 */

// ── POST: حفظ توقيع جديد ─────────────────────────────────
function doPost(e) {
  try {
    var data  = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // الصورة base64 — نقطع إذا تجاوزت حد الخلية (49000 حرف)
    var sig = String(data.signature || '');
    if (sig.length > 49000) sig = sig.substring(0, 49000);

    sheet.appendRow([
      new Date().toISOString(),  // A: التاريخ
      data.name      || '',      // B: الاسم
      data.classroom || '',      // C: الصف
      data.contact   || '',      // D: التواصل
      data.id        || '',      // E: المعرف
      sig                        // F: التوقيع (base64)
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
