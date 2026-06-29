if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(new URL('../sw.js', window.location.href)).catch(() => {});
  });
}

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

  // 🕺 リックロールコード (↑↑↓↓←→←→BA) + 🥊 MMAゲームコード (上下上下左右左右ABC)
  const RICKROLL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  let konamiIndex = 0;
  const mmaGameCode = [38, 40, 38, 40, 37, 39, 37, 39, 65, 66, 67];
  let mmaGameIndex = 0;
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'a' || e.key === 'A' || e.key === 'b' || e.key === 'B' || e.key === 'c' || e.key === 'C') {
      const keyMap = { ArrowUp: 38, ArrowDown: 40, ArrowLeft: 37, ArrowRight: 39, a: 65, A: 65, b: 66, B: 66, c: 67, C: 67 };
      const code = keyMap[e.key] || e.keyCode;
      if (code === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) { window.open(RICKROLL, '_blank'); konamiIndex = 0; }
      } else {
        konamiIndex = 0;
      }
      if (code === mmaGameCode[mmaGameIndex]) {
        mmaGameIndex++;
        if (mmaGameIndex === mmaGameCode.length) { window.startMMAGame(); mmaGameIndex = 0; }
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

  // 🦖 隠しランナーゲーム — 恐竜ゲーム風
  window.startMMAGame = function() {
    if (document.querySelector('.game-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'game-overlay';

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 480;
    canvas.id = 'mmaCanvas';
    overlay.appendChild(canvas);
    document.body.appendChild(overlay);

    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const GROUND_Y = 384;
    const DINO_X = 120;
    const DINO_W = 34;
    const DINO_H = 40;

    let gameState = 'tutorial';
    let score = 0;
    let bestScore = 0;
    let speed = 8;
    let speedUp = 0;
    let frame = 0;
    let jumpY = GROUND_Y - DINO_H;
    let duck = false;
    let obstacles = [];
    let clouds = [];
    let particles = [];
    let shake = 0;
    let flash = 0;
    let spawnCooldown = 90;
    let distance = 0;
    let punchFlash = 0;
    let lastTime = 0;
    let nextCloudSpawn = 0;

    const dino = {
      x: DINO_X,
      y: jumpY,
      vy: 0,
      onGround: true
    };

    function addParticles(x, y, color, count) {
      const burst = Math.max(4, count + Math.floor((Math.random() - 0.5) * 6));
      for (let i = 0; i < burst; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 1.2 + Math.random() * 4.8;
        particles.push({
          x, y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - (0.4 + Math.random() * 1.2),
          life: 14 + Math.random() * 18,
          size: 2 + Math.random() * 4,
          color
        });
      }
    }

    function spawnObstacle() {
      const typeRoll = Math.random();
      let type = 'cactus';
      if (typeRoll > 0.72) type = 'bird';
      else if (typeRoll > 0.42) type = 'tall';

      const base = { x: W + 40 + Math.random() * 50, passed: false, hit: false, type };
      if (type === 'bird') {
        base.w = 34 + Math.floor(Math.random() * 10);
        base.h = 22 + Math.floor(Math.random() * 10);
        base.y = Math.random() > 0.5 ? 312 : 276 + Math.floor(Math.random() * 20);
      } else if (type === 'tall') {
        base.w = 18 + Math.floor(Math.random() * 10);
        base.h = 48 + Math.floor(Math.random() * 20);
        base.y = GROUND_Y - base.h;
      } else {
        base.w = 24 + Math.floor(Math.random() * 10);
        base.h = 28 + Math.floor(Math.random() * 16);
        base.y = GROUND_Y - base.h;
      }
      obstacles.push(base);
    }

    function resetGame() {
      score = 0;
      speed = 8;
      speedUp = 0;
      frame = 0;
      jumpY = GROUND_Y - DINO_H;
      duck = false;
      obstacles = [];
      clouds = [];
      particles = [];
      shake = 0;
      flash = 0;
      punchFlash = 0;
      spawnCooldown = 60 + Math.random() * 60;
      distance = 0;
      lastTime = 0;
      nextCloudSpawn = 0;
      dino.y = jumpY;
      dino.vy = 0;
      dino.onGround = true;
      gameState = 'playing';
      spawnObstacle();
      spawnObstacle();
    }

    function closeGame() {
      document.removeEventListener('keydown', keyHandler);
      document.removeEventListener('keyup', keyUpHandler);
      overlay.remove();
    }

    function keyHandler(e) {
      if (!overlay.parentNode) return;
      if (['ArrowUp', 'ArrowDown', ' ', 'Enter', 'Escape'].includes(e.key)) e.preventDefault();

      if (e.key === 'Escape') {
        closeGame();
        return;
      }

      if (gameState === 'tutorial') {
        if (e.key === 'Enter' || e.key === ' ') resetGame();
        return;
      }

      if (gameState === 'gameover') {
        if (e.key === 'Enter' || e.key === ' ') resetGame();
        return;
      }

      if (e.key === 'x' || e.key === 'X') {
        const target = obstacles.find(ob => !ob.hit && ob.x < dino.x + 100 && ob.x + ob.w > dino.x + 34 && Math.abs(ob.y - dino.y) < 28);
        if (target) {
          target.hit = true;
          punchFlash = 12;
          score += 25;
          bestScore = Math.max(bestScore, score);
          addParticles(target.x + target.w / 2, target.y + target.h / 2, '#ffd700', 18);
          return;
        }
      }

      if (e.key === ' ' || e.key === 'ArrowUp') {
        if (dino.onGround) {
          dino.vy = -(12.8 + Math.random() * 2.8);
          dino.onGround = false;
          addParticles(dino.x + 10, dino.y + 34, '#ffd700', 6 + Math.floor(Math.random() * 6));
        }
        return;
      }

      if (e.key === 'ArrowDown') {
        duck = true;
      }
    }

    function keyUpHandler(e) {
      if (e.key === 'ArrowDown') duck = false;
    }

    document.addEventListener('keydown', keyHandler);
    document.addEventListener('keyup', keyUpHandler);

    function update(delta) {
      frame += delta;
      if (flash > 0) flash--;
      if (shake > 0) shake--;

      clouds.forEach(c => {
        c.x -= c.speed * delta;
        if (c.x < -60) {
          c.x = W + 80 + Math.random() * 120;
          c.y = 50 + Math.random() * 180;
          c.speed = 0.4 + Math.random() * 1.5;
          c.size = 0.8 + Math.random() * 1.5;
        }
      });
      nextCloudSpawn -= delta;
      if (clouds.length < 3 || nextCloudSpawn <= 0) {
        clouds.push({
          x: W + Math.random() * 200,
          y: 40 + Math.random() * 180,
          speed: 0.4 + Math.random() * 1.5,
          size: 0.8 + Math.random() * 1.5
        });
        nextCloudSpawn = 18 + Math.random() * 36;
      }

      if (gameState !== 'playing') {
        particles.forEach(p => {
          p.x += p.vx * delta;
          p.y += p.vy * delta;
          p.vy += 0.18 * delta;
          p.life -= delta;
        });
        particles = particles.filter(p => p.life > 0);
        return;
      }

      score += delta;
      distance += (speed * delta) / 12;
      speedUp += 0.0006 * delta;
      speed = 7.5 + Math.min(5.5, speedUp * 18);

      spawnCooldown -= delta;
      if (spawnCooldown <= 0) {
        spawnObstacle();
        if (distance > 500 && Math.random() < 0.18) spawnObstacle();
        const minGap = Math.max(36, 96 - Math.floor(speed * 4));
        spawnCooldown = minGap + Math.random() * 34;
      }

      if (!dino.onGround) {
        dino.y += dino.vy * delta;
        dino.vy += 0.66 * delta;
        if (dino.y >= jumpY) {
          dino.y = jumpY;
          dino.vy = 0;
          dino.onGround = true;
        }
      } else {
        const targetY = duck ? GROUND_Y - 24 : jumpY;
        dino.y = targetY;
      }

      obstacles = obstacles.filter(ob => {
        ob.x -= speed * delta;

        const dinoW = duck && dino.onGround ? DINO_W + 6 : DINO_W;
        const dinoH = duck && dino.onGround ? 20 : DINO_H;
        const dinoYNow = dino.y;
        const hit = ob.x < dino.x + dinoW - 2 && ob.x + ob.w - 2 > dino.x + 2 && ob.y < dinoYNow + dinoH - 2 && ob.y + ob.h - 2 > dinoYNow + 2;

        if (hit && !ob.hit) {
          ob.hit = true;
          gameState = 'gameover';
          bestScore = Math.max(bestScore, score);
          shake = 18;
          addParticles(dino.x + 18, dino.y + 16, '#e63946', 22);
          addParticles(ob.x + ob.w / 2, ob.y + ob.h / 2, '#ffd700', 12);
          return true;
        }

        if (!ob.passed && ob.x + ob.w < dino.x) {
          ob.passed = true;
          score += 8;
        }

        return ob.x > -80;
      });

      particles.forEach(p => {
        p.x += p.vx * delta;
        p.y += p.vy * delta;
        p.vy += 0.18 * delta;
        p.life -= delta;
      });
      particles = particles.filter(p => p.life > 0);
      if (punchFlash > 0) punchFlash--;
    }

    function drawSky() {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#101423');
      grad.addColorStop(1, '#07070c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      clouds.forEach(c => {
        ctx.fillStyle = 'rgba(255,255,255,0.10)';
        ctx.beginPath();
        ctx.arc(c.x, c.y, 16 * c.size, 0, Math.PI * 2);
        ctx.arc(c.x + 16 * c.size, c.y + 4, 20 * c.size, 0, Math.PI * 2);
        ctx.arc(c.x + 36 * c.size, c.y, 14 * c.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < W; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, H);
        ctx.stroke();
      }
    }

    function drawGround() {
      ctx.fillStyle = '#1a1d12';
      ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y + 0.5);
      ctx.lineTo(W, GROUND_Y + 0.5);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      for (let i = -frame * speed % 40; i < W; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, GROUND_Y + 18);
        ctx.lineTo(i + 20, GROUND_Y + 18);
        ctx.stroke();
      }
    }

    function drawDino() {
      const x = dino.x;
      const y = dino.y;
      const bodyY = duck && dino.onGround ? y + 12 : y;
      const bodyH = duck && dino.onGround ? 22 : 36;

      ctx.save();
      if (shake > 0) ctx.translate((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4);

      ctx.fillStyle = '#d8d8d8';
      ctx.fillRect(x, bodyY, 34, bodyH);
      ctx.fillRect(x + 24, bodyY - 10, 18, 18);
      ctx.fillRect(x + 40, bodyY + 2, 8, 8);
      ctx.fillRect(x + 8, bodyY + bodyH - 4, 8, 12);
      ctx.fillRect(x + 24, bodyY + bodyH - 4, 8, 12);
      ctx.fillRect(x + 34, bodyY + bodyH - 4, 8, 12);
      ctx.fillStyle = '#1b1b1b';
      ctx.fillRect(x + 31, bodyY - 4, 3, 3);
      ctx.fillStyle = flash > 0 ? '#ffd700' : '#e63946';
      ctx.fillRect(x + 36, bodyY + 10, 4, 4);
      if (punchFlash > 0) {
        ctx.strokeStyle = 'rgba(255,215,0,0.85)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(x + 28, bodyY + 18, 26, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawObstacle(ob) {
      ctx.save();
      ctx.translate(ob.x, ob.y);
      ctx.fillStyle = ob.hit ? '#8c4d1f' : '#ff7f2a';
      ctx.fillRect(0, 10, ob.w, ob.h - 10);
      ctx.fillStyle = ob.hit ? '#bbbbbb' : '#ffd8a8';
      ctx.fillRect(6, 0, ob.w - 12, 14);
      ctx.fillStyle = '#2d1b0f';
      ctx.fillRect(8, 16, 4, 4);
      ctx.fillRect(ob.w - 12, 16, 4, 4);
      ctx.fillStyle = '#b71c1c';
      ctx.fillRect(0, ob.h - 8, ob.w, 8);
      ctx.fillStyle = 'rgba(255,255,255,0.14)';
      ctx.fillRect(4, 4, 3, ob.h - 12);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText(ob.hit ? 'HIT' : 'PUNCH', ob.w / 2, ob.h + 14);
      ctx.restore();
    }

    function drawParticles() {
      particles.forEach(p => {
        ctx.globalAlpha = Math.max(0, p.life / 30);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      ctx.globalAlpha = 1;
    }

    function drawHud() {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, W, 40);
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 18px Oswald, sans-serif';
      ctx.fillText(`SCORE ${Math.floor(score)}`, 16, 26);
      ctx.fillStyle = '#cfd8dc';
      ctx.fillText(`BEST ${Math.floor(bestScore)}`, 170, 26);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#9ad1ff';
      ctx.fillText(`SPEED ${speed.toFixed(1)}`, W - 16, 26);
    }

    function drawTutorial() {
      ctx.fillStyle = 'rgba(0,0,0,0.78)';
      ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 46px Oswald, sans-serif';
      ctx.fillText('🦖 DINO RUN', W / 2, 84);
      ctx.fillStyle = '#ddd';
      ctx.font = '18px Inter, sans-serif';
      ctx.fillText('恐竜ゲーム風の隠しランナー', W / 2, 122);

      const lines = [
        'Space / ↑ でジャンプ',
        '↓ でしゃがむ',
        '障害物を避けてスコアを伸ばす',
        'Enter でスタート, Esc で終了'
      ];
      lines.forEach((t, i) => {
        ctx.fillStyle = i === 0 ? '#fff' : '#c9c9c9';
        ctx.fillText(t, W / 2, 180 + i * 36);
      });

      ctx.fillStyle = '#a7b3c7';
      ctx.fillText('Enter / Space で開始, X でパンチ', W / 2, 390);
    }

    function drawGameOver() {
      ctx.fillStyle = 'rgba(0,0,0,0.70)';
      ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#e63946';
      ctx.font = 'bold 56px Oswald, sans-serif';
      ctx.fillText('GAME OVER', W / 2, 170);
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 30px Oswald, sans-serif';
      ctx.fillText(`SCORE ${Math.floor(score / 10)}`, W / 2, 220);
      ctx.fillStyle = '#d0d0d0';
      ctx.font = '18px Inter, sans-serif';
      ctx.fillText(`BEST ${Math.floor(bestScore)}`, W / 2, 256);
      ctx.fillText('Enter / Space で再戦', W / 2, 320);
      ctx.fillText('Esc で終了', W / 2, 350);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      drawSky();
      drawGround();
      drawParticles();

      if (gameState === 'tutorial') {
        drawTutorial();
        return;
      }

      obstacles.forEach(drawObstacle);
      drawDino();
      drawHud();

      if (gameState === 'gameover') drawGameOver();
    }

    function loop() {
      if (!overlay.parentNode) return;
      const now = performance.now();
      const delta = lastTime ? Math.min(2, (now - lastTime) / 16.6667) : 1;
      lastTime = now;
      update(delta);
      draw();
      requestAnimationFrame(loop);
    }

    draw();
    loop();
  };
});
