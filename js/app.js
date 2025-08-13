/*
  app.js — Sudharshan Interior Designs
  - Pure vanilla JS
  - Features: smooth anchor scrolling with offset, navbar shrink on scroll, active link sync,
    IntersectionObserver reveal, section title stroke draw, Carousel (touch/drag + autoplay + ARIA),
    Lightbox modal for service galleries, contact/newsletter validation, mobile callback modal.
  - Swap brand: CSS variables in styles.css control visuals.
  - Minify: Use terser/uglify to produce app.min.js for production.
*/
(function() {
  const html = document.documentElement;
  html.classList.remove('no-js');

  const HEADER_SELECTOR = '[data-header]';
  const header = document.querySelector(HEADER_SELECTOR);
  const nav = document.getElementById('primary-nav');
  const navToggle = document.querySelector('.nav-toggle');

  // Utility: throttle
  function throttle(fn, wait) {
    let inThrottle = false; let lastArgs; let lastThis;
    return function throttled(...args) {
      lastArgs = args; lastThis = this;
      if (!inThrottle) {
        fn.apply(lastThis, lastArgs);
        inThrottle = true;
        setTimeout(() => { inThrottle = false; if (lastArgs !== args) fn.apply(lastThis, lastArgs); }, wait);
      }
    };
  }

  // Smooth scroll with header offset
  function getHeaderOffset() {
    if (!header) return 0;
    const styles = getComputedStyle(header.querySelector('.header-inner'));
    const padding = parseInt(styles.paddingTop || '0') + parseInt(styles.paddingBottom || '0');
    return header.offsetHeight; // header height already includes padding
  }

  function smoothScrollTo(hash) {
    const target = document.querySelector(hash);
    if (!target) return;
    const headerOffset = getHeaderOffset();
    const rect = target.getBoundingClientRect();
    const targetY = rect.top + window.pageYOffset - (headerOffset - 2);
    window.scrollTo({ top: Math.max(targetY, 0), behavior: 'smooth' });
  }

  // Nav open/close for mobile
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && nav.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Handle anchor links with data-scroll
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[data-scroll]');
    if (!anchor) return;
    const href = anchor.getAttribute('href') || '';
    if (href.startsWith('#')) {
      e.preventDefault();
      smoothScrollTo(href);
      history.pushState(null, '', href);
    }
  });

  // Header shrink on scroll
  const onScroll = throttle(() => {
    if (!header) return;
    const scrolled = window.scrollY > 8;
    header.classList.toggle('is-shrunk', scrolled);
  }, 100);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active link syncing
  const sectionIds = ['#home', '#about', '#services', '#portfolio'];
  const sections = sectionIds.map(id => document.querySelector(id)).filter(Boolean);
  const navLinks = Array.from(document.querySelectorAll('.primary-nav a'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = '#' + entry.target.id;
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          const match = (a.getAttribute('href') || '').replace(location.origin, '');
          if (match === id || match === ('/index.html' + id) || match === ('index.html' + id)) {
            a.setAttribute('aria-current', 'true');
          } else if (a.getAttribute('aria-current')) {
            a.removeAttribute('aria-current');
          }
        });
      }
    });
  }, { threshold: 0.6 });
  sections.forEach(sec => observer.observe(sec));

  // Reveal animations + title stroke draw
  const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        const underline = entry.target.parentElement?.querySelector?.('.title-underline path');
        if (underline) {
          const total = underline.getTotalLength?.() || 160;
          underline.style.strokeDasharray = String(total);
          underline.style.strokeDashoffset = String(total);
          requestAnimationFrame(() => {
            underline.style.transition = 'stroke-dashoffset 900ms cubic-bezier(.25,.1,.25,1)';
            underline.style.strokeDashoffset = '0';
          });
        }
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealEls.forEach(el => revealObserver.observe(el));

  // Carousel
  class Carousel {
    constructor(root, { autoplay = true, interval = 5000, transitionMs = 600 } = {}) {
      this.root = root;
      this.track = root.querySelector('[data-carousel-track]');
      this.slides = Array.from(root.querySelectorAll('[data-carousel-slide]'));
      this.prevBtn = root.querySelector('.carousel-prev');
      this.nextBtn = root.querySelector('.carousel-next');
      this.dotsWrap = root.querySelector('.carousel-dots');
      this.index = 0;
      this.autoplay = autoplay;
      this.interval = interval;
      this.transitionMs = transitionMs;
      this.width = this.root.querySelector('.carousel-viewport').clientWidth;
      this.isPointerDown = false;
      this.startX = 0; this.currentX = 0; this.deltaX = 0;
      this.rafId = null; this.autoTimer = null;

      this.setup();
      this.bind();
      this.update();
      this.startAutoplay();
    }

    setup() {
      // Dots
      this.dotsWrap.innerHTML = '';
      this.slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', `slide-${i}`);
        b.addEventListener('click', () => this.goTo(i));
        this.dotsWrap.appendChild(b);
      });

      // ARIA
      this.root.setAttribute('role', 'region');
      this.root.setAttribute('aria-live', 'polite');
      this.slides.forEach((slide, i) => {
        slide.id = `slide-${i}`;
        slide.setAttribute('aria-roledescription', 'slide');
        slide.setAttribute('aria-label', `${i+1} of ${this.slides.length}`);
      });
    }

    bind() {
      this.prevBtn?.addEventListener('click', () => this.prev());
      this.nextBtn?.addEventListener('click', () => this.next());

      // Resize
      window.addEventListener('resize', throttle(() => {
        this.width = this.root.querySelector('.carousel-viewport').clientWidth;
        this.snap();
      }, 150));

      // Keyboard
      this.root.querySelector('.carousel-viewport')?.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') this.next();
        else if (e.key === 'ArrowLeft') this.prev();
      });

      // Pointer events for drag
      const viewport = this.root.querySelector('.carousel-viewport');
      if (viewport) {
        viewport.addEventListener('pointerdown', this.onPointerDown);
        viewport.addEventListener('pointermove', this.onPointerMove);
        viewport.addEventListener('pointerup', this.onPointerUp);
        viewport.addEventListener('pointercancel', this.onPointerUp);
        viewport.addEventListener('pointerleave', this.onPointerUp);
        viewport.addEventListener('mouseenter', () => this.pauseAutoplay());
        viewport.addEventListener('mouseleave', () => this.startAutoplay());
      }
    }

    onPointerDown = (e) => {
      this.isPointerDown = true; this.startX = e.clientX; this.currentX = e.clientX; this.deltaX = 0;
      this.pauseAutoplay();
      this.track.style.transition = 'none';
      this.root.setPointerCapture?.(e.pointerId);
    }

    onPointerMove = (e) => {
      if (!this.isPointerDown) return;
      this.currentX = e.clientX;
      this.deltaX = this.currentX - this.startX;
      const x = -this.index * this.width + this.deltaX;
      this.track.style.transform = `translate3d(${x}px,0,0)`;
    }

    onPointerUp = () => {
      if (!this.isPointerDown) return;
      this.isPointerDown = false;
      this.track.style.transition = '';
      const threshold = this.width * 0.15;
      if (this.deltaX > threshold) this.prev();
      else if (this.deltaX < -threshold) this.next();
      else this.snap();
      this.startAutoplay();
    }

    snap() { this.setTransform(-this.index * this.width, 0); }

    setTransform(x, duration = this.transitionMs) {
      const start = performance.now();
      const from = parseFloat((this.track.style.transform.match(/-?\d+\.?\d*/)?.[0]) || '0');
      const delta = x - from;
      if (this.rafId) cancelAnimationFrame(this.rafId);
      const ease = (t) => t<.5 ? 2*t*t : -1+(4-2*t)*t; // easeInOutQuad
      const animate = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const value = from + delta * ease(t);
        this.track.style.transform = `translate3d(${value}px,0,0)`;
        if (t < 1) this.rafId = requestAnimationFrame(animate);
      };
      if (duration === 0) { this.track.style.transform = `translate3d(${x}px,0,0)`; return; }
      this.rafId = requestAnimationFrame(animate);
    }

    update() {
      // Update dots
      Array.from(this.dotsWrap.children).forEach((b, i) => b.setAttribute('aria-selected', String(i === this.index)));
      // Snap to index
      this.setTransform(-this.index * this.width);
    }

    next() { this.index = (this.index + 1) % this.slides.length; this.update(); }
    prev() { this.index = (this.index - 1 + this.slides.length) % this.slides.length; this.update(); }
    goTo(i) { this.index = i; this.update(); }

    startAutoplay() {
      if (!this.autoplay || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      this.pauseAutoplay();
      this.autoTimer = setInterval(() => this.next(), this.interval);
    }

    pauseAutoplay() { if (this.autoTimer) { clearInterval(this.autoTimer); this.autoTimer = null; } }
  }

  // Initialize carousel(s)
  document.querySelectorAll('[data-carousel]').forEach(el => {
    new Carousel(el, { autoplay: true, interval: 5000, transitionMs: 600 });
  });

  // Lightbox for Services
  class Lightbox {
    constructor() {
      this.modal = document.getElementById('lightbox');
      if (!this.modal) return;
      this.backdrop = this.modal.querySelector('.lightbox-backdrop');
      this.contentTrack = this.modal.querySelector('.lightbox-track');
      this.prevBtn = this.modal.querySelector('.lightbox-prev');
      this.nextBtn = this.modal.querySelector('.lightbox-next');
      this.dots = this.modal.querySelector('.lightbox-dots');
      this.closeButtons = this.modal.querySelectorAll('[data-lightbox-close]');
      this.images = [];
      this.index = 0;

      this.bind();
    }

    bind() {
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-lightbox]');
        if (!btn) return;
        const id = btn.getAttribute('data-lightbox');
        if (!id) return;
        this.open(id);
      });

      this.backdrop?.addEventListener('click', () => this.close());
      this.closeButtons.forEach(b => b.addEventListener('click', () => this.close()));
      this.prevBtn?.addEventListener('click', () => this.prev());
      this.nextBtn?.addEventListener('click', () => this.next());
      document.addEventListener('keydown', (e) => {
        if (!this.isOpen()) return;
        if (e.key === 'Escape') this.close();
        if (e.key === 'ArrowRight') this.next();
        if (e.key === 'ArrowLeft') this.prev();
      });
    }

    isOpen() { return this.modal && this.modal.classList.contains('open'); }

    open(id) {
      const galleryMap = {
        cupboards: [
          { src: '/images/service-cupboards-1.svg', alt: 'Cupboard sample 1' },
          { src: '/images/service-cupboards-2.svg', alt: 'Cupboard sample 2' }
        ],
        kitchens: [
          { src: '/images/service-kitchens-1.svg', alt: 'Kitchen sample 1' },
          { src: '/images/service-kitchens-2.svg', alt: 'Kitchen sample 2' }
        ],
        doors: [
          { src: '/images/service-doors-1.svg', alt: 'Main door sample 1' },
          { src: '/images/service-doors-2.svg', alt: 'Main door sample 2' }
        ],
        windows: [
          { src: '/images/service-windows-1.svg', alt: 'Window sample 1' },
          { src: '/images/service-windows-2.svg', alt: 'Window sample 2' }
        ],
        aluminum: [
          { src: '/images/service-aluminum-1.svg', alt: 'Aluminum work sample 1' },
          { src: '/images/service-aluminum-2.svg', alt: 'Aluminum work sample 2' }
        ]
      };
      this.images = galleryMap[id] || [];
      this.index = 0;
      this.render();
      this.modal?.setAttribute('aria-hidden', 'false');
      this.modal?.classList.add('open');
      // Focus trap
      const focusables = this.modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const first = focusables[0]; const last = focusables[focusables.length - 1];
      this.modal.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }, { once: true });
      setTimeout(() => this.prevBtn?.focus(), 0);
    }

    close() {
      this.modal?.classList.remove('open');
      this.modal?.setAttribute('aria-hidden', 'true');
      this.contentTrack.innerHTML = '';
      this.dots.innerHTML = '';
    }

    render() {
      this.contentTrack.innerHTML = '';
      this.dots.innerHTML = '';
      this.images.forEach((img, i) => {
        const el = document.createElement('img');
        el.src = img.src; el.alt = img.alt; el.width = 1600; el.height = 900; el.loading = 'lazy';
        if (i === this.index) el.classList.add('active');
        this.contentTrack.appendChild(el);
        const dot = document.createElement('button'); dot.type = 'button'; dot.setAttribute('aria-selected', String(i === this.index));
        dot.addEventListener('click', () => { this.index = i; this.render(); });
        this.dots.appendChild(dot);
      });
    }

    next() { this.index = (this.index + 1) % this.images.length; this.render(); }
    prev() { this.index = (this.index - 1 + this.images.length) % this.images.length; this.render(); }
  }
  new Lightbox();

  // Newsletter form
  function validateEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  document.querySelectorAll('#newsletter-form').forEach(form => {
    const email = form.querySelector('input[type="email"]');
    const msg = form.querySelector('.form-message');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!email || !validateEmail(email.value.trim())) {
        msg.textContent = 'Please enter a valid email.';
        return;
      }
      msg.textContent = 'Thanks! You are subscribed.';
      form.reset();
    });
  });

  // Contact form validation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const name = contactForm.querySelector('#name');
    const email = contactForm.querySelector('#email');
    const phone = contactForm.querySelector('#phone');
    const service = contactForm.querySelector('#service');
    const message = contactForm.querySelector('#message');
    const msg = contactForm.querySelector('.form-message');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      const setErr = (el, id, text) => {
        const small = document.getElementById(id);
        if (text) { small.textContent = text; el.setAttribute('aria-invalid', 'true'); ok = false; }
        else { small.textContent = ''; el.removeAttribute('aria-invalid'); }
      };

      const nameVal = name.value.trim();
      setErr(name, 'error-name', nameVal.length < 2 ? 'Please enter your full name.' : '');

      const emailVal = email.value.trim();
      setErr(email, 'error-email', validateEmail(emailVal) ? '' : 'Please enter a valid email.');

      const phoneVal = phone.value.trim();
      const phoneOk = /^\+?[0-9\-\s]{7,15}$/.test(phoneVal);
      setErr(phone, 'error-phone', phoneOk ? '' : 'Please enter a valid phone number.');

      setErr(service, 'error-service', service.value ? '' : 'Please select a service.');

      const msgVal = message.value.trim();
      setErr(message, 'error-message', msgVal && msgVal.length < 5 ? 'Message is too short.' : '');

      if (ok) {
        msg.textContent = 'Thanks! Your message has been sent.';
        contactForm.reset();
      } else {
        msg.textContent = '';
      }
    });
  }

  // Callback modal (mobile)
  const cbBtn = document.getElementById('callback-btn');
  const cbModal = document.getElementById('callback-modal');
  if (cbBtn && cbModal) {
    const open = () => { cbModal.classList.add('open'); cbModal.setAttribute('aria-hidden', 'false'); };
    const close = () => { cbModal.classList.remove('open'); cbModal.setAttribute('aria-hidden', 'true'); };
    cbBtn.addEventListener('click', open);
    cbModal.querySelectorAll('[data-callback-close]').forEach(el => el.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && cbModal.classList.contains('open')) close(); });

    const cbForm = document.getElementById('callback-form');
    if (cbForm) {
      const name = cbForm.querySelector('#cb-name');
      const phone = cbForm.querySelector('#cb-phone');
      const msg = cbForm.querySelector('.form-message');
      cbForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let ok = true;
        const setErr = (el, id, text) => { const small = document.getElementById(id); if (text) { small.textContent = text; ok = false; } else { small.textContent = ''; } };
        setErr(name, 'error-cb-name', name.value.trim().length < 2 ? 'Please enter your full name.' : '');
        setErr(phone, 'error-cb-phone', /^\+?[0-9\-\s]{7,15}$/.test(phone.value.trim()) ? '' : 'Please enter a valid phone number.');
        if (ok) { msg.textContent = 'Thanks! We will call you back soon.'; cbForm.reset(); setTimeout(close, 1200); } else { msg.textContent = ''; }
      });
    }
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();