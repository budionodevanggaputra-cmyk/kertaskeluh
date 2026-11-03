// FILE: js/modules/tunnel/scene.js
import { THREE } from 'three';
import { TUNNEL } from '../config.js';
import { CameraRig } from './camera-rig.js';
import { NotePanelsManager } from './note-panels.js';
import { setupTunnelInput } from './input.js';
import { showFallbackList, updateA11yList } from './fallback-list.js';

let renderer = null;
let scene = null;
let camera = null;
let cameraRig = null;
let panelsManager = null;
let isRunning = false;
let animationFrameId = null;

function getFogColor() {
  const style = getComputedStyle(document.documentElement);
  const color = style.getPropertyValue('--color-overlay').trim() || style.getPropertyValue('--color-scene-fallback').trim() || '#0B1730';
  return new THREE.Color(color);
}

function updateThemeStyles() {
  if (!scene) return;
  const fogColor = getFogColor();
  if (scene.fog) {
    scene.fog.color.copy(fogColor);
  }
  if (panelsManager) {
    panelsManager.updateAccentColorFromTheme();
  }
}

export function getCameraRig() {
  return cameraRig;
}

export function flyToNote(index) {
  if (cameraRig) {
    cameraRig.flyToNote(index, true);
  }
  if (panelsManager) {
    panelsManager.triggerFreshRing(index, 2000);
    const panel = panelsManager.getPanel(index);
    if (panel && cameraRig) {
      cameraRig.inspectPanel(panel);
      panelsManager.setInspectedPanel(index);
      window.dispatchEvent(
        new CustomEvent('kertaskeluh:inspect', {
          detail: { panel, note: panel.note, index }
        })
      );
    }
  }
}

export function inspectNoteById(noteId) {
  if (!panelsManager || !cameraRig) return false;
  const panel = panelsManager.getPanelByNoteId(noteId);
  const idx = panelsManager.getPanelIndexByNoteId(noteId);
  if (panel && idx !== -1) {
    cameraRig.inspectPanel(panel);
    panelsManager.setInspectedPanel(idx);
    window.dispatchEvent(
      new CustomEvent('kertaskeluh:inspect', {
        detail: { panel, note: panel.note, index: idx }
      })
    );
    return true;
  }
  return false;
}

export function resetInspection() {
  if (cameraRig) cameraRig.resetInspect();
  if (panelsManager) panelsManager.setInspectedPanel(-1);
  window.dispatchEvent(
    new CustomEvent('kertaskeluh:inspect', {
      detail: { panel: null, note: null, index: -1 }
    })
  );
}

export function updateTunnelNotes(notes) {
  if (panelsManager) {
    panelsManager.buildPanels(notes);
  }
  if (cameraRig) {
    cameraRig.setMaxProgress(notes.length);
  }
  updateA11yList(notes);
}

export function initTunnelScene(initialNotes = []) {
  const canvas = document.querySelector('[data-js="tunnel-canvas"]');
  if (!canvas) return;

  // Cek ketersediaan WebGL
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
  } catch (err) {
    showFallbackList(initialNotes);
    return;
  }

  const initialW = canvas.clientWidth || window.innerWidth;
  const initialH = canvas.clientHeight || window.innerHeight;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, TUNNEL.maxDpr));
  renderer.setSize(initialW, initialH, false);
  renderer.setClearColor(0x000000, 0); // Latar transparan agar scene.jpg DOM terlihat
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(getFogColor(), 0.012);

  const aspect = initialW / (initialH || 1);
  camera = new THREE.PerspectiveCamera(TUNNEL.fovBase, aspect, 0.1, 150);
  camera.position.set(0, 0, TUNNEL.cameraZStart);

  cameraRig = new CameraRig(camera);
  cameraRig.setMaxProgress(initialNotes.length);

  panelsManager = new NotePanelsManager(scene);
  panelsManager.updateAccentColorFromTheme();
  panelsManager.buildPanels(initialNotes);

  updateA11yList(initialNotes);

  setupTunnelInput({
    canvas,
    cameraRig,
    panelsManager,
    camera
  });

  const handleResize = () => {
    if (!renderer || !camera || !canvas) return;
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    camera.aspect = w / (h || 1);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };

  window.addEventListener('resize', handleResize);
  requestAnimationFrame(handleResize);

  // Pantau pemuatan web font untuk merefresh tekstur tulisan tangan
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      window.dispatchEvent(new CustomEvent('kertaskeluh:fontsloaded'));
    });
  }

  // Pantau perubahan tema siang/malam
  const observer = new MutationObserver(() => {
    updateThemeStyles();
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  // Render Loop
  const tick = () => {
    if (!isRunning) return;

    cameraRig.update();
    panelsManager.update(camera.position.z);

    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(tick);
  };

  isRunning = true;
  tick();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    } else {
      if (!isRunning) {
        isRunning = true;
        tick();
      }
    }
  });

  window.addEventListener('kertaskeluh:notepublished', (e) => {
    const idx = (e.detail && e.detail.index) || 0;
    flyToNote(idx);
  });
}
