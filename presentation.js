"use strict";

const slides       = [...document.querySelectorAll(".slide")];
const dotsRoot     = document.getElementById("dots");
const prevBtn      = document.getElementById("prevBtn");
const nextBtn      = document.getElementById("nextBtn");
const slideCount   = document.getElementById("slideCount");
const slideLabel   = document.getElementById("slideLabel");
const progressFill = document.getElementById("progressFill");
const overviewBtn  = document.getElementById("overviewBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

let activeIndex = 0;

/* ── Image error fallback ── */
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", () => {
    const fb = document.createElement("span");
    fb.className = "image-fallback";
    fb.textContent = "الصورة غير متاحة حالياً";
    fb.setAttribute("role", "img");
    fb.setAttribute("aria-label", img.alt || "صورة");
    img.replaceWith(fb);
  }, { once: true });
});

/* ── Build dots ── */
slides.forEach((slide, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `الشريحة ${index + 1}: ${slide.dataset.label || ""}`);
  dot.addEventListener("click", () => setSlide(index));
  dotsRoot.appendChild(dot);
});

const dots = [...dotsRoot.querySelectorAll("button")];

/* ── Set active slide ── */
function setSlide(index) {
  activeIndex = Math.max(0, Math.min(index, slides.length - 1));

  slides.forEach((slide, i) => {
    const active = i === activeIndex;
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", String(!active));
  });

  dots.forEach((dot, i) => {
    const active = i === activeIndex;
    dot.classList.toggle("is-active", active);
    dot.setAttribute("aria-current", active ? "step" : "false");
  });

  prevBtn.disabled = activeIndex === 0;
  nextBtn.disabled = activeIndex === slides.length - 1;
  slideCount.textContent = `${activeIndex + 1} / ${slides.length}`;
  slideLabel.textContent = slides[activeIndex].dataset.label || "";
  progressFill.style.width = `${((activeIndex + 1) / slides.length) * 100}%`;

  /* Move focus to new slide content (accessibility) */
  if (document.activeElement !== prevBtn && document.activeElement !== nextBtn) {
    const heading = slides[activeIndex].querySelector("h1, h2");
    if (heading) { heading.setAttribute("tabindex", "-1"); heading.focus({ preventScroll: true }); }
  }
}

function nextSlide() { setSlide(activeIndex + 1); }
function prevSlide() { setSlide(activeIndex - 1); }

/* ── Fullscreen ── */
async function toggleFullscreen() {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
}

function setBilingual(el, ar, he, arLabel, heLabel) {
  el.innerHTML = `${ar} <span lang="he" dir="rtl">| ${he}</span>`;
  el.setAttribute("aria-label", arLabel || ar);
}

function updateFullscreenLabel() {
  if (document.fullscreenElement) {
    setBilingual(fullscreenBtn, "خروج", "יציאה", "الخروج من ملء الشاشة");
  } else {
    setBilingual(fullscreenBtn, "ملء الشاشة", "מסך מלא", "ملء الشاشة");
  }
}

/* ── Button events ── */
prevBtn.addEventListener("click", prevSlide);
nextBtn.addEventListener("click", nextSlide);

overviewBtn.addEventListener("click", () => {
  const on = document.body.classList.toggle("overview");
  if (on) {
    setBilingual(overviewBtn, "عرض الشرائح", "ערוך שקופיות");
  } else {
    setBilingual(overviewBtn, "كل الشرائح", "כל השקופיות");
  }
});

fullscreenBtn.addEventListener("click", () => toggleFullscreen().catch(() => {}));
document.addEventListener("fullscreenchange", updateFullscreenLabel);

/* ── Keyboard navigation ── */
document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

  switch (e.key) {
    case "ArrowRight":
    case "PageDown":
    case " ":
      e.preventDefault(); nextSlide(); break;
    case "ArrowLeft":
    case "PageUp":
      e.preventDefault(); prevSlide(); break;
    case "Home":
      e.preventDefault(); setSlide(0); break;
    case "End":
      e.preventDefault(); setSlide(slides.length - 1); break;
    case "f":
    case "F":
      e.preventDefault(); toggleFullscreen().catch(() => {}); break;
    case "Escape":
      if (document.body.classList.contains("overview")) {
        document.body.classList.remove("overview");
        setBilingual(overviewBtn, "كل الشرائح", "כל השקופיות");
      }
      break;
  }
});

/* ── Touch / swipe support ── */
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
}, { passive: true });

document.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) < 48 || Math.abs(dy) > Math.abs(dx)) return;
  /* RTL: swipe left = next, swipe right = prev */
  if (dx < 0) nextSlide();
  else prevSlide();
}, { passive: true });

/* ── Init ── */
setBilingual(overviewBtn, "كل الشرائح", "כל השקופיות");
setBilingual(fullscreenBtn, "ملء الشاشة", "מסך מלא", "ملء الشاشة");
setSlide(0);
