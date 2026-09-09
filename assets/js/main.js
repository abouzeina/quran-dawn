/**
 * QURAN DAWN — Main JavaScript
 * Pure Vanilla JS, accessible, performant, no dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Scroll Effect
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Mobile Navigation Drawer
  const menuToggle = document.querySelector('.menu-toggle');
  const navDrawer = document.querySelector('.mobile-nav-drawer');
  const navOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-footer a');

  if (menuToggle && navDrawer && navOverlay) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !navDrawer.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      navDrawer.classList.toggle('open', isOpen);
      navOverlay.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', () => toggleMenu());
    navOverlay.addEventListener('click', () => toggleMenu(false));

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  // 3. FAQ Accordion (Accessible & Smooth)
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const panelId = trigger.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);

      // Close all other panels for clean editorial focus
      faqTriggers.forEach((otherTrigger) => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          const otherPanelId = otherTrigger.getAttribute('aria-controls');
          const otherPanel = document.getElementById(otherPanelId);
          if (otherPanel) {
            otherPanel.style.maxHeight = null;
            otherPanel.classList.remove('open');
          }
        }
      });

      // Toggle current panel
      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        if (panel) {
          panel.style.maxHeight = null;
          panel.classList.remove('open');
        }
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        if (panel) {
          panel.classList.add('open');
          panel.style.maxHeight = `${panel.scrollHeight}px`;
        }
      }
    });

    // Keyboard navigation: Enter & Space handled natively on button
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const triggersArray = Array.from(faqTriggers);
        const currentIndex = triggersArray.indexOf(trigger);
        let nextIndex;
        if (e.key === 'ArrowDown') {
          nextIndex = (currentIndex + 1) % triggersArray.length;
        } else {
          nextIndex = (currentIndex - 1 + triggersArray.length) % triggersArray.length;
        }
        triggersArray[nextIndex].focus();
      }
    });
  });

  // 4. Smooth Editorial Reveal Animations on Scroll
  const autoRevealSelectors = [
    '.fade-up',
    '.section-header',
    '.page-header',
    '.about-heading',
    '.contact-heading',
    '.courses-header-wrapper',
    '.features-header-grid',
    '.saas-card',
    '.course-card-v2',
    '.pricing-card-v2',
    '.faq-item',
    '.why-us-card',
    '.about-story-grid > div',
    '.about-values article',
    '.about-arches article',
    '.about-programs .about-program',
    '.about-belief .container',
    '.contact-information',
    '.contact-form-panel',
    '.journal-card',
    '.pre-footer-content'
  ];

  const elementsToReveal = new Set();
  autoRevealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      // Exclude header and elements inside navigation
      if (!el.closest('.site-header') && !el.closest('.mobile-nav-drawer') && !el.closest('.site-preloader')) {
        elementsToReveal.add(el);
      }
    });
  });

  const allRevealList = Array.from(elementsToReveal);

  // Group sibling cards to give them delightful staggered delays
  const parentGroups = new Map();
  allRevealList.forEach(el => {
    el.classList.add('fade-up');
    const parent = el.parentElement;
    if (parent) {
      if (!parentGroups.has(parent)) {
        parentGroups.set(parent, []);
      }
      parentGroups.get(parent).push(el);
    }
  });

  parentGroups.forEach(siblings => {
    if (siblings.length > 1) {
      siblings.forEach((child, idx) => {
        if (!child.style.transitionDelay) {
          child.style.transitionDelay = `${(idx % 4) * 0.12}s`;
        }
      });
    }
  });

  if ('IntersectionObserver' in window && allRevealList.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    });

    allRevealList.forEach(el => {
      // If element is already in the viewport on initial load, reveal immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('in-view');
      } else {
        revealObserver.observe(el);
      }
    });
  } else {
    allRevealList.forEach(el => el.classList.add('in-view'));
  }
  // Journal: enhance the existing HTML list; no article content is generated.
  const articleList = document.querySelector('#article-list');
  if (articleList) {
    const cards = [...articleList.querySelectorAll('.journal-card')];
    const filters = document.querySelector('.journal-filters');
    const pagination = document.querySelector('.journal-pagination');
    const status = document.querySelector('.journal-results');
    const pageButtons = [...pagination.querySelectorAll('[data-page]')];
    let category = 'all';
    let page = 1;
    const pageSize = 6;

    const renderList = () => {
      const matches = cards.filter(card => category === 'all' || card.dataset.category === category);
      const totalPages = Math.max(1, Math.ceil(matches.length / pageSize));
      page = Math.min(page, totalPages);
      cards.forEach(card => { card.hidden = true; });
      matches.slice((page - 1) * pageSize, page * pageSize).forEach(card => { card.hidden = false; });
      status.textContent = `Showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, matches.length)} of ${matches.length} insights`;
      pageButtons.forEach(button => {
        const value = button.dataset.page;
        const number = Number(value);
        button.hidden = Number.isFinite(number) && number > totalPages;
        button.disabled = (value === 'previous' && page === 1) || (value === 'next' && page === totalPages);
        if (number === page) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
      });
      pagination.hidden = totalPages < 2;
    };
    filters.hidden = false;
    filters.addEventListener('click', event => {
      const button = event.target.closest('[data-filter]');
      if (!button) return;
      category = button.dataset.filter;
      page = 1;
      filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      renderList();
    });
    pagination.addEventListener('click', event => {
      const button = event.target.closest('[data-page]');
      if (!button || button.disabled) return;
      const value = button.dataset.page;
      page = value === 'next' ? page + 1 : value === 'previous' ? page - 1 : Number(value);
      renderList();
      document.querySelector('#latest-title').focus({ preventScroll: true });
      document.querySelector('#latest').scrollIntoView({ block: 'start' });
    });
    renderList();
  }

  // Static article fragments work without JS; JS adds metadata and sharing.
  const entries = document.querySelector('.single-entries');
  if (entries) {
    const updateArticle = () => {
      let target;
      try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { target = null; }
      const article = target?.closest('.article-entry') || entries.querySelector('.article-default');
      const title = article.querySelector('h1').textContent;
      const related = [...document.querySelectorAll('.journal-related-grid .journal-card')];
      let visibleRelated = 0;
      related.forEach(card => {
        card.hidden = card.dataset.category === article.id || visibleRelated >= 3;
        if (!card.hidden) visibleRelated += 1;
      });
      document.title = `${title} — Quran Dawn`;
      document.querySelector('meta[property="og:title"]').content = document.title;
      const excerpt = article.querySelector('.section-desc').textContent;
      document.querySelector('meta[name="description"]').content = excerpt;
      document.querySelector('meta[property="og:description"]').content = excerpt;
      const url = new URL(location.href);
      url.hash = article.id === 'routine' ? '' : article.id;
      article.dataset.shareUrl = url.href;
      article.querySelectorAll('[data-share]').forEach(link => {
        const destination = new URL(link.href);
        destination.search = '';
        destination.searchParams.set(link.dataset.share === 'facebook' ? 'u' : 'url', url.href);
        if (link.dataset.share === 'x') destination.searchParams.set('text', title);
        link.href = destination.href;
      });
      article.querySelectorAll('.article-toc a').forEach(link => {
        if (link.hash === location.hash) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };
    window.addEventListener('hashchange', updateArticle);
    updateArticle();
    entries.addEventListener('click', async event => {
      const button = event.target.closest('[data-copy-link]');
      if (!button) return;
      const article = button.closest('.article-entry');
      const status = article.querySelector('.share-status');
      const url = article.dataset.shareUrl;
      try {
        await navigator.clipboard.writeText(url);
        status.textContent = 'Link copied. Ready to share.';
      } catch {
        status.textContent = `Copy this link from your address bar: ${url}`;
      }
    });
  }
});
