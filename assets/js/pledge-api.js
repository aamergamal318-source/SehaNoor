/* ==========================================================================
   SehaNoor pledge API — the Google Apps Script endpoint behind the
   pledge form and the honor board, plus the local (on-device) copy.

   Privacy: the client never sends or shows contact details, and the
   honor board only shows a first name and an initial (see displayName).
   ========================================================================== */
(function () {
  "use strict";

  var GAS_URL = "https://script.google.com/macros/s/AKfycbw3sf6B9CsXjD8K3_MqO1_Yid4x4T-I84zTUwwMYmTUz2tXzK314D-eNd-TN6NB41iq/exec";
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

  function saveLocal(entry) {
    try {
      var list = local();
      list.push(entry);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
    } catch (e) { /* storage full or blocked: the remote copy still counts */ }
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
          return { id: String(s.id || ""), name: s.name, classroom: s.classroom, date: s.date, signature: s.signature || null };
        });
      });
    }
  };
})();
