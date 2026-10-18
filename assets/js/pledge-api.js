/* ==========================================================================
   SehaNoor pledge API — the Google Apps Script endpoint behind the
   pledge form and the honor board, plus the local (on-device) copy.

   Privacy: no contact details are collected; the honor board only shows a
   first name and a family initial (see displayName), and the device keeps
   only that masked name. Abuse guards: name/class validation, a honeypot,
   a minimum fill time and a per-device rate limit — repeated server-side
   in scripts/google-apps-script.gs.
   ========================================================================== */
(function () {
  "use strict";

  var GAS_URL = "https://script.google.com/macros/s/AKfycbya3AZcHpvrZ1yXHyjUAKNcFvuMjPmfnGV4r5QtZtFrOVOCelLtO8T4KdeyvVTOvAlq/exec";
  var LOCAL_KEY = "sehanoor_pledges";
  var TIMEOUT_MS = 9000;

  function withTimeout(promise) {
    return new Promise(function (resolve, reject) {
      var t = setTimeout(function () { reject(new Error("timeout")); }, TIMEOUT_MS);
      promise.then(function (v) { clearTimeout(t); resolve(v); }, function (e) { clearTimeout(t); reject(e); });
    });
  }

  function getJSON(url) {
    return withTimeout(fetch(url, { credentials: "omit" })).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    });
  }

  function local() {
    try {
      var list = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
      return Array.isArray(list) ? list : [];
    } catch (e) { return []; }
  }

  /* Only a minimal, already-masked copy is kept on the device, so a shared
     school computer never shows the previous student's full name, class or
     signature. Older full entries are migrated on load. */
  function minimal(e) {
    return { id: String(e.id || ""), name: displayName(e.name), date: e.date };
  }
  function saveLocal(entry) {
    try {
      var list = local();
      list.push(minimal(entry));
      localStorage.setItem(LOCAL_KEY, JSON.stringify(list.slice(-50)));
    } catch (e) { /* storage full or blocked: the remote copy still counts */ }
  }
  try {
    var stored = local();
    if (stored.some(function (e) { return e.signature || e.classroom || e.contact; })) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(stored.map(minimal)));
    }
  } catch (e) { /* ignore */ }

  /* ---------- abuse guards (client side; the Apps Script repeats them) ---------- */
  var NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s'’.\-]{1,39}$/u;
  var CLASS_RE = /^[\p{L}\p{M}\p{N}\s"'״׳.\-\/]{0,20}$/u;
  var LOG_KEY = "sehanoor_pledge_log";
  function validName(n) {
    var letters = (n.match(/\p{L}/gu) || []).length;
    return NAME_RE.test(n) && letters >= 2;
  }
  function validClass(c) { return CLASS_RE.test(c); }
  /* max 5 pledges per device per hour, 20 s apart (friends signing at a school station) */
  function rateCheck() {
    var now = Date.now(), log = [];
    try { log = JSON.parse(localStorage.getItem(LOG_KEY) || "[]").filter(function (t) { return now - t < 3600e3; }); } catch (e) { /* ignore */ }
    if (log.length && now - log[log.length - 1] < 20e3) return "wait";
    if (log.length >= 5) return "limit";
    return "ok";
  }
  function rateLog() {
    try {
      var now = Date.now();
      var log = JSON.parse(localStorage.getItem(LOG_KEY) || "[]").filter(function (t) { return now - t < 3600e3; });
      log.push(now);
      localStorage.setItem(LOG_KEY, JSON.stringify(log));
    } catch (e) { /* ignore */ }
  }

  /* "Ahmad Abu Rabia" → "Ahmad A." — keeps the board friendly without full names */
  function displayName(name) {
    var parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "";
    if (parts.length === 1) return parts[0];
    return parts[0] + " " + parts[parts.length - 1].charAt(0) + ".";
  }

  /* POST through a hidden form + iframe: the only reliable cross-origin
     submit to Apps Script without CORS headers. Fire-and-forget. */
  function submit(entry) {
    var frameName = "sn_gas_frame";
    var iframe = document.getElementById(frameName);
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = iframe.name = frameName;
      iframe.title = "submit";
      iframe.tabIndex = -1;
      iframe.setAttribute("aria-hidden", "true");
      iframe.style.cssText = "position:absolute;width:0;height:0;border:0;visibility:hidden";
      document.body.appendChild(iframe);
    }
    var form = document.createElement("form");
    form.method = "POST";
    form.action = GAS_URL;
    form.target = frameName;
    form.hidden = true;
    var input = document.createElement("input");
    input.type = "hidden";
    input.name = "payload";
    input.value = JSON.stringify(entry);
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
    setTimeout(function () { form.remove(); }, 5000);
  }

  window.SN = window.SN || {};
  window.SN.pledges = {
    local: local,
    saveLocal: saveLocal,
    validName: validName,
    validClass: validClass,
    rateCheck: rateCheck,
    rateLog: rateLog,
    submit: submit,
    displayName: displayName,
    count: function () {
      return getJSON(GAS_URL + "?action=count").then(function (j) {
        if (!j || !j.success) throw new Error("bad response");
        return Number(j.count) || 0;
      });
    },
    list: function () {
      return getJSON(GAS_URL).then(function (j) {
        if (!j || !j.success || !Array.isArray(j.signatories)) throw new Error("bad response");
        /* Drop anything we never display, even if the server still sends it */
        return j.signatories.map(function (s) {
          return { id: String(s.id || ""), name: displayName(s.name), classroom: s.classroom, date: s.date, signature: s.signature || null };
        });
      });
    }
  };
})();
