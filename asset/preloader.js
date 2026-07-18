// ============================================================
// Loading screen (splash) — simulated progress synced to the
// real window "load" event, with a safety timeout so it never
// blocks the site if something is slow to arrive.
// ============================================================
(function () {
  "use strict";

  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fill = document.getElementById('preloaderFill');
  const percentEl = document.getElementById('preloaderPercent');

  function reveal() {
    preloader.classList.add('hidden');
    document.body.classList.remove('loading');
    document.dispatchEvent(new CustomEvent('site:ready'));
    setTimeout(() => preloader.remove(), 700);
  }

  if (reduceMotion) {
    document.body.classList.remove('loading');
    preloader.classList.add('hidden');
    document.dispatchEvent(new CustomEvent('site:ready'));
    setTimeout(() => preloader.remove(), 50);
    return;
  }

  document.body.classList.add('loading');

  let progress = 0;
  let windowLoaded = false;
  let rafId = null;

  function setProgress(p) {
    progress = p;
    if (fill) fill.style.width = p + '%';
    if (percentEl) percentEl.textContent = Math.round(p) + '%';
  }

  function tick() {
    const ceiling = windowLoaded ? 100 : 90;
    progress += (ceiling - progress) * 0.06 + 0.15;
    if (progress > ceiling) progress = ceiling;
    setProgress(progress);

    if (progress < 99.5) {
      rafId = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafId);
      setProgress(100);
      setTimeout(reveal, 250);
    }
  }

  window.addEventListener('load', () => { windowLoaded = true; });
  // Safety net: never let the splash block the site for more than ~4.5s
  setTimeout(() => { windowLoaded = true; }, 4500);

  rafId = requestAnimationFrame(tick);
})();
