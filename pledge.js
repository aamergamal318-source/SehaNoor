/* pledge.js — Pledge form logic (language, signature pad, localStorage) */

// ── Language ──────────────────────────────────────────────
const LANG_KEY = 'ortbari_lang';
let lang = localStorage.getItem(LANG_KEY) || 'ar';

function applyLang(l) {
  lang = l;
  localStorage.setItem(LANG_KEY, l);
  document.documentElement.lang = l;
  document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-he]').forEach(el => {
    if (l === 'he') {
      if (!el.dataset.arSaved) el.dataset.arSaved = el.textContent;
      el.textContent = el.getAttribute('data-he');
    } else {
      if (el.dataset.arSaved) el.textContent = el.dataset.arSaved;
    }
  });

  // Sync input placeholders
  document.querySelectorAll('[data-placeholder-he]').forEach(el => {
    if (!el.dataset.placeholderArSaved) el.dataset.placeholderArSaved = el.placeholder;
    el.placeholder = l === 'he' ? el.getAttribute('data-placeholder-he') : el.dataset.placeholderArSaved;
  });

  const lbl = document.getElementById('pLangLabel');
  if (lbl) lbl.textContent = l === 'ar' ? 'עברית' : 'العربية';
}

const langBtn = document.getElementById('pLangBtn');
if (langBtn) langBtn.addEventListener('click', () => applyLang(lang === 'ar' ? 'he' : 'ar'));

applyLang(lang);

// ── Storage ────────────────────────────────────────────────
const STORAGE_KEY = 'sehanoor_pledges';

function getSignatories() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function saveSignatory(data) {
  const list = getSignatories();
  list.push(data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function updateHeaderCount() {
  const el = document.getElementById('hdrSigCount');
  if (el) el.textContent = getSignatories().length;
}

updateHeaderCount();

// ── Signature Pad ─────────────────────────────────────────
const canvas = document.getElementById('sigCanvas');
const ctx    = canvas ? canvas.getContext('2d') : null;
const hint   = document.getElementById('sigHint');
const sigWrap = document.getElementById('sigWrap');

let paths = [];       // completed strokes
let curPath = [];     // stroke in progress
let drawing = false;

function resizeCanvas() {
  if (!canvas) return;
  const r   = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = r.width  * dpr;
  canvas.height = r.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  repaint();
}

function repaint() {
  if (!canvas) return;
  const w = canvas.width  / (window.devicePixelRatio || 1);
  const h = canvas.height / (window.devicePixelRatio || 1);
  ctx.clearRect(0, 0, w, h);
  ctx.lineCap    = 'round';
  ctx.lineJoin   = 'round';
  ctx.lineWidth  = 2.4;
  ctx.strokeStyle = '#1e293b';

  [...paths, curPath].forEach(p => {
    if (p.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(p[0].x, p[0].y);
    for (let i = 1; i < p.length - 1; i++) {
      const mx = (p[i].x + p[i + 1].x) / 2;
      const my = (p[i].y + p[i + 1].y) / 2;
      ctx.quadraticCurveTo(p[i].x, p[i].y, mx, my);
    }
    ctx.lineTo(p[p.length - 1].x, p[p.length - 1].y);
    ctx.stroke();
  });
}

function getPoint(e) {
  const r = canvas.getBoundingClientRect();
  const src = e.touches ? e.touches[0] : e;
  return { x: src.clientX - r.left, y: src.clientY - r.top };
}

function onDown(e) {
  e.preventDefault();
  drawing = true;
  curPath = [getPoint(e)];
  if (hint) hint.classList.add('hidden');
  if (sigWrap) sigWrap.classList.add('active');
}
function onMove(e) {
  if (!drawing) return;
  e.preventDefault();
  curPath.push(getPoint(e));
  repaint();
}
function onUp(e) {
  if (!drawing) return;
  e.preventDefault();
  drawing = false;
  if (curPath.length) { paths.push(curPath); curPath = []; repaint(); }
}

if (canvas) {
  canvas.addEventListener('mousedown',  onDown);
  canvas.addEventListener('mousemove',  onMove);
  canvas.addEventListener('mouseup',    onUp);
  canvas.addEventListener('mouseleave', onUp);
  canvas.addEventListener('touchstart', onDown, { passive: false });
  canvas.addEventListener('touchmove',  onMove, { passive: false });
  canvas.addEventListener('touchend',   onUp,   { passive: false });

  window.addEventListener('resize', resizeCanvas);
  // Run after fonts / layout settle
  requestAnimationFrame(resizeCanvas);
}

document.getElementById('sigUndo')?.addEventListener('click', () => {
  paths.pop();
  repaint();
  if (!paths.length && hint) hint.classList.remove('hidden');
});
document.getElementById('sigClear')?.addEventListener('click', () => {
  paths = []; curPath = []; repaint();
  if (hint) hint.classList.remove('hidden');
  if (sigWrap) sigWrap.classList.remove('active');
});

// ── Form Submit ────────────────────────────────────────────
document.getElementById('pledgeForm')?.addEventListener('submit', e => {
  e.preventDefault();

  const nameEl  = document.getElementById('pledgeName');
  const nameErr = document.getElementById('nameErr');
  const name    = nameEl.value.trim();

  if (!name) {
    nameErr.hidden = false;
    nameEl.focus();
    return;
  }
  nameErr.hidden = true;

  saveSignatory({
    id:        Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name,
    classroom: document.getElementById('pledgeClass').value.trim(),
    contact:   document.getElementById('pledgeContact').value.trim(),
    signature: paths.length ? canvas.toDataURL('image/png') : null,
    date:      new Date().toISOString()
  });

  document.getElementById('pledgeFormState').hidden   = true;
  document.getElementById('pledgeSuccessState').hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Sign Again ─────────────────────────────────────────────
document.getElementById('pledgeAgainBtn')?.addEventListener('click', () => {
  document.getElementById('pledgeSuccessState').hidden = true;
  document.getElementById('pledgeFormState').hidden    = false;
  document.getElementById('pledgeForm').reset();
  paths = []; curPath = []; repaint();
  if (hint) hint.classList.remove('hidden');
  if (sigWrap) sigWrap.classList.remove('active');
  updateHeaderCount();
});

// ── Share Toast ────────────────────────────────────────────
function showToast() {
  const t = document.getElementById('shareToast');
  if (!t) return;
  navigator.clipboard?.writeText(window.location.href).catch(() => {});
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
