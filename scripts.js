(() => {
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  const html = document.documentElement;
  const setTheme = (mode) => {
    html.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
  };
  setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

  const themeToggle = document.getElementById('theme-toggle');
  themeToggle?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // Navbar behavior
  const header = document.querySelector('.site-header');
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.querySelector('.nav-toggle');

  const setScrolled = () => {
    if (window.scrollY > 6) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  setScrolled();
  window.addEventListener('scroll', setScrolled, { passive: true });

  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu?.classList.toggle('open');
  });
  navLinks.forEach((a) => a.addEventListener('click', () => {
    navMenu?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }));

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.16 });
  revealEls.forEach((el) => io.observe(el));

  // Active section highlighting
  const sections = [...document.querySelectorAll('main section[id]')];
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute('id');
      const link = navLinks.find((l) => l.getAttribute('href') === `#${id}`);
      if (entry.isIntersecting) {
        navLinks.forEach((l) => { l.classList.remove('active'); l.removeAttribute('aria-current'); });
        if (link) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'true');
        }
      }
    });
  }, { threshold: 0.5 });
  sections.forEach((s) => sectionObserver.observe(s));

  // Portfolio filters
  const filterBtns = [...document.querySelectorAll('.filter-btn')];
  const projectCards = [...document.querySelectorAll('.project-card')];
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });

  // Project modal
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTags = document.getElementById('modalTags');
  const modalLink = document.getElementById('modalLink');
  let lastFocus = null;

  const openModal = (card) => {
    lastFocus = document.activeElement;
    modalTitle.textContent = card.dataset.title || 'Project';
    modalDesc.textContent = card.dataset.description || '';
    const tags = (card.dataset.tags || '').split(',').filter(Boolean).map((t) => t.trim());
    modalTags.textContent = tags.length ? `Tags: ${tags.join(' • ')}` : '';
    const href = card.dataset.link || '#';
    modalLink.setAttribute('href', href);
    modal.hidden = false;
    modal.querySelector('.modal-close').focus();
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = '';
    lastFocus?.focus();
  };
  projectCards.forEach((card) => card.addEventListener('click', () => openModal(card)));
  modal?.addEventListener('click', (e) => {
    const target = e.target;
    if (target.hasAttribute('data-close')) closeModal();
  });
  window.addEventListener('keydown', (e) => { if (!modal.hidden && e.key === 'Escape') closeModal(); });

  // Case studies carousel controls (scroll snapping container)
  const caseTrack = document.getElementById('caseTrack');
  const casePrev = document.querySelector('#case-studies .carousel-btn.prev');
  const caseNext = document.querySelector('#case-studies .carousel-btn.next');
  const scrollByCard = () => {
    const first = caseTrack.querySelector('.case-card');
    const cardWidth = first?.getBoundingClientRect().width || 320;
    return cardWidth + 16; // gap
  };
  casePrev?.addEventListener('click', () => caseTrack.scrollBy({ left: -scrollByCard(), behavior: 'smooth' }));
  caseNext?.addEventListener('click', () => caseTrack.scrollBy({ left: scrollByCard(), behavior: 'smooth' }));

  // Testimonials slider (auto + manual)
  const testiTrack = document.getElementById('testiTrack');
  const testiPrev = document.querySelector('#testimonials .slider-btn.prev');
  const testiNext = document.querySelector('#testimonials .slider-btn.next');
  let testiIndex = 0;
  const testiItems = [...testiTrack.children];
  const updateTestimonial = () => {
    testiTrack.style.transform = `translateX(-${testiIndex * 100}%)`;
    testiTrack.style.transition = 'transform 500ms cubic-bezier(.2,.7,.2,1)';
  };
  testiPrev?.addEventListener('click', () => { testiIndex = (testiIndex - 1 + testiItems.length) % testiItems.length; updateTestimonial(); });
  testiNext?.addEventListener('click', () => { testiIndex = (testiIndex + 1) % testiItems.length; updateTestimonial(); });
  let testiTimer = setInterval(() => { testiIndex = (testiIndex + 1) % testiItems.length; updateTestimonial(); }, 4000);
  testiTrack.addEventListener('mouseenter', () => clearInterval(testiTimer));
  testiTrack.addEventListener('mouseleave', () => { testiTimer = setInterval(() => { testiIndex = (testiIndex + 1) % testiItems.length; updateTestimonial(); }, 4000); });

  // Contact form validation
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');
  const fields = {
    name: { el: document.getElementById('name'), error: document.getElementById('error-name'), validate: (v) => v.trim().length >= 2 || 'Please enter your name.' },
    email: { el: document.getElementById('email'), error: document.getElementById('error-email'), validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email.' },
    message: { el: document.getElementById('message'), error: document.getElementById('error-message'), validate: (v) => v.trim().length >= 10 || 'Please write a few details (min 10 chars).' },
  };
  const updateValidity = () => {
    let allValid = true;
    Object.values(fields).forEach(({ el, error, validate }) => {
      const res = validate(el.value);
      if (res !== true) {
        error.textContent = res;
        allValid = false;
      } else {
        error.textContent = '';
      }
    });
    submitBtn.disabled = !allValid;
    return allValid;
  };
  Object.values(fields).forEach(({ el }) => {
    el.addEventListener('input', updateValidity);
    el.addEventListener('blur', updateValidity);
  });
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!updateValidity()) return;
    submitBtn.disabled = true;
    formStatus.textContent = 'Sending…';
    setTimeout(() => {
      form.reset();
      updateValidity();
      formStatus.textContent = 'Thanks! We will be in touch shortly.';
      submitBtn.disabled = false;
    }, 800);
  });

  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();