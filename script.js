"use strict";

/* ══════════════════════════════════════
   LANGUAGE SWITCHER (shared with article pages)
══════════════════════════════════════ */
const LANG_KEY = "ortbari_lang";
let currentLang = localStorage.getItem(LANG_KEY) || "ar";

const langToggleBtn = document.getElementById("langToggle");
const arCache = new Map();

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-he]").forEach((el) => {
    if (lang === "he") {
      if (!arCache.has(el)) arCache.set(el, el.textContent.trim());
      el.textContent = el.dataset.he;
    } else {
      if (arCache.has(el)) el.textContent = arCache.get(el);
    }
  });

  langToggleBtn.textContent = lang === "ar" ? "עברית" : "العربية";
  langToggleBtn.setAttribute("aria-label", lang === "ar" ? "עברית" : "العربية");
}

langToggleBtn.addEventListener("click", () => {
  applyLang(currentLang === "ar" ? "he" : "ar");
});

if (currentLang !== "ar") applyLang(currentLang);

/* ══════════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════════ */
const scrollProg = document.getElementById("scrollProg");

function updateScrollProg() {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProg.style.width = pct + "%";
}

window.addEventListener("scroll", updateScrollProg, { passive: true });
updateScrollProg();

/* ══════════════════════════════════════
   HEADER SCROLL STATE
══════════════════════════════════════ */
const header     = document.getElementById("siteHeader");
const menuToggle = document.getElementById("menuToggle");
const mainNav    = document.getElementById("mainNav");
const navLinks   = [...document.querySelectorAll(".main-nav a")];

document.getElementById("year").textContent = new Date().getFullYear();

function setHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}
setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

/* ══════════════════════════════════════
   MOBILE NAV
══════════════════════════════════════ */
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  menuToggle.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("nav-open", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  });
});

/* ══════════════════════════════════════
   REVEAL ON SCROLL
══════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ══════════════════════════════════════
   ANIMATED COUNTERS
══════════════════════════════════════ */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    animateCounter(entry.target);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.35 });

document.querySelectorAll("[data-count]").forEach((el) => counterObserver.observe(el));

function animateCounter(el) {
  const target   = Number(el.dataset.count);
  const duration = 1400;
  const start    = performance.now();

  function tick(now) {
    const t       = Math.min((now - start) / duration, 1);
    const eased   = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ══════════════════════════════════════
   GOAL BAR ANIMATION
══════════════════════════════════════ */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.style.width = "calc(var(--p) * 1%)";
    barObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });

document.querySelectorAll(".gc-fill").forEach((bar) => {
  bar.style.width = "0%";
  barObserver.observe(bar);
});

/* ══════════════════════════════════════
   ACTIVE NAV LINK ON SCROLL
══════════════════════════════════════ */
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  });
}, { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 });

sections.forEach((s) => sectionObserver.observe(s));
