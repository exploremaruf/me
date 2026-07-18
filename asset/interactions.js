// ============================================================
// Mouse-reactive interactions:
//   1. Custom smooth-follow cursor (dot + lagging ring)
//   2. Spotlight glow that tracks the cursor across cards
//   3. Subtle 3D tilt on the hero photo
//   4. Expanding ripple burst on click
// All desktop-only (fine pointer + hover support) and disabled
// under prefers-reduced-motion.
// ============================================================
(function () {
  "use strict";

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------------------------------------------------------
     1. Custom cursor
  --------------------------------------------------------- */
  function initCustomCursor() {
    if (reduceMotion || !fineHover) return;
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;

    let dx = 0, dy = 0;      // dot: instant position
    let rx = 0, ry = 0;      // ring: eased/lagging position
    let hasMoved = false;

    function onMove(e) {
      dx = e.clientX; dy = e.clientY;
      dot.style.left = dx + 'px';
      dot.style.top = dy + 'px';
      if (!hasMoved) {
        hasMoved = true;
        rx = dx; ry = dy;
        document.body.classList.add('cursor-active');
      }
    }

    function tick() {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(tick);
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
    document.addEventListener('mouseenter', () => { if (hasMoved) document.body.classList.add('cursor-active'); });

    const hoverSelector = 'a, button, .btn, input, textarea, [role="button"], .skill-card, .project-card, .stat-card';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverSelector)) document.body.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverSelector)) document.body.classList.remove('cursor-hover');
    });

    requestAnimationFrame(tick);
  }

  /* ---------------------------------------------------------
     2. Card spotlight — tracks cursor via CSS custom properties
  --------------------------------------------------------- */
  function initSpotlight() {
    if (reduceMotion) return;
    const selector = '.skill-card, .project-card, .stat-card, .contact-form';
    document.addEventListener('pointermove', (e) => {
      const target = e.target.closest(selector);
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      target.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     3. Hero photo tilt
  --------------------------------------------------------- */
  function initHeroTilt() {
    if (reduceMotion || !fineHover) return;
    const hero = document.querySelector('.hero');
    const frame = document.querySelector('.hero-image .image-frame');
    if (!hero || !frame) return;

    let tx = 0, ty = 0, cx = 0, cy = 0;

    function apply() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      frame.style.transform = `perspective(700px) rotateX(${cy}deg) rotateY(${cx}deg)`;
      requestAnimationFrame(apply);
    }

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      tx = px * 14;
      ty = -py * 10;
    }, { passive: true });

    hero.addEventListener('mouseleave', () => { tx = 0; ty = 0; });
    requestAnimationFrame(apply);
  }

  /* ---------------------------------------------------------
     4. Click ripple burst
  --------------------------------------------------------- */
  function initRipple() {
    if (reduceMotion) return;
    document.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button !== 0) return; // left click / primary touch only
      const el = document.createElement('span');
      el.className = 'ripple';
      el.style.left = e.clientX + 'px';
      el.style.top = e.clientY + 'px';
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }, { passive: true });
  }

  initCustomCursor();
  initSpotlight();
  initHeroTilt();
  initRipple();
})();
