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
  const current  = Number(el.textContent.replace(/[^\d.-]/g, ""));
  const from     = Number.isFinite(current) ? current : 0;
  const duration = 1400;
  const start    = performance.now();

  function tick(now) {
    const t       = Math.min((now - start) / duration, 1);
    const eased   = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(from + (target - from) * eased);
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

/* ═══════════════════════════════════════════════
   GALLERY LIGHTBOX
═══════════════════════════════════════════════ */
const galleryItems = [...document.querySelectorAll(".gal-item")];

if (galleryItems.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="إغلاق">×</button>
    <div class="lightbox-inner">
      <img alt="">
      <p class="lightbox-caption"></p>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");
  const lightboxClose = lightbox.querySelector(".lightbox-close");

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  galleryItems.forEach((item) => {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", "تكبير الصورة");

    const openItem = () => {
      const img = item.querySelector("img");
      const caption = item.querySelector("figcaption");
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt || "";
      lightboxCaption.textContent = caption ? caption.textContent.trim() : "";
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
      lightboxClose.focus();
    };

    item.addEventListener("click", openItem);
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openItem();
      }
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}

/* ══════════════════════════════════════
   BMI CALCULATOR
══════════════════════════════════════ */
const BMI_DATA = {
  ar: {
    cats: [
      { max: 18.5, label: "نحيف جداً",  color: "#1976D2", bg: "#E3F2FD",
        title: "وزنك أقل من المعدل الطبيعي",
        tips: [
          "زد تناول البروتينات: اللحوم، البيض، البقوليات والجبن",
          "أضف الدهون الصحية: زيت الزيتون، المكسرات، الأفوكادو",
          "تناول 5–6 وجبات صغيرة يومياً بدلاً من 3 كبيرة",
          "مارس تمارين القوة لبناء كتلة عضلية صحية",
          "استشر طبيباً للتأكد من عدم وجود سبب طبي",
        ]},
      { max: 25, label: "طبيعي",        color: "#2E7D32", bg: "#E8F5E9",
        title: "ممتاز! وزنك ضمن النطاق الصحي الطبيعي",
        tips: [
          "حافظ على نظامك الغذائي المتوازن الحالي",
          "استمر في ممارسة 150 دقيقة نشاط بدني أسبوعياً",
          "اشرب 8–10 أكواب ماء يومياً",
          "نم 7–9 ساعات ليلاً للحفاظ على التوازن الهرموني",
          "راقب وزنك شهرياً للاطمئنان على الاستقرار",
        ]},
      { max: 30, label: "زيادة وزن",   color: "#E65100", bg: "#FFF3E0",
        title: "وزنك أعلى قليلاً من المعدل — التغيير ممكن",
        tips: [
          "قلل السكريات المضافة والمشروبات الغازية تدريجياً",
          "استبدل الخبز الأبيض بالخبز الكامل والطحين الأسمر",
          "أضف 30 دقيقة من المشي اليومي إلى روتينك",
          "زد تناول الخضار والفواكه الطازجة في كل وجبة",
          "خطط وجباتك مسبقاً لتجنب الأكل العشوائي",
        ]},
      { max: Infinity, label: "سمنة",  color: "#C62828", bg: "#FFEBEE",
        title: "مؤشرك يستدعي اهتماماً صحياً جاداً",
        tips: [
          "تواصل مع طبيب الأسرة لوضع خطة صحية آمنة ومخصصة",
          "ابدأ بخطوة واحدة: المشي 15 دقيقة يومياً ثم زد تدريجياً",
          "الهدف: خسارة 0.5–1 كغ أسبوعياً بشكل صحي ومستدام",
          "تجنب الحميات القاسية — التغيير التدريجي أكثر نجاعة",
          "اطلب دعم الأسرة والأصدقاء في رحلتك الصحية",
        ]},
    ],
  },
  he: {
    cats: [
      { max: 18.5, label: "רזה מדי",    color: "#1976D2", bg: "#E3F2FD",
        title: "משקלך נמוך מהטווח התקין",
        tips: [
          "הגבר צריכת חלבונים: בשר, ביצים, קטניות וגבינה",
          "הוסף שומנים בריאים: שמן זית, אגוזים, אבוקדו",
          "אכול 5–6 ארוחות קטנות ביום במקום 3 גדולות",
          "עשה אימוני כוח לבניית מסת שריר בריאה",
          "התייעץ עם רופא לשלילת גורמים רפואיים",
        ]},
      { max: 25, label: "תקין",         color: "#2E7D32", bg: "#E8F5E9",
        title: "מצוין! המשקל שלך בטווח הבריאותי התקין",
        tips: [
          "המשך בתזונה המאוזנת הנוכחית",
          "שמור על 150 דקות פעילות גופנית שבועית",
          "שתה 8–10 כוסות מים ביום",
          "ישן 7–9 שעות בלילה לשמירה על האיזון ההורמונלי",
          "עקוב אחר משקלך חודשית להבטחת יציבות",
        ]},
      { max: 30, label: "עודף משקל",   color: "#E65100", bg: "#FFF3E0",
        title: "משקלך גבוה מעט מהרצוי — שינוי אפשרי",
        tips: [
          "הפחת סוכרים מוספים ומשקאות ממותקים בהדרגה",
          "החלף לחם לבן בלחם מחיטה מלאה",
          "הוסף 30 דקות הליכה יומית לשגרה שלך",
          "הגבר ירקות ופירות טריים בכל ארוחה",
          "תכנן ארוחות מראש למניעת אכילה אקראית",
        ]},
      { max: Infinity, label: "שמנות", color: "#C62828", bg: "#FFEBEE",
        title: "המדד שלך מצריך תשומת לב בריאותית רצינית",
        tips: [
          "פנה לרופא המשפחה לגיבוש תוכנית בריאות בטוחה ומותאמת",
          "התחל בצעד אחד: הליכה 15 דקות ביום ואז הגדל בהדרגה",
          "מטרה: ירידה של 0.5–1 ק\"ג בשבוע בצורה בריאה ומתמשכת",
          "הימנע מדיאטות קיצוניות — שינוי הדרגתי יעיל יותר",
          "בקש תמיכה ממשפחה וחברים במסע הבריאותי שלך",
        ]},
    ],
  },
};

let bmiLastValue = null;

function calcBMI() {
  const h = parseFloat(document.getElementById("bmiHeight").value);
  const w = parseFloat(document.getElementById("bmiWeight").value);
  if (!h || !w || h < 50 || h > 280 || w < 10 || w > 500) return;
  bmiLastValue = w / ((h / 100) ** 2);
  renderBMI(bmiLastValue);
}

function renderBMI(bmi) {
  const d    = BMI_DATA[currentLang];
  const cat  = d.cats.find(c => bmi < c.max);
  const pct  = Math.min(Math.max((bmi - 10) / 30 * 100, 2), 98);

  document.getElementById("bmiNumber").textContent  = bmi.toFixed(1);
  const badge = document.getElementById("bmiCatBadge");
  badge.textContent       = cat.label;
  badge.style.background  = cat.bg;
  badge.style.color       = cat.color;

  const marker = document.getElementById("bmiMarker");
  marker.style.left       = pct + "%";
  marker.style.background = cat.color;

  document.getElementById("bmiAdviceBox").innerHTML =
    `<strong>${cat.title}</strong><ul class="bmi-advice-tips">${cat.tips.map(t => `<li>${t}</li>`).join("")}</ul>`;

  const result = document.getElementById("bmiResult");
  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

document.getElementById("bmiCalcBtn").addEventListener("click", calcBMI);
document.getElementById("bmiHeight").addEventListener("keydown", e => { if (e.key === "Enter") calcBMI(); });
document.getElementById("bmiWeight").addEventListener("keydown", e => { if (e.key === "Enter") calcBMI(); });

document.getElementById("bmiResetBtn").addEventListener("click", () => {
  document.getElementById("bmiResult").hidden = true;
  document.getElementById("bmiHeight").value  = "";
  document.getElementById("bmiWeight").value  = "";
  bmiLastValue = null;
  document.getElementById("bmiHeight").focus();
});

langToggleBtn.addEventListener("click", () => {
  if (bmiLastValue !== null) renderBMI(bmiLastValue);
});
