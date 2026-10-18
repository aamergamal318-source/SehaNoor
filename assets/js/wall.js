/* ==========================================================================
   SehaNoor honor board — renders pledges (remote + this device), with
   privacy-safe names (first name + family initial).
   ========================================================================== */
(function () {
  "use strict";
  var SN = window.SN;
  var API = SN.pledges;
  var grid = document.querySelector("[data-wall-grid]");
  var empty = document.querySelector("[data-wall-empty]");
  var status = document.querySelector("[data-wall-status]");
  var countEl = document.querySelector("[data-wall-count]");
  var search = document.querySelector("[data-wall-search]");
  var all = [], state = "loading";

  var TONES = ["leaf", "sky", "sand", "rose", "terra"];
  function tone(id) {
    var h = 0;
    for (var i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
    return TONES[Math.abs(h) % TONES.length];
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function fmtDate(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return "";
    return d.toLocaleDateString(SN.i18n.lang === "he" ? "he-IL" : "ar", { year: "numeric", month: "long", day: "numeric" });
  }
  function safeSig(src) {
    return typeof src === "string" && /^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(src) ? src : null;
  }

  function card(s, i) {
    var name = API.displayName(s.name);
    var sig = safeSig(s.signature);
    return '<li class="sig-card sig-card--' + tone(s.id || name) + '" style="--d:' + Math.min(i, 16) * 45 + 'ms">' +
      '<div class="sig-card__top"><span class="sig-card__avatar" aria-hidden="true">' + esc(name.charAt(0)) + "</span>" +
      '<div><p class="sig-card__name">' + esc(name) + "</p>" +
      (s.classroom ? '<p class="sig-card__class">' + esc(s.classroom) + "</p>" : "") + "</div></div>" +
      (sig ? '<div class="sig-card__sig"><img src="' + sig + '" alt="' + esc(SN.t({ ar: "توقيع ", he: "החתימה של " }) + name) + '" loading="lazy"></div>'
           : '<div class="sig-card__sig sig-card__sig--none" aria-hidden="true"><svg class="icon"><use href="assets/img/icons.svg#pen"/></svg></div>') +
      '<p class="sig-card__date">' + fmtDate(s.date) + "</p></li>";
  }

  function render() {
    var q = (search.value || "").trim().toLowerCase();
    var list = q ? all.filter(function (s) {
      return API.displayName(s.name).toLowerCase().indexOf(q) > -1 || String(s.classroom || "").toLowerCase().indexOf(q) > -1;
    }) : all;
    grid.innerHTML = list.map(card).join("");
    grid.setAttribute("aria-busy", "false");
    empty.hidden = all.length > 0 || state === "loading";
    if (state === "loading" && !all.length) {
      grid.innerHTML = new Array(6).join(".").split(".").map(function () { return '<li class="sig-card sig-card--skeleton" aria-hidden="true"></li>'; }).join("");
      grid.setAttribute("aria-busy", "true");
    }
    var msg = "";
    if (state === "loading") msg = SN.t({ ar: "جارٍ تحميل التوقيعات…", he: "טוען חתימות…" });
    else if (state === "offline") msg = SN.t({ ar: "تعذّر الاتصال الآن — تُعرض التوقيعات المحفوظة على هذا الجهاز فقط.", he: "אין חיבור כרגע — מוצגות רק החתימות השמורות במכשיר הזה." });
    else if (q) msg = SN.t({ ar: list.length + " نتيجة", he: list.length + " תוצאות" });
    status.textContent = msg;
  }

  function setCount(n) {
    countEl.dataset.count = n;
    if (SN.runCounter) SN.runCounter(countEl); else countEl.textContent = n;
  }

  /* 1) this device first */
  var local = API.local().slice().reverse();
  all = local.map(function (s) { return { id: String(s.id || ""), name: s.name, classroom: s.classroom, date: s.date, signature: s.signature }; });
  if (all.length) setCount(all.length);
  render();

  /* 2) the shared board */
  API.list().then(function (remote) {
    var localSig = {};
    local.forEach(function (s) { if (s.signature) localSig[s.id] = s.signature; });
    var ids = {};
    remote.forEach(function (s) { ids[s.id] = true; if (!s.signature && localSig[s.id]) s.signature = localSig[s.id]; });
    all = remote.concat(all.filter(function (s) { return !ids[s.id]; }));
    state = "ready";
    setCount(all.length);
    grid.classList.add("is-entering");
    render();
    setTimeout(function () { grid.classList.remove("is-entering"); }, 1600);
  }).catch(function () {
    state = "offline";
    setCount(all.length);
    render();
  });

  search.addEventListener("input", render);
  SN.i18n.onChange(render);
})();
