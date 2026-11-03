// FILE: js/modules/zoom-controls.js
import { ZOOM, TUNNEL } from './config.js';
import { getCameraRig } from './tunnel/scene.js';
import { clamp, debounce } from './utils.js';

let btnOut = null;
let btnIn = null;
let btnReset = null;
let btnFit = null;
let btnFwd = null;
let btnBwd = null;

const debouncedUpdateReadout = debounce((zoom) => {
  if (btnReset) {
    btnReset.textContent = `${Math.round(zoom * 100)}%`;
  }
}, 300);

function updateButtons(zoom) {
  if (btnOut) {
    const isMin = zoom <= ZOOM.min + 0.01;
    btnOut.disabled = isMin;
    btnOut.classList.toggle('zoom__button--disabled', isMin);
  }

  if (btnIn) {
    const isMax = zoom >= ZOOM.max - 0.01;
    btnIn.disabled = isMax;
    btnIn.classList.toggle('zoom__button--disabled', isMax);
  }

  debouncedUpdateReadout(zoom);
}

export function initZoomControls() {
  btnOut = document.querySelector('[data-js="zoom-out"]');
  btnIn = document.querySelector('[data-js="zoom-in"]');
  btnReset = document.querySelector('[data-js="zoom-reset"]');
  btnFit = document.querySelector('[data-js="zoom-fit"]');
  btnFwd = document.querySelector('[data-js="tunnel-forward"]');
  btnBwd = document.querySelector('[data-js="tunnel-backward"]');

  const rig = getCameraRig();

  if (btnOut) {
    btnOut.addEventListener('click', () => {
      const r = getCameraRig();
      if (r) r.zoomBy(1 / ZOOM.buttonFactor, true);
    });
  }

  if (btnIn) {
    btnIn.addEventListener('click', () => {
      const r = getCameraRig();
      if (r) r.zoomBy(ZOOM.buttonFactor, true);
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      const r = getCameraRig();
      if (r) r.setZoom(ZOOM.initial, true);
    });
  }

  if (btnFit) {
    btnFit.addEventListener('click', () => {
      const r = getCameraRig();
      if (r) r.fitToStart(true);
    });
  }

  if (btnFwd) {
    btnFwd.addEventListener('click', () => {
      const r = getCameraRig();
      if (r) {
        r.resetInspect();
        window.dispatchEvent(new CustomEvent('kertaskeluh:inspect', { detail: { note: null } }));
        r.targetProgress = clamp(r.targetProgress + TUNNEL.cardSpacing, 0, r.maxProgress);
      }
    });
  }

  if (btnBwd) {
    btnBwd.addEventListener('click', () => {
      const r = getCameraRig();
      if (r) {
        r.resetInspect();
        window.dispatchEvent(new CustomEvent('kertaskeluh:inspect', { detail: { note: null } }));
        r.targetProgress = clamp(r.targetProgress - TUNNEL.cardSpacing, 0, r.maxProgress);
      }
    });
  }

  if (rig) {
    rig.onViewChange((state) => {
      updateButtons(state.zoom);
    });
    updateButtons(rig.zoom);
    if (btnReset) {
      btnReset.textContent = `${Math.round(rig.zoom * 100)}%`;
    }
  }
}
