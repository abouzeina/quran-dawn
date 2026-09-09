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

  // 4. Subtle Reveal Animations on Scroll
  const revealElements = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('in-view'));
  }
});

