/**
 * Навигатор первокурсника СПбПУ — main.js
 * Команда Тепловики
 */

'use strict';

/* ============================================================
   1. БУРГЕР-МЕНЮ
   ============================================================ */
(function initBurger() {
  const burger   = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  if (!burger || !mobileNav) return;

  function openMenu() {
    mobileNav.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileNav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Закрывать при клике на ссылку внутри меню
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Закрывать при клике вне меню (оверлей)
  document.addEventListener('click', (e) => {
    if (mobileNav.classList.contains('open') &&
        !mobileNav.contains(e.target) &&
        !burger.contains(e.target)) {
      closeMenu();
    }
  });

  // Закрывать при нажатии Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeMenu();
      burger.focus();
    }
  });
})();


/* ============================================================
   2. ТЁМНАЯ ТЕМА
   ============================================================ */
(function initTheme() {
  const html = document.documentElement;

  // Выбрать тему по prefers-color-scheme (localStorage недоступен в iframe)
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.setAttribute('data-theme', 'dark');
  }

  // SVG иконки
  const moonSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  const sunSVG  = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

  function updateIcons(isDark) {
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.innerHTML = isDark ? sunSVG : moonSVG;
      btn.setAttribute('aria-label', isDark ? 'Включить светлую тему' : 'Включить тёмную тему');
    });
  }

  // Начальное состояние иконок
  updateIcons(html.getAttribute('data-theme') === 'dark');

  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = html.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      updateIcons(!isDark);
    });
  });
})();


/* ============================================================
   3. ПОИСК / ФИЛЬТР ИНСТИТУТОВ (секция СДО)
   ============================================================ */
(function initInstituteSearch() {
  const input = document.getElementById('lmsSearch');
  if (!input) return;

  const cards = document.querySelectorAll('.institute-card');
  const noResults = document.getElementById('lmsNoResults');

  function normalize(str) {
    return str.toLowerCase().trim();
  }

  input.addEventListener('input', () => {
    const query = normalize(input.value);
    let found = 0;

    cards.forEach(card => {
      const name  = normalize(card.dataset.name  || '');
      const abbr  = normalize(card.dataset.abbr  || '');
      const match = !query || name.includes(query) || abbr.includes(query);
      card.style.display = match ? '' : 'none';
      if (match) found++;
    });

    if (noResults) {
      noResults.style.display = found === 0 ? 'block' : 'none';
    }
  });

  // Кнопка очистки поиска (если есть)
  const clearBtn = document.getElementById('lmsSearchClear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      input.dispatchEvent(new Event('input'));
      input.focus();
    });
  }
})();


/* ============================================================
   4. FAQ — одиночный режим для <details>
   ============================================================ */
(function initFAQ() {
  const items = document.querySelectorAll('details.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        // Закрыть все остальные
        items.forEach(other => {
          if (other !== item && other.open) {
            other.open = false;
          }
        });
      }
    });
  });
})();


/* ============================================================
   5. АКТИВНЫЙ ПУНКТ НАВИГАЦИИ ПРИ СКРОЛЛЕ
   ============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
})();


/* ============================================================
   6. ПЛАВНАЯ ПРОКРУТКА (полифилл для Safari и старых браузеров)
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;

      window.scrollTo({ top, behavior: 'smooth' });

      // Обновить URL без перезагрузки
      history.pushState(null, '', `#${targetId}`);
    });
  });
})();


/* ============================================================
   7. АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ
   ============================================================ */
(function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.quick-card, .institute-card, .campus-card, .faq-item, .contact-card'
  );
  if (!revealElements.length) return;

  // Добавить начальное состояние
  revealElements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${(i % 4) * 0.07}s, transform 0.5s ease ${(i % 4) * 0.07}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));
})();


/* ============================================================
   8. STICKY HEADER — усиленная тень при скролле
   ============================================================ */
(function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    // Добавляем inline-style вместо класса, т.к. класс переопределит CSS
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 4px 20px rgba(0,0,0,.35)';
    } else {
      header.style.boxShadow = '';
    }
  }, { passive: true });
})();
