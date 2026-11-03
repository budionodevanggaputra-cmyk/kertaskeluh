// FILE: js/modules/hero.js
import { getCameraRig } from './tunnel/scene.js';
import { openPauseModal } from './pause.js';

let heroElement = null;
let pauseLink = null;

export function initHero() {
  heroElement = document.querySelector('[data-js="hero-section"]');
  pauseLink = document.querySelector('[data-js="hero-pause-link"]');

  if (pauseLink) {
    pauseLink.addEventListener('click', (e) => {
      e.preventDefault();
      openPauseModal();
    });
  }

  const rig = getCameraRig();
  if (rig) {
    rig.onViewChange((state) => {
      if (!heroElement) return;
      const moved = state.progress > 0.3 || state.isInspecting || Math.abs(state.zoom - 1.0) > 0.15;
      heroElement.classList.toggle('hero--compact', moved);
    });
  }
}
