/* ==========================================================================
   SehaNoor article renderer — builds an article page from SN_ARTICLES
   (articles/article-data.js) for the active language.
   ========================================================================== */
(function () {
  "use strict";
  var SN = window.SN;
  var DATA = window.SN_ARTICLES;
  var id = document.body.dataset.articleId;
  if (!DATA || !DATA[id]) return;

  var ORDER = ["food", "water", "activity", "snacks", "sleep", "sun", "hygiene", "screen"];
  var COVERS = {
    food:     { photo: "food-display" },
    snacks:   { photo: "food-platter" },
    activity: { photo: "exercise-equipment" },
    water:    { tone: "sky",   icon: "water" },
    sleep:    { tone: "night", icon: "moon" },
    sun:      { tone: "sun",   icon: "sun" },
    hygiene:  { tone: "teal",  icon: "hand" },
    screen:   { tone: "rose",  icon: "screen" }
  };
  var ICON_FOR = { food: "bowl", snacks: "apple", activity: "move", water: "water", sleep: "moon", sun: "sun", hygiene: "hand", screen: "screen" };

  var UI = {
    home:     { ar: "الرئيسية", he: "דף הבית" },
    library:  { ar: "مركز المعرفة", he: "מרכז הידע" },
    minutes:  { ar: "دقائق قراءة", he: "דקות קריאה" },
    toc:      { ar: "في هذا المقال", he: "במאמר הזה" },
    facts:    { ar: "حقائق سريعة", he: "עובדות מהירות" },
    tips:     { ar: "نصائح عملية", he: "טיפים מעשיים" },
    related:  { ar: "اقرأ أيضاً", he: "כדאי לקרוא גם" },
    prev:     { ar: "المقال السابق", he: "המאמר הקודם" },
    next:     { ar: "المقال التالي", he: "המאמר הבא" },
    share:    { ar: "مشاركة المقال", he: "שיתוף המאמר" },
    copied:   { ar: "تم نسخ الرابط", he: "הקישור הועתק" },
    disclaimer: { ar: "المقال للتعلّم ولا يغني عن استشارة طبية. لأي سؤال شخصي توجّهوا إلى ممرضة المدرسة أو طبيب/ة العائلة.", he: "המאמר נועד ללמידה ואינו מחליף ייעוץ רפואי. בכל שאלה אישית פנו לאחות בית הספר או לרופא/ת המשפחה." },
    site:     { ar: "قادة الصحة · أورط أبو ربيعة", he: "מנהיגי בריאות · אורט אבו רביעה" }
  };

  function icon(name) {
    return '<svg class="icon" aria-hidden="true"><use href="../assets/img/icons.svg#' + name + '"/></svg>';
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  /* strip leading emoji used as decoration in the legacy content */
  function clean(s) { return String(s || "").replace(/[\p{Extended_Pictographic}️‍]/gu, "").replace(/\s{2,}/g, " ").trim(); }

  function cover(slug, big) {
    var c = COVERS[slug];
    if (c.photo) {
      return '<span class="cover cover--photo"><img src="../assets/img/' + c.photo + (big ? "-1280" : "-640") + '.webp" alt="" ' +
        (big ? 'fetchpriority="high"' : 'loading="lazy"') + ' width="' + (big ? 1280 : 640) + '" height="' + (big ? 853 : 427) + '"></span>';
    }
    return '<span class="cover cover--' + c.tone + '">' + icon(c.icon) + "</span>";
  }

  function render() {
    var c = DATA[id][SN.i18n.lang] || DATA[id].ar;
    document.title = c.title + " | " + SN.t(UI.site);

    var hero = document.querySelector("[data-art-hero]");
    hero.innerHTML =
      '<div class="container art-hero__grid">' +
        '<div class="art-hero__text">' +
          '<nav class="breadcrumb" aria-label="' + esc(SN.t({ ar: "مسار التنقل", he: "פירורי לחם" })) + '">' +
            '<a href="../">' + SN.t(UI.home) + '</a><span aria-hidden="true">/</span>' +
            '<a href="../learn.html#articles">' + SN.t(UI.library) + '</a><span aria-hidden="true">/</span>' +
            '<span aria-current="page">' + esc(c.cat) + "</span>" +
          "</nav>" +
          '<span class="tag tag--' + (COVERS[id].tone || "green") + '">' + esc(c.cat) + "</span>" +
          '<h1 class="art-hero__title">' + esc(c.title) + "</h1>" +
          '<p class="art-hero__sub">' + esc(c.subtitle) + "</p>" +
          '<p class="art-hero__meta">' + icon("clock") + '<span class="num">' + c.readMins + "</span> " + SN.t(UI.minutes) + "</p>" +
        "</div>" +
        '<div class="art-hero__cover">' + cover(id, true) + "</div>" +
      "</div>";

    document.querySelector("[data-art-intro]").innerHTML = "<p>" + c.intro + "</p>";

    document.querySelector("[data-art-sections]").innerHTML = c.sections.map(function (s, i) {
      return '<section class="art-section" id="' + esc(s.id) + '" aria-labelledby="' + esc(s.id) + '-h">' +
        '<h2 id="' + esc(s.id) + '-h"><span class="art-section__n num">0' + (i + 1) + "</span>" + esc(s.title) + "</h2>" +
        s.content + "</section>";
      /* Legacy section stock photos (s.img) were unrelated to the topics and are no longer shown. */
    }).join("");

    document.querySelector("[data-art-tips]").innerHTML =
      '<h2 class="tips__title">' + icon("check") + SN.t(UI.tips) + "</h2>" +
      '<ol class="tips__list">' + c.tips.map(function (t) { return "<li>" + clean(t) + "</li>"; }).join("") + "</ol>";

    document.querySelector("[data-art-toc]").innerHTML =
      '<p class="side__title">' + SN.t(UI.toc) + "</p><ol class=\"toc\">" +
      c.sections.map(function (s, i) { return '<li><a href="#' + esc(s.id) + '" class="toc__link"><span class="num">0' + (i + 1) + "</span>" + esc(s.title) + "</a></li>"; }).join("") +
      "</ol>";

    document.querySelector("[data-art-facts]").innerHTML =
      '<p class="side__title">' + SN.t(UI.facts) + "</p>" +
      c.facts.map(function (f) {
        return '<div class="fact"><strong>' + esc(clean(f.lbl)) + "</strong><span>" + esc(f.txt) + "</span></div>";
      }).join("");

    document.querySelector("[data-art-share]").innerHTML =
      '<button class="btn btn--ghost btn--sm btn--block" type="button" data-share>' + icon("share") + "<span>" + SN.t(UI.share) + "</span></button>";

    var related = (c.related || []).filter(function (r) { return DATA[r.slug]; });
    document.querySelector("[data-art-related]").innerHTML =
      '<h2 class="related__title">' + SN.t(UI.related) + '</h2><ul class="related__list" role="list">' +
      related.map(function (r) {
        var rc = DATA[r.slug][SN.i18n.lang] || DATA[r.slug].ar;
        return '<li><a class="rel-card" href="' + r.slug + '.html">' + cover(r.slug, false) +
          '<span class="rel-card__body"><span class="rel-card__cat">' + esc(rc.cat) + '</span><span class="rel-card__title">' + esc(rc.title) + "</span>" +
          '<span class="rel-card__time">' + icon("clock") + '<span class="num">' + rc.readMins + "</span> " + SN.t(UI.minutes) + "</span></span></a></li>";
      }).join("") + "</ul>";

    var i = ORDER.indexOf(id);
    var prev = ORDER[(i - 1 + ORDER.length) % ORDER.length], next = ORDER[(i + 1) % ORDER.length];
    function pn(slug, label, cls, ic) {
      var d = DATA[slug][SN.i18n.lang] || DATA[slug].ar;
      return '<a class="pager__link pager__link--' + cls + '" href="' + slug + '.html"><span class="pager__label">' + (cls === "prev" ? icon(ic) : "") + SN.t(label) + (cls === "next" ? icon(ic) : "") + '</span><span class="pager__title">' + esc(d.title) + "</span></a>";
    }
    document.querySelector("[data-art-pager]").innerHTML = pn(prev, UI.prev, "prev", "arrow-back") + pn(next, UI.next, "next", "arrow");

    document.querySelector("[data-art-disclaimer]").textContent = SN.t(UI.disclaimer);
    observeToc();
  }

  var tocIO;
  function observeToc() {
    if (tocIO) tocIO.disconnect();
    if (!("IntersectionObserver" in window)) return;
    var links = [].slice.call(document.querySelectorAll(".toc__link"));
    tocIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) { l.toggleAttribute("aria-current", l.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-25% 0px -65% 0px" });
    [].forEach.call(document.querySelectorAll(".art-section"), function (s) { tocIO.observe(s); });
  }

  document.addEventListener("click", function (e) {
    if (!e.target.closest("[data-share]")) return;
    var url = location.href.split("#")[0];
    if (navigator.share) {
      navigator.share({ title: document.title, url: url }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () { SN.toast(UI.copied); }, function () {});
    }
  });

  render();
  SN.i18n.onChange(render);
})();
