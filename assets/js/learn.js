/* ==========================================================================
   SehaNoor knowledge hub — article filter and daily health challenges.
   Challenge progress lives only in this browser (localStorage).
   ========================================================================== */
(function () {
  "use strict";
  var SN = window.SN;

  /* ---------- Article filter ---------- */
  var artChips = [].slice.call(document.querySelectorAll("[data-art-filter]"));
  artChips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.dataset.artFilter;
      artChips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
      [].forEach.call(document.querySelectorAll(".lib__item"), function (li) {
        li.hidden = !(f === "all" || li.dataset.cat === f);
      });
    });
  });

  /* ---------- Challenges ---------- */
  var root = document.querySelector("[data-challenges]");
  if (!root) return;

  var KEY = "sehanoor_challenges_v1";
  var GOALS = { water: 8, move: 60, food: 3, screen: 2 };
  var ORDER = ["water", "move", "food", "screen"];
  var mem = { days: {} };   /* used when storage is blocked */

  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY) || "null");
      if (d && d.days) return d;
    } catch (e) { /* fall through */ }
    return mem;
  }
  function save(d) {
    var keys = Object.keys(d.days).sort();
    while (keys.length > 60) delete d.days[keys.shift()];
    mem = d;
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* in-memory only */ }
  }
  function dayKey(date) {
    var d = date || new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function today() {
    var d = load(), k = dayKey();
    if (!d.days[k]) d.days[k] = { water: 0, move: 0, food: [], screen: [] };
    return { all: d, day: d.days[k] };
  }
  function doneMap(day) {
    day = day || {};
    return {
      water: (day.water || 0) >= GOALS.water,
      move: (day.move || 0) >= GOALS.move,
      food: (day.food || []).length >= GOALS.food,
      screen: (day.screen || []).length >= GOALS.screen
    };
  }
  function countDone(day) {
    var m = doneMap(day);
    return ORDER.filter(function (k) { return m[k]; }).length;
  }

  /* water glasses */
  var glassesBox = root.querySelector("[data-glasses]");
  for (var g = 1; g <= GOALS.water; g++) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "glass";
    b.dataset.n = g;
    b.innerHTML = '<svg class="icon" aria-hidden="true"><use href="assets/img/icons.svg#drop-sm"/></svg>';
    glassesBox.appendChild(b);
  }
  glassesBox.addEventListener("click", function (e) {
    var btn = e.target.closest(".glass");
    if (!btn) return;
    var t = today(), n = +btn.dataset.n;
    t.day.water = t.day.water === n ? n - 1 : n;
    save(t.all); paint();
  });

  /* movement */
  [].forEach.call(root.querySelectorAll("[data-move]"), function (btn) {
    btn.addEventListener("click", function () {
      var t = today();
      t.day.move = Math.max(0, Math.min(180, (t.day.move || 0) + parseInt(btn.dataset.move, 10)));
      save(t.all); paint();
    });
  });

  /* checklists */
  [].forEach.call(root.querySelectorAll('[data-ch="food"], [data-ch="screen"]'), function (card) {
    var key = card.dataset.ch;
    card.addEventListener("change", function (e) {
      if (e.target.type !== "checkbox") return;
      var t = today();
      t.day[key] = [].filter.call(card.querySelectorAll("input:checked"), Boolean).map(function (i) { return i.value; });
      save(t.all); paint();
    });
  });

  /* reset */
  document.querySelector("[data-ch-reset]").addEventListener("click", function () {
    var ok = window.confirm(SN.t({ ar: "مسح كل بيانات التحديات من هذا الجهاز؟", he: "למחוק את כל נתוני האתגרים מהמכשיר הזה?" }));
    if (!ok) return;
    mem = { days: {} };
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    paint();
    SN.toast({ ar: "تم مسح البيانات", he: "הנתונים נמחקו" });
  });

  function streak(all) {
    var n = 0, d = new Date();
    if (countDone(all.days[dayKey(d)]) < 2) d.setDate(d.getDate() - 1); /* today still in progress */
    while (countDone(all.days[dayKey(d)]) >= 2) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  function paint() {
    var t = today(), day = t.day, done = doneMap(day);
    var locale = SN.i18n.lang === "he" ? "he-IL" : "ar";

    /* water */
    [].forEach.call(glassesBox.children, function (btn) {
      var n = +btn.dataset.n, on = n <= day.water;
      btn.classList.toggle("is-full", on);
      btn.setAttribute("aria-pressed", String(on));
      btn.setAttribute("aria-label", SN.t({ ar: "الكوب " + n, he: "כוס " + n }));
    });
    status("water", day.water + " / " + GOALS.water + " " + SN.t({ ar: "أكواب", he: "כוסות" }));

    /* move */
    var bar = root.querySelector("[data-move-bar]");
    bar.setAttribute("aria-valuenow", Math.min(day.move, 60));
    bar.firstElementChild.style.width = Math.min(100, day.move / GOALS.move * 100) + "%";
    status("move", day.move + " / " + GOALS.move + " " + SN.t({ ar: "دقيقة", he: "דקות" }));

    /* lists */
    ["food", "screen"].forEach(function (k) {
      var card = root.querySelector('[data-ch="' + k + '"]');
      [].forEach.call(card.querySelectorAll("input"), function (i) { i.checked = day[k].indexOf(i.value) > -1; });
      status(k, day[k].length + " / " + GOALS[k]);
    });

    ORDER.forEach(function (k) { root.querySelector('[data-ch="' + k + '"]').classList.toggle("is-done", done[k]); });

    /* summary */
    var n = countDone(day);
    document.querySelector("[data-ch-done]").textContent = n;
    document.querySelector("[data-ch-ring]").style.setProperty("--p", n / 4 * 100);
    var s = streak(t.all);
    document.querySelector("[data-ch-streak-text]").textContent = s
      ? SN.t({ ar: s + " يوم متتالٍ بتحديين أو أكثر", he: s + " ימים ברצף עם שני אתגרים או יותר" })
      : SN.t({ ar: "أكملوا تحديين اليوم لبدء سلسلة", he: "השלימו שני אתגרים היום כדי להתחיל רצף" });

    /* week */
    var week = document.querySelector("[data-week]");
    week.innerHTML = "";
    for (var i = 6; i >= 0; i--) {
      var d = new Date(); d.setDate(d.getDate() - i);
      var m = doneMap(t.all.days[dayKey(d)]);
      var li = document.createElement("li");
      li.className = "week__day" + (i === 0 ? " is-today" : "");
      var dots = ORDER.map(function (k) { return '<i class="week__dot week__dot--' + k + (m[k] ? " is-on" : "") + '"></i>'; }).join("");
      var label = d.toLocaleDateString(locale, { weekday: "short" });
      var c = ORDER.filter(function (k) { return m[k]; }).length;
      li.innerHTML = '<span class="week__name">' + label + '</span><span class="week__dots" aria-hidden="true">' + dots + '</span>' +
        '<span class="visually-hidden">' + SN.t({ ar: c + " من 4 تحديات", he: c + " מתוך 4 אתגרים" }) + "</span>";
      week.appendChild(li);
    }
  }

  function status(k, text) {
    root.querySelector('[data-ch="' + k + '"] [data-status]').textContent = text;
  }

  paint();
  SN.i18n.onChange(paint);
})();
