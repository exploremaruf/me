// ============================================================
// Antigravity particle field — lightweight canvas effect
// Particles float upward with a gentle sway and drift away
// from the cursor (antigravity) on hover/movement.
// ============================================================
(function () {
  "use strict";

  const canvas = document.getElementById('antigravityCanvas');
  if (!canvas || !canvas.getContext) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const ctx = canvas.getContext('2d');
  let width = 0, height = 0, dpr = 1;
  let particles = [];
  let colors = ['#34d399', '#22d3ee'];
  let mouse = { x: -9999, y: -9999, active: false };
  let rafId = null;
  let running = true;

  function readThemeColors() {
    const styles = getComputedStyle(document.documentElement);
    const c1 = styles.getPropertyValue('--accent').trim();
    const c2 = styles.getPropertyValue('--accent-2').trim();
    colors = [c1 || '#34d399', c2 || '#22d3ee'];
  }

  function countForWidth(w) {
    if (w < 560) return 18;
    if (w < 1000) return 32;
    return 48;
  }

  function makeParticle(randomY) {
    const r = 1.3 + Math.random() * 2.4;
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : height + r + 10,
      r,
      baseSpeed: 0.16 + Math.random() * 0.3,
      sway: 0.35 + Math.random() * 0.75,
      phase: Math.random() * Math.PI * 2,
      color: colors[Math.random() > 0.5 ? 0 : 1],
      alpha: 0.16 + Math.random() * 0.26,
      vx: 0,
      vy: 0
    };
  }

  function seed() {
    const count = countForWidth(width);
    particles = new Array(count).fill(0).map(() => makeParticle(true));
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function step() {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // gentle upward float + horizontal sway
      p.phase += 0.006 + p.baseSpeed * 0.004;
      const swayX = Math.sin(p.phase) * p.sway;

      let targetVX = swayX * 0.06;
      let targetVY = -p.baseSpeed;

      // antigravity: particles drift away from the cursor
      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 150;
        if (dist < radius && dist > 0.001) {
          const force = (1 - dist / radius) * 1.7;
          targetVX += (dx / dist) * force;
          targetVY += (dy / dist) * force;
        }
      }

      // ease toward target velocity for smooth, non-jittery motion
      p.vx += (targetVX - p.vx) * 0.06;
      p.vy += (targetVY - p.vy) * 0.06;
      p.x += p.vx;
      p.y += p.vy;

      // wrap around edges
      if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;

      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(step);
  }

  function onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  }
  function onMouseLeave() { mouse.active = false; }

  let resizeTimer;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  }

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running && !rafId) rafId = requestAnimationFrame(step);
    if (!running && rafId) { cancelAnimationFrame(rafId); rafId = null; }
  });

  document.addEventListener('theme:change', () => {
    readThemeColors();
    particles.forEach(p => { p.color = colors[Math.random() > 0.5 ? 0 : 1]; });
  });

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  window.addEventListener('mouseleave', onMouseLeave, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) onMouseMove(e.touches[0]);
  }, { passive: true });
  window.addEventListener('resize', onResize);

  readThemeColors();
  resize();
  rafId = requestAnimationFrame(step);
})();
