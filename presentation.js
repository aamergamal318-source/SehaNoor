"use strict";

const slides = [...document.querySelectorAll(".slide")];
const dotsRoot = document.getElementById("dots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const slideCount = document.getElementById("slideCount");
const progressFill = document.getElementById("progressFill");
const overviewBtn = document.getElementById("overviewBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

let activeIndex = 0;

slides.forEach((slide, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("aria-label", `اذهب إلى الشريحة ${index + 1}`);
  button.addEventListener("click", () => setSlide(index));
  dotsRoot.appendChild(button);
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
    dot.classList.toggle("is-active", dotIndex === activeIndex);
    dot.setAttribute("aria-current", dotIndex === activeIndex ? "true" : "false");
  });

  prevBtn.disabled = activeIndex === 0;
  nextBtn.disabled = activeIndex === slides.length - 1;
  slideCount.textContent = `${activeIndex + 1} / ${slides.length}`;
  progressFill.style.width = `${((activeIndex + 1) / slides.length) * 100}%`;
}

function nextSlide() {
  setSlide(activeIndex + 1);
}

function prevSlide() {
  setSlide(activeIndex - 1);
}

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

overviewBtn.addEventListener("click", () => {
  const isOverview = document.body.classList.toggle("overview");
  overviewBtn.textContent = isOverview ? "عرض الشرائح" : "كل الشرائح";
});

fullscreenBtn.addEventListener("click", async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen();
    fullscreenBtn.textContent = "خروج";
  } else {
    await document.exitFullscreen();
    fullscreenBtn.textContent = "ملء الشاشة";
  }
});

document.addEventListener("fullscreenchange", () => {
  fullscreenBtn.textContent = document.fullscreenElement ? "خروج" : "ملء الشاشة";
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
    event.preventDefault();
    nextSlide();
  }

  if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    prevSlide();
  }

  if (event.key === "Home") {
    event.preventDefault();
    setSlide(0);
  }

  if (event.key === "End") {
    event.preventDefault();
    setSlide(slides.length - 1);
  }

  if (event.key.toLowerCase() === "o") {
    overviewBtn.click();
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
