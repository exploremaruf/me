// ============================================================
// Premium GSAP animations — hero entrance + staggered reveals
// Degrades gracefully: if GSAP/ScrollTrigger fail to load (e.g.
// the CDN is blocked), every element here is visible by default
// since nothing is hidden via CSS — it just skips the flourish.
// ============================================================
(function () {
  "use strict";

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';

  if (hasGSAP && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---------- Hero entrance, fires once the splash screen clears ---------- */
  function heroIntro() {
    const heroSelectors = ['.build-console', '.hero-eyebrow', '.hero-name', '.hero-desc', '.hero-cta', '.hero-socials'];
    const heroEls = heroSelectors.map(sel => document.querySelector(sel)).filter(Boolean);
    const heroImage = document.querySelector('.hero-image .image-frame');

    if (!hasGSAP || reduceMotion) return; // elements are visible by default already

    gsap.set(heroEls, { opacity: 0, y: 26 });
    if (heroImage) gsap.set(heroImage, { opacity: 0, scale: 0.92, y: 20 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (heroImage) tl.to(heroImage, { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'power4.out' }, 0.05);
    tl.to(heroEls, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.15);
  }

  /* ---------- Staggered reveals for grid / list groups ---------- */
  function initScrollReveals() {
    if (!hasGSAP || !window.ScrollTrigger || reduceMotion) return;

    const groups = [
      { container: '.skills-grid', items: '.skill-card' },
      { container: '.projects-grid', items: '.project-card' },
      { container: '.timeline-wrapper', items: '.timeline-item' }
    ];

    groups.forEach(({ container, items }) => {
      const root = document.querySelector(container);
      if (!root) return;
      const els = root.querySelectorAll(items);
      if (!els.length) return;

      gsap.set(els, { opacity: 0, y: 32 });
      ScrollTrigger.batch(els, {
        start: 'top 88%',
        once: true,
        onEnter: batch => gsap.to(batch, {
          opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.1
        })
      });
    });
  }

  document.addEventListener('site:ready', heroIntro, { once: true });
  initScrollReveals();
})();
