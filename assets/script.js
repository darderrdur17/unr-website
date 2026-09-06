// ==========================================================================
// UNR Website — shared interactivity
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initI18n();
  initHeaderScrollState();
  initHeroEntrance();
  initPageHero();
  initRevealOnScroll();
  initParallax();
  initStatCounters();
  initCountdowns();
  initFeeTabs();
  initProgramFilter();
  initNewsFilter();
  initStepperProgress();
  initChecklist();
  initAccordion();
  initTestimonials();
  initMobileNav();
  initLightbox();
  initContactForm();
  initPmbFinder();
  initPmbLogin();
  initPmbApply();
  initBackToTop();
  initYear();
});

function getNested(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

function wrapHeroWords(text) {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => `<span class="hero-word">${word}</span>`)
    .join(' ');
}

function applyLang(lang) {
  const dict = (window.UNR_I18N && window.UNR_I18N[lang]) || window.UNR_I18N.id;
  document.documentElement.lang = lang === 'en' ? 'en' : 'id';
  try { localStorage.setItem('unr-lang', lang); } catch (_) {}

  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    btn.setAttribute('aria-pressed', btn.getAttribute('data-lang') === lang ? 'true' : 'false');
  });

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const value = getNested(dict, el.getAttribute('data-i18n'));
    if (value != null) el.textContent = value;
  });

  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const value = getNested(dict, el.getAttribute('data-i18n-html'));
    if (value != null) el.innerHTML = value;
  });

  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const value = getNested(dict, el.getAttribute('data-i18n-aria'));
    if (value != null) el.setAttribute('aria-label', value);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const value = getNested(dict, el.getAttribute('data-i18n-placeholder'));
    if (value != null) el.setAttribute('placeholder', value);
  });

  document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
    const value = getNested(dict, el.getAttribute('data-i18n-alt'));
    if (value != null) el.setAttribute('alt', value);
  });

  const page = document.body.getAttribute('data-page');
  const titleKey = page ? `meta.${page}Title` : 'meta.homeTitle';
  const title = getNested(dict, titleKey);
  if (title) document.title = title;

  const heroTitle = document.querySelector('[data-hero-title]');
  if (heroTitle && dict.hero) {
    heroTitle.innerHTML = `${wrapHeroWords(dict.hero.line1)}<br>${wrapHeroWords(dict.hero.line2)}`;
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.classList.remove('is-ready');
      requestAnimationFrame(() => initHeroEntrance());
    }
  }

  document.querySelectorAll('.timer-unit .u').forEach((el) => {
    const unit = el.closest('[data-unit]')?.getAttribute('data-unit');
    const map = { days: 'count.d', hours: 'count.h', minutes: 'count.m', seconds: 'count.s' };
    const value = unit ? getNested(dict, map[unit]) : null;
    if (value) el.textContent = value;
  });
}

function initI18n() {
  if (!window.UNR_I18N) return;
  let lang = 'id';
  try { lang = localStorage.getItem('unr-lang') || 'id'; } catch (_) {}
  applyLang(lang);
  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => applyLang(btn.getAttribute('data-lang')));
  });
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initHeaderScrollState() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initHeroEntrance() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const words = hero.querySelectorAll('.hero-word');
  words.forEach((w, i) => {
    w.style.animationDelay = prefersReducedMotion() ? '0s' : `${0.07 * i}s`;
  });
  requestAnimationFrame(() => hero.classList.add('is-ready'));
}

function initPageHero() {
  const hero = document.querySelector('.page-hero');
  if (!hero) return;
  requestAnimationFrame(() => hero.classList.add('is-ready'));
}

function initParallax() {
  if (prefersReducedMotion()) return;
  const layers = document.querySelectorAll('[data-parallax]');
  if (!layers.length) return;
  const onScroll = () => {
    const y = window.scrollY;
    layers.forEach((el) => {
      const factor = Number(el.getAttribute('data-parallax') || 0.12);
      el.style.transform = `translate3d(0, ${y * factor}px, 0)`;
    });
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initRevealOnScroll() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const groups = new Map();
  items.forEach((el) => {
    if (el.hasAttribute('data-reveal-delay')) return;
    const parent = el.parentElement;
    if (!parent) return;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  });
  groups.forEach((els) => {
    if (els.length < 2) return;
    els.forEach((el, i) => el.setAttribute('data-reveal-delay', String(i * 90)));
  });

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = Number(entry.target.getAttribute('data-reveal-delay') || 0);
        entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
  );

  items.forEach((el) => io.observe(el));
}

function initStatCounters() {
  const counters = document.querySelectorAll('[data-count-to]');
  if (!counters.length) return;

  const formatCount = (value) => String(value);

  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-count-to'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    if (prefersReducedMotion()) {
      el.textContent = formatCount(target) + suffix;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatCount(Math.round(eased * target)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.45 }
    );
    counters.forEach((c) => io.observe(c));
  } else {
    counters.forEach(animate);
  }
}

function initCountdowns() {
  const timers = document.querySelectorAll('.countdown-timer');
  if (!timers.length) return;

  timers.forEach((timer) => {
    const targetDate = new Date(timer.getAttribute('data-target'));
    const dayEl = timer.querySelector('[data-unit="days"] .n');
    const hourEl = timer.querySelector('[data-unit="hours"] .n');
    const minEl = timer.querySelector('[data-unit="minutes"] .n');
    const secEl = timer.querySelector('[data-unit="seconds"] .n');
    const endedNote = timer.parentElement?.querySelector('[data-countdown-ended]');

    const tick = () => {
      const now = new Date();
      let diff = Math.max(0, targetDate - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= days * (1000 * 60 * 60 * 24);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * (1000 * 60 * 60);
      const minutes = Math.floor(diff / (1000 * 60));
      diff -= minutes * (1000 * 60);
      const seconds = Math.floor(diff / 1000);

      if (dayEl) dayEl.textContent = String(days).padStart(2, '0');
      if (hourEl) hourEl.textContent = String(hours).padStart(2, '0');
      if (minEl) minEl.textContent = String(minutes).padStart(2, '0');
      if (secEl) secEl.textContent = String(seconds).padStart(2, '0');

      if (endedNote && targetDate - now <= 0) {
        endedNote.hidden = false;
      }
    };
    tick();
    setInterval(tick, 1000);
  });
}

function initFeeTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  if (!tabButtons.length) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.tab-row').parentElement;
      const target = btn.getAttribute('data-tab-target');

      group.querySelectorAll('.tab-btn').forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      group.querySelectorAll('.fee-table').forEach((table) => {
        table.classList.toggle('active', table.id === target);
      });
    });
  });
}

function initProgramFilter() {
  const chips = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('[data-program]');
  if (!chips.length || !cards.length) return;

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const value = chip.getAttribute('data-filter');
      chips.forEach((c) => {
        c.classList.toggle('active', c === chip);
        c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
      });
      cards.forEach((card, i) => {
        const match = value === 'all' || card.getAttribute('data-program') === value;
        card.style.display = match ? '' : 'none';
        if (match && !prefersReducedMotion()) {
          card.classList.remove('is-visible');
          requestAnimationFrame(() => {
            card.style.transitionDelay = `${i * 40}ms`;
            card.classList.add('is-visible');
          });
        }
      });
    });
  });
}

function initStepperProgress() {
  const steps = document.querySelectorAll('.step');
  steps.forEach((step, index) => {
    step.addEventListener('click', () => {
      steps.forEach((s, i) => s.classList.toggle('done', i <= index));
    });
    step.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        step.click();
      }
    });
  });
}

function initChecklist() {
  const items = document.querySelectorAll('.checklist li');
  items.forEach((item) => {
    const checkbox = item.querySelector('input');
    if (!checkbox) return;
    const sync = () => item.classList.toggle('checked', checkbox.checked);
    checkbox.addEventListener('change', sync);
    item.addEventListener('click', (e) => {
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
        sync();
      }
    });
  });
}

function initAccordion() {
  const triggers = document.querySelectorAll('.accordion-trigger');
  triggers.forEach((trigger) => {
    trigger.setAttribute('aria-expanded', trigger.closest('.accordion-item')?.classList.contains('open') ? 'true' : 'false');
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const panel = item.querySelector('.accordion-panel');
      const isOpen = item.classList.contains('open');

      item.parentElement.querySelectorAll('.accordion-item.open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.accordion-panel').style.maxHeight = null;
          openItem.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : null;
    });
  });

  document.querySelectorAll('.accordion-item.open .accordion-panel').forEach((panel) => {
    panel.style.maxHeight = panel.scrollHeight + 'px';
  });
}

function initTestimonials() {
  const slider = document.querySelector('[data-slider]');
  if (!slider) return;
  const track = slider.querySelector('[data-slider-track]');
  const slides = [...slider.querySelectorAll('[data-slide]')];
  const prev = slider.querySelector('[data-slider-prev]');
  const next = slider.querySelector('[data-slider-next]');
  const dotsWrap = slider.querySelector('[data-slider-dots]');
  if (!track || slides.length < 2) return;

  let index = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Testimoni ${i + 1}`);
    dot.addEventListener('click', () => go(i));
    dotsWrap?.appendChild(dot);
  });

  const dots = [...(dotsWrap?.children || [])];

  const go = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  };

  const play = () => {
    stop();
    if (prefersReducedMotion()) return;
    timer = setInterval(() => go(index + 1), 6500);
  };
  const stop = () => clearInterval(timer);

  prev?.addEventListener('click', () => {
    go(index - 1);
    play();
  });
  next?.addEventListener('click', () => {
    go(index + 1);
    play();
  });
  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', play);
  play();
}

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const overlay = document.querySelector('.nav-overlay');
  if (!toggle || !links) return;

  const setOpen = (open) => {
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    const dict = (window.UNR_I18N && window.UNR_I18N[document.documentElement.lang]) || (window.UNR_I18N && window.UNR_I18N.id);
    const label = dict ? (open ? dict.cta.close : dict.cta.menu) : (open ? 'Tutup menu' : 'Buka menu');
    toggle.setAttribute('aria-label', label);
  };

  toggle.addEventListener('click', () => {
    setOpen(!document.body.classList.contains('nav-open'));
  });
  overlay?.addEventListener('click', () => setOpen(false));
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

function initNewsFilter() {
  const chips = document.querySelectorAll('[data-news-filter]');
  const cards = document.querySelectorAll('[data-news]');
  if (!chips.length || !cards.length) return;
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const value = chip.getAttribute('data-news-filter');
      chips.forEach((c) => {
        c.classList.toggle('active', c === chip);
        c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
      });
      cards.forEach((card) => {
        const match = value === 'all' || card.getAttribute('data-news') === value;
        card.style.display = match ? '' : 'none';
      });
    });
  });
}

function initLightbox() {
  const triggers = document.querySelectorAll('[data-lightbox]');
  if (!triggers.length) return;
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('hidden', '');
  overlay.innerHTML = '<button type="button" class="lightbox-close" aria-label="Close">×</button><img alt="">';
  document.body.appendChild(overlay);
  const img = overlay.querySelector('img');
  const close = () => {
    overlay.classList.remove('is-open');
    setTimeout(() => overlay.setAttribute('hidden', ''), 280);
  };
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.classList.contains('lightbox-close')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
  triggers.forEach((el) => {
    el.addEventListener('click', () => {
      img.src = el.getAttribute('data-lightbox') || el.getAttribute('src');
      img.alt = el.getAttribute('alt') || '';
      overlay.removeAttribute('hidden');
      requestAnimationFrame(() => overlay.classList.add('is-open'));
    });
  });
}

function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  const onScroll = () => {
    btn.classList.toggle('is-visible', window.scrollY > 520);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });
}

function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = (form.querySelector('[name="name"]')?.value || '').trim();
    const email = (form.querySelector('[name="email"]')?.value || '').trim();
    const topic = form.querySelector('[name="topic"]')?.value || '';
    const message = (form.querySelector('[name="message"]')?.value || '').trim();
    const subject = encodeURIComponent(`[UNR] ${topic} — ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`);
    window.location.href = `mailto:info@unr.ac.id?subject=${subject}&body=${body}`;
    const status = form.querySelector('[data-form-status]');
    if (status) status.hidden = false;
  });
}

function pmbDict() {
  const lang = document.documentElement.lang === 'en' ? 'en' : 'id';
  return (window.UNR_I18N && window.UNR_I18N[lang]) || window.UNR_I18N?.id;
}

function initPmbFinder() {
  const form = document.querySelector('[data-pmb-finder]');
  const tracks = document.querySelectorAll('.pmb-track');
  const status = document.querySelector('[data-pmb-status]');
  if (!form || !tracks.length) return;

  const syncProgramOptions = () => {
    const level = form.level.value;
    [...form.program.options].forEach((option) => {
      if (!option.value) {
        option.hidden = false;
        return;
      }
      const optionLevel = option.getAttribute('data-level');
      option.hidden = Boolean(level && optionLevel && optionLevel !== level);
    });
    const selected = form.program.selectedOptions[0];
    if (selected?.hidden) form.program.value = '';
  };

  const applyFilter = (scroll = true) => {
    const level = form.level.value;
    const program = form.program.value;
    const system = form.system.value;
    let visible = 0;

    tracks.forEach((track) => {
      const levels = (track.getAttribute('data-level') || '').split(',');
      const programs = (track.getAttribute('data-program') || '').split(',');
      const systems = (track.getAttribute('data-system') || '').split(',');
      const matchLevel = !level || levels.includes(level);
      const matchProgram = !program || programs.includes(program);
      const matchSystem = !system || systems.includes(system);
      const match = matchLevel && matchProgram && matchSystem;
      track.hidden = !match;
      if (match) visible += 1;
    });

    if (status) {
      const dict = pmbDict();
      const found = getNested(dict, 'pmb.found') || 'Jalur ditemukan';
      const none = getNested(dict, 'pmb.none') || 'Tidak ada jalur yang cocok. Ubah filter.';
      status.hidden = false;
      status.textContent = visible ? `${visible} ${found}` : none;
    }

    if (scroll) {
      document.getElementById('jalur')?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  };

  form.level.addEventListener('change', syncProgramOptions);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    applyFilter(true);
  });

  document.querySelectorAll('[data-pmb-show-tracks]').forEach((btn) => {
    btn.addEventListener('click', () => {
      form.level.value = btn.getAttribute('data-pmb-show-tracks') || '';
      form.program.value = '';
      form.system.value = '';
      syncProgramOptions();
      applyFilter(true);
    });
  });

  syncProgramOptions();
}

function initPmbLogin() {
  const form = document.querySelector('[data-pmb-login]');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = form.querySelector('[data-pmb-login-status]');
    const id = (form.applicantId?.value || '').trim();
    const pin = (form.pin?.value || '').trim();
    if (!status) return;
    const dict = pmbDict();
    status.hidden = false;
    status.textContent = id && pin
      ? (getNested(dict, 'pmb.loginOk') || 'Prototype login succeeded.')
      : (getNested(dict, 'pmb.loginNeed') || 'Enter Applicant ID and PIN.');
  });
}

function initPmbApply() {
  const status = document.querySelector('[data-pmb-apply-status]');
  const buttons = document.querySelectorAll('[data-pmb-apply]');
  if (!status || !buttons.length) return;
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const track = btn.closest('.pmb-track');
      const title = track?.querySelector('h3')?.textContent?.trim() || '';
      const system = track?.querySelector('.pmb-meta')?.textContent?.trim() || '';
      const dict = pmbDict();
      const prefix = getNested(dict, 'pmb.applyOk') || 'Prototype: selected';
      status.hidden = false;
      status.textContent = `${prefix} ${title} — ${system}.`;
      status.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
    });
  });
}

function initYear() {
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}
