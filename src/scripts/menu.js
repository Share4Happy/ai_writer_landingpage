/**
 * NT AI Writer - Mobile Navigation & Smooth Scroll
 */

export function initNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const navDrawer = document.getElementById('nav-drawer');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link');

  if (!menuToggle || !navDrawer) return;

  function openMenu() {
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.classList.add('is-active');
    navDrawer.classList.add('is-open');
    if (navOverlay) navOverlay.classList.add('is-active');
    document.body.classList.add('no-scroll');
  }

  function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.classList.remove('is-active');
    navDrawer.classList.remove('is-open');
    if (navOverlay) navOverlay.classList.remove('is-active');
    document.body.classList.remove('no-scroll');
  }

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  // Đóng drawer khi nhấn phím Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDrawer.classList.contains('is-open')) {
      closeMenu();
      menuToggle.focus();
    }
  });

  // Tự động đóng menu khi bấm vào link và cuộn mượt mà
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#') && targetId.length > 1) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          closeMenu();
          targetEl.scrollIntoView({ behavior: 'smooth' });
          // Cập nhật URL hash mà không gây giật
          history.pushState(null, '', targetId);
        }
      } else {
        closeMenu();
      }
    });
  });
}
