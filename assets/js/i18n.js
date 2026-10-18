/* ==========================================================================
   SehaNoor i18n — one engine for every page.

   Arabic is the source language and lives in the markup. Hebrew lives next
   to it in data attributes, so each string is translated where it is used:

     data-he              → textContent
     data-he-html         → innerHTML (only for trusted, authored markup)
     data-he-aria-label   → aria-label
     data-he-alt          → alt
     data-he-placeholder  → placeholder
     data-he-title        → title
     data-he-content      → content (meta tags)

   Strings created in JavaScript use SN.t({ ar: "…", he: "…" }).
   Both languages are RTL, so only `lang` changes on <html>.
   ========================================================================== */
(function () {
  "use strict";

  var KEY = "ortbari_lang";
  var LANGS = ["ar", "he"];
  var NAMES = { ar: "العربية", he: "עברית" };
  var SWITCH_LABEL = { ar: "التبديل إلى العبرية", he: "החלפה לערבית" };

  var BINDINGS = [
    { attr: "he",          kind: "text" },
    { attr: "heHtml",      kind: "html" },
    { attr: "heAriaLabel", kind: "aria-label" },
    { attr: "heAlt",       kind: "alt" },
    { attr: "hePlaceholder", kind: "placeholder" },
    { attr: "heTitle",     kind: "title" },
    { attr: "heContent",   kind: "content" }
  ];

  function toKebab(s) { return s.replace(/[A-Z]/g, function (m) { return "-" + m.toLowerCase(); }); }

  function storedLang() {
    try {
      var q = new URLSearchParams(location.search).get("lang");
      if (LANGS.indexOf(q) > -1) { localStorage.setItem(KEY, q); return q; }
      var s = localStorage.getItem(KEY);
      if (LANGS.indexOf(s) > -1) return s;
    } catch (e) { /* storage blocked: fall back to Arabic */ }
    return "ar";
  }

  var current = storedLang();
  var listeners = [];

  function read(el, kind) {
    if (kind === "text") return el.textContent;
    if (kind === "html") return el.innerHTML;
    return el.getAttribute(kind) || "";
  }
  function write(el, kind, value) {
    if (kind === "text") el.textContent = value;
    else if (kind === "html") el.innerHTML = value;
    else el.setAttribute(kind, value);
  }

  function apply(root) {
    root = root || document;
    BINDINGS.forEach(function (b) {
      var sel = "[data-" + toKebab(b.attr) + "]";
      var nodes = root.querySelectorAll(sel);
      if (root !== document && root.matches && root.matches(sel)) nodes = [root].concat([].slice.call(nodes));
      [].forEach.call(nodes, function (el) {
        var store = "ar" + b.attr.charAt(0).toUpperCase() + b.attr.slice(1);
        if (current === "he") {
          if (!(store in el.dataset)) el.dataset[store] = read(el, b.kind);
          write(el, b.kind, el.dataset[b.attr]);
        } else if (store in el.dataset) {
          write(el, b.kind, el.dataset[store]);
        }
      });
    });
  }

  function syncToggles() {
    var other = current === "ar" ? "he" : "ar";
    [].forEach.call(document.querySelectorAll("[data-lang-toggle]"), function (btn) {
      btn.setAttribute("aria-label", SWITCH_LABEL[current]);
      var label = btn.querySelector("[data-lang-label]");
      if (label) { label.textContent = NAMES[other]; label.setAttribute("lang", other); }
    });
  }

  function setLang(lang, opts) {
    if (LANGS.indexOf(lang) < 0) return;
    current = lang;
    try { localStorage.setItem(KEY, lang); } catch (e) { /* ignore */ }
    document.documentElement.lang = lang;
    document.documentElement.dir = "rtl";
    apply(document);
    syncToggles();
    document.documentElement.classList.remove("i18n-pending");
    if (!opts || !opts.silent) {
      listeners.forEach(function (fn) { try { fn(lang); } catch (e) { console.error(e); } });
      document.dispatchEvent(new CustomEvent("sn:langchange", { detail: { lang: lang } }));
    }
  }

  window.SN = window.SN || {};
  window.SN.i18n = {
    get lang() { return current; },
    set: setLang,
    toggle: function () { setLang(current === "ar" ? "he" : "ar"); },
    apply: apply,
    onChange: function (fn) { listeners.push(fn); },
    names: NAMES
  };
  /* Pick the string for the active language: SN.t({ar:"…", he:"…"}) */
  window.SN.t = function (pair) {
    if (pair == null) return "";
    if (typeof pair === "string") return pair;
    return pair[current] != null ? pair[current] : pair.ar;
  };

  function init() {
    setLang(current, { silent: true });
    document.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest("[data-lang-toggle]");
      if (btn) { e.preventDefault(); window.SN.i18n.toggle(); }
    });
  }

  /* Loaded at the end of <body>, so the markup above is already parsed. */
  if (document.body) init();
  else document.addEventListener("DOMContentLoaded", init);
})();
