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

  // 🥊 隠しMMAゲームコード (上下上下左右左右ABC)
  const mmaGameCode = [38, 40, 38, 40, 37, 39, 37, 39, 65, 66, 67];
  let mmaGameIndex = 0;
  document.addEventListener('keydown', (e) => {
    const c = e.code;
    if (c === 'ArrowUp' || c === 'ArrowDown' || c === 'ArrowLeft' || c === 'ArrowRight' || c === 'KeyA' || c === 'KeyB' || c === 'KeyC') {
      const keyMap = { ArrowUp: 38, ArrowDown: 40, ArrowLeft: 37, ArrowRight: 39, KeyA: 65, KeyB: 66, KeyC: 67 };
      const code = keyMap[c];
      if (code === mmaGameCode[mmaGameIndex]) {
        mmaGameIndex++;
        if (mmaGameIndex === mmaGameCode.length) {
          startMMAGame();
          mmaGameIndex = 0;
        }
      } else {
        mmaGameIndex = 0;
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

  // 🥊 隠しMMAゲーム — 反射神経トレーニング
  window.startMMAGame = function() {
    if (document.querySelector('.game-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'game-overlay';

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 480;
    canvas.id = 'mmaCanvas';

    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const CX = W / 2, CY = H / 2;
    const HIT_RADIUS = 50;

    const DIR = { up: 0, down: 1, left: 2, right: 3 };
    const DIR_KEYS = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
    const DIR_LABEL = ['↑', '↓', '←', '→'];
    const DIR_COLOR = ['#e74c3c', '#f39c12', '#2ecc71', '#3498db'];

    let lives = 5;
    let score = 0;
    let combo = 0;
    let maxCombo = 0;
    let level = 1;
    let arrows = [];
    let particles = [];
    let flash = 0;
    let missFlash = 0;
    let spawnTimer = 0;
    let spawnInterval = 70;
    let baseSpeed = 3;
    let gameState = 'tutorial';
    let perfectCount = 0;

    function spawnArrow() {
      const dir = Math.floor(Math.random() * 4);
      let x, y, vx, vy;
      const margin = 60;
      switch (dir) {
        case DIR.up:    x = CX + (Math.random() - 0.5) * 300; y = H + margin; vx = 0; vy = -1; break;
        case DIR.down:  x = CX + (Math.random() - 0.5) * 300; y = -margin;   vx = 0; vy = 1;  break;
        case DIR.left:  x = W + margin; y = CY + (Math.random() - 0.5) * 200; vx = -1; vy = 0; break;
        case DIR.right: x = -margin;    y = CY + (Math.random() - 0.5) * 200; vx = 1;  vy = 0; break;
      }
      arrows.push({
        x, y, vx, vy, dir, speed: baseSpeed + level * 0.2,
        trail: [], dist: Infinity, hit: false, reached: false
      });
    }

    function addParticles(x, y, color, count) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * 5;
        particles.push({
          x, y, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd - 1,
          life: 20 + Math.random() * 15, color, size: 2 + Math.random() * 4
        });
      }
    }

    function keyHandler(e) {
      if (!overlay.parentNode) return;
      e.preventDefault();
      if (e.key === 'Escape') { closeGame(); return; }

      if (gameState === 'tutorial') {
        if (e.key === 'Enter' || e.key === ' ') {
          gameState = 'playing';
          spawnArrow();
        }
        return;
      }

      if (gameState === 'gameover') {
        if (e.key === 'Enter' || e.key === ' ') restartGame();
        return;
      }

      const dir = DIR_KEYS[e.key];
      if (!dir) return;

      let best = -1, bestDist = Infinity;
      arrows.forEach((a, i) => {
        if (a.hit || a.reached) return;
        const d = Math.hypot(a.x - CX, a.y - CY);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      if (best === -1) { miss(); return; }
      const a = arrows[best];
      if (a.dir !== DIR[dir]) { miss(); return; }

      if (bestDist <= HIT_RADIUS) {
        const perf = bestDist < 20;
        const pts = perf ? 150 + combo * 20 : 100 + combo * 10;
        score += pts; combo++;
        if (combo > maxCombo) maxCombo = combo;
        if (perf) perfectCount++;
        a.hit = true; flash = 12;
        addParticles(a.x, a.y, DIR_COLOR[a.dir], 12);
        addParticles(a.x, a.y, '#fff', 6);
        if (combo >= 3) {
          for (let i = 0; i < 3; i++)
            setTimeout(() => addParticles(CX, CY, '#ffd700', 8), i * 60);
        }
      } else if (bestDist <= HIT_RADIUS + 30) {
        score += 30; combo = 0; a.hit = true; flash = 6;
        addParticles(a.x, a.y, '#aaa', 6);
      } else {
        miss();
      }
    }

    function miss() {
      combo = 0; lives--; missFlash = 15;
      addParticles(CX, CY, '#e74c3c', 20);
      if (lives <= 0) gameState = 'gameover';
    }

    document.addEventListener('keydown', keyHandler);

    function closeGame() {
      document.removeEventListener('keydown', keyHandler);
      overlay.remove();
    }

    function restartGame() {
      lives = 5; score = 0; combo = 0; maxCombo = 0; level = 1;
      arrows = []; particles = []; flash = 0; missFlash = 0;
      spawnTimer = 0; spawnInterval = 70; perfectCount = 0;
      gameState = 'playing';
      spawnArrow();
    }

    function update() {
      if (flash > 0) flash--;
      if (missFlash > 0) missFlash--;

      if (gameState !== 'playing') {
        particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.life--; });
        particles = particles.filter(p => p.life > 0);
        return;
      }

      spawnTimer++;
      const adj = Math.max(18, spawnInterval - level * 3);
      if (spawnTimer >= adj) {
        spawnTimer = 0;
        spawnArrow();
        if (Math.random() < 0.25 + level * 0.03) spawnArrow();
      }

      arrows = arrows.filter(a => {
        if (a.hit) return false;
        a.trail.push({ x: a.x, y: a.y });
        if (a.trail.length > 5) a.trail.shift();

        a.x += a.vx * a.speed;
        a.y += a.vy * a.speed;
        const dist = Math.hypot(a.x - CX, a.y - CY);
        a.dist = dist;

        if (dist < 25 && !a.reached) {
          a.reached = true;
          combo = 0; lives--; missFlash = 15;
          addParticles(CX, CY, '#e74c3c', 20);
          addParticles(a.x, a.y, '#e74c3c', 10);
          if (lives <= 0) gameState = 'gameover';
          return false;
        }

        const outside = a.x < -120 || a.x > W + 120 || a.y < -120 || a.y > H + 120;
        if (outside) return false;
        return true;
      });

      level = 1 + Math.floor(score / 300);

      particles = particles.filter(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.3; p.life--;
        return p.life > 0;
      });
    }

    function drawTutorial() {
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.fillRect(0, 0, W, H);

      ctx.textAlign = 'center';

      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 42px Oswald, sans-serif';
      ctx.fillText('🥊 反射神経トレーニング', CX, 70);

      ctx.fillStyle = '#e63946';
      ctx.font = 'bold 20px Oswald, sans-serif';
      ctx.fillText('飛んでくる矢印を迎撃して自分を守れ！', CX, 105);

      const rules = [
        '❶  画面外から「↑↓←→」の矢印が飛んでくる',
        '❷  矢印と同じ方向のキーを押して迎撃！',
        '❸  中央の白いリング内で押すとヒット',
        '❹  金色のリング内で押すとパーフェクト',
        '❺  取り逃すと矢印が当たって ❤️ が減る',
      ];
      ctx.font = '18px Inter, sans-serif';
      rules.forEach((t, i) => {
        ctx.fillStyle = '#ddd';
        ctx.fillText(t, CX, 150 + i * 34);
      });

      // Visual demo: 4 colored arrows with labels
      const demoArrows = [
        { dir: '↑', color: DIR_COLOR[0], x: CX - 120 },
        { dir: '↓', color: DIR_COLOR[1], x: CX - 40 },
        { dir: '←', color: DIR_COLOR[2], x: CX + 40 },
        { dir: '→', color: DIR_COLOR[3], x: CX + 120 },
      ];
      ctx.font = '36px Oswald, sans-serif';
      demoArrows.forEach(d => {
        ctx.fillStyle = d.color;
        ctx.fillText(d.dir, d.x, 330);
        ctx.fillStyle = '#888';
        ctx.font = '13px Inter, sans-serif';
        ctx.fillText('キー', d.x, 355);
        ctx.font = '36px Oswald, sans-serif';
      });

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 22px Oswald, sans-serif';
      const blink = Math.sin(Date.now() * 0.004) > 0;
      if (blink) ctx.fillText('▼  Enter / Space でスタート  ▼', CX, 410);

      ctx.fillStyle = '#666';
      ctx.font = '14px Oswald, sans-serif';
      ctx.fillText('ESC で終了', CX, 445);

      // Draw a sample arrow flying toward center (animation)
      const demoAngle = Date.now() * 0.002;
      const dx = CX + Math.cos(demoAngle) * 140;
      const dy = CY + Math.sin(demoAngle) * 100;
      ctx.save();
      ctx.translate(dx, dy);
      ctx.rotate(Math.atan2(CY - dy, CX - dx));
      ctx.fillStyle = `hsla(${(Date.now() * 0.05) % 360}, 80%, 60%, 0.5)`;
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(-8, -12);
      ctx.lineTo(-5, 0);
      ctx.lineTo(-8, 12);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      if (gameState === 'tutorial') { drawTutorial(); return; }

      // BG
      const bg = ctx.createRadialGradient(CX, CY, 50, CX, CY, 400);
      bg.addColorStop(0, '#1a1a2e');
      bg.addColorStop(1, '#0a0a0f');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < W; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, H); ctx.stroke(); }
      for (let i = 0; i < H; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i); ctx.stroke(); }

      // Arrow trajectory lines + trails
      arrows.forEach(a => {
        if (a.hit || a.reached) return;

        // Trajectory line (dashed, from arrow to center)
        ctx.save();
        ctx.setLineDash([5, 6]);
        ctx.strokeStyle = `rgba(255,255,255,0.12)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(CX, CY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Afterimage trail
        a.trail.forEach((t, i) => {
          const alpha = (i / a.trail.length) * 0.25;
          ctx.save();
          ctx.translate(t.x, t.y);
          let ang = 0;
          if (a.vx > 0) ang = 0; else if (a.vx < 0) ang = Math.PI;
          else if (a.vy < 0) ang = -Math.PI / 2; else ang = Math.PI / 2;
          ctx.rotate(ang);
          ctx.globalAlpha = alpha;
          ctx.fillStyle = DIR_COLOR[a.dir];
          ctx.beginPath();
          ctx.moveTo(18, 0);
          ctx.lineTo(-7, -10);
          ctx.lineTo(-4, 0);
          ctx.lineTo(-7, 10);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        });
        ctx.globalAlpha = 1;
      });

      // Player (center)
      ctx.save();
      ctx.translate(CX, CY);
      const pulse = Math.sin(Date.now() * 0.005) * 0.08 + 0.92;

      ctx.beginPath();
      ctx.arc(0, 0, HIT_RADIUS, 0, Math.PI * 2);
      ctx.strokeStyle = missFlash > 0 ? '#e74c3c' : '#fff';
      ctx.globalAlpha = missFlash > 0 ? 0.4 : 0.08 + missFlash * 0.005;
      ctx.lineWidth = 2; ctx.setLineDash([6, 8]); ctx.stroke();
      ctx.setLineDash([]); ctx.globalAlpha = 1;

      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.strokeStyle = missFlash > 0 ? '#e74c3c' : '#ffd700';
      ctx.globalAlpha = missFlash > 0 ? 0.5 : 0.2;
      ctx.lineWidth = 1.5; ctx.stroke();
      ctx.globalAlpha = 1;

      ctx.scale(pulse, pulse);
      ctx.fillStyle = flash > 0 ? '#ffd700' : '#e67e22';
      ctx.beginPath();
      ctx.arc(0, -8, 20, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(-12, 4, 24, 30);
      ctx.fillStyle = '#e63946';
      ctx.fillRect(-12, 18, 24, 16);
      ctx.fillStyle = '#2196F3';
      ctx.fillRect(-20, -14, 40, 4);
      ctx.fillStyle = '#d32f2f';
      ctx.beginPath();
      ctx.arc(-14, 8, 7, 0, Math.PI * 2); ctx.arc(14, 8, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(-6, -12, 3, 0, Math.PI * 2); ctx.arc(6, -12, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#333';
      ctx.beginPath();
      ctx.arc(-6, -12, 1.5, 0, Math.PI * 2); ctx.arc(6, -12, 1.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // Arrows
      arrows.forEach(a => {
        if (a.hit || a.reached) return;
        const dist = Math.hypot(a.x - CX, a.y - CY);
        const inZone = dist <= HIT_RADIUS;
        const near = dist <= HIT_RADIUS + 30;
        ctx.save();
        ctx.translate(a.x, a.y);

        let angle = 0;
        if (a.vx > 0) angle = 0; else if (a.vx < 0) angle = Math.PI;
        else if (a.vy < 0) angle = -Math.PI / 2; else angle = Math.PI / 2;
        ctx.rotate(angle);

        const s = inZone ? 1.4 : near ? 1.15 : 1;
        const col = inZone ? '#ffd700' : near ? '#fff' : DIR_COLOR[a.dir];

        ctx.shadowColor = inZone ? 'rgba(255,215,0,0.6)' : 'transparent';
        ctx.shadowBlur = inZone ? 20 : 0;

        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.moveTo(24 * s, 0);
        ctx.lineTo(-11 * s, -15 * s);
        ctx.lineTo(-7 * s, 0);
        ctx.lineTo(-11 * s, 15 * s);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 1; ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.restore();
      });

      // Particles
      particles.forEach(p => {
        ctx.globalAlpha = p.life / 30;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      });
      ctx.globalAlpha = 1;

      // HUD
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, W, 42);

      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 18px Oswald, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`SCORE: ${score}`, 16, 29);

      ctx.fillStyle = '#3498db';
      ctx.fillText(`LV.${level}`, 175, 29);

      if (combo >= 2) {
        ctx.fillStyle = '#f39c12';
        ctx.textAlign = 'center';
        ctx.font = `bold ${16 + Math.min(combo, 10)}px Oswald, sans-serif`;
        ctx.fillText(`${combo} COMBO!`, W / 2, 32);
      } else {
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.font = '14px Oswald, sans-serif';
        ctx.fillText('↑ ↓ ← → で迎撃', W / 2, 30);
      }

      ctx.textAlign = 'right';
      let ls = '';
      for (let i = 0; i < lives; i++) ls += '❤️';
      for (let i = lives; i < 5; i++) ls += '🖤';
      ctx.font = '16px Oswald, sans-serif';
      ctx.fillText(ls, W - 16, 29);

      // Game over
      if (gameState === 'gameover') {
        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 56px Oswald, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💀 GAME OVER', W / 2, H / 2 - 70);
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 34px Oswald, sans-serif';
        ctx.fillText(`SCORE: ${score}`, W / 2, H / 2 - 10);
        ctx.fillStyle = '#aaa';
        ctx.font = '18px Oswald, sans-serif';
        ctx.fillText(`MAX COMBO: ${maxCombo}  |  PERFECT: ${perfectCount}`, W / 2, H / 2 + 40);
        ctx.fillStyle = '#ccc';
        ctx.font = '16px Oswald, sans-serif';
        ctx.fillText('Enter / Space で再戦  |  ESC で終了', W / 2, H / 2 + 85);
      }
    }

    function loop() {
      if (!overlay.parentNode) return;
      update();
      draw();
      requestAnimationFrame(loop);
    }

    loop();
  };
});
