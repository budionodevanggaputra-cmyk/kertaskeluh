// FILE: js/modules/nav.js
import { getCameraRig, resetInspection } from './tunnel/scene.js';
import { openComposer, closeComposer } from './composer.js';
import { openInfoModal, closeInfoModal } from './info.js';
import { openSupportModal, closeSupportModal } from './support.js';
import { closePauseModal } from './pause.js';
import { closePaymentModal } from './payment.js';
import { closeAuthModal, closeUserStoriesModal } from './auth.js';

let navHomeBtn = null;
let navAddBtn = null;
let navInfoBtn = null;
let navSupportBtn = null;

export function setNavActive(name) {
  if (navHomeBtn) {
    const isHome = name === 'home';
    navHomeBtn.classList.toggle('nav__item--active', isHome);
    if (isHome) {
      navHomeBtn.setAttribute('aria-current', 'page');
    } else {
      navHomeBtn.removeAttribute('aria-current');
    }
  }

  if (navAddBtn) {
    navAddBtn.classList.toggle('nav__item--active', name === 'add');
  }

  if (navInfoBtn) {
    navInfoBtn.classList.toggle('nav__item--active', name === 'info');
  }
}

export function initNav() {
  navHomeBtn = document.querySelector('[data-js="nav-home"]');
  navAddBtn = document.querySelector('[data-js="nav-add"]');
  navInfoBtn = document.querySelector('[data-js="nav-info"]');
  navSupportBtn = document.querySelector('[data-js="nav-support"]');

  if (navHomeBtn) {
    navHomeBtn.addEventListener('click', () => {
      closeComposer();
      closeInfoModal();
      closeSupportModal();
      closePauseModal();
      closePaymentModal();
      closeAuthModal();
      closeUserStoriesModal();
      resetInspection();

      const rig = getCameraRig();
      if (rig) rig.resetToStart(true);

      setNavActive('home');
    });
  }

  if (navAddBtn) {
    navAddBtn.addEventListener('click', () => {
      openComposer(navAddBtn);
      setNavActive('add');
    });
  }

  if (navInfoBtn) {
    navInfoBtn.addEventListener('click', () => {
      openInfoModal();
      setNavActive('info');
    });
  }

  if (navSupportBtn) {
    navSupportBtn.addEventListener('click', () => {
      openSupportModal();
    });
  }

  window.addEventListener('kertaskeluh:composerstate', (e) => {
    if (e.detail && e.detail.open) {
      setNavActive('add');
    } else {
      setNavActive('home');
    }
  });

  window.addEventListener('kertaskeluh:infostate', (e) => {
    if (e.detail && e.detail.open) {
      setNavActive('info');
    } else {
      setNavActive('home');
    }
  });
}
