/* ==========================================================================
   SehaNoor site — shared behaviour for every content page:
   header state, mobile menu, dock, reveal-on-scroll, counters,
   scroll progress, active section links, toast.
   Requires i18n.js.
   ========================================================================== */
(function () {
  "use strict";

  var SN = window.SN;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  SN.reduceMotion = reduceMotion;

  /* ---------- Header + dock + progress (one rAF-throttled scroll handler) ---------- */
  var header = document.querySelector(".site-header");
  var dock = document.querySelector(".dock");
  var progress = document.querySelector(".scroll-progress");
  var lastY = window.scrollY;
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 16);
    if (dock) {
      var goingDown = y > lastY + 4;
      var goingUp = y < lastY - 4;
      if (goingDown && y > 400) dock.classList.add("is-hidden");
      else if (goingUp || y < 200) dock.classList.remove("is-hidden");
    }
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.getElementById("mainNav");
  function setMenu(open) {
    if (!menuBtn || !nav) return;
    menuBtn.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    menuBtn.setAttribute("aria-label", SN.t(open
      ? { ar: "إغلاق القائمة", he: "סגירת התפריט" }
      : { ar: "فتح القائمة", he: "פתיחת התפריט" }));
    if (open) { var first = nav.querySelector("a"); if (first) first.focus(); }
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () { setMenu(menuBtn.getAttribute("aria-expanded") !== "true"); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); menuBtn.focus(); }
    });
    window.matchMedia("(min-width: 1024px)").addEventListener("change", function (m) { if (m.matches) setMenu(false); });
    SN.i18n.onChange(function () { setMenu(nav.classList.contains("is-open")); });
  }

  /* ---------- Reveal on scroll ---------- */
  [].forEach.call(document.querySelectorAll("[data-stagger]"), function (group) {
    [].forEach.call(group.children, function (child, i) {
      if (child.classList.contains("reveal")) child.style.setProperty("--i", i);
    });
  });
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    [].forEach.call(revealEls, function (el) { el.classList.add("is-in"); });
  } else {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          revealIO.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    [].forEach.call(revealEls, function (el) { revealIO.observe(el); });
  }

  /* ---------- Counters: <span data-count="1000" data-suffix="+"> ---------- */
  function formatNum(n) { return Math.round(n).toLocaleString("en-US"); }
  function runCounter(el) {
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = formatNum(target) + suffix; return; }
    var dur = 1600, t0 = performance.now();
    (function tick(now) {
      var p = Math.min((now - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = formatNum(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCounter(entry.target); countIO.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    [].forEach.call(counters, function (el) {
      if (!reduceMotion) el.textContent = "0" + (el.dataset.suffix || "");
      countIO.observe(el);
    });
  }
  SN.runCounter = runCounter;

  /* ---------- Active section in nav / dock ---------- */
  var sectionLinks = [].slice.call(document.querySelectorAll('.main-nav__link[href^="#"], .dock a[href^="#"]'));
  var targets = {};
  sectionLinks.forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    var sec = id && document.getElementById(id);
    if (sec) (targets[id] = targets[id] || { el: sec, links: [] }).links.push(a);
  });
  if (Object.keys(targets).length && "IntersectionObserver" in window) {
    var activeIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        if (window.scrollY < window.innerHeight * 0.5) return;
        sectionLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
        targets[entry.target.id].links.forEach(function (a) { a.setAttribute("aria-current", "true"); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(targets).forEach(function (id) { activeIO.observe(targets[id].el); });
    window.addEventListener("scroll", function () {
      if (window.scrollY < window.innerHeight * 0.5) sectionLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
    }, { passive: true });
  }

  /* ---------- Toast ---------- */
  var toastEl;
  SN.toast = function (msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = SN.t(msg);
    toastEl.classList.add("is-shown");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove("is-shown"); }, 2600);
  };

  /* ---------- Small things ---------- */
  [].forEach.call(document.querySelectorAll("[data-year]"), function (el) { el.textContent = new Date().getFullYear(); });
  [].forEach.call(document.querySelectorAll('a[target="_blank"]'), function (a) { a.rel = "noopener noreferrer"; });
})();
