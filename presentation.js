"use strict";

const slides = [...document.querySelectorAll(".slide")];
const dotsRoot = document.getElementById("dots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const slideCount = document.getElementById("slideCount");
const slideLabel = document.getElementById("slideLabel");
const progressFill = document.getElementById("progressFill");
const overviewBtn = document.getElementById("overviewBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

let activeIndex = 0;

document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", () => {
    const fallback = document.createElement("span");
    fallback.className = "image-fallback";
    fallback.textContent = "الصورة غير متاحة حالياً";
    image.replaceWith(fallback);
  }, { once: true });
});

slides.forEach((slide, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `انتقال إلى الشريحة ${index + 1}: ${slide.dataset.label || ""}`);
  dot.addEventListener("click", () => setSlide(index));
  dotsRoot.appendChild(dot);
});

const dots = [...dotsRoot.querySelectorAll("button")];

function setSlide(index) {
  activeIndex = Math.max(0, Math.min(index, slides.length - 1));

  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeIndex;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });

  dots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === activeIndex;
    dot.classList.toggle("is-active", isActive);
    dot.setAttribute("aria-current", isActive ? "step" : "false");
  });

  prevBtn.disabled = activeIndex === 0;
  nextBtn.disabled = activeIndex === slides.length - 1;
  slideCount.textContent = `${activeIndex + 1} / ${slides.length}`;
  slideLabel.textContent = slides[activeIndex].dataset.label || "";
  progressFill.style.width = `${((activeIndex + 1) / slides.length) * 100}%`;
}

function nextSlide() {
  setSlide(activeIndex + 1);
}

function prevSlide() {
  setSlide(activeIndex - 1);
}

async function toggleFullscreen() {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
}

function updateFullscreenLabel() {
  fullscreenBtn.textContent = document.fullscreenElement ? "خروج" : "ملء الشاشة";
  fullscreenBtn.setAttribute("aria-label", document.fullscreenElement ? "الخروج من ملء الشاشة" : "ملء الشاشة");
}

prevBtn.addEventListener("click", prevSlide);
nextBtn.addEventListener("click", nextSlide);

overviewBtn.addEventListener("click", () => {
  const isOverview = document.body.classList.toggle("overview");
  overviewBtn.textContent = isOverview ? "عرض الشرائح" : "كل الشرائح";
});

fullscreenBtn.addEventListener("click", () => {
  toggleFullscreen().catch(() => {});
});

document.addEventListener("fullscreenchange", updateFullscreenLabel);

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (key === "ArrowRight" || key === "PageDown" || key === " ") {
    event.preventDefault();
    nextSlide();
  }

  if (key === "ArrowLeft" || key === "PageUp") {
    event.preventDefault();
    prevSlide();
  }

  if (key === "Home") {
    event.preventDefault();
    setSlide(0);
  }

  if (key === "End") {
    event.preventDefault();
    setSlide(slides.length - 1);
  }

  if (key.toLowerCase() === "f") {
    event.preventDefault();
    toggleFullscreen().catch(() => {});
  }

  if (key === "Escape" && document.body.classList.contains("overview")) {
    document.body.classList.remove("overview");
    overviewBtn.textContent = "كل الشرائح";
  }
});

let touchStartX = 0;

document.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

document.addEventListener("touchend", (event) => {
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) < 48) return;
  if (delta < 0) nextSlide();
  if (delta > 0) prevSlide();
}, { passive: true });

setSlide(0);
