// FILE: js/modules/tunnel/input.js
import { THREE } from 'three';
import { TUNNEL, ZOOM } from '../config.js';
import { clamp } from '../utils.js';

export function setupTunnelInput({ canvas, cameraRig, panelsManager, camera }) {
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();

  let isPointerDown = false;
  let hasDragged = false;
  let pointerStartY = 0;
  let pointerStartX = 0;

  let isTouching = false;
  let touchStartY = 0;
  let initialPinchDistance = 0;
  let initialPinchZoom = 1;

  // Pointer move (Mouse Drag, Mouse Parallax & Raycasting)
  const onPointerMove = (e) => {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = -((e.clientY / window.innerHeight) * 2 - 1);

    cameraRig.mouse.targetX = normX;
    cameraRig.mouse.targetY = normY;

    if (isPointerDown) {
      const dy = pointerStartY - e.clientY;
      const dx = pointerStartX - e.clientX;

      if (Math.abs(dy) > 4 || Math.abs(dx) > 4) {
        hasDragged = true;
      }
      pointerStartY = e.clientY;
      pointerStartX = e.clientX;

      if (cameraRig.isInspecting) {
        window.dispatchEvent(new CustomEvent('kertaskeluh:inspect', { detail: { note: null } }));
      }
      cameraRig.addScroll(dy * 2.8);
      return;
    }

    pointerNdc.set(normX, normY);
    raycaster.setFromCamera(pointerNdc, camera);

    const meshes = panelsManager.panels.map((p) => p.mesh).filter((m) => m && m.visible);
    const intersects = raycaster.intersectObjects(meshes, false);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      panelsManager.setHoveredPanel(hitMesh.userData.index);
      canvas.style.cursor = 'pointer';
    } else {
      panelsManager.setHoveredPanel(-1);
      canvas.style.cursor = 'grab';
    }
  };

  const onPointerDown = (e) => {
    if (e.button !== 0) return; // Hanya klik kiri
    isPointerDown = true;
    hasDragged = false;
    pointerStartY = e.clientY;
    pointerStartX = e.clientX;
    canvas.style.cursor = 'grabbing';
  };

  const onPointerUp = () => {
    isPointerDown = false;
    canvas.style.cursor = 'grab';
  };

  const onPointerLeave = () => {
    isPointerDown = false;
    cameraRig.mouse.targetX = 0;
    cameraRig.mouse.targetY = 0;
    panelsManager.setHoveredPanel(-1);
    canvas.style.cursor = '';
  };

  // Wheel handling (Scroll maju/mundur & Zoom via Ctrl)
  const onWheel = (e) => {
    e.preventDefault();

    if (e.ctrlKey) {
      // Zoom FOV
      const factor = e.deltaY < 0 ? 1.08 : 0.92;
      cameraRig.zoomBy(factor, false);
    } else {
      // Scroll menyusuri terowongan
      if (cameraRig.isInspecting) {
        window.dispatchEvent(new CustomEvent('kertaskeluh:inspect', { detail: { note: null } }));
      }
      cameraRig.addScroll(e.deltaY);
    }
  };

  // Click handling (Inspeksi panel cerita)
  const onClick = (e) => {
    if (hasDragged) {
      hasDragged = false;
      return;
    }

    pointerNdc.set(
      (e.clientX / window.innerWidth) * 2 - 1,
      -((e.clientY / window.innerHeight) * 2 - 1)
    );
    raycaster.setFromCamera(pointerNdc, camera);

    const meshes = panelsManager.panels.map((p) => p.mesh).filter((m) => m && m.visible);
    const intersects = raycaster.intersectObjects(meshes, false);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      const hitIdx = hitMesh.userData.index;
      const panel = panelsManager.getPanel(hitIdx);

      if (cameraRig.isInspecting && cameraRig.inspectTarget === panel) {
        cameraRig.resetInspect();
        panelsManager.setInspectedPanel(-1);
        window.dispatchEvent(
          new CustomEvent('kertaskeluh:inspect', {
            detail: { panel: null, note: null, index: -1 }
          })
        );
      } else if (panel) {
        cameraRig.inspectPanel(panel);
        panelsManager.setInspectedPanel(hitIdx);
        window.dispatchEvent(
          new CustomEvent('kertaskeluh:inspect', {
            detail: { panel, note: panel.note, index: hitIdx }
          })
        );
      }
    } else if (cameraRig.isInspecting) {
      cameraRig.resetInspect();
      panelsManager.setInspectedPanel(-1);
      window.dispatchEvent(
        new CustomEvent('kertaskeluh:inspect', {
          detail: { panel: null, note: null, index: -1 }
        })
      );
    }
  };

  // Touch Handling (Mobile drag & pinch zoom)
  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      isTouching = true;
      touchStartY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      isTouching = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      initialPinchDistance = Math.hypot(dx, dy);
      initialPinchZoom = cameraRig.targetZoom;
    }
  };

  const onTouchMove = (e) => {
    if (isTouching && e.touches.length === 1) {
      const dy = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;
      cameraRig.addScroll(dy * 2.5);
    } else if (e.touches.length === 2 && initialPinchDistance > 0) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const factor = dist / initialPinchDistance;
      cameraRig.setZoom(initialPinchZoom * factor, false);
    }
  };

  const onTouchEnd = () => {
    isTouching = false;
    initialPinchDistance = 0;
  };

  // Keyboard navigation
  const onKeyDown = (e) => {
    const isInput = e.target.closest('input, textarea, [contenteditable="true"]');
    const isModalOpen = !document.querySelector('[data-js="modal-root"]').hidden;
    const isComposerOpen = !document.querySelector('[data-js="composer-panel"]').hidden;

    if (isInput || isModalOpen || isComposerOpen) return;

    if (e.key === 'Escape') {
      if (cameraRig.isInspecting) {
        e.preventDefault();
        cameraRig.resetInspect();
        panelsManager.setInspectedPanel(-1);
      }
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      cameraRig.resetInspect();
      cameraRig.targetProgress = clamp(cameraRig.targetProgress + TUNNEL.cardSpacing, 0, cameraRig.maxProgress);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      cameraRig.resetInspect();
      cameraRig.targetProgress = clamp(cameraRig.targetProgress - TUNNEL.cardSpacing, 0, cameraRig.maxProgress);
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      cameraRig.zoomBy(ZOOM.buttonFactor, true);
    } else if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      cameraRig.zoomBy(1 / ZOOM.buttonFactor, true);
    } else if (e.key === '0') {
      e.preventDefault();
      cameraRig.setZoom(ZOOM.initial, true);
    } else if (e.key === 'Home') {
      e.preventDefault();
      cameraRig.resetToStart(true);
    } else if (e.key === 'End') {
      e.preventDefault();
      cameraRig.resetInspect();
      cameraRig.targetProgress = cameraRig.maxProgress;
    }
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave);
  window.addEventListener('blur', onPointerLeave);
  window.addEventListener('wheel', onWheel, { passive: false });
  canvas.addEventListener('click', onClick);

  canvas.addEventListener('touchstart', onTouchStart, { passive: true });
  canvas.addEventListener('touchmove', onTouchMove, { passive: true });
  canvas.addEventListener('touchend', onTouchEnd);
  canvas.addEventListener('touchcancel', onTouchEnd);

  window.addEventListener('keydown', onKeyDown);
}
