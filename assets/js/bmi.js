/* ==========================================================================
   SehaNoor BMI tool

   Ages 5–19: BMI-for-age percentile from the CDC 2000 LMS reference
   (window.CDC_BMI_LMS, monthly rows from 60.5 months). Categories follow
   CDC cut-offs (<5th, 5th–<85th, 85th–<95th, ≥95th) but are described in
   neutral, non-stigmatising language with no weight-loss instructions.
   Age 20+: WHO adult BMI categories.
   Nothing is stored or sent; the calculation runs in the browser.
   ========================================================================== */
(function () {
  "use strict";
  var SN = window.SN;
  var LMS = window.CDC_BMI_LMS;
  var form = document.querySelector("[data-bmi-form]");
  if (!form || !LMS) return;

  var out = document.querySelector("[data-bmi-result]");
  var errEl = document.querySelector("[data-bmi-error]");
  var resetBtn = document.querySelector("[data-bmi-reset]");
  var last = null;

  /* Standard normal CDF (Abramowitz & Stegun 7.1.26, |error| < 1.5e-7) */
  function normCdf(z) {
    var t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
    var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z / 2);
    return z >= 0 ? (1 + y) / 2 : (1 - y) / 2;
  }

  /* Linear interpolation between monthly LMS rows */
  function lmsAt(sex, ageMonths) {
    var rows = LMS[sex];
    var x = Math.max(0, Math.min(rows.length - 1, ageMonths - LMS.start));
    var i = Math.floor(x), f = x - i;
    var a = rows[i], b = rows[Math.min(i + 1, rows.length - 1)];
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
  }

  function percentile(bmi, sex, ageMonths) {
    var p = lmsAt(sex, ageMonths), L = p[0], M = p[1], S = p[2];
    var z = L !== 0 ? (Math.pow(bmi / M, L) - 1) / (L * S) : Math.log(bmi / M) / S;
    return normCdf(z) * 100;
  }

  var T = {
    errAge:    { ar: "أدخلوا عمراً بين 5 و120 سنة.", he: "הזינו גיל בין 5 ל-120." },
    errHeight: { ar: "أدخلوا طولاً بين 80 و230 سم.", he: 'הזינו גובה בין 80 ל-230 ס"מ.' },
    errWeight: { ar: "أدخلوا وزناً بين 15 و250 كغ.", he: 'הזינו משקל בין 15 ל-250 ק"ג.' },
    errBmi:    { ar: "النتيجة غير منطقية — تحقّقوا من الطول والوزن.", he: "התוצאה אינה סבירה — בדקו את הגובה והמשקל." },
    yourBmi:   { ar: "مؤشر كتلة الجسم", he: "מדד מסת הגוף" },
    pctLabel:  { ar: "المئين لعمرك وجنسك", he: "האחוזון לגילך ולמינך" },
    pctExplain:{ ar: "يعني أن مؤشرك أعلى من نحو {p}% ممن هم في عمرك وجنسك.", he: "כלומר המדד שלך גבוה מכ-{p}% מבני גילך ומינך." },
    teenNote:  { ar: "في سنوات النمو يتغيّر الجسم بسرعة، والمئين يتغيّر معه. نتيجة واحدة ليست حكماً على صحتك.", he: "בשנות הגדילה הגוף משתנה מהר, והאחוזון משתנה איתו. תוצאה אחת אינה קביעה לגבי הבריאות שלך." },
    adultNote: { ar: "للبالغين يُستخدم تصنيف منظمة الصحة العالمية. BMI لا يميّز بين العضل والدهون.", he: "למבוגרים משמש הסיווג של ארגון הבריאות העולמי. BMI אינו מבדיל בין שריר לשומן." },
    habitsTitle: { ar: "عادات تفيد الجميع، مهما كانت النتيجة", he: "הרגלים שמועילים לכולם, בכל תוצאה" },
    habits: [
      { ar: "اشرب الماء بانتظام طوال اليوم.", he: "שתו מים באופן קבוע לאורך היום." },
      { ar: "تحرّك نحو 60 دقيقة يومياً بنشاط تستمتع به.", he: "זוזו כ-60 דקות ביום, בפעילות שאתם נהנים ממנה." },
      { ar: "نم 8–10 ساعات في الليلة.", he: "ישנו 8–10 שעות בלילה." },
      { ar: "أضف خضاراً وفاكهة إلى وجباتك، ولا تتخطَّ الإفطار.", he: "הוסיפו ירקות ופירות לארוחות, ואל תוותרו על ארוחת הבוקר." },
      { ar: "تحدّث عن جسمك بلطف — وعن أجسام الآخرين أيضاً.", he: "דברו על הגוף שלכם בעדינות — וגם על גופם של אחרים." }
    ],
    talk: { ar: "يُفضَّل الحديث مع ممرضة المدرسة أو طبيب/ة العائلة لتقييم كامل يأخذ في الحسبان النمو والتاريخ الصحي. لا تبدأ أي حمية بنفسك.", he: "מומלץ לשוחח עם אחות בית הספר או עם רופא/ת המשפחה להערכה מלאה שמביאה בחשבון גדילה והיסטוריה רפואית. אל תתחילו דיאטה לבד." },
    fine: { ar: "استمر في العادات التي تشعرك بالنشاط والراحة.", he: "המשיכו בהרגלים שגורמים לכם להרגיש אנרגטיים ורגועים." },
    scaleTeen: [
      { ar: "أقل من المتوقع", he: "מתחת לצפוי" },
      { ar: "النطاق الصحي", he: "הטווח הבריא" },
      { ar: "أعلى", he: "מעל" },
      { ar: "مرتفع", he: "גבוה" }
    ],
    teenCats: [
      { ar: "أقل من النطاق المتوقع لعمرك", he: "מתחת לטווח הצפוי לגילך" },
      { ar: "ضمن النطاق الصحي لعمرك", he: "בטווח הבריא לגילך" },
      { ar: "أعلى من النطاق الصحي لعمرك", he: "מעל הטווח הבריא לגילך" },
      { ar: "في النطاق المرتفع لعمرك", he: "בטווח הגבוה לגילך" }
    ],
    adultCats: [
      { ar: "أقل من النطاق الصحي", he: "מתחת לטווח הבריא" },
      { ar: "ضمن النطاق الصحي", he: "בטווח הבריא" },
      { ar: "أعلى من النطاق الصحي", he: "מעל הטווח הבריא" },
      { ar: "في النطاق المرتفع", he: "בטווח הגבוה" }
    ]
  };

  function fmtPct(p) {
    if (p < 1) return "<1";
    if (p > 99) return ">99";
    return String(Math.round(p));
  }

  function scaleHTML(bands, pos, labels) {
    /* bands: [[from,to,cls]], pos: 0–100 */
    var segs = bands.map(function (b, i) {
      return '<span class="bmi-scale__seg bmi-scale__seg--' + b[2] + '" style="flex-basis:' + (b[1] - b[0]) + '%"><span class="bmi-scale__lbl">' + SN.t(labels[i]) + '</span></span>';
    }).join("");
    return '<div class="bmi-scale" aria-hidden="true"><div class="bmi-scale__track">' + segs + '</div>' +
      '<span class="bmi-scale__marker" style="--pos:' + pos.toFixed(1) + '%"></span></div>';
  }

  function render(r) {
    var teen = r.age < 20;
    var cat, html = "";
    if (teen) {
      cat = r.pct < 5 ? 0 : r.pct < 85 ? 1 : r.pct < 95 ? 2 : 3;
    } else {
      cat = r.bmi < 18.5 ? 0 : r.bmi < 25 ? 1 : r.bmi < 30 ? 2 : 3;
    }
    var catLabel = SN.t((teen ? T.teenCats : T.adultCats)[cat]);
    var tone = ["low", "ok", "mid", "high"][cat];

    html += '<div class="bmi-out bmi-out--' + tone + '">';
    html += '<div class="bmi-out__nums">';
    html += '<div><span class="bmi-out__k">' + SN.t(T.yourBmi) + '</span><span class="bmi-out__v num">' + r.bmi.toFixed(1) + '</span></div>';
    if (teen) html += '<div><span class="bmi-out__k">' + SN.t(T.pctLabel) + '</span><span class="bmi-out__v num">' + fmtPct(r.pct) + '</span></div>';
    html += '</div>';
    html += '<p class="bmi-out__cat">' + catLabel + '</p>';

    if (teen) {
      html += scaleHTML([[0, 5, "low"], [5, 85, "ok"], [85, 95, "mid"], [95, 100, "high"]], Math.max(1, Math.min(99, r.pct)), T.scaleTeen);
      html += '<p class="bmi-out__explain">' + SN.t(T.pctExplain).replace("{p}", fmtPct(r.pct).replace(/[<>]/g, "")) + '</p>';
      html += '<p class="bmi-out__note">' + SN.t(T.teenNote) + '</p>';
    } else {
      var pos = (Math.max(15, Math.min(40, r.bmi)) - 15) / 25 * 100;
      html += scaleHTML([[0, 14, "low"], [14, 40, "ok"], [40, 60, "mid"], [60, 100, "high"]], pos, T.adultCats);
      html += '<p class="bmi-out__note">' + SN.t(T.adultNote) + '</p>';
    }
    html += '<p class="bmi-out__talk">' + SN.t(cat === 1 ? T.fine : T.talk) + '</p>';
    html += '<h3 class="bmi-out__habits-title">' + SN.t(T.habitsTitle) + '</h3><ul class="bmi-out__habits">' +
      T.habits.map(function (h) { return "<li>" + SN.t(h) + "</li>"; }).join("") + "</ul>";
    html += "</div>";
    out.innerHTML = html;
    out.hidden = false;
  }

  function fail(msg, field) {
    errEl.textContent = SN.t(msg);
    errEl.hidden = false;
    [].forEach.call(form.querySelectorAll(".input"), function (i) { i.removeAttribute("aria-invalid"); });
    if (field) { field.setAttribute("aria-invalid", "true"); field.focus(); }
    out.hidden = true;
    last = null;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ageEl = form.age, hEl = form.height, wEl = form.weight;
    var age = parseInt(ageEl.value, 10);
    var months = parseInt(form.months.value, 10) || 0;
    var h = parseFloat(hEl.value), w = parseFloat(wEl.value);
    if (!(age >= 5 && age <= 120)) return fail(T.errAge, ageEl);
    if (!(h >= 80 && h <= 230)) return fail(T.errHeight, hEl);
    if (!(w >= 15 && w <= 250)) return fail(T.errWeight, wEl);
    var bmi = w / Math.pow(h / 100, 2);
    if (bmi < 8 || bmi > 80) return fail(T.errBmi, wEl);
    errEl.hidden = true;
    [].forEach.call(form.querySelectorAll(".input"), function (i) { i.removeAttribute("aria-invalid"); });
    var sex = form.sex.value === "f" ? "f" : "m";
    last = { age: age, bmi: bmi, sex: sex };
    if (age < 20) last.pct = percentile(bmi, sex, age * 12 + months + 0.5);
    render(last);
    resetBtn.hidden = false;
    out.focus({ preventScroll: true });
    out.scrollIntoView({ behavior: SN.reduceMotion ? "auto" : "smooth", block: "nearest" });
  });

  form.addEventListener("reset", function () {
    out.hidden = true;
    errEl.hidden = true;
    resetBtn.hidden = true;
    last = null;
    setTimeout(function () { form.age.focus(); }, 0);
  });

  SN.i18n.onChange(function () {
    if (last) render(last);
    if (!errEl.hidden) errEl.hidden = true;
  });

  /* exposed for automated checks */
  SN.bmi = { percentile: percentile };
})();
