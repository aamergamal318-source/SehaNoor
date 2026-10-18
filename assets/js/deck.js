/* ==========================================================================
   SehaNoor deck — navigation, language modes, overview, fullscreen.
   Keys (RTL): ← next · → previous · Space/PageDown next · PageUp previous
               Home/End · F fullscreen · O overview · L language · Esc
   Deep link: presentation.html#5 opens slide 5.
   ========================================================================== */
(function () {
  "use strict";
  var root = document.documentElement;
  var slides = [].slice.call(document.querySelectorAll(".slide"));
  var N = slides.length;
  var dotsBox = document.querySelector("[data-dots]");
  var countLbl = document.querySelector("[data-count-label]");
  var titleLbl = document.querySelector("[data-title-label]");
  var progress = document.querySelector("[data-progress]");
  var prevBtn = document.querySelector("[data-prev]");
  var nextBtn = document.querySelector("[data-next]");
  var overview = document.querySelector("[data-overview]");
  var ovBtn = document.querySelector("[data-overview-btn]");
  var ovList = document.querySelector("[data-overview-list]");
  var modeBtn = document.querySelector("[data-mode-btn]");
  var modeLbl = document.querySelector("[data-mode-label]");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var index = 0;

  /* ---------- language modes ---------- */
  var MODES = ["dual", "ar", "he"];
  var MODE_LABEL = { dual: "ع + ע", ar: "عربي", he: "עברית" };
  function setMode(m) {
    root.dataset.mode = m;
    root.lang = m === "he" ? "he" : "ar";
    modeLbl.textContent = MODE_LABEL[m];
    try { localStorage.setItem("sehanoor_deck_mode", m); } catch (e) { /* ignore */ }
    updateLabels();
  }
  modeBtn.addEventListener("click", function () {
    var cur = root.dataset.mode || "dual";
    setMode(MODES[(MODES.indexOf(cur) + 1) % MODES.length]);
  });

  function titleOf(i) {
    var t = (slides[i].dataset.title || "").split("|").map(function (s) { return s.trim(); });
    var m = root.dataset.mode || "dual";
    return m === "ar" ? t[0] : m === "he" ? (t[1] || t[0]) : t.join(" | ");
  }

  /* ---------- dots + overview ---------- */
  slides.forEach(function (s, i) {
    s.setAttribute("role", "group");
    s.setAttribute("aria-roledescription", "slide");
    var d = document.createElement("button");
    d.type = "button";
    d.setAttribute("role", "tab");
    d.addEventListener("click", function () { go(i); });
    dotsBox.appendChild(d);
    var li = document.createElement("li");
    var b = document.createElement("button");
    b.type = "button";
    b.addEventListener("click", function () { toggleOverview(false); go(i); });
    li.appendChild(b);
    ovList.appendChild(li);
  });
  var dots = [].slice.call(dotsBox.children);
  var ovBtns = [].slice.call(ovList.querySelectorAll("button"));

  function updateLabels() {
    slides.forEach(function (s, i) {
      s.setAttribute("aria-label", (i + 1) + " / " + N + ": " + titleOf(i));
      dots[i].setAttribute("aria-label", (i + 1) + ": " + titleOf(i));
      ovBtns[i].innerHTML = '<span class="num">' + String(i + 1).padStart(2, "0") + "</span><span>" + titleOf(i) + "</span>";
    });
    titleLbl.textContent = titleOf(index);
  }

  /* ---------- navigation ---------- */
  function go(i, fromHash) {
    index = Math.max(0, Math.min(N - 1, i));
    slides.forEach(function (s, k) {
      var on = k === index;
      s.classList.toggle("is-active", on);
      s.classList.toggle("is-before", k > index);
      s.setAttribute("aria-hidden", String(!on));
      if ("inert" in s) s.inert = !on;
    });
    dots.forEach(function (d, k) { d.setAttribute("aria-selected", String(k === index)); d.tabIndex = k === index ? 0 : -1; });
    ovBtns.forEach(function (b, k) { b.setAttribute("aria-current", String(k === index)); });
    countLbl.textContent = (index + 1) + " / " + N;
    titleLbl.textContent = titleOf(index);
    progress.style.width = ((index + 1) / N * 100) + "%";
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === N - 1;
    if (!fromHash && history.replaceState) history.replaceState(null, "", "#" + (index + 1));
    animateNumbers(slides[index]);
  }
  function next() { go(index + 1); }
  function prev() { go(index - 1); }
  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  /* count-up on the impact slide */
  function animateNumbers(slide) {
    [].forEach.call(slide.querySelectorAll("[data-to]"), function (el) {
      var to = +el.dataset.to, suf = el.dataset.suffix || "";
      if (reduce) { el.textContent = to.toLocaleString("en-US") + suf; return; }
      var t0 = performance.now(), dur = 1300;
      (function tick(now) {
        var p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4))).toLocaleString("en-US") + suf;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }

  /* ---------- overview ---------- */
  function toggleOverview(force) {
    var open = typeof force === "boolean" ? force : overview.hidden;
    overview.hidden = !open;
    ovBtn.setAttribute("aria-pressed", String(open));
    if (open) ovBtns[index].focus();
  }
  ovBtn.addEventListener("click", function () { toggleOverview(); });

  /* ---------- fullscreen ---------- */
  var fsBtn = document.querySelector("[data-fs-btn]");
  function toggleFs() {
    if (!document.fullscreenEnabled) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
    else document.documentElement.requestFullscreen().catch(function () {});
  }
  if (!document.fullscreenEnabled) fsBtn.hidden = true;
  fsBtn.addEventListener("click", toggleFs);

  /* ---------- help, blank screen, idle cursor ---------- */
  var help = document.querySelector("[data-help]");
  var helpBtn = document.querySelector("[data-help-btn]");
  var blank = document.querySelector("[data-blank]");
  function toggleHelp(force) {
    var open = typeof force === "boolean" ? force : help.hidden;
    help.hidden = !open;
    helpBtn.setAttribute("aria-expanded", String(open));
  }
  helpBtn.addEventListener("click", function () { toggleHelp(); });
  help.addEventListener("click", function () { toggleHelp(false); });
  blank.addEventListener("click", function () { blank.hidden = true; });
  var deckEl = document.querySelector("[data-deck]"), idleT;
  document.addEventListener("mousemove", function () {
    deckEl.classList.remove("is-idle");
    clearTimeout(idleT);
    if (document.fullscreenElement) idleT = setTimeout(function () { deckEl.classList.add("is-idle"); }, 2500);
  });

  /* ---------- keyboard ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    var k = e.key;
    if (!blank.hidden) { e.preventDefault(); blank.hidden = true; return; }
    if (!help.hidden) { if (k === "Escape" || k === "?") { e.preventDefault(); toggleHelp(false); } return; }
    if (k === "?") { e.preventDefault(); toggleHelp(true); return; }
    if (k === "b" || k === "B") { e.preventDefault(); blank.hidden = false; return; }
    if (/^[1-9]$/.test(k) && overview.hidden) { e.preventDefault(); go(parseInt(k, 10) - 1); return; }
    if (!overview.hidden) {
      if (k === "Escape" || k === "o" || k === "O") { e.preventDefault(); toggleOverview(false); }
      return;
    }
    if (k === "ArrowLeft" || k === "PageDown" || (k === " " && tag !== "button")) { e.preventDefault(); next(); }
    else if (k === "ArrowRight" || k === "PageUp") { e.preventDefault(); prev(); }
    else if (k === "Home") { e.preventDefault(); go(0); }
    else if (k === "End") { e.preventDefault(); go(N - 1); }
    else if (k === "f" || k === "F") { e.preventDefault(); toggleFs(); }
    else if (k === "o" || k === "O") { e.preventDefault(); toggleOverview(true); }
    else if (k === "l" || k === "L") { e.preventDefault(); modeBtn.click(); }
  });

  /* ---------- swipe (RTL: swipe right → next) ---------- */
  var x0 = null, y0 = null;
  var stage = document.querySelector("[data-stage]");
  stage.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return;
    if (dx > 0) next(); else prev();
  }, { passive: true });

  /* ---------- init ---------- */
  window.addEventListener("hashchange", function () {
    var n = parseInt(location.hash.slice(1), 10);
    if (n >= 1 && n <= N && n - 1 !== index) go(n - 1, true);
  });
  setMode(root.dataset.mode && MODES.indexOf(root.dataset.mode) > -1 ? root.dataset.mode : "dual");
  var start = parseInt(location.hash.slice(1), 10);
  go(start >= 1 && start <= N ? start - 1 : 0, true);
})();
