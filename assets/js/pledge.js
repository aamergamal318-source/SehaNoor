/* ==========================================================================
   SehaNoor pledge page — signature pad, validation, submission.
   ========================================================================== */
(function () {
  "use strict";
  var SN = window.SN;
  var API = SN.pledges;

  /* ---------- live count + recent initials ---------- */
  var countEls = document.querySelectorAll("[data-pledge-count]");
  function showCount(n) { [].forEach.call(countEls, function (el) { el.textContent = Number(n).toLocaleString("en-US"); }); }
  var localN = API.local().length;
  if (localN) showCount(localN);
  API.list().then(function (list) {
    showCount(Math.max(list.length, localN));
    var box = document.querySelector("[data-recent]");
    if (box) {
      box.innerHTML = list.slice(0, 5).map(function (s) {
        var ch = String(s.name || "").trim().charAt(0);
        return ch ? "<span>" + ch.replace(/[<&>]/g, "") + "</span>" : "";
      }).join("");
      if (list.length > 5) box.insertAdjacentHTML("beforeend", '<span class="more num">+' + (list.length - 5) + "</span>");
    }
  }).catch(function () { if (!localN) showCount(0); });

  /* ---------- signature pad (pointer events: mouse, touch, pen) ---------- */
  var pad = document.querySelector("[data-sigpad]");
  var canvas = pad.querySelector("canvas");
  var ctx = canvas.getContext("2d");
  var undoBtn = document.querySelector("[data-sig-undo]");
  var clearBtn = document.querySelector("[data-sig-clear]");
  var strokes = [], current = null;

  function size() {
    var r = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }
  function path(c, pts, scale) {
    if (pts.length < 2) {
      if (pts.length === 1) { c.beginPath(); c.arc(pts[0].x * scale, pts[0].y * scale, 1.4 * scale, 0, Math.PI * 2); c.fill(); }
      return;
    }
    c.beginPath();
    c.moveTo(pts[0].x * scale, pts[0].y * scale);
    for (var i = 1; i < pts.length - 1; i++) {
      c.quadraticCurveTo(pts[i].x * scale, pts[i].y * scale, (pts[i].x + pts[i + 1].x) / 2 * scale, (pts[i].y + pts[i + 1].y) / 2 * scale);
    }
    c.lineTo(pts[pts.length - 1].x * scale, pts[pts.length - 1].y * scale);
    c.stroke();
  }
  function style(c, scale) {
    c.lineCap = c.lineJoin = "round";
    c.lineWidth = 2.6 * scale;
    c.strokeStyle = c.fillStyle = "#0f2a1d";
  }
  function draw() {
    var r = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, r.width, r.height);
    style(ctx, 1);
    strokes.concat(current ? [current] : []).forEach(function (s) { path(ctx, s, 1); });
    var has = strokes.length > 0;
    pad.classList.toggle("has-ink", has || !!current);
    undoBtn.disabled = clearBtn.disabled = !has;
  }
  function pt(e) { var r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }

  canvas.addEventListener("pointerdown", function (e) {
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    current = [pt(e)];
    draw();
  });
  canvas.addEventListener("pointermove", function (e) {
    if (!current) return;
    e.preventDefault();
    var evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    evs.forEach(function (ev) { current.push(pt(ev)); });
    draw();
  });
  function end() { if (current) { strokes.push(current); current = null; draw(); } }
  canvas.addEventListener("pointerup", end);
  canvas.addEventListener("pointercancel", end);
  undoBtn.addEventListener("click", function () { strokes.pop(); draw(); });
  clearBtn.addEventListener("click", function () { strokes = []; draw(); });
  window.addEventListener("resize", function () { clearTimeout(size._t); size._t = setTimeout(size, 120); });
  size();

  /* Export a compact PNG (≤ 480px wide) so it fits the Sheets cell limit */
  function exportSignature() {
    if (!strokes.length) return null;
    var r = canvas.getBoundingClientRect();
    var scale = Math.min(1, 480 / r.width);
    var off = document.createElement("canvas");
    off.width = Math.round(r.width * scale);
    off.height = Math.round(r.height * scale);
    var c = off.getContext("2d");
    style(c, scale);
    strokes.forEach(function (s) { path(c, s, scale); });
    return off.toDataURL("image/png");
  }

  /* ---------- submit ---------- */
  var form = document.getElementById("pledgeForm");
  var card = document.querySelector(".sign__card");
  var success = document.querySelector("[data-success]");
  var nameEl = form.elements.name, nameErr = document.getElementById("nameErr");
  var consentEl = form.consent, consentErr = document.getElementById("consentErr");

  var classEl = form.classroom, classErr = document.getElementById("classErr");
  var rateErr = document.getElementById("rateErr");
  var openedAt = Date.now();

  function flag(el, err, bad) {
    err.hidden = !bad;
    if (bad) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = nameEl.value.replace(/\s+/g, " ").trim();
    var classroom = classEl.value.replace(/\s+/g, " ").trim();
    var badName = !API.validName(name);
    var badClass = !API.validClass(classroom);
    flag(nameEl, nameErr, badName);
    flag(classEl, classErr, badClass);
    consentErr.hidden = consentEl.checked;
    rateErr.hidden = true;
    if (badName) { nameEl.focus(); return; }
    if (badClass) { classEl.focus(); return; }
    if (!consentEl.checked) { consentEl.focus(); return; }

    var rate = API.rateCheck();
    if (rate !== "ok") {
      rateErr.textContent = SN.t(rate === "wait"
        ? { ar: "لحظة من فضلكم — يمكن التوقيع مجدداً بعد بضع ثوانٍ.", he: "רגע בבקשה — אפשר לחתום שוב בעוד כמה שניות." }
        : { ar: "وصل هذا الجهاز إلى الحد الأقصى من التوقيعات لهذه الساعة.", he: "המכשיר הזה הגיע למספר החתימות המרבי לשעה זו." });
      rateErr.hidden = false;
      return;
    }

    var entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: name,
      classroom: classroom,
      signature: exportSignature(),
      date: new Date().toISOString()
    };
    /* Bots fill the honeypot or submit instantly: show success, send nothing */
    var isBot = form.website.value !== "" || Date.now() - openedAt < 3000;
    if (!isBot) {
      API.saveLocal(entry);
      API.submit(entry);
      API.rateLog();
      showCount(Math.max(API.local().length, parseInt(String(countEls[0] && countEls[0].textContent).replace(/\D/g, ""), 10) + 1 || 1));
    }

    card.dataset.state = "success";
    form.hidden = true;
    success.hidden = false;
    success.focus();
    window.scrollTo({ top: card.getBoundingClientRect().top + window.scrollY - 100, behavior: SN.reduceMotion ? "auto" : "smooth" });
  });

  document.querySelector("[data-again]").addEventListener("click", function () {
    form.reset();
    openedAt = Date.now();
    strokes = []; draw();
    success.hidden = true;
    form.hidden = false;
    card.dataset.state = "form";
    nameEl.focus();
  });
})();
