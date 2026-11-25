// Page polish: scroll progress bar, cards that animate in as you scroll, and a soft glow following the cursor.
// Board screens' side panels are left out: their controls must never wait on a scroll animation.
const TARGETS = '.page-head, .tabs, .card';
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

let io = null, mo = null, until = 0, queued = false;

function show(el, delay = 0) {
  el.classList.remove('fx-hide');
  el.style.animationDelay = delay + 'ms';
  el.classList.add('fx-in');
  const done = () => { el.classList.remove('fx-in'); el.style.animationDelay = ''; };
  el.addEventListener('animationend', done, { once: true });
  setTimeout(done, delay + 900); // content must never stay invisible if the browser pauses animations
}

function scan(view) {
  queued = false;
  if (!io) return;
  const fold = innerHeight * 0.94;
  let n = 0;
  for (const el of view.querySelectorAll(TARGETS)) {
    if (el.dataset.fx) continue;
    el.dataset.fx = '1';
    if (el.parentElement.closest('.card, .side-panel')) continue; // nested: moves with its parent or stays put
    if (el.getBoundingClientRect().top < fold) show(el, Math.min(n++, 8) * 45);
    else { el.classList.add('fx-hide'); io.observe(el); }
  }
}

/** Call after a page renders. Only the first moments are animated, so live updates never flicker. */
export function animateView(view) {
  io?.disconnect();
  mo?.disconnect();
  io = null;
  if (calm() || document.hidden || !('IntersectionObserver' in window)) return;
  io = new IntersectionObserver(entries => {
    let n = 0;
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      show(e.target, Math.min(n++, 4) * 70);
    }
  }, { rootMargin: '0px 0px -6% 0px' });
  until = Date.now() + 1000;
  mo = new MutationObserver(() => {
    if (Date.now() > until) { mo.disconnect(); return; }
    if (!queued) { queued = true; requestAnimationFrame(() => scan(view)); }
  });
  mo.observe(view, { childList: true, subtree: true });
  scan(view);
}

export function initFx() {
  const bar = document.createElement('div');
  bar.id = 'scroll-bar';
  document.body.appendChild(bar);
  let ticking = false;
  const paint = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
  };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  new ResizeObserver(request).observe(document.body);

  if (calm() || !matchMedia('(hover: hover)').matches) return;
  document.addEventListener('pointermove', e => {
    const c = e.target.closest?.('.card, .theme-btn');
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', `${e.clientX - r.left}px`);
    c.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });
}
