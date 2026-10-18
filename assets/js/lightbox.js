/* ==========================================================================
   SehaNoor lightbox — accessible image viewer.
   Keyboard: ←/→ (RTL aware), Home/End, Esc. Touch: swipe. Focus is trapped
   while open and returned to the trigger on close.

   Auto-binds:
     [data-gallery]          → every visible .gallery__btn inside becomes a set
     [data-lightbox-single]  → a one-image viewer (uses data-full + inner img)
   ========================================================================== */
(function () {
  "use strict";
  var SN = window.SN;
  var root, img, cap, count, btnPrev, btnNext, btnClose;
  var items = [], index = 0, trigger = null;

  var L = {
    dialog: { ar: "عارض الصور", he: "מציג תמונות" },
    close:  { ar: "إغلاق", he: "סגירה" },
    prev:   { ar: "الصورة السابقة", he: "התמונה הקודמת" },
    next:   { ar: "الصورة التالية", he: "התמונה הבאה" }
  };

  function icon(id) {
    return '<svg class="icon" aria-hidden="true"><use href="' + SN.assetBase + 'assets/img/icons.svg#' + id + '"/></svg>';
  }

  function build() {
    root = document.createElement("div");
    root.className = "lightbox";
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.innerHTML =
      '<div class="lightbox__bar">' +
        '<span class="lightbox__count" aria-live="polite"></span>' +
        '<button class="lightbox__btn lightbox__close" type="button">' + icon("close") + '</button>' +
      '</div>' +
      '<div class="lightbox__stage">' +
        '<img class="lightbox__img" alt="">' +
        '<button class="lightbox__btn lightbox__nav lightbox__nav--prev" type="button">' + icon("chev-prev") + '</button>' +
        '<button class="lightbox__btn lightbox__nav lightbox__nav--next" type="button">' + icon("chev-next") + '</button>' +
      '</div>' +
      '<p class="lightbox__caption"></p>';
    document.body.appendChild(root);
    img = root.querySelector(".lightbox__img");
    cap = root.querySelector(".lightbox__caption");
    count = root.querySelector(".lightbox__count");
    btnPrev = root.querySelector(".lightbox__nav--prev");
    btnNext = root.querySelector(".lightbox__nav--next");
    btnClose = root.querySelector(".lightbox__close");

    btnClose.addEventListener("click", close);
    btnPrev.addEventListener("click", function () { go(index - 1); });
    btnNext.addEventListener("click", function () { go(index + 1); });
    root.addEventListener("click", function (e) {
      if (e.target === root || e.target.classList.contains("lightbox__stage")) close();
    });
    root.addEventListener("keydown", onKey);

    var x0 = null, y0 = null;
    root.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      x0 = null;
      if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return;
      /* RTL: swiping right reveals the next image */
      go(dx > 0 ? index + 1 : index - 1);
    }, { passive: true });
    labels();
    SN.i18n.onChange(function () { labels(); if (root.classList.contains("is-open")) render(); });
  }

  function labels() {
    root.setAttribute("aria-label", SN.t(L.dialog));
    btnClose.setAttribute("aria-label", SN.t(L.close));
    btnPrev.setAttribute("aria-label", SN.t(L.prev));
    btnNext.setAttribute("aria-label", SN.t(L.next));
  }

  function render() {
    var it = items[index];
    if (!it) return;
    var single = items.length < 2;
    btnPrev.hidden = btnNext.hidden = single;
    count.textContent = single ? "" : (index + 1) + " / " + items.length;
    var src = it.full || it.src;
    if (img.getAttribute("src") === src) { img.alt = it.alt(); cap.textContent = it.caption(); return; }
    img.classList.add("is-switching");
    var pre = new Image();
    pre.onload = pre.onerror = function () {
      img.src = src;
      img.alt = it.alt();
      cap.textContent = it.caption();
      requestAnimationFrame(function () { img.classList.remove("is-switching"); });
    };
    pre.src = src;
  }

  function go(i) {
    if (items.length < 2) return;
    index = (i + items.length) % items.length;
    render();
  }

  function onKey(e) {
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    /* In RTL the "next" image sits to the left */
    if (e.key === "ArrowLeft") { e.preventDefault(); go(index + 1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); go(index - 1); }
    else if (e.key === "Home") { e.preventDefault(); go(0); }
    else if (e.key === "End") { e.preventDefault(); go(items.length - 1); }
    else if (e.key === "Tab") {
      var f = [].filter.call(root.querySelectorAll("button"), function (b) { return !b.hidden; });
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function open(list, i, from) {
    if (!root) build();
    items = list; index = i || 0; trigger = from || document.activeElement;
    render();
    root.classList.add("is-open");
    document.documentElement.style.overflow = "hidden";
    setTimeout(function () { btnClose.focus(); }, 30);
  }

  function close() {
    root.classList.remove("is-open");
    document.documentElement.style.overflow = "";
    if (trigger && trigger.focus) trigger.focus();
  }

  function fromButton(btn) {
    var im = btn.querySelector("img");
    var c = btn.querySelector(".gallery__caption");
    return {
      src: im.currentSrc || im.src,
      full: im.dataset.full || btn.dataset.full,
      alt: function () { return im.alt; },
      caption: function () { return c ? c.textContent.trim() : im.alt; }
    };
  }

  SN.lightbox = { open: open };

  /* base path for the icon sprite (pages in sub-folders set data-base="../") */
  SN.assetBase = document.documentElement.dataset.base || "";

  document.addEventListener("click", function (e) {
    var single = e.target.closest("[data-lightbox-single]");
    if (single) { open([fromButton(single)], 0, single); return; }
    var btn = e.target.closest("[data-gallery] .gallery__btn");
    if (btn) {
      var gallery = btn.closest("[data-gallery]");
      var visible = [].filter.call(gallery.querySelectorAll(".gallery__item"), function (li) {
        return !li.classList.contains("is-hidden");
      }).map(function (li) { return li.querySelector(".gallery__btn"); });
      open(visible.map(fromButton), visible.indexOf(btn), btn);
    }
  });
})();
