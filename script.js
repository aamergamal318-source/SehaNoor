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
   BMI CALCULATOR — Personalized by Age & Gender
══════════════════════════════════════ */
const BMI_CATS = [
  { max: 18.5, color: "#1976D2", bg: "#E3F2FD" },
  { max: 25,   color: "#2E7D32", bg: "#E8F5E9" },
  { max: 30,   color: "#E65100", bg: "#FFF3E0" },
  { max: Infinity, color: "#C62828", bg: "#FFEBEE" },
];

const BMI_TEXT = {
  ar: {
    teenNote: "⚠️ تنبيه: لدى المراهقين (أقل من 18 سنة) يُفسَّر مؤشر BMI وفق مخططات المئينات الخاصة بالعمر والجنس. هذا المؤشر استرشادي فقط — راجع طبيب متخصص للتقييم الدقيق.",
    genderAge: {
      m: { teen: "ذكر · مراهق", young: "ذكر · شاب", adult: "ذكر · بالغ", senior: "ذكر · كبير السن" },
      f: { teen: "أنثى · مراهقة", young: "أنثى · شابة", adult: "أنثى · بالغة", senior: "أنثى · كبيرة السن" },
    },
    cats: [
      {
        label: "نحيف جداً",
        title: { m: "وزنك أقل من المعدل — جسمك يحتاج دعماً غذائياً", f: "وزنكِ أقل من المعدل — جسمكِ يحتاج دعماً غذائياً" },
        core: ["زد تناول البروتينات: لحوم، بيض، بقوليات وجبن", "أضف الدهون الصحية: زيت الزيتون، المكسرات، الأفوكادو", "تناول 5–6 وجبات صغيرة منتظمة يومياً"],
        gender: { m: "مارس تمارين القوة 3 مرات أسبوعياً لبناء كتلة عضلية", f: "ركزي على الحديد والكالسيوم — ضروريان لصحة المرأة خاصةً" },
        age: {
          teen:   "جسمك في مرحلة نمو — لا تحذف أي وجبة، وتحدث مع طبيب",
          young:  "التغذية السليمة الآن تبني صحتك للعقود القادمة",
          adult:  "النحافة عند البالغين قد تشير لمشكلة صحية — استشر طبيبك",
          senior: "الحفاظ على الكتلة العضلية أولوية — تناول البروتين في كل وجبة",
        },
      },
      {
        label: "طبيعي",
        title: { m: "ممتاز! وزنك ضمن النطاق الصحي المثالي", f: "ممتاز! وزنكِ ضمن النطاق الصحي المثالي" },
        core: ["حافظ على نظامك الغذائي المتوازن الحالي", "استمر في 150 دقيقة نشاط بدني أسبوعياً", "اشرب 8–10 أكواب ماء يومياً"],
        gender: { m: "اجمع بين تمارين القوة والكارديو للحفاظ على التكوين الجسدي المثالي", f: "اهتمي بالكالسيوم وفيتامين D لحماية كثافة عظامك على المدى البعيد" },
        age: {
          teen:   "التغذية الجيدة الآن تبني عظاماً وعضلات قوية لبقية حياتك",
          young:  "الحفاظ على وزنك الآن يقلل بشكل كبير خطر الأمراض المزمنة لاحقاً",
          adult:  "الفحص الدوري المنتظم يضمن استمرار صحتك المثالية مع التقدم في العمر",
          senior: "ركز على الحفاظ على الوزن والكتلة العضلية — لا حاجة لإنقاص الوزن",
        },
      },
      {
        label: "زيادة وزن",
        title: { m: "وزنك أعلى قليلاً — تغييرات بسيطة تصنع فرقاً كبيراً", f: "وزنكِ أعلى قليلاً — تغييرات بسيطة تصنع فرقاً كبيراً" },
        core: ["قلل السكريات المضافة والوجبات السريعة تدريجياً", "استبدل الخبز الأبيض بالخبز الكامل", "أضف 30 دقيقة مشي يومي إلى روتينك"],
        gender: { m: "ضغط الدم وسكر الدم يرتفعان عند الرجال بشكل خاص — فحص دوري مهم", f: "اضطرابات هرمونية كتكيس المبايض ترتبط بالوزن — استشيري طبيبة متخصصة" },
        age: {
          teen:   "ركز على الرياضة وتقليل السكريات — لا تمارس حمية قاسية في سن النمو",
          young:  "الشروع في التغيير الآن أسهل بكثير — جسمك يستجيب سريعاً في هذا السن",
          adult:  "تناول طعامك ببطء وتجنب الأكل أمام الشاشات لتحسين التحكم في الكميات",
          senior: "المشي اليومي والسباحة أفضل من الحمية القاسية لحماية المفاصل والعظام",
        },
      },
      {
        label: "سمنة",
        title: { m: "مؤشرك يستدعي اهتماماً صحياً — الخطوة الأولى هي الأهم", f: "مؤشركِ يستدعي اهتماماً صحياً — الخطوة الأولى هي الأهم" },
        core: ["تواصل مع طبيب الأسرة لوضع خطة صحية آمنة ومخصصة", "ابدأ بخطوة واحدة: 15 دقيقة مشي يومياً ثم زد تدريجياً", "الهدف الصحي: خسارة 0.5–1 كغ أسبوعياً فقط"],
        gender: { m: "فحوصات سنوية ضرورية: سكر الدم، ضغط الدم، الدهون الثلاثية، وظائف الكبد", f: "السمنة تؤثر على الهرمونات والخصوبة — استشيري متخصصة في التغذية والنسائية" },
        age: {
          teen:   "اطلب مساعدة متخصص — أنت لست وحدك، والتغيير ممكن جداً في السن المبكرة",
          young:  "التدخل المبكر يمنع أمراضاً مزمنة خطيرة — الوقت في صالحك تماماً",
          adult:  "الدعم النفسي لا يقل أهمية عن النظام الغذائي في رحلة فقدان الوزن",
          senior: "التركيز على الحركة الآمنة والتغذية المتوازنة أهم من هدف إنقاص الوزن السريع",
        },
      },
    ],
  },
  he: {
    teenNote: "⚠️ הערה: לנוער (מתחת לגיל 18) BMI מפורש לפי מפות אחוזיות מותאמות לגיל ומין. מדד זה הוא אינדיקטיבי בלבד — מומלץ להתייעץ עם רופא לאבחון מדויק.",
    genderAge: {
      m: { teen: "זכר · נוער", young: "זכר · צעיר", adult: "זכר · מבוגר", senior: "זכר · בוגר" },
      f: { teen: "נקבה · נוערת", young: "נקבה · צעירה", adult: "נקבה · מבוגרת", senior: "נקבה · בוגרת" },
    },
    cats: [
      {
        label: "רזה מדי",
        title: { m: "משקלך נמוך מהנורמה — הגוף זקוק לתמיכה תזונתית", f: "משקלך נמוך מהנורמה — הגוף זקוק לתמיכה תזונתית" },
        core: ["הגבר צריכת חלבונים: בשר, ביצים, קטניות וגבינה", "הוסף שומנים בריאים: שמן זית, אגוזים, אבוקדו", "אכול 5–6 ארוחות קטנות סדירות ביום"],
        gender: { m: "עשה אימוני כוח 3 פעמים בשבוע לבניית מסת שריר בריאה", f: "שימי לב לצריכת ברזל וסידן — חיוניים במיוחד לבריאות האישה" },
        age: {
          teen:   "גופך בשלב גדילה — אל תדלג על ארוחות, והתייעץ עם רופא",
          young:  "תזונה נכונה כעת מניחה את היסוד הבריאותי לשנים הבאות",
          adult:  "רזון בבגרות עשוי להצביע על בעיה רפואית — בדוק עם רופא",
          senior: "שמירה על מסת שריר היא עדיפות — צרוך חלבון בכל ארוחה",
        },
      },
      {
        label: "תקין",
        title: { m: "מצוין! משקלך בטווח הבריאותי האידיאלי", f: "מצוין! משקלך בטווח הבריאותי האידיאלי" },
        core: ["שמור על תזונה מאוזנת ומגוונת כנוכחית", "בצע 150 דקות פעילות גופנית בשבוע", "שתה 8–10 כוסות מים ביום"],
        gender: { m: "שלב אימוני כוח עם קרדיו לשמירה על הרכב גוף אידיאלי לאורך זמן", f: "שמרי על צריכת סידן וויטמין D להגנה על צפיפות העצמות" },
        age: {
          teen:   "תזונה טובה עכשיו בונה עצמות ושרירים חזקים לשארית חייך",
          young:  "שמירה על המשקל כעת מפחיתה משמעותית סיכון למחלות כרוניות",
          adult:  "בדיקות תקופתיות סדירות מבטיחות המשך הבריאות האופטימלית",
          senior: "התמקד בשמירה על המשקל ועל מסת השריר — אין צורך בירידה",
        },
      },
      {
        label: "עודף משקל",
        title: { m: "משקלך גבוה מעט — שינויים קטנים עושים הבדל גדול", f: "משקלך גבוה מעט — שינויים קטנים עושים הבדל גדול" },
        core: ["הפחת סוכרים מוספים ואוכל מהיר בהדרגה", "החלף לחם לבן בלחם מחיטה מלאה", "הוסף 30 דקות הליכה יומית לשגרה שלך"],
        gender: { m: "לחץ דם וסוכר בדם עולים אצל גברים בשלב זה — בדיקות תקופתיות חיוניות", f: "הפרעות הורמונליות כגון PCOS עשויות להיות קשורות למשקל — התייעצי עם רופאה" },
        age: {
          teen:   "התמקד בספורט והפחתת סוכרים — אל תנסה דיאטה קיצונית בגיל הגדילה",
          young:  "להתחיל את השינוי עכשיו קל בהרבה — גופך מגיב מהר בגיל זה",
          adult:  "אכול לאט והימנע מאכילה מול מסכים לשיפור שליטה בכמויות",
          senior: "הליכה יומית ושחייה עדיפות על דיאטה קיצונית להגנה על המפרקים",
        },
      },
      {
        label: "שמנות",
        title: { m: "המדד שלך מצריך תשומת לב — הצעד הראשון הוא החשוב ביותר", f: "המדד שלך מצריך תשומת לב — הצעד הראשון הוא החשוב ביותר" },
        core: ["פנה לרופא המשפחה לגיבוש תוכנית בריאות בטוחה ומותאמת", "התחל בצעד אחד: 15 דקות הליכה ביום ואז הגדל בהדרגה", "מטרה: ירידה של 0.5–1 ק\"ג בשבוע — בריאותי ובר-קיימא"],
        gender: { m: "בדיקות חיוניות שנתיות: סוכר בדם, לחץ דם, טריגליצרידים, תפקודי כבד", f: "שמנות עשויה להשפיע על הורמונים ופוריות — התייעצי עם מומחית" },
        age: {
          teen:   "בקש עזרה ממומחה — אתה לא לבד, ושינוי אפשרי לגמרי בגיל צעיר",
          young:  "התערבות מוקדמת מונעת מחלות כרוניות חמורות — הזמן לצדך",
          adult:  "תמיכה נפשית חשובה לא פחות מהתזונה במסע ירידת המשקל",
          senior: "התמקד בתנועה בטוחה ותזונה מאוזנת יותר מאשר ביעד ירידת משקל מהירה",
        },
      },
    ],
  },
};

let bmiLastValue = null;

function getAgeGroup(age) {
  if (age < 18) return "teen";
  if (age < 36) return "young";
  if (age < 61) return "adult";
  return "senior";
}

function calcBMI() {
  const h = parseFloat(document.getElementById("bmiHeight").value);
  const w = parseFloat(document.getElementById("bmiWeight").value);
  const a = parseFloat(document.getElementById("bmiAge").value);
  const g = document.querySelector('input[name="bmiGender"]:checked').value;
  const err = document.getElementById("bmiErr");

  if (!h || !w || !a || h < 50 || h > 280 || w < 10 || w > 500 || a < 5 || a > 120) {
    err.hidden = false;
    return;
  }
  err.hidden = true;
  bmiLastValue = { bmi: w / ((h / 100) ** 2), age: a, gender: g };
  renderBMI(bmiLastValue);
}

function renderBMI({ bmi, age, gender }) {
  const txt    = BMI_TEXT[currentLang];
  const catIdx = BMI_CATS.findIndex(c => bmi < c.max);
  const vis    = BMI_CATS[catIdx];
  const content = txt.cats[catIdx];
  const ageGroup = getAgeGroup(age);
  const pct    = Math.min(Math.max((bmi - 10) / 30 * 100, 2), 98);

  document.getElementById("bmiNumber").textContent = bmi.toFixed(1);

  const badge = document.getElementById("bmiCatBadge");
  badge.textContent      = content.label;
  badge.style.background = vis.bg;
  badge.style.color      = vis.color;

  document.getElementById("bmiPersonalTag").textContent = txt.genderAge[gender][ageGroup] + " · " + age + (currentLang === "ar" ? " سنة" : " שנים");

  const marker = document.getElementById("bmiMarker");
  marker.style.left       = pct + "%";
  marker.style.background = vis.color;

  const teenNote = document.getElementById("bmiTeenNote");
  teenNote.hidden = age >= 18;
  if (age < 18) teenNote.textContent = txt.teenNote;

  const tips = [...content.core, content.gender[gender], content.age[ageGroup]];
  document.getElementById("bmiAdviceBox").innerHTML =
    `<strong>${content.title[gender]}</strong><ul class="bmi-advice-tips">${tips.map(t => `<li>${t}</li>`).join("")}</ul>`;

  const result = document.getElementById("bmiResult");
  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

document.getElementById("bmiCalcBtn").addEventListener("click", calcBMI);
["bmiHeight", "bmiWeight", "bmiAge"].forEach(id => {
  document.getElementById(id).addEventListener("keydown", e => { if (e.key === "Enter") calcBMI(); });
});

document.getElementById("bmiResetBtn").addEventListener("click", () => {
  document.getElementById("bmiResult").hidden = true;
  document.getElementById("bmiErr").hidden    = true;
  ["bmiHeight", "bmiWeight", "bmiAge"].forEach(id => { document.getElementById(id).value = ""; });
  bmiLastValue = null;
  document.getElementById("bmiHeight").focus();
});

langToggleBtn.addEventListener("click", () => {
  if (bmiLastValue !== null) renderBMI(bmiLastValue);
});

/* ══════════════════════════════════════
   PLEDGE WALL COUNT (Google Sheets)
══════════════════════════════════════ */
(async function updatePledgeCount() {
  const badge = document.getElementById("pledgeWallCount");
  if (!badge) return;

  // 1. اعرض العدد المحلي فوراً
  try {
    const local = JSON.parse(localStorage.getItem("sehanoor_pledges") || "[]");
    if (local.length) { badge.textContent = local.length; badge.classList.add("visible"); }
  } catch (_) {}

  // 2. اجلب العدد الحقيقي من Google Sheets
  const GAS = "https://script.google.com/macros/s/AKfycbw3sf6B9CsXjD8K3_MqO1_Yid4x4T-I84zTUwwMYmTUz2tXzK314D-eNd-TN6NB41iq/exec";
  try {
    const r = await fetch(GAS + "?action=count");
    const j = await r.json();
    if (j.success && j.count > 0) {
      badge.textContent = j.count;
      badge.classList.add("visible");
    }
  } catch (_) {}
})();
