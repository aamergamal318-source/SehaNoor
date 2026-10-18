/* ==========================================================================
   SehaNoor — homepage interactions
   ========================================================================== */
(function () {
  "use strict";
  var SN = window.SN;

  /* ---------- Manifesto: words light up as the reader scrolls ---------- */
  var manifesto = document.querySelector("[data-manifesto]");
  var KEY_WORDS = /^(ماء|حركة|طيبة|ثقافة|מים|תנועה|טובה|התרבות)[،,.—]?$/;
  var words = [];

  function splitManifesto() {
    if (!manifesto) return;
    var text = manifesto.textContent.trim();
    manifesto.innerHTML = "";
    var sr = document.createElement("span");
    sr.className = "visually-hidden";
    sr.textContent = text;
    var visual = document.createElement("span");
    visual.setAttribute("aria-hidden", "true");
    manifesto.append(sr, visual);
    words = text.split(/\s+/).map(function (w, i, arr) {
      var s = document.createElement("span");
      s.className = "w" + (KEY_WORDS.test(w) ? " is-key" : "");
      s.textContent = w;
      visual.appendChild(s);
      if (i < arr.length - 1) visual.appendChild(document.createTextNode(" "));
      return s;
    });
    paintManifesto();
  }
  function paintManifesto() {
    if (!words.length) return;
    if (SN.reduceMotion) { words.forEach(function (w) { w.classList.add("is-lit"); }); return; }
    var r = manifesto.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * 0.85 - r.top) / (r.height + vh * 0.3);
    var lit = Math.round(Math.max(0, Math.min(1, p)) * words.length);
    words.forEach(function (w, i) { w.classList.toggle("is-lit", i < lit); });
  }
  if (manifesto) {
    /* Give i18n the plain Arabic source before we split it into spans */
    if (!("arHe" in manifesto.dataset)) manifesto.dataset.arHe = manifesto.textContent.trim();
    splitManifesto();
    SN.i18n.onChange(splitManifesto);
    var mTick = false;
    window.addEventListener("scroll", function () {
      if (!mTick) { mTick = true; requestAnimationFrame(function () { paintManifesto(); mTick = false; }); }
    }, { passive: true });
  }

  /* ---------- Why: challenge ↔ alternative ---------- */
  var whyGrid = document.querySelector(".why__grid");
  [].forEach.call(document.querySelectorAll('input[name="whyView"]'), function (r) {
    r.addEventListener("change", function () { if (r.checked && whyGrid) whyGrid.dataset.view = r.value; });
  });

  /* ---------- Leadership journey (ARIA tabs) ---------- */
  var journey = document.querySelector("[data-journey]");
  if (journey) {
    var tabs = [].slice.call(journey.querySelectorAll('[role="tab"]'));
    var fill = journey.querySelector(".journey__rail-fill");
    var select = function (i, focus) {
      tabs.forEach(function (t, k) {
        var on = k === i;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (fill) fill.style.height = ((i + 1) / tabs.length * 100) + "%";
      if (focus) tabs[i].focus();
      if (window.innerWidth < 860) tabs[i].scrollIntoView({ block: "nearest", inline: "center", behavior: SN.reduceMotion ? "auto" : "smooth" });
    };
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(i); });
      t.addEventListener("keydown", function (e) {
        var n = tabs.length, j = null;
        /* Vertical list on desktop, horizontal (RTL) row on mobile */
        if (e.key === "ArrowDown" || e.key === "ArrowLeft") j = (i + 1) % n;
        else if (e.key === "ArrowUp" || e.key === "ArrowRight") j = (i - 1 + n) % n;
        else if (e.key === "Home") j = 0;
        else if (e.key === "End") j = n - 1;
        if (j !== null) { e.preventDefault(); select(j, true); }
      });
    });
    select(0);
  }

  /* ---------- Evidence filters ---------- */
  var gallery = document.querySelector("[data-gallery]");
  var chips = [].slice.call(document.querySelectorAll("[data-filter]"));
  var emptyMsg = document.querySelector(".gallery__empty");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.dataset.filter;
      chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
      var shown = 0;
      [].forEach.call(gallery.querySelectorAll(".gallery__item"), function (li) {
        var match = f === "all" || li.dataset.cat.split(" ").indexOf(f) > -1;
        var wasHidden = li.classList.contains("is-hidden");
        li.classList.toggle("is-hidden", !match);
        if (match) {
          shown++;
          if (wasHidden && !SN.reduceMotion) {
            li.classList.remove("is-entering"); void li.offsetWidth; li.classList.add("is-entering");
          }
        }
      });
      if (emptyMsg) emptyMsg.hidden = shown > 0;
    });
  });

  /* ---------- Unit charts (one mark per ambassador / class) ---------- */
  [].forEach.call(document.querySelectorAll("[data-units]"), function (box) {
    var n = parseInt(box.dataset.units, 10) || 0;
    var frag = document.createDocumentFragment();
    for (var k = 0; k < n; k++) {
      var i = document.createElement("i");
      i.style.setProperty("--k", k);
      frag.appendChild(i);
    }
    box.appendChild(frag);
  });

  /* ---------- Pledge count ---------- */
  var countEls = document.querySelectorAll("[data-pledge-count]");
  if (countEls.length && SN.pledges) {
    var show = function (n) { [].forEach.call(countEls, function (el) { el.textContent = n.toLocaleString("en-US"); }); };
    var localN = SN.pledges.local().length;
    if (localN) show(localN);
    SN.pledges.count().then(function (n) { if (n >= localN) show(n); }).catch(function () {
      if (!localN) [].forEach.call(countEls, function (el) { el.parentNode.hidden = true; });
    });
  }

  /* ---------- Hero parallax (desktop, motion allowed) ---------- */
  var photos = [].slice.call(document.querySelectorAll(".hero__photo"));
  var hero = document.querySelector(".hero");
  if (photos.length && !SN.reduceMotion && window.matchMedia("(min-width: 961px) and (pointer: fine)").matches) {
    var depth = [0.06, -0.08, 0.12];
    var pTick = false;
    var parallax = function () {
      var y = window.scrollY;
      if (y < hero.offsetHeight) {
        photos.forEach(function (p, i) { p.style.translate = "0 " + (y * depth[i % depth.length]).toFixed(1) + "px"; });
      }
      pTick = false;
    };
    window.addEventListener("scroll", function () {
      if (!pTick) { pTick = true; requestAnimationFrame(parallax); }
    }, { passive: true });
  }
})();
