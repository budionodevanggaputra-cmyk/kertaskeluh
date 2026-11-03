// FILE: js/modules/tunnel/camera-rig.js
import { THREE } from 'three';
import { TUNNEL, ZOOM, INSPECT } from '../config.js';
import { clamp, lerp, debounce } from '../utils.js';
import { saveView, loadView } from '../storage.js';

export class CameraRig {
  constructor(camera) {
    this.camera = camera;
    this.progress = 0;
    this.targetProgress = 0;
    this.velocity = 0;
    this.zoom = ZOOM.initial;
    this.targetZoom = ZOOM.initial;
    this.maxProgress = TUNNEL.cardSpacing * 2;

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.inspectTarget = null;
    this.isInspecting = false;

    this.tmpVec = new THREE.Vector3();
    this.tmpEuler = new THREE.Euler();
    this.tmpQuat = new THREE.Quaternion();

    this.viewChangeListeners = [];

    this.debouncedSave = debounce(() => {
      saveView({
        progress: Math.round(this.progress * 100) / 100,
        zoom: Math.round(this.zoom * 100) / 100
      });
    }, 300);

    // Muat persistensi bila ada
    const saved = loadView();
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (saved) {
      if (typeof saved.progress === 'number') {
        this.progress = saved.progress;
        this.targetProgress = saved.progress;
      }
      if (typeof saved.zoom === 'number') {
        this.zoom = clamp(saved.zoom, ZOOM.min, ZOOM.max);
        this.targetZoom = this.zoom;
      }
    } else if (!prefersReduced) {
      // Intro glide halus saat pertama kali masuk terowongan
      this.progress = -0.7;
      this.targetProgress = 0;
    }
  }

  onViewChange(fn) {
    if (typeof fn === 'function') {
      this.viewChangeListeners.push(fn);
    }
  }

  notifyChange() {
    const data = {
      progress: this.progress,
      maxProgress: this.maxProgress,
      zoom: this.zoom,
      isInspecting: this.isInspecting
    };
    this.viewChangeListeners.forEach((fn) => fn(data));
    this.debouncedSave();
  }

  setMaxProgress(notesCount) {
    this.maxProgress = Math.max(TUNNEL.cardSpacing * 2, (notesCount + 1) * TUNNEL.cardSpacing);
    this.targetProgress = clamp(this.targetProgress, 0, this.maxProgress);
  }

  addScroll(delta) {
    if (this.isInspecting) {
      this.resetInspect();
    }
    this.velocity += delta * TUNNEL.scrollSpeed;
  }

  setZoom(newZoom, animated = true) {
    this.targetZoom = clamp(newZoom, ZOOM.min, ZOOM.max);
    if (!animated) {
      this.zoom = this.targetZoom;
    }
  }

  zoomBy(factor, animated = true) {
    this.setZoom(this.targetZoom * factor, animated);
  }

  resetToStart(animated = true) {
    this.resetInspect();
    this.targetProgress = 0;
    this.targetZoom = ZOOM.initial;
    if (!animated) {
      this.progress = 0;
      this.zoom = ZOOM.initial;
      this.velocity = 0;
    }
  }

  fitToStart(animated = true) {
    this.resetInspect();
    this.targetProgress = 0;
    this.targetZoom = ZOOM.min; // Melebarkan FOV agar terlihat banyak
    if (!animated) {
      this.progress = 0;
      this.zoom = ZOOM.min;
      this.velocity = 0;
    }
  }

  flyToNote(index, animated = true) {
    this.resetInspect();
    const targetZ = -1.8 - index * TUNNEL.cardSpacing;
    const prog = TUNNEL.cameraZStart - targetZ - 3.5;
    this.targetProgress = clamp(prog, 0, this.maxProgress);
    if (!animated) {
      this.progress = this.targetProgress;
      this.velocity = 0;
    }
  }

  inspectPanel(panel) {
    this.isInspecting = true;
    this.inspectTarget = panel;
    if (panel && panel.mesh) {
      const cardProg = TUNNEL.cameraZStart - panel.mesh.position.z - 3.2;
      this.targetProgress = clamp(cardProg, 0, this.maxProgress);
    }
  }

  resetInspect() {
    this.isInspecting = false;
    this.inspectTarget = null;
  }

  update() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Update zoom (FOV)
    if (prefersReduced) {
      this.zoom = this.targetZoom;
    } else {
      this.zoom = lerp(this.zoom, this.targetZoom, 0.15);
    }
    this.camera.fov = TUNNEL.fovBase / this.zoom;
    this.camera.updateProjectionMatrix();

    if (this.isInspecting && this.inspectTarget) {
      const mesh = this.inspectTarget.mesh;
      const rotY = mesh.rotation.y;
      const nx = Math.sin(rotY);
      const nz = Math.cos(rotY);
      const inspectDist = (INSPECT && INSPECT.distance) || 4.2;

      const targetCamX = mesh.position.x + nx * inspectDist;
      const targetCamY = mesh.position.y;
      const targetCamZ = mesh.position.z + nz * inspectDist;

      if (prefersReduced) {
        this.camera.position.set(targetCamX, targetCamY, targetCamZ);
      } else {
        this.camera.position.lerp(this.tmpVec.set(targetCamX, targetCamY, targetCamZ), 0.14);
      }

      const lookTarget = new THREE.Vector3(mesh.position.x, mesh.position.y, mesh.position.z);
      const m = new THREE.Matrix4().lookAt(this.camera.position, lookTarget, new THREE.Vector3(0, 1, 0));
      this.tmpQuat.setFromRotationMatrix(m);

      if (prefersReduced) {
        this.camera.quaternion.copy(this.tmpQuat);
      } else {
        this.camera.quaternion.slerp(this.tmpQuat, 0.14);
      }

      this.notifyChange();
      return;
    }

    // Scroll progress physics
    if (prefersReduced) {
      this.progress = this.targetProgress;
      this.velocity = 0;
    } else {
      this.velocity *= TUNNEL.damping;
      this.targetProgress = clamp(this.targetProgress + this.velocity, 0, this.maxProgress);
      this.progress = lerp(this.progress, this.targetProgress, 0.12);
    }

    const currentCamZ = TUNNEL.cameraZStart - this.progress;

    // Mouse parallax
    if (prefersReduced) {
      this.mouse.x = 0;
      this.mouse.y = 0;
    } else {
      this.mouse.x = lerp(this.mouse.x, this.mouse.targetX, 0.08);
      this.mouse.y = lerp(this.mouse.y, this.mouse.targetY, 0.08);
    }

    const lookX = Math.sign(this.mouse.x) * Math.pow(Math.abs(this.mouse.x), 1.4);
    const targetRotY = -lookX * (Math.PI * 0.28);
    const targetPosX = -lookX * (TUNNEL.wallDistance * 0.35);
    const targetPosY = this.mouse.y * 0.6;

    this.camera.position.lerp(this.tmpVec.set(targetPosX, targetPosY, currentCamZ), 0.12);

    this.tmpQuat.setFromEuler(this.tmpEuler.set(this.mouse.y * 0.1, targetRotY, 0));
    this.camera.quaternion.slerp(this.tmpQuat, 0.1);

    this.notifyChange();
  }
}
