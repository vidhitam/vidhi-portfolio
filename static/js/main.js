/* Vidhitam Chakole Portfolio — Main JavaScript */

(function () {
  'use strict';

  const STATIC_BASE = '/static';

  let galleryImages = [];
  let galleryFilters = [];
  let currentFilter = 'general';

  const TYPED_ROLES = [
    'Software Developer',
    'AI Enthusiast',
    'Web Developer',
    'Student Leader',
    'Problem Solver',
    'Tech Explorer',
  ];

  // --- Particles ---
  function initParticles() {
    if (typeof particlesJS === 'undefined') return;

    particlesJS('particles-js', {
      particles: {
        number: { value: 70, density: { enable: true, value_area: 900 } },
        color: { value: ['#00d4ff', '#a855f7', '#ec4899'] },
        shape: { type: 'circle' },
        opacity: { value: 0.4, random: true },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 140,
          color: '#00d4ff',
          opacity: 0.12,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.2,
          direction: 'none',
          random: true,
          out_mode: 'out',
        },
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: true, mode: 'push' },
          resize: true,
        },
        modes: {
          grab: { distance: 160, line_linked: { opacity: 0.35 } },
          push: { particles_nb: 3 },
        },
      },
      retina_detect: true,
    });
  }

  // --- Typing effect ---
  function initTyping() {
    const el = document.getElementById('typedText');
    if (!el) return;

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function type() {
      const current = TYPED_ROLES[roleIndex];

      if (!deleting) {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(type, 2000);
          return;
        }
      } else {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % TYPED_ROLES.length;
        }
      }

      setTimeout(type, deleting ? 40 : 80);
    }

    type();
  }

  // --- Navbar ---
  function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    toggle?.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
    });

    links?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle?.classList.remove('active');
        links?.classList.remove('open');
      });
    });
  }

  // --- Scroll reveal ---
  function initReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  // --- 3D tilt on hover ---
  function init3DTilt() {
    document.querySelectorAll('.hover-3d').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  function imgPath(relativePath) {
    return `${STATIC_BASE}/${relativePath}`;
  }

  function placeholderSvg(text) {
    const encoded = encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
        <rect fill="#12121a" width="400" height="400"/>
        <rect fill="rgba(0,212,255,0.08)" x="40" y="40" width="320" height="320" rx="16"/>
        <text x="200" y="200" text-anchor="middle" dominant-baseline="middle" fill="#6b6b80" font-family="sans-serif" font-size="14">${text}</text>
      </svg>`
    );
    return `data:image/svg+xml,${encoded}`;
  }

  function certIconClass(title) {
    const t = title.toLowerCase();
    if (t.includes('python')) return 'fab fa-python';
    if (t.includes(' c ') || t.startsWith('c ') || t.includes('c programming')) return 'fas fa-c';
    if (t.includes('youth') || t.includes('parliament')) return 'fas fa-landmark';
    if (t.includes('hackathon')) return 'fas fa-laptop-code';
    return 'fas fa-certificate';
  }

  // --- Lightbox ---
  let lightboxIndex = 0;
  let lightboxList = [];

  function showLightboxItem(item) {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');

    if (!item || !lb) return;

    const src = item.fullSrc || imgPath(item.src);
    img.src = src;
    img.onerror = function () {
      this.src = placeholderSvg(item.caption || 'Image');
    };
    caption.textContent = item.caption || '';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function openLightbox(index, list) {
    lightboxList = list.map((item) => ({
      src: item.src,
      fullSrc: imgPath(item.src),
      caption: item.caption,
    }));
    lightboxIndex = index;
    showLightboxItem(lightboxList[lightboxIndex]);
  }

  function closeLightbox() {
    document.getElementById('lightbox')?.classList.remove('active');
    document.body.style.overflow = '';
  }

  function initLightbox() {
    document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
    document.getElementById('lightbox')?.addEventListener('click', (e) => {
      if (e.target.id === 'lightbox') closeLightbox();
    });

    document.getElementById('lightboxPrev')?.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxIndex = (lightboxIndex - 1 + lightboxList.length) % lightboxList.length;
      showLightboxItem(lightboxList[lightboxIndex]);
    });

    document.getElementById('lightboxNext')?.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxIndex = (lightboxIndex + 1) % lightboxList.length;
      showLightboxItem(lightboxList[lightboxIndex]);
    });

    document.addEventListener('keydown', (e) => {
      const lb = document.getElementById('lightbox');
      if (!lb?.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') document.getElementById('lightboxPrev')?.click();
      if (e.key === 'ArrowRight') document.getElementById('lightboxNext')?.click();
    });
  }

  function getFilteredImages(filterId) {
    return galleryImages.filter((img) => img.category === filterId);
  }

  function createFilmFrame(item, index, list) {
    const frame = document.createElement('div');
    frame.className = 'film-frame';

    const img = document.createElement('img');
    img.src = imgPath(item.src);
    img.alt = item.caption;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.onerror = function () {
      this.src = placeholderSvg(item.caption);
    };

    const perfsTop = document.createElement('div');
    perfsTop.className = 'film-perforations';
    const perfsBottom = document.createElement('div');
    perfsBottom.className = 'film-perforations';

    const photoWrap = document.createElement('div');
    photoWrap.className = 'film-photo-wrap';
    photoWrap.appendChild(img);

    frame.appendChild(perfsTop);
    frame.appendChild(photoWrap);
    frame.appendChild(perfsBottom);

    frame.addEventListener('click', () => openLightbox(index, list));

    return frame;
  }

  function renderFilmReel(filterId) {
    const track = document.getElementById('filmTrack');
    const wrap = document.getElementById('filmReelWrap');
    const emptyEl = document.getElementById('galleryEmpty');
    const viewport = document.getElementById('filmViewport');
    if (!track) return;

    const list = getFilteredImages(filterId);
    track.innerHTML = '';
    track.style.animation = 'none';

    if (!list.length) {
      wrap?.setAttribute('hidden', '');
      emptyEl?.removeAttribute('hidden');
      return;
    }

    wrap?.removeAttribute('hidden');
    emptyEl?.setAttribute('hidden', '');

    list.forEach((item, index) => {
      track.appendChild(createFilmFrame(item, index, list));
    });

    list.forEach((item, index) => {
      const clone = createFilmFrame(item, index, list);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    const duration = Math.max(list.length * 5, 20);
    track.style.setProperty('--film-duration', `${duration}s`);
    track.style.animation = '';

    viewport?.classList.remove('film-paused');
  }

  function setGalleryFilter(filterId) {
    currentFilter = filterId;

    document.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.filter === filterId);
    });

    renderFilmReel(filterId);
  }

  function initFilmReelControls() {
    const viewport = document.getElementById('filmViewport');
    const track = document.getElementById('filmTrack');

    viewport?.addEventListener('mouseenter', () => {
      viewport.classList.add('film-paused');
      if (track) track.style.animationPlayState = 'paused';
    });

    viewport?.addEventListener('mouseleave', () => {
      viewport.classList.remove('film-paused');
      if (track) track.style.animationPlayState = 'running';
    });
  }

  function renderGalleryFilters() {
    const filtersEl = document.getElementById('galleryFilters');
    if (!filtersEl) return;

    filtersEl.innerHTML = galleryFilters
      .map(
        (f, i) =>
          `<button type="button" class="filter-btn${i === 0 ? ' active' : ''}" data-filter="${f.id}">${f.label}</button>`
      )
      .join('');

    filtersEl.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => setGalleryFilter(btn.dataset.filter));
    });
  }

  async function initGallery() {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      galleryImages = data.images || [];
      galleryFilters = data.filters || [{ id: 'general', label: 'Highlights' }];
    } catch {
      galleryImages = [];
      galleryFilters = [{ id: 'general', label: 'Highlights' }];
    }

    renderGalleryFilters();
    initFilmReelControls();
    setGalleryFilter(galleryFilters[0]?.id || 'general');

    document.querySelectorAll('.community-gallery-link').forEach((link) => {
      link.addEventListener('click', () => {
        const filter = link.dataset.galleryFilter;
        if (!filter) return;
        setTimeout(() => setGalleryFilter(filter), 400);
      });
    });
  }

  function initCertificates() {
    document.querySelectorAll('.cert-card').forEach((card) => {
      card.querySelector('.cert-preview-btn')?.addEventListener('click', () => {
        const previewUrl = card.dataset.preview;
        const title = card.dataset.title;
        if (!previewUrl) return;
        lightboxList = [{ fullSrc: previewUrl, caption: title || 'Certificate' }];
        lightboxIndex = 0;
        showLightboxItem(lightboxList[0]);
      });
    });
    init3DTilt();
  }

  // --- GitHub API ---
  async function initGitHub() {
    const profileEl = document.getElementById('githubProfile');
    const reposEl = document.getElementById('githubRepos');

    try {
      const res = await fetch('/api/github');
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      const p = data.profile;
      profileEl.innerHTML = `
        <div class="github-profile-inner">
          <img class="github-avatar" src="${p.avatar_url}" alt="${p.login}" onerror="this.style.display='none'">
          <div>
            <h3>${p.name || p.login}</h3>
            <p style="color: var(--text-secondary); margin: 8px 0;">${p.bio || 'Software Developer · AI Enthusiast · Student Leader'}</p>
            <a href="${p.html_url}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline" style="margin-top: 8px;">
              <i class="fab fa-github"></i> View Profile
            </a>
            <div class="github-stats">
              <div class="github-stat"><strong>${p.public_repos}</strong><span>Repositories</span></div>
              <div class="github-stat"><strong>${p.followers}</strong><span>Followers</span></div>
              <div class="github-stat"><strong>${p.following}</strong><span>Following</span></div>
            </div>
          </div>
        </div>
      `;

      if (data.repos?.length) {
        reposEl.innerHTML = data.repos
          .map(
            (repo) => `
          <div class="repo-card glass-card hover-3d">
            <h4><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h4>
            <p>${repo.description}</p>
            <div class="repo-meta">
              ${repo.language ? `<span><i class="fas fa-circle" style="font-size: 0.5rem; color: var(--accent-cyan);"></i> ${repo.language}</span>` : ''}
              <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
              <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
            </div>
          </div>
        `
          )
          .join('');
        init3DTilt();
      } else {
        reposEl.innerHTML =
          '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">No public repositories found yet.</p>';
      }
    } catch {
      profileEl.innerHTML = `
        <p style="color: var(--text-muted); text-align: center;">
          Unable to load GitHub data. <a href="https://github.com/vidhitam" target="_blank" rel="noopener noreferrer" style="color: var(--accent-cyan);">Visit profile →</a>
        </p>
      `;
    }
  }

  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 120) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach((link) => {
        link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--accent-cyan)' : '';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTyping();
    initNavbar();
    initReveal();
    init3DTilt();
    initLightbox();
    initGallery();
    initCertificates();
    initGitHub();
    initActiveNav();
  });
})();
