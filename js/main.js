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

  // Nav hide on scroll down, show on scroll up + shadow
  let lastScroll = 0;
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      const curr = window.scrollY;
      if (curr > lastScroll && curr > 100) nav.classList.add('hidden');
      else nav.classList.remove('hidden');
      lastScroll = curr;
      if (curr > 50) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    });
  }

  // Scroll progress bar
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    });
  }

  // Back to top button
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 300);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Section nav scroll spy
  const sectionNav = document.querySelector('.section-nav');
  if (sectionNav) {
    const links = sectionNav.querySelectorAll('a');
    const sections = [];
    links.forEach(link => {
      const id = link.getAttribute('href');
      if (id && id.startsWith('#')) {
        const el = document.querySelector(id);
        if (el) sections.push({ el, link });
      }
    });
    if (sections.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            links.forEach(l => l.classList.remove('active'));
            const match = sections.find(s => s.el === entry.target);
            if (match) match.link.classList.add('active');
          }
        });
      }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });
      sections.forEach(s => observer.observe(s.el));
    }
  }

  // 🕺 リックロールコード (↑↑↓↓←→←→BA)
  const RICKROLL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  let konamiIndex = 0;
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'b' || e.key === 'a' || e.key === 'B' || e.key === 'A') {
      const keyMap = { ArrowUp: 38, ArrowDown: 40, ArrowLeft: 37, ArrowRight: 39, b: 66, B: 66, a: 65, A: 65 };
      const code = keyMap[e.key] || e.keyCode;
      if (code === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          window.open(RICKROLL, '_blank');
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    }
  });

  // 🕺 Easter egg: logo 5 clicks
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
