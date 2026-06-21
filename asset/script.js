// ============================================================
// Md. Maruf Hasan Soncoy — Portfolio interactions
// ============================================================
(function(){
  "use strict";

  /* ---------- Theme toggle (persisted) ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = stored || (prefersLight ? 'light' : 'dark');
  if (initial === 'light') root.setAttribute('data-theme', 'light');
  themeToggle?.setAttribute('aria-pressed', String(initial === 'light'));

  themeToggle?.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
      themeToggle.setAttribute('aria-pressed', 'false');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      themeToggle.setAttribute('aria-pressed', 'true');
    }
  });

  /* ---------- Mobile nav ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const expanded = navLinks.classList.contains('open');
    hamburger.setAttribute('aria-expanded', String(expanded));
  });
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* ---------- Active link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navItems = document.querySelectorAll('.nav-link');
  const onScrollSpy = () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 110;
      if (window.scrollY >= top) current = sec.id;
    });
    navItems.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', onScrollSpy, { passive: true });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Stat counters ---------- */
  const statEls = document.querySelectorAll('.stat-number');
  const statIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1200;
      const startTime = performance.now();
      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
      statIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  statEls.forEach(el => statIO.observe(el));

  /* ---------- Skill bar fill ---------- */
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width + '%';
        skillIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  skillFills.forEach(el => skillIO.observe(el));

  /* ---------- Build console typing line ---------- */
  const buildLine = document.getElementById('buildLine');
  if (buildLine) {
    const lines = [
      'whoami → Md. Maruf Hasan Soncoy',
      './gradlew build ✓',
      'flutter create next_app',
      'echo "Hi, I\'m itsmaruf"'
    ];
    let li = 0, ci = 0, deleting = false;
    const tick = () => {
      const full = lines[li];
      if (!deleting) {
        ci++;
        buildLine.textContent = full.slice(0, ci);
        if (ci === full.length) { deleting = true; setTimeout(tick, 1400); return; }
      } else {
        ci--;
        buildLine.textContent = full.slice(0, ci);
        if (ci === 0) { deleting = false; li = (li + 1) % lines.length; }
      }
      setTimeout(tick, deleting ? 28 : 55);
    };
    tick();
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop?.classList.toggle('show', window.scrollY > 480);
  }, { passive: true });
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Contact form (front-end only placeholder) ---------- */
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      contactForm.reset();
    }, 2400);
    // TODO: wire this up to your form backend (Formspree, EmailJS, etc.)
  });

})();
