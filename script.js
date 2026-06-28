/**
 * Portfolio Website — Main Script
 * Handles navigation, smooth scrolling, scroll animations, and UI interactions.
 */

(function () {
  'use strict';

  // DOM Elements
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav__link');
  const revealElements = document.querySelectorAll('.reveal');
  const yearEl = document.getElementById('year');

  // Set current year in footer
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /**
   * Toggle mobile navigation menu
   */
  function toggleNav() {
    const isOpen = navMenu.classList.toggle('nav__menu--open');
    navToggle.classList.toggle('nav__toggle--open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  /**
   * Close mobile menu
   */
  function closeNav() {
    navMenu.classList.remove('nav__menu--open');
    navToggle.classList.remove('nav__toggle--open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /**
   * Smooth scroll to anchor links with header offset
   */
  function handleSmoothScroll(e) {
    const href = this.getAttribute('href');

    if (!href || !href.startsWith('#')) return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    closeNav();

    const headerHeight = header ? header.offsetHeight : 0;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    history.pushState(null, '', href);
  }

  /**
   * Update header style on scroll
   */
  function handleHeaderScroll() {
    if (!header) return;

    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  /**
   * Highlight active nav link based on scroll position
   */
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + (header ? header.offsetHeight : 0) + 100;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const correspondingLink = document.querySelector('.nav__link[href="#' + sectionId + '"]');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove('nav__link--active');
        });
        if (correspondingLink) {
          correspondingLink.classList.add('nav__link--active');
        }
      }
    });
  }

  /**
   * Intersection Observer for scroll-triggered reveal animations
   */
  function initRevealAnimations() {
    if (!revealElements.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      revealElements.forEach(function (el) {
        el.classList.add('reveal--visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
      }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /**
   * Throttle helper for scroll events
   */
  function throttle(fn, delay) {
    let lastCall = 0;
    return function () {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn.apply(this, arguments);
      }
    };
  }

  // Event Listeners
  if (navToggle) {
    navToggle.addEventListener('click', toggleNav);
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', handleSmoothScroll);
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    if (!anchor.classList.contains('nav__link')) {
      anchor.addEventListener('click', handleSmoothScroll);
    }
  });

  window.addEventListener('scroll', throttle(function () {
    handleHeaderScroll();
    updateActiveNavLink();
  }, 100));

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('nav__menu--open')) {
      closeNav();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768 && navMenu.classList.contains('nav__menu--open')) {
      closeNav();
    }
  });

  // Initialize
  handleHeaderScroll();
  updateActiveNavLink();
  initRevealAnimations();
  initHeroEffects();
})();

/**
 * Hero section — particle background & avatar tilt
 */
function initHeroEffects() {
  'use strict';

  var canvas = document.getElementById('heroCanvas');
  var avatarCard = document.getElementById('heroAvatarCard');
  var heroSection = document.getElementById('hero');

  if (!canvas || !heroSection) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var particleCount = 48;
  var animationId = null;

  function resizeCanvas() {
    var rect = heroSection.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  function createParticles() {
    particles = [];
    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.15
      });
    }
  }

  function drawParticles() {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(139, 92, 246, ' + p.opacity + ')';
      ctx.fill();

      for (var j = i + 1; j < particles.length; j++) {
        var p2 = particles[j];
        var dx = p.x - p2.x;
        var dy = p.y - p2.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(99, 102, 241, ' + (0.12 * (1 - dist / 120)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(drawParticles);
  }

  function handleHeroMouseMove(e) {
    if (!avatarCard) return;

    var rect = heroSection.getBoundingClientRect();
    var x = (e.clientX - rect.left) / rect.width - 0.5;
    var y = (e.clientY - rect.top) / rect.height - 0.5;

    avatarCard.style.transform =
      'perspective(1000px) rotateY(' + (x * 12) + 'deg) rotateX(' + (-y * 12) + 'deg)';
  }

  function resetAvatarTilt() {
    if (avatarCard) {
      avatarCard.style.transform = '';
    }
  }

  resizeCanvas();
  createParticles();
  drawParticles();

  window.addEventListener('resize', function () {
    resizeCanvas();
    createParticles();
  });

  if (avatarCard && window.matchMedia('(pointer: fine)').matches) {
    heroSection.addEventListener('mousemove', handleHeroMouseMove);
    heroSection.addEventListener('mouseleave', resetAvatarTilt);
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    } else if (!animationId) {
      drawParticles();
    }
  });
}
