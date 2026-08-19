// TISZTA VÍZ — shared site behavior (nav scroll state, reveal-on-scroll,
// desktop dropdowns, and mobile hamburger menu). Loaded on every page.

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Nav background on scroll ---- */
  const navEl = document.getElementById('nav');
  if (navEl) {
    const updateNav = () => navEl.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', updateNav);
    updateNav();
  }

  /* ---- Reveal on scroll ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.14 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---- Desktop dropdowns (hover on pointer devices, click/tap fallback) ---- */
  const dropdownItems = document.querySelectorAll('.has-dropdown');
  dropdownItems.forEach(item => {
    const btn = item.querySelector('.nav-link-btn');
    let hoverTimeout;

    item.addEventListener('mouseenter', () => {
      clearTimeout(hoverTimeout);
      dropdownItems.forEach(i => i.classList.remove('open'));
      item.classList.add('open');
    });
    item.addEventListener('mouseleave', () => {
      hoverTimeout = setTimeout(() => item.classList.remove('open'), 150);
    });

    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = item.classList.contains('open');
        dropdownItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-dropdown')) {
      dropdownItems.forEach(i => i.classList.remove('open'));
    }
  });

  /* ---- Mobile hamburger + slide-down panel ---- */
  const navToggle = document.querySelector('.nav-toggle');
  const mobilePanel = document.querySelector('.mobile-panel');

  if (navToggle && mobilePanel) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.classList.toggle('open');
      mobilePanel.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobilePanel.querySelectorAll('.mobile-parent').forEach(parent => {
      parent.addEventListener('click', () => {
        const submenu = parent.nextElementSibling;
        const isOpen = parent.classList.contains('open');
        mobilePanel.querySelectorAll('.mobile-parent').forEach(p => {
          p.classList.remove('open');
          if (p.nextElementSibling) p.nextElementSibling.classList.remove('open');
        });
        if (!isOpen) {
          parent.classList.add('open');
          if (submenu) submenu.classList.add('open');
        }
      });
    });

    // Close mobile panel when a direct link is tapped
    mobilePanel.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navToggle.classList.remove('open');
        mobilePanel.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- About page: highlight the active chapter in the sticky sub-nav ---- */
  const storyNav = document.getElementById('storyNav');
  if (storyNav) {
    const storyLinks = storyNav.querySelectorAll('a[data-story]');
    const storySections = Array.from(storyLinks)
      .map(link => document.getElementById(link.dataset.story))
      .filter(Boolean);

    if ('IntersectionObserver' in window && storySections.length) {
      const setActive = (id) => {
        storyLinks.forEach(link => link.classList.toggle('active', link.dataset.story === id));
      };
      const storyIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      }, { rootMargin: '-140px 0px -60% 0px', threshold: 0 });
      storySections.forEach(sec => storyIO.observe(sec));
    }
  }

  /* ---- Contact form (static demo — no backend wired up) ---- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Message sent';
      setTimeout(() => { btn.textContent = original; contactForm.reset(); }, 2200);
    });
  }

});
