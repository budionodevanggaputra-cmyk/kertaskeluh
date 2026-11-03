// FILE: js/modules/tunnel/note-panels.js
import { THREE } from 'three';
import { TUNNEL } from '../config.js';
import {
  renderNoteToTexture,
  renderSpecialPanelTexture,
  createPlaceholderTexture
} from './note-texture.js';

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vViewDirection;

  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vViewDirection = normalize(cameraPosition - worldPosition.xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uOpacity;
  uniform float uGlossEnergy;
  uniform float uNarrowGloss;
  uniform float uGlossShift;
  uniform float uAccentRing;
  uniform vec3 uAccentColor;

  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vViewDirection;

  void main() {
    vec2 sampleUv = clamp(vUv, vec2(0.001), vec2(0.999));
    vec4 color = texture2D(uTexture, sampleUv);

    // Cincin aksen untuk catatan baru (pengganti note-card--fresh)
    if (uAccentRing > 0.01) {
      float borderDist = min(min(sampleUv.x, 1.0 - sampleUv.x), min(sampleUv.y, 1.0 - sampleUv.y));
      if (borderDist < 0.035) {
        color.rgb = mix(color.rgb, uAccentColor, uAccentRing * 0.95);
      }
    }

    color.a *= uOpacity;

    if (color.a <= 0.002) {
      discard;
    }

    gl_FragColor = color;
    #include <colorspace_fragment>
  }
`;

export class NotePanelsManager {
  constructor(scene) {
    this.scene = scene;
    this.panels = [];
    this.cardGeometry = new THREE.PlaneGeometry(1, 1);
    this.placeholderTexture = createPlaceholderTexture();
    this.activeTextures = new Map();
    this.hoveredPanelIndex = -1;
    this.inspectedPanelIndex = -1;
    const initialAccent = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() || '#F2B84B';
    this.accentColor = new THREE.Color(initialAccent);

    window.addEventListener('kertaskeluh:fontsloaded', () => {
      this.activeTextures.forEach((tex) => tex.dispose());
      this.activeTextures.clear();
      this.panels.forEach((p) => {
        if (p.note) {
          p.hasTexture = false;
        }
      });
    });
  }

  updateAccentColorFromTheme() {
    const val = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();
    if (val) {
      this.accentColor.set(val);
      this.panels.forEach((p) => {
        if (p.material && p.material.uniforms.uAccentColor) {
          p.material.uniforms.uAccentColor.value = this.accentColor;
        }
      });
    }
  }

  buildPanels(notes) {
    this.clear();

    const PANEL_W = 3.0;
    const PANEL_H = 4.0;

    if (!notes || notes.length === 0) {
      // Panel kosong di depan pintu masuk bila belum ada cerita
      const tex = renderSpecialPanelTexture(
        '',
        'Belum ada cerita di sini. Tidak apa-apa. Kamu boleh mulai kapan saja.',
        false
      );
      const panel = this.createPanelMesh({
        texture: tex,
        x: 0,
        y: 0,
        z: -8.0,
        rotY: 0,
        rotZ: -0.02,
        scaleX: PANEL_W,
        scaleY: PANEL_H,
        isSpecial: true,
        index: 0
      });
      this.panels.push(panel);
      this.scene.add(panel.mesh);
      return;
    }

    // Panel cerita berurutan di dinding terowongan (bergantian kiri dan kanan)
    notes.forEach((note, index) => {
      const side = index % 2 === 0 ? 'left' : 'right';
      const x = side === 'left' ? -TUNNEL.wallDistance : TUNNEL.wallDistance;
      const y = (((note.seed || index) % 100) / 100 - 0.5) * 1.5;
      const z = -1.8 - index * TUNNEL.cardSpacing;
      // Sedikit condong ke arah sumbu tengah terowongan agar mudah dibaca dari kejauhan
      const rotY = side === 'left' ? (Math.PI / 2 - 0.28) : (-Math.PI / 2 + 0.28);
      const rotZ = ((note.rotation || 0) * Math.PI) / 180;

      const panel = this.createPanelMesh({
        texture: this.placeholderTexture,
        x,
        y,
        z,
        rotY,
        rotZ,
        scaleX: PANEL_W,
        scaleY: PANEL_H,
        note,
        index
      });

      this.panels.push(panel);
      this.scene.add(panel.mesh);
    });

    // Panel penutup di ujung terdalam terowongan
    const endZ = -1.8 - notes.length * TUNNEL.cardSpacing;
    const endTex = renderSpecialPanelTexture(
      'Kertas Keluh',
      'Itu semua cerita untuk saat ini.',
      true
    );
    const endPanel = this.createPanelMesh({
      texture: endTex,
      x: 0,
      y: 0,
      z: endZ,
      rotY: 0,
      rotZ: 0,
      scaleX: PANEL_W,
      scaleY: PANEL_H,
      isSpecial: true,
      index: notes.length
    });
    this.panels.push(endPanel);
    this.scene.add(endPanel.mesh);
  }

  createPanelMesh(cfg) {
    const uniforms = {
      uTexture: { value: cfg.texture },
      uOpacity: { value: 1.0 },
      uGlossEnergy: { value: 0.18 },
      uNarrowGloss: { value: 0.08 },
      uGlossShift: { value: 0.5 },
      uAccentRing: { value: 0.0 },
      uAccentColor: { value: this.accentColor }
    };

    const material = new THREE.ShaderMaterial({
      transparent: true,
      toneMapped: false,
      depthWrite: true,
      depthTest: true,
      side: THREE.DoubleSide,
      uniforms,
      vertexShader,
      fragmentShader
    });

    const mesh = new THREE.Mesh(this.cardGeometry, material);
    mesh.position.set(cfg.x, cfg.y, cfg.z);
    mesh.rotation.set(0, cfg.rotY, cfg.rotZ);
    mesh.scale.set(cfg.scaleX, cfg.scaleY, 1);
    mesh.userData = {
      index: cfg.index,
      note: cfg.note,
      baseScaleX: cfg.scaleX,
      baseScaleY: cfg.scaleY,
      isSpecial: cfg.isSpecial || false,
      basePos: new THREE.Vector3(cfg.x, cfg.y, cfg.z),
      baseRot: new THREE.Euler(0, cfg.rotY, cfg.rotZ)
    };

    return {
      mesh,
      material,
      uniforms,
      note: cfg.note,
      index: cfg.index,
      hasTexture: cfg.isSpecial || false
    };
  }

  update(cameraZ) {
    const currentIdx = Math.max(0, Math.round((-cameraZ - 1.8) / TUNNEL.cardSpacing));
    const win = TUNNEL.textureWindow;

    this.panels.forEach((panel) => {
      // Jendela tekstur: alokasikan hanya untuk catatan yang berada dalam jendela kamera
      if (panel.note) {
        const inWindow = Math.abs(panel.index - currentIdx) <= win;

        if (inWindow && !panel.hasTexture) {
          const tex = renderNoteToTexture(panel.note);
          panel.uniforms.uTexture.value = tex;
          panel.hasTexture = true;
          this.activeTextures.set(panel.index, tex);
        } else if (!inWindow && panel.hasTexture) {
          const oldTex = this.activeTextures.get(panel.index);
          if (oldTex) {
            oldTex.dispose();
            this.activeTextures.delete(panel.index);
          }
          panel.uniforms.uTexture.value = this.placeholderTexture;
          panel.hasTexture = false;
        }
      }

      // Pudarkan panel hanya bila jarak ke kamera jauh (efek memudar di kejauhan)
      const dist = Math.abs(panel.mesh.position.z - cameraZ);
      // Panel yang sudah terlewati di belakang kamera memudar cepat agar tidak menghalangi
      const fadeNear = Math.min(1.0, Math.max(0.0, 1.0 - (panel.mesh.position.z - cameraZ) / 2.5));
      // Panel jauh memudar halus menjelang batas jarak pandang (fadeDistance)
      const fadeFar = Math.min(1.0, Math.max(0.0, (TUNNEL.fadeDistance - dist) / 14.0));
      const opacity = Math.min(fadeNear, fadeFar);

      panel.uniforms.uOpacity.value = opacity;
      panel.mesh.visible = opacity > 0.01;

      // Animasi skala hover halus
      const isHovered = this.hoveredPanelIndex === panel.index;
      const targetScaleMultiplier = isHovered ? 1.04 : 1.0;
      panel.mesh.scale.x += (panel.mesh.userData.baseScaleX * targetScaleMultiplier - panel.mesh.scale.x) * 0.15;
      panel.mesh.scale.y += (panel.mesh.userData.baseScaleY * targetScaleMultiplier - panel.mesh.scale.y) * 0.15;
    });
  }

  setHoveredPanel(index) {
    this.hoveredPanelIndex = index;
  }

  setInspectedPanel(index) {
    this.inspectedPanelIndex = index;
  }

  getPanel(index) {
    return this.panels[index] || null;
  }

  getPanelByNoteId(noteId) {
    return this.panels.find((p) => p.note && p.note.id === noteId) || null;
  }

  getPanelIndexByNoteId(noteId) {
    return this.panels.findIndex((p) => p.note && p.note.id === noteId);
  }

  triggerFreshRing(index, durationMs = 1500) {
    const panel = this.panels[index];
    if (!panel) return;

    panel.uniforms.uAccentRing.value = 1.0;
    setTimeout(() => {
      let val = 1.0;
      const fadeStep = () => {
        val -= 0.08;
        if (val <= 0) {
          panel.uniforms.uAccentRing.value = 0.0;
        } else {
          panel.uniforms.uAccentRing.value = val;
          requestAnimationFrame(fadeStep);
        }
      };
      fadeStep();
    }, durationMs);
  }

  clear() {
    this.activeTextures.forEach((tex) => tex.dispose());
    this.activeTextures.clear();
    this.panels.forEach((p) => {
      if (p.material) p.material.dispose();
      this.scene.remove(p.mesh);
    });
    this.panels = [];
    this.hoveredPanelIndex = -1;
    this.inspectedPanelIndex = -1;
  }
}
