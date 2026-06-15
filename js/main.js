document.addEventListener('DOMContentLoaded', () => {

  // Nav toggle (mobile)
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav')) navLinks.classList.remove('open');
    });
  }

  // Nav hide on scroll down, show on scroll up
  let lastScroll = 0;
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      const curr = window.scrollY;
      if (curr > lastScroll && curr > 100) nav.classList.add('hidden');
      else nav.classList.remove('hidden');
      lastScroll = curr;
    });
  }

  // Active nav link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === currentPath) a.classList.add('active');
  });

  // Fade-in on scroll (Intersection Observer)
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => observer.observe(el));
  }

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Table row hover parallax micro-effect (visual only)
  const rows = document.querySelectorAll('.weight-table tbody tr');
  rows.forEach(row => {
    row.addEventListener('mouseenter', function() {
      this.style.transition = 'background 0.2s ease';
    });
  });

  // 🕺 Easter egg: Konami code (↑↑↓↓←→←→BA) → Rickroll
  const RICKROLL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  let konamiIndex = 0;
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        window.open(RICKROLL, '_blank');
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  // 🕺 Easter egg: logo 5 clicks → Rickroll
  const logo = document.querySelector('.nav-logo');
  if (logo) {
    let logoClicks = 0;
    logo.addEventListener('click', (e) => {
      logoClicks++;
      if (logoClicks >= 5) {
        e.preventDefault();
        window.open(RICKROLL, '_blank');
        logoClicks = 0;
      }
    });
  }
});
