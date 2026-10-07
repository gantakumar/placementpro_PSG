/* PlacementPro — interactive UI layer.
   Pure enhancement: adds ripples, scroll reveal, card tilt/glow, counters
   and a scroll progress bar. Never touches app logic or data. */
(function () {
  if (window.__ppUiEnhanceLoaded) return;
  window.__ppUiEnhanceLoaded = true;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Scroll progress bar ─────────────────────────────── */
  var bar = document.createElement('div');
  bar.id = 'pp-scroll-progress';
  bar.style.cssText =
    'position:fixed;top:0;left:0;height:3px;width:0;z-index:9998;' +
    'background:linear-gradient(90deg,#7c6ff7,#a56bff,#34c9e8);' +
    'box-shadow:0 0 14px rgba(124,111,247,.8);transition:width .1s linear;pointer-events:none';
  document.body.appendChild(bar);
  window.addEventListener('scroll', function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }, { passive: true });

  /* ── 2. Button ripple ───────────────────────────────────── */
  document.addEventListener('click', function (e) {
    if (reduce) return;
    var btn = e.target.closest && e.target.closest('.btn, .nav-item, .tab-btn, .portal-card');
    if (!btn) return;
    var r = btn.getBoundingClientRect();
    var size = Math.max(r.width, r.height);
    var ink = document.createElement('span');
    ink.className = 'rp-ink';
    ink.style.width = ink.style.height = size + 'px';
    ink.style.left = (e.clientX - r.left - size / 2) + 'px';
    ink.style.top = (e.clientY - r.top - size / 2) + 'px';
    if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
    btn.appendChild(ink);
    setTimeout(function () { ink.remove(); }, 600);
  }, true);

  /* ── 3. Scroll reveal for cards / sections ──────────────── */
  var revealSel = '.card,.feat-card,.exp-card,.stat-card,.company-card,.co-mini-card,.holder-admin-card,.tbl-wrap,.q-card';
  var io = 'IntersectionObserver' in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
    : null;

  function markReveal(root) {
    if (!io || reduce) return;
    var nodes = (root || document).querySelectorAll(revealSel);
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.dataset.ppReveal) continue;
      n.dataset.ppReveal = '1';
      n.classList.add('reveal');
      n.style.transitionDelay = Math.min(i, 8) * 45 + 'ms';
      io.observe(n);
    }
  }

  /* ── 4. Pointer-follow glow on cards ────────────────────── */
  document.addEventListener('pointermove', function (e) {
    if (reduce) return;
    var card = e.target.closest && e.target.closest('.card,.feat-card,.exp-card,.stat-card,.portal-card,.company-card,.co-mini-card');
    if (!card) return;
    var r = card.getBoundingClientRect();
    card.style.background =
      'radial-gradient(320px circle at ' + (e.clientX - r.left) + 'px ' + (e.clientY - r.top) +
      'px, rgba(124,111,247,.13), transparent 62%), linear-gradient(160deg, rgba(255,255,255,.045), rgba(255,255,255,.015)), var(--surf)';
  }, { passive: true });
  document.addEventListener('pointerout', function (e) {
    var card = e.target.closest && e.target.closest('.card,.feat-card,.exp-card,.stat-card,.portal-card,.company-card,.co-mini-card');
    if (card && !card.contains(e.relatedTarget)) card.style.background = '';
  }, { passive: true });

  /* ── 5. Animated number counters on stat cards ──────────── */
  function animateCounters(root) {
    if (reduce) return;
    var nums = (root || document).querySelectorAll('.stat-num,.result-num');
    nums.forEach(function (el) {
      if (el.dataset.ppCounted) return;
      var raw = (el.textContent || '').trim();
      var m = raw.match(/^([^\d-]*)(-?\d+(?:\.\d+)?)(.*)$/);
      if (!m) return;
      el.dataset.ppCounted = '1';
      var pre = m[1], target = parseFloat(m[2]), post = m[3];
      var dec = (m[2].split('.')[1] || '').length;
      var start = performance.now(), dur = 900;
      (function step(now) {
        var p = Math.min(1, (now - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + (target * eased).toFixed(dec) + post;
        if (p < 1) requestAnimationFrame(step);
      })(start);
    });
  }

  /* ── 6. Re-apply after the legacy app re-renders the DOM ── */
  var queued = false;
  function refresh() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      markReveal(document);
      animateCounters(document);
    });
  }
  new MutationObserver(refresh).observe(document.body, { childList: true, subtree: true });
  refresh();
})();
