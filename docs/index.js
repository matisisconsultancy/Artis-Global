/* ═══════════════════════════════════════════════════════
   ARTIS GLOBAL · index.js
═══════════════════════════════════════════════════════ */
'use strict';

const $     = id  => document.getElementById(id);
const $$    = sel => document.querySelectorAll(sel);
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const isMob = () => window.innerWidth <= 640;
const noHov = () => window.matchMedia('(hover:none)').matches;


/* ─────────────────────────────────────────────────
   1. HERO GRADIENT → MOUSE
───────────────────────────────────────────────── */
const heroBg     = $('heroBg');
const heroSticky = $('heroSticky');
if (heroBg && heroSticky && !noHov()) {
  heroSticky.addEventListener('mousemove', e => {
    const r = heroSticky.getBoundingClientRect();
    heroBg.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%');
    heroBg.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
  }, { passive: true });
}


/* ─────────────────────────────────────────────────
   2. HERO SCROLL-DRIVEN (Hark Capital style)
      headline sube · subtítulo aparece
───────────────────────────────────────────────── */
const heroWrap      = $('hero-wrap');
const heroHeadline  = $('heroHeadline');
const heroStatsBand = $('heroStats');
const heroHint      = $('heroScrollHint');

const HERO_LIFT = 180;
const PHASE_IN  = 0.28;

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

let heroRaf = false;
function heroTick() {
  heroRaf = false;
  if (!heroWrap) return;
  const sY      = window.scrollY;
  const wrapTop = heroWrap.getBoundingClientRect().top + sY;
  const room    = heroWrap.offsetHeight - window.innerHeight;
  const p       = clamp((sY - wrapTop) / room, 0, 1);

  const lift = p < PHASE_IN ? 0 : easeOut((p - PHASE_IN) / (1 - PHASE_IN)) * HERO_LIFT;
  if (heroHeadline) heroHeadline.style.transform = `translateY(-${lift.toFixed(1)}px)`;

  const panP = clamp((p - PHASE_IN) / (1 - PHASE_IN), 0, 1);
  const panE = easeOut(panP);
  if (heroStatsBand) {
    heroStatsBand.style.opacity   = panE.toFixed(3);
    heroStatsBand.style.transform = `translateY(${((1 - panE) * 14).toFixed(1)}px)`;
    heroStatsBand.setAttribute('aria-hidden', panP < .05 ? 'true' : 'false');
  }

  if (heroHint) heroHint.classList.toggle('hidden', p > .04);
}

window.addEventListener('scroll', () => {
  if (!heroRaf) { heroRaf = true; requestAnimationFrame(heroTick); }
}, { passive: true });
window.addEventListener('resize', heroTick, { passive: true });
window.addEventListener('load',   heroTick);


/* ─────────────────────────────────────────────────
   3. HERO PARTICLES
───────────────────────────────────────────────── */
const pWrap = $('heroParticles');
if (pWrap) {
  for (let i = 0; i < 22; i++) {
    const el = document.createElement('div');
    el.classList.add('particle');
    const s = (Math.random() * 3.5 + 1.5).toFixed(1);
    el.style.cssText = [
      `width:${s}px`, `height:${s}px`,
      `left:${(Math.random() * 100).toFixed(1)}%`,
      `top:${(Math.random() * 80 + 20).toFixed(1)}%`,
      `--d:${(Math.random() * 10 + 7).toFixed(1)}s`,
      `--dl:${(Math.random() * 8).toFixed(1)}s`,
      `--tx:${(Math.random() * 70 - 35).toFixed(0)}px`,
      `--ty:${(-(Math.random() * 200 + 80)).toFixed(0)}px`,
      `--op:${(Math.random() * .15 + .04).toFixed(2)}`,
    ].join(';');
    pWrap.appendChild(el);
  }
}


/* ─────────────────────────────────────────────────
   4. SCROLL REVEAL
───────────────────────────────────────────────── */
const revIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revIO.unobserve(entry.target);
    }
  });
}, { threshold: .1, rootMargin: '0px 0px -30px 0px' });
$$('.reveal').forEach(el => revIO.observe(el));


/* ─────────────────────────────────────────────────
   5. STAT COUNTERS
───────────────────────────────────────────────── */
const cntIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = parseInt(el.dataset.target, 10);
    const dur    = 1400;
    const t0     = performance.now();
    (function fr(now) {
      const prog = clamp((now - t0) / dur, 0, 1);
      el.textContent = Math.round((1 - Math.pow(1 - prog, 3)) * target);
      if (prog < 1) requestAnimationFrame(fr);
      else el.textContent = target;
    })(t0);
    cntIO.unobserve(el);
  });
}, { threshold: .5 });
$$('[data-target]').forEach(el => {
  if (el.closest('#heroStats')) return;
  cntIO.observe(el);
});


/* ─────────────────────────────────────────────────
   6. MARQUEES
───────────────────────────────────────────────── */
function mkMq(id, items) {
  const track = $(id);
  if (!track) return;
  const html = items.map(i =>
    `<span class="mq-item"><span class="mq-dot"></span>${i}</span>`
  ).join('');
  track.innerHTML = html + html;
}
mkMq('mq1', ['Asesoría jurídica salud', 'Habilitación SUPERSALUD', 'Estrategia financiera IPS', 'Comunicación institucional', 'Activos digitales Colombia', 'Ideas claras, impacto real', 'Lex artis · Bogotá']);
mkMq('mq2', ['Primera consulta sin costo', 'Bogotá · Colombia', 'Agendar asesoría', '+57 319 507 9403', 'Sector salud Colombia', 'Ideas claras, impacto real', 'Sin compromiso']);
mkMq('mq3', ['Asesoría jurídica', 'Asesoría financiera', 'Consultoría estratégica', 'ARTIS Global', 'Ideas claras, impacto real', 'Agendar asesoría']);


/* ─────────────────────────────────────────────────
   7. QUOTE — scroll-driven bg transition
───────────────────────────────────────────────── */
(function () {
  var sec    = $('quote-sec');
  var sticky = $('quoteSticky');
  if (!sec || !sticky) return;

  var C0 = [14, 41, 22];
  var C1 = [245, 244, 240];
  var T0 = [255, 255, 255];
  var T1 = [8, 26, 13];
  var L0 = [168, 216, 50];
  var L1 = [90, 160, 30];

  function lerpQ(a, b, t) { return Math.round(a + (b - a) * t); }
  function rgbQ(c) { return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')'; }
  function easeQ(t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

  var qRaf = false;

  function quoteTick() {
    qRaf = false;
    var sY   = window.scrollY;
    var top  = sec.getBoundingClientRect().top + sY;
    var room = sec.offsetHeight - window.innerHeight;
    var p    = clamp((sY - top) / room, 0, 1);
    var e    = easeQ(p);

    var bg = [lerpQ(C0[0], C1[0], e), lerpQ(C0[1], C1[1], e), lerpQ(C0[2], C1[2], e)];
    sticky.style.backgroundColor = rgbQ(bg);
    sticky.style.setProperty('--glow-op', (Math.sin(p * Math.PI) * .55).toFixed(3));

    var tc = [lerpQ(T0[0], T1[0], e), lerpQ(T0[1], T1[1], e), lerpQ(T0[2], T1[2], e)];
    var lc = [lerpQ(L0[0], L1[0], e), lerpQ(L0[1], L1[1], e), lerpQ(L0[2], L1[2], e)];

    var bigP = sticky.querySelector('.big-quote p');
    if (bigP) bigP.style.color = rgbQ(tc);
    var bigPEm = sticky.querySelector('.big-quote p em');
    if (bigPEm) bigPEm.style.color = rgbQ(lc);
    var labelStrong = sticky.querySelector('.qa-label strong');
    if (labelStrong) labelStrong.style.color = rgbQ(tc);
    var labelSpan = sticky.querySelector('.qa-label span');
    if (labelSpan) labelSpan.style.color = 'rgba(' + tc[0] + ',' + tc[1] + ',' + tc[2] + ',.40)';

    sticky.style.setProperty('--q-color', 'rgba(' + tc[0] + ',' + tc[1] + ',' + tc[2] + ',.65)');
    sec.style.borderTop = p < .1
      ? '1px solid rgba(255,255,255,.1)'
      : '1px solid rgba(7,21,13,.06)';
  }

  window.addEventListener('scroll', function () {
    if (!qRaf) { qRaf = true; requestAnimationFrame(quoteTick); }
  }, { passive: true });
  window.addEventListener('resize', quoteTick, { passive: true });
  quoteTick();
})();


/* ─────────────────────────────────────────────────
   8. CONTACTO + FOOTER — scroll-driven bg
      crema → verde profundo
───────────────────────────────────────────────── */
(function () {
  var wrap   = $('cf-wrap');
  var sticky = $('cfSticky');
  if (!wrap || !sticky) return;

  var B0 = [245, 244, 240];
  var B1 = [10, 31, 16];
  var H0 = [8, 26, 13];
  var H1 = [255, 255, 255];

  function lerpC(a, b, t) { return Math.round(a + (b - a) * t); }
  function rgbC(c) { return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')'; }
  function easeC(t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

  var cfRaf = false;

  function cfTick() {
    cfRaf = false;
    var sY   = window.scrollY;
    var top  = wrap.getBoundingClientRect().top + sY;
    var room = wrap.offsetHeight - window.innerHeight;
    var p    = clamp((sY - top) / room, 0, 1);
    var e    = easeC(p);

    var bg = [lerpC(B0[0], B1[0], e), lerpC(B0[1], B1[1], e), lerpC(B0[2], B1[2], e)];
    sticky.style.backgroundColor = rgbC(bg);

    sticky.style.setProperty('--cf-glow', (Math.max(0, (e - .3) / .7) * .28).toFixed(3));

    var footerSection = sticky.querySelector('#footer');
    if (footerSection) {
      footerSection.style.backgroundColor = e > 0.85 ? '#0a1f10' : 'transparent';
    }

    var hc = [lerpC(H0[0], H1[0], e), lerpC(H0[1], H1[1], e), lerpC(H0[2], H1[2], e)];

    var bc = e < .5
      ? 'rgba(8,26,13,' + (.1 - e * .1).toFixed(2) + ')'
      : 'rgba(255,255,255,' + ((e - .5) * .2).toFixed(2) + ')';

    var h2el = sticky.querySelector('.contact-info-col h2');
    if (h2el) h2el.style.color = rgbC(hc);

    var sub = sticky.querySelector('.ci-sub');
    if (sub) sub.style.color = 'rgba(' + lerpC(8,255,e) + ',' + lerpC(26,255,e) + ',' + lerpC(13,255,e) + ',.' + Math.round(lerpC(48,52,e)) + ')';

    sticky.querySelectorAll('.ci-row span, .ci-row a').forEach(function(el) {
      el.style.color = 'rgba(' + lerpC(8,255,e) + ',' + lerpC(26,255,e) + ',' + lerpC(13,255,e) + ',' + lerpC(55,58,e)/100 + ')';
    });

    sticky.querySelectorAll('.ci-icon').forEach(function(el) {
      el.style.background  = 'rgba(' + lerpC(8,255,e) + ',' + lerpC(26,255,e) + ',' + lerpC(13,255,e) + ',.06)';
      el.style.borderColor = 'rgba(' + lerpC(8,255,e) + ',' + lerpC(26,255,e) + ',' + lerpC(13,255,e) + ',.12)';
      el.style.color = e < .5
        ? 'rgb(' + lerpC(98,168,e*2) + ',' + lerpC(188,216,e*2) + ',' + lerpC(36,50,e*2) + ')'
        : 'rgb(168,216,50)';
    });

    sticky.querySelectorAll('.foot-address p, .foot-contact a, .foot-copy-row > span, .foot-legal a, .foot-tag').forEach(function(el) {
      el.style.color = 'rgba(' + lerpC(8,255,e) + ',' + lerpC(26,255,e) + ',' + lerpC(13,255,e) + ',' + lerpC(38,30,e)/100 + ')';
    });

    var copyRow = sticky.querySelector('.foot-copy-row');
    if (footerSection) footerSection.style.borderTopColor = bc;
    if (copyRow) copyRow.style.borderTopColor = bc;

    var fw = sticky.querySelector('.nav-wordmark');
    if (fw) fw.style.color = rgbC(hc);

    var flogo = sticky.querySelector('.nav-logo-img--footer');
    if (flogo) {
      flogo.style.filter = 'invert(' + Math.round(lerpC(100,0,e)) + '%) brightness(' + Math.round(lerpC(20,100,e)) + '%)';
    }
  }

  window.addEventListener('scroll', function () {
    if (!cfRaf) { cfRaf = true; requestAnimationFrame(cfTick); }
  }, { passive: true });
  window.addEventListener('resize', cfTick, { passive: true });
  cfTick();
})();


/* ─────────────────────────────────────────────────
   10. CARD SPOTLIGHT HOVER (proceso)
───────────────────────────────────────────────── */
if (!noHov()) {
  $$('.proc-step').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var r = card.getBoundingClientRect();
      card.style.background = 'radial-gradient(140px circle at ' + (e.clientX - r.left) + 'px ' + (e.clientY - r.top) + 'px,rgba(158,203,45,.06),transparent 70%)';
    });
    card.addEventListener('mouseleave', function() { card.style.background = ''; });
  });
}


/* ─────────────────────────────────────────────────
   11. PARALLAX DESAFÍOS (desktop only)
───────────────────────────────────────────────── */
var dscWrap = $('desafios-wrap');
var dscImg  = $('dscBgImg');
var fcCards = dscWrap ? Array.from(dscWrap.querySelectorAll('.fc-card')) : [];
fcCards.forEach(function(c) { c._speed = parseFloat(c.getAttribute('data-px-speed') || '0'); });
var rafPending = false;

function parallaxTick() {
  rafPending = false;
  if (!dscWrap || isMob()) return;
  var sY         = window.scrollY;
  var vh         = window.innerHeight;
  var wrapTop    = dscWrap.getBoundingClientRect().top + sY;
  var scrollRoom = dscWrap.offsetHeight - vh;
  var progress   = clamp((sY - wrapTop) / scrollRoom, 0, 1);
  if (dscImg) dscImg.style.transform = 'scale(' + (1.18 - 0.18 * progress).toFixed(4) + ')';
  fcCards.forEach(function(c) {
    // never overwrite mobile CSS transform
    if (!isMob()) c.style.transform = 'translateY(' + (-(progress * c._speed)).toFixed(2) + 'px)';
  });
}
function onScroll() {
  if (!rafPending) { rafPending = true; requestAnimationFrame(parallaxTick); }
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', parallaxTick, { passive: true });
window.addEventListener('load',   parallaxTick);


/* ─────────────────────────────────────────────────
   11b. MOBILE CARD ENTRANCE
───────────────────────────────────────────────── */
(function () {
  if (!isMob()) return;
  var cards = Array.from(document.querySelectorAll('.fc-card'));
  if (!cards.length) return;
  var cardIO = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var idx = cards.indexOf(entry.target);
        setTimeout(function() { entry.target.classList.add('mob-in'); }, Math.max(0, idx) * 80);
        cardIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px 0px 0px' });
  cards.forEach(function(c) { cardIO.observe(c); });
})();


/* ─────────────────────────────────────────────────
   12. ACCORDION SOLUCIÓN
───────────────────────────────────────────────── */
var accItems = Array.from($$('[data-acc]'));
accItems.forEach(function(item) {
  var trigger = item.querySelector('.acc-trigger');
  if (!trigger) return;

  trigger.addEventListener('mouseenter', function() {
    accItems.forEach(function(other) {
      var t = other.querySelector('.acc-trigger');
      if (t) t.classList.remove('hov-grad');
    });
    trigger.classList.add('hov-grad');
  });
  trigger.addEventListener('mouseleave', function() { trigger.classList.remove('hov-grad'); });

  trigger.addEventListener('click', function() {
    var isOpen = item.classList.contains('acc-open');
    accItems.forEach(function(other) {
      other.classList.remove('acc-open');
      var t = other.querySelector('.acc-trigger');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('acc-open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
});


/* ─────────────────────────────────────────────────
   13. WIZARD FORM
───────────────────────────────────────────────── */
var progFill = $('progFill');
var wizHead  = $('wizHead');
var wizBody  = $('wizBody');
var wizOk    = $('wizOk');
var sel      = { org: '', svc: '' };

function setStep(n) {
  $$('.wstep').forEach(function(s, i) { s.classList.toggle('active', i === n); });
  $$('.wtab').forEach(function(t, i) {
    t.classList.remove('active', 'done');
    if (i === n) t.classList.add('active');
    if (i < n)  t.classList.add('done');
  });
  if (progFill) progFill.style.width = Math.round((n + 1) / 3 * 100) + '%';
}
function shake(el) {
  el.animate([
    { transform: 'translateX(0)' }, { transform: 'translateX(-7px)' },
    { transform: 'translateX(7px)' }, { transform: 'translateX(-4px)' },
    { transform: 'translateX(0)' }
  ], { duration: 320, easing: 'ease' });
}

$$('#ws0 .opt, #ws1 .opt').forEach(function(o) {
  o.addEventListener('click', function() {
    o.closest('.opts').querySelectorAll('.opt').forEach(function(x) { x.classList.remove('sel'); });
    o.classList.add('sel');
    if (o.closest('#ws0')) sel.org = o.dataset.v;
    if (o.closest('#ws1')) sel.svc = o.dataset.v;
  });
});

var n0btn = $('n0'); if (n0btn) n0btn.addEventListener('click', function() { sel.org ? setStep(1) : shake($('ws0')); });
var b1btn = $('b1'); if (b1btn) b1btn.addEventListener('click', function() { setStep(0); });
var n1btn = $('n1'); if (n1btn) n1btn.addEventListener('click', function() { sel.svc ? setStep(2) : shake($('ws1')); });
var b2btn = $('b2'); if (b2btn) b2btn.addEventListener('click', function() { setStep(1); });

var subbtn = $('sub');
if (subbtn) {
  subbtn.addEventListener('click', function() {
    var bad = ['fn','fo','fe','ft'].filter(function(id) { var f = $(id); return !f || !f.value.trim(); });
    bad.forEach(function(id) {
      var f = $(id);
      if (!f) return;
      f.style.borderColor = '#e05252';
      f.addEventListener('input', function() { f.style.borderColor = ''; }, { once: true });
    });
    if (bad.length) { shake($('ws2')); return; }
    if (wizHead) wizHead.style.display = 'none';
    if (wizBody) wizBody.style.display = 'none';
    if (wizOk) {
      wizOk.style.display = 'block';
      wizOk.animate(
        [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 420, easing: 'ease', fill: 'forwards' }
      );
    }
  });
}


/* ─────────────────────────────────────────────────
   14. NAV SCROLL + ACTIVE SECTION
───────────────────────────────────────────────── */
var navEl = $('nav');
window.addEventListener('scroll', function() {
  navEl.classList.toggle('solid', window.scrollY > 50);
}, { passive: true });

var secIO = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      $$('.nav-link').forEach(function(a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: .35 });
document.querySelectorAll('section[id], div[id="desafios"], div[id="hero-wrap"]')
  .forEach(function(s) { secIO.observe(s); });


/* ─────────────────────────────────────────────────
   15. BOGOTÁ CLOCK
───────────────────────────────────────────────── */
(function clock() {
  var now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' }));
  var el  = $('navTime');
  if (el) {
    el.textContent = 'Bogotá\u2002' + String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
  }
  setTimeout(clock, 15000);
})();


/* ─────────────────────────────────────────────────
   16. MOBILE MENU
───────────────────────────────────────────────── */
var menuBtn    = $('menuBtn');
var mobOverlay = $('mobOverlay');
var mobX       = $('mobClose');

function closeMob() {
  if (mobOverlay) mobOverlay.classList.remove('open');
  if (menuBtn) {
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  document.body.style.overflow = '';
}

if (menuBtn) {
  menuBtn.addEventListener('click', function() {
    if (mobOverlay) mobOverlay.classList.add('open');
    menuBtn.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  });
}
if (mobX) {
  mobX.addEventListener('click', function(e) { e.stopPropagation(); closeMob(); });
  mobX.addEventListener('touchstart', function(e) { e.stopPropagation(); closeMob(); }, { passive: true });
}
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeMob(); });


/* ─────────────────────────────────────────────────
   17. SMOOTH SCROLL
───────────────────────────────────────────────── */
$$('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
    closeMob();
  });
});


/* ─────────────────────────────────────────────────
   18. COOKIE CONSENT
───────────────────────────────────────────────── */
(function () {
  var STORAGE_KEY = 'artis_cookies_v1';
  var banner      = document.getElementById('cookieBanner');
  var btnClose    = document.getElementById('ckClose');
  var btnAccept   = document.getElementById('ckAccept');
  var btnReject   = document.getElementById('ckReject');
  var btnCustom   = document.getElementById('ckCustom');
  var toggles     = document.querySelectorAll('.ck-toggle[data-key]');
  var manageLink  = document.getElementById('cookieManageLink');
  if (!banner) return;

  function getPrefs() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (err) { return null; }
  }
  function savePrefs(prefs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.assign({}, prefs, { ts: Date.now() })));
  }
  function showBanner() {
    banner.hidden = false;
    requestAnimationFrame(function() {
      requestAnimationFrame(function() { banner.classList.add('ck-visible'); });
    });
    var acceptBtn = document.getElementById('ckAccept');
    if (acceptBtn) acceptBtn.focus();
  }
  function hideBanner() {
    banner.classList.remove('ck-visible');
    banner.addEventListener('transitionend', function() { banner.hidden = true; }, { once: true });
  }
  function syncToggles(prefs) {
    toggles.forEach(function(t) {
      t.setAttribute('aria-checked', (prefs && prefs[t.dataset.key]) ? 'true' : 'false');
    });
  }
  function readToggles() {
    var out = {};
    toggles.forEach(function(t) { out[t.dataset.key] = t.getAttribute('aria-checked') === 'true'; });
    return out;
  }

  toggles.forEach(function(t) {
    t.addEventListener('click', function() {
      t.setAttribute('aria-checked', t.getAttribute('aria-checked') !== 'true' ? 'true' : 'false');
    });
    t.addEventListener('keydown', function(e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); t.click(); }
    });
  });

  if (btnAccept) btnAccept.addEventListener('click', function() { savePrefs({ analytics: true, marketing: true }); syncToggles({ analytics: true, marketing: true }); hideBanner(); });
  if (btnReject) btnReject.addEventListener('click', function() { savePrefs({ analytics: false, marketing: false }); syncToggles({ analytics: false, marketing: false }); hideBanner(); });
  if (btnCustom) btnCustom.addEventListener('click', function() { savePrefs(readToggles()); hideBanner(); });
  if (btnClose)  btnClose.addEventListener('click',  function() { savePrefs({ analytics: false, marketing: false }); hideBanner(); });

  if (manageLink) {
    manageLink.addEventListener('click', function(e) {
      e.preventDefault();
      syncToggles(getPrefs());
      showBanner();
    });
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !banner.hidden && btnClose) btnClose.click();
  });

  var stored = getPrefs();
  if (!stored) setTimeout(showBanner, 900);
  else syncToggles(stored);
})();


/* ─────────────────────────────────────────────────
   19. MOBILE TOUCH ENHANCEMENTS
───────────────────────────────────────────────── */
(function () {
  if (!isMob()) return;

  document.querySelectorAll('.cta-btn, .ghost-btn, .tm-cta').forEach(function(btn) {
    btn.addEventListener('touchstart', function() {
      btn.style.transform  = 'scale(.97)';
      btn.style.transition = 'transform .12s ease';
    }, { passive: true });
    btn.addEventListener('touchend', function() {
      btn.style.transform = '';
    }, { passive: true });
  });

  document.querySelectorAll('.proc-step').forEach(function(step) {
    step.addEventListener('touchstart', function() {
      this.style.background = 'rgba(168,216,50,.06)';
    }, { passive: true });
    step.addEventListener('touchend', function() {
      var self = this;
      setTimeout(function() { self.style.background = ''; }, 300);
    }, { passive: true });
  });

  var hint = document.getElementById('heroScrollHint');
  if (hint) {
    window.addEventListener('touchstart', function() { hint.classList.add('hidden'); }, { once: true, passive: true });
  }

  // Horizontal card gallery — scroll dots
  var dscCards = document.getElementById('dscCards');
  var dotsWrap = document.getElementById('dscDots');
  if (dscCards && dotsWrap) {
    var cardEls = Array.from(dscCards.querySelectorAll('.fc-card'));
    var dots = cardEls.map(function(_, i) {
      var d = document.createElement('div');
      d.className = 'dsc-scroll-dot' + (i === 0 ? ' active' : '');
      dotsWrap.appendChild(d);
      return d;
    });
    dotsWrap.style.display = 'flex';

    dscCards.addEventListener('scroll', function() {
      var scrollLeft = dscCards.scrollLeft;
      var gap = 14;
      var cardW = cardEls[0] ? (cardEls[0].offsetWidth + gap) : 1;
      var active = Math.min(Math.round(scrollLeft / cardW), dots.length - 1);
      dots.forEach(function(d, i) { d.classList.toggle('active', i === active); });
    }, { passive: true });
  }
})();