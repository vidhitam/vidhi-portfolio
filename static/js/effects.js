/* Interactive effects — desktop + mobile, minimal heart cursor, section float icons */

(function () {
  'use strict';

  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  const FLOAT_GROUPS = {
    technical: {
      icons: ['fa-code', 'fa-terminal', 'fa-microchip', 'fa-database', 'fa-robot', 'fa-brackets-curly', 'fa-laptop-code', 'fa-brain'],
      colors: ['#0284c7', '#7c3aed', '#06b6d4', '#6366f1'],
      labels: ['Dev', 'AI', 'Code', 'Tech'],
    },
    ngo: {
      icons: ['fa-hands-helping', 'fa-flag', 'fa-seedling', 'fa-heart', 'fa-users', 'fa-handshake', 'fa-globe'],
      colors: ['#ec4899', '#db2777', '#4ade80', '#f97316'],
      labels: ['NGO', 'Social', 'Care', 'Unity'],
    },
    education: {
      icons: ['fa-graduation-cap', 'fa-book', 'fa-certificate', 'fa-university', 'fa-award'],
      colors: ['#eab308', '#f59e0b', '#0284c7', '#7c3aed'],
      labels: ['Learn', 'Cert', 'SIT', 'Study'],
    },
    leadership: {
      icons: ['fa-crown', 'fa-bullhorn', 'fa-calendar-check', 'fa-star', 'fa-trophy'],
      colors: ['#f97316', '#ec4899', '#eab308', '#7c3aed'],
      labels: ['Lead', 'Events', 'Growth'],
    },
    media: {
      icons: ['fa-camera', 'fa-film', 'fa-image', 'fa-camera-retro'],
      colors: ['#b45309', '#ec4899', '#db2777', '#f59e0b'],
      labels: ['Photo', 'Reel', 'Memories'],
    },
    general: {
      icons: ['fa-bolt', 'fa-star', 'fa-envelope', 'fa-link', 'fa-rocket'],
      colors: ['#0284c7', '#ec4899', '#7c3aed', '#06b6d4'],
      labels: ['Hi', 'Connect', 'Go'],
    },
  };

  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function bindPointer() {
    const set = (x, y) => {
      pointerX = x;
      pointerY = y;
    };

    document.addEventListener('mousemove', (e) => set(e.clientX, e.clientY));

    document.addEventListener(
      'touchstart',
      (e) => {
        const t = e.touches[0];
        if (t) set(t.clientX, t.clientY);
      },
      { passive: true }
    );

    document.addEventListener(
      'touchmove',
      (e) => {
        const t = e.touches[0];
        if (t) set(t.clientX, t.clientY);
      },
      { passive: true }
    );
  }

  function initHeartCursor() {
    const cursor = document.getElementById('heartCursor');
    const trailLayer = document.getElementById('heartTrailLayer');
    if (!cursor) return;

    document.body.classList.add('custom-cursor-active');
    if (isTouch) document.body.classList.add('touch-cursor-mode');

    let curX = pointerX;
    let curY = pointerY;
    let lastTrailX = pointerX;
    let lastTrailY = pointerY;
    let hovering = false;
    let visible = !isTouch;

    function spawnTrail(x, y) {
      if (!trailLayer) return;
      const dot = document.createElement('span');
      dot.className = 'heart-trail-particle';
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      trailLayer.appendChild(dot);
      setTimeout(() => dot.remove(), 600);
    }

    if (isTouch) {
      document.addEventListener(
        'touchstart',
        (e) => {
          const t = e.touches[0];
          if (!t) return;
          visible = true;
          cursor.classList.add('is-visible');
          curX = t.clientX;
          curY = t.clientY;
          spawnTrail(t.clientX, t.clientY);
        },
        { passive: true }
      );

      document.addEventListener(
        'touchend',
        () => {
          setTimeout(() => {
            visible = false;
            cursor.classList.remove('is-visible');
          }, 400);
        },
        { passive: true }
      );
    } else {
      document.addEventListener('mousemove', () => {
        const dx = pointerX - lastTrailX;
        const dy = pointerY - lastTrailY;
        if (Math.hypot(dx, dy) > 28) {
          spawnTrail(pointerX, pointerY);
          lastTrailX = pointerX;
          lastTrailY = pointerY;
        }
      });

      document.addEventListener('mousedown', () => cursor.classList.add('is-clicking'));
      document.addEventListener('mouseup', () => cursor.classList.remove('is-clicking'));

      const hoverTargets = 'a, button, .hover-3d, .glass-card, .filter-btn, .float-icon';
      document.querySelectorAll(hoverTargets).forEach((el) => {
        el.addEventListener('mouseenter', () => {
          hovering = true;
          cursor.classList.add('is-hover');
        });
        el.addEventListener('mouseleave', () => {
          hovering = false;
          cursor.classList.remove('is-hover');
        });
      });
    }

    function animate() {
      curX = lerp(curX, pointerX, hovering ? 0.35 : isTouch ? 0.45 : 0.22);
      curY = lerp(curY, pointerY, hovering ? 0.35 : isTouch ? 0.45 : 0.22);

      const scale = hovering ? 1.12 : 1;
      const opacity = isTouch ? (visible ? 1 : 0) : 1;
      cursor.style.opacity = opacity;
      cursor.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%) scale(${scale})`;

      requestAnimationFrame(animate);
    }

    animate();
  }

  function initTouchRipples() {
    const layer = document.getElementById('touchRippleLayer');
    if (!layer) return;

    const spawn = (x, y) => {
      const ripple = document.createElement('span');
      ripple.className = 'touch-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      layer.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    };

    document.addEventListener(
      'touchstart',
      (e) => {
        Array.from(e.changedTouches).forEach((t) => spawn(t.clientX, t.clientY));
      },
      { passive: true }
    );

    if (!isTouch) {
      document.addEventListener('click', (e) => spawn(e.clientX, e.clientY));
    }
  }

  function initCursorSpotlight() {
    const spotlight = document.getElementById('cursorSpotlight');
    if (!spotlight) return;

    let cx = pointerX;
    let cy = pointerY;

    function tick() {
      cx = lerp(cx, pointerX, isTouch ? 0.12 : 0.09);
      cy = lerp(cy, pointerY, isTouch ? 0.12 : 0.09);
      spotlight.style.background = `radial-gradient(${isTouch ? 420 : 650}px circle at ${cx}px ${cy}px,
        rgba(236, 72, 153, 0.28),
        rgba(124, 58, 237, 0.18) 30%,
        rgba(2, 132, 199, 0.12) 50%,
        rgba(249, 115, 22, 0.08) 65%,
        transparent 75%)`;
      requestAnimationFrame(tick);
    }

    tick();
  }

  function initInteractiveCanvas() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;
    let lx = pointerX;
    let ly = pointerY;
    let time = 0;

    const blobs = [
      { color: 'rgba(236, 72, 153, 0.45)', ox: 0.15, oy: 0.25, r: 300, pull: 0.4 },
      { color: 'rgba(124, 58, 237, 0.38)', ox: 0.75, oy: 0.15, r: 340, pull: 0.28 },
      { color: 'rgba(2, 132, 199, 0.35)', ox: 0.5, oy: 0.65, r: 320, pull: 0.22 },
      { color: 'rgba(249, 115, 22, 0.28)', ox: 0.88, oy: 0.5, r: 260, pull: 0.18 },
      { color: 'rgba(234, 179, 8, 0.25)', ox: 0.1, oy: 0.78, r: 240, pull: 0.15 },
      { color: 'rgba(6, 182, 212, 0.3)', ox: 0.35, oy: 0.45, r: 220, pull: 0.2 },
      { color: 'rgba(219, 39, 119, 0.32)', ox: 0.62, oy: 0.82, r: 280, pull: 0.25 },
      { color: 'rgba(99, 102, 241, 0.28)', ox: 0.92, oy: 0.22, r: 200, pull: 0.12 },
    ];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
      time += 0.01;
      lx = lerp(lx, pointerX, 0.07);
      ly = lerp(ly, pointerY, 0.07);

      ctx.clearRect(0, 0, w, h);

      blobs.forEach((b, i) => {
        const floatX = Math.sin(time + i * 1.1) * 80;
        const floatY = Math.cos(time * 0.85 + i * 0.9) * 65;
        const x = b.ox * w + floatX + (lx - b.ox * w) * b.pull;
        const y = b.oy * h + floatY + (ly - b.oy * h) * b.pull;
        const radius = b.r + Math.sin(time * 2.2 + i) * 30;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, b.color);
        grad.addColorStop(0.55, b.color.replace(/[\d.]+\)$/, '0.08)'));
        grad.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      const pulse = 160 + Math.sin(time * 3) * 30;
      const cursorGrad = ctx.createRadialGradient(lx, ly, 0, lx, ly, pulse);
      cursorGrad.addColorStop(0, 'rgba(236, 72, 153, 0.22)');
      cursorGrad.addColorStop(0.4, 'rgba(124, 58, 237, 0.12)');
      cursorGrad.addColorStop(0.7, 'rgba(2, 132, 199, 0.06)');
      cursorGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = cursorGrad;
      ctx.beginPath();
      ctx.arc(lx, ly, pulse, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(draw);
    }

    draw();
  }

  function initOrbFollow() {
    const orbs = [
      { el: document.getElementById('orb1'), factor: 0.05 },
      { el: document.getElementById('orb2'), factor: -0.04 },
      { el: document.getElementById('orb3'), factor: 0.035 },
    ].filter((o) => o.el);

    orbs.forEach(({ el, factor }) => {
      let ox = 0;
      let oy = 0;

      function tick() {
        const mx = pointerX - window.innerWidth / 2;
        const my = pointerY - window.innerHeight / 2;
        ox = lerp(ox, mx * factor, 0.06);
        oy = lerp(oy, my * factor, 0.06);
        el.style.transform = `translate(${ox}px, ${oy}px)`;
        requestAnimationFrame(tick);
      }

      tick();
    });
  }

  function initFloatingSectionIcons() {
    const layer = document.getElementById('floatIconsLayer');
    if (!layer) return;

    const floats = [];
    const isMobile = window.innerWidth < 768;
    const countPerSection = isMobile ? 2 : 4;

    document.querySelectorAll('[data-float-group]').forEach((section) => {
      const groupKey = section.dataset.floatGroup;
      const group = FLOAT_GROUPS[groupKey] || FLOAT_GROUPS.general;

      for (let i = 0; i < countPerSection; i++) {
        const useIcon = Math.random() > 0.35;
        const iconClass = group.icons[Math.floor(Math.random() * group.icons.length)];
        const color = group.colors[Math.floor(Math.random() * group.colors.length)];
        const label = group.labels[Math.floor(Math.random() * group.labels.length)];

        const el = document.createElement('div');
        el.className = `float-icon float-icon--${groupKey}`;
        el.dataset.group = groupKey;
        el.innerHTML = useIcon
          ? `<i class="fas ${iconClass}"></i>`
          : `<span>${label}</span>`;
        el.style.setProperty('--float-color', color);
        layer.appendChild(el);

        floats.push({
          el,
          section,
          groupKey,
          angle: Math.random() * Math.PI * 2,
          angleSpeed: 0.004 + Math.random() * 0.008,
          radiusX: 40 + Math.random() * (isMobile ? 30 : 70),
          radiusY: 30 + Math.random() * (isMobile ? 25 : 55),
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.02 + Math.random() * 0.02,
          currentX: 0,
          currentY: 0,
          opacity: 0,
        });
      }
    });

    function tick() {
      const vh = window.innerHeight;

      floats.forEach((f) => {
        const rect = f.section.getBoundingClientRect();
        const inView = rect.bottom > -80 && rect.top < vh + 80;
        const targetOpacity = inView ? (isMobile ? 0.75 : 0.9) : 0;

        f.opacity = lerp(f.opacity, targetOpacity, 0.08);
        f.el.style.opacity = f.opacity;

        if (f.opacity < 0.02) return;

        f.angle += f.angleSpeed;
        f.wobble += f.wobbleSpeed;

        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const side = Math.floor(f.angle / (Math.PI / 2)) % 4;
        let anchorX = cx;
        let anchorY = cy;

        if (side === 0) {
          anchorX = rect.right + 8;
          anchorY = cy + Math.sin(f.angle) * f.radiusY;
        } else if (side === 1) {
          anchorX = cx + Math.cos(f.angle) * f.radiusX;
          anchorY = rect.bottom + 8;
        } else if (side === 2) {
          anchorX = rect.left - 8;
          anchorY = cy + Math.sin(f.angle) * f.radiusY;
        } else {
          anchorX = cx + Math.cos(f.angle) * f.radiusX;
          anchorY = rect.top - 8;
        }

        const targetX = anchorX + Math.sin(f.wobble) * 12;
        const targetY = anchorY + Math.cos(f.wobble * 1.3) * 10;

        f.currentX = lerp(f.currentX, targetX, 0.1);
        f.currentY = lerp(f.currentY, targetY, 0.1);

        const scale = 0.85 + Math.sin(f.wobble) * 0.12;
        f.el.style.transform = `translate3d(${f.currentX}px, ${f.currentY}px, 0) translate(-50%, -50%) scale(${scale})`;
      });

      requestAnimationFrame(tick);
    }

    tick();
  }

  function initMagneticElements() {
    if (isTouch) return;

    document.querySelectorAll('.btn, .hero-social a, .nav-logo').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  function initSectionTilt() {
    if (isTouch) return;

    document.querySelectorAll('.section').forEach((section) => {
      section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        section.style.setProperty('--tilt-x', `${y * -1.5}deg`);
        section.style.setProperty('--tilt-y', `${x * 1.5}deg`);
      });
      section.addEventListener('mouseleave', () => {
        section.style.setProperty('--tilt-x', '0deg');
        section.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  function initCardShine() {
    const update = (el, clientX, clientY) => {
      const rect = el.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--shine-x', `${x}%`);
      el.style.setProperty('--shine-y', `${y}%`);
    };

    document.querySelectorAll('.glass-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => update(card, e.clientX, e.clientY));
      card.addEventListener(
        'touchmove',
        (e) => {
          const t = e.touches[0];
          if (t) update(card, t.clientX, t.clientY);
        },
        { passive: true }
      );
    });
  }

  function init() {
    bindPointer();
    initInteractiveCanvas();
    initCursorSpotlight();
    initOrbFollow();
    initHeartCursor();
    initTouchRipples();
    initFloatingSectionIcons();
    initMagneticElements();
    initSectionTilt();
    initCardShine();

    if (isTouch) document.body.classList.add('touch-device');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
