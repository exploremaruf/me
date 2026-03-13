/**
 * MARUF.DEV — Portfolio JavaScript
 * Features: typing effect, mobile menu, scroll reveal,
 *           active nav, counter animation, back-to-top
 */

/* ============================================================
   DOM REFERENCES
   ============================================================ */
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('navLinks');
const navItems    = document.querySelectorAll('.nav-link');
const typingEl    = document.getElementById('typingText');
const backToTop   = document.getElementById('backToTop');
const sections    = document.querySelectorAll('section[id]');
const contactForm = document.getElementById('contactForm');
const languageToggle = document.getElementById('languageToggle');
const languageDropdown = document.getElementById('languageDropdown');
const languageOptions = document.querySelectorAll('.language-option');
const currentLangDisplay = document.getElementById('currentLang');

/* ============================================================
   LANGUAGE SWITCHER
   ============================================================ */
function getCurrentLanguage() {
    const path = window.location.pathname;
    if (path.includes('/arabic/')) return 'ar';
    if (path.includes('/italian/')) return 'it';
    if (path.includes('/russian/')) return 'ru';
    return 'en';
}

function updateLanguageDisplay() {
    const currentLang = getCurrentLanguage();
    const langMap = { en: 'EN', ar: 'AR', it: 'IT', ru: 'RU' };
    if (currentLangDisplay) {
        currentLangDisplay.textContent = langMap[currentLang] || 'EN';
    }
    
    // Mark current language as active in dropdown
    languageOptions.forEach(option => {
        if (option.getAttribute('data-lang') === currentLang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// Toggle language dropdown
if (languageToggle) {
    languageToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        languageDropdown.classList.toggle('open');
    });
}

// Handle language selection
languageOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.preventDefault();
        const href = option.getAttribute('href');
        if (href) {
            // Navigate to the selected language version
            window.location.href = href;
        }
        languageDropdown.classList.remove('open');
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (
        languageDropdown.classList.contains('open') &&
        !languageDropdown.contains(e.target) &&
        !languageToggle.contains(e.target)
    ) {
        languageDropdown.classList.remove('open');
    }
});

// Initialize language display on page load
updateLanguageDisplay();

/* ============================================================
   TYPING EFFECT
   ============================================================ */
const roles = [
    'Android Developer',
    'Java Developer',
    'Mobile App Learner',
    'Tech Enthusiast',
    'CSE Student'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const TYPING_SPEED  = 90;
const DELETING_SPEED = 55;
const PAUSE_AFTER_WORD = 1800;
const PAUSE_BEFORE_TYPE = 350;

function typeWriter() {
    const current = roles[roleIndex];

    if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
    }

    let delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;

    if (!isDeleting && charIndex === current.length) {
        // Finished typing — pause before deleting
        delay = PAUSE_AFTER_WORD;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        // Finished deleting — move to next role
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = PAUSE_BEFORE_TYPE;
    }

    setTimeout(typeWriter, delay);
}

if (typingEl) {
    setTimeout(typeWriter, 800);
}

/* ============================================================
   MOBILE MENU TOGGLE
   ============================================================ */
function closeMobileMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

if (hamburger) {
    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        // Prevent body scroll while menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });
}

// Close menu when a nav link is clicked
navItems.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (
        navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)
    ) {
        closeMobileMenu();
    }
});

/* ============================================================
   NAVBAR: BACKGROUND ON SCROLL + ACTIVE LINK
   ============================================================ */
function onScroll() {
    const scrollY = window.scrollY;

    // Make navbar opaque once user scrolls past hero
    if (scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Back-to-top button visibility
    if (scrollY > 400) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    // Active nav link — highlight section in view
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', onScroll, { passive: true });
// Run once on load
onScroll();

/* ============================================================
   BACK TO TOP
   ============================================================ */
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ============================================================
   SCROLL REVEAL — Intersection Observer
   ============================================================ */
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger sibling reveals with a small delay
                const siblings = entry.target.parentElement
                    ? Array.from(entry.target.parentElement.children).filter(
                          el => el.classList.contains('reveal')
                      )
                    : [];
                const siblingIndex = siblings.indexOf(entry.target);
                const delay = siblingIndex >= 0 ? siblingIndex * 100 : 0;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
});

/* ============================================================
   SKILL BAR ANIMATION — fills bars when section enters view
   ============================================================ */
const skillObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fills = entry.target.querySelectorAll('.skill-fill');
                fills.forEach(fill => {
                    const target = fill.getAttribute('data-width') || 0;
                    setTimeout(() => {
                        fill.style.width = `${target}%`;
                    }, 300);
                });
                skillObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.2 }
);

const skillsSection = document.getElementById('skills');
if (skillsSection) skillObserver.observe(skillsSection);

/* ============================================================
   COUNTER ANIMATION — counts up when About section appears
   ============================================================ */
function animateCounter(el, target, duration) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current);
        }
    }, 16);
}

const counterObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'), 10);
                    animateCounter(counter, target, 1800);
                });
                counterObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.3 }
);

const aboutSection = document.getElementById('about');
if (aboutSection) counterObserver.observe(aboutSection);

/* ============================================================
   CONTACT FORM — Client-side feedback (no backend)
   ============================================================ */
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.disabled = false;
            contactForm.reset();
        }, 3500);
    });
}

console.log('%cMaruf.Dev Portfolio — Loaded 🚀', 'color: #3b82f6; font-size: 14px; font-weight: bold;');
