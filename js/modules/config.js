// FILE: js/modules/config.js
export const ZOOM = {
  min: 0.5,
  max: 2.0,
  initial: 1.0,
  buttonFactor: 1.2
};

export const TUNNEL = {
  cardSpacing: 3.8,
  wallDistance: 2.8,
  textureWindow: 12,
  maxDpr: 2,
  fovBase: 55,
  scrollSpeed: 0.008,
  keyStep: 1.5,
  damping: 0.92,
  cameraZStart: 2.2,
  fadeDistance: 50.0
};

export const LIMITS = {
  maxChars: 500,
  maxFileSize: 2 * 1024 * 1024 // 2 MB
};

export const BREATHING = {
  inhaleMs: 4000,
  holdMs: 4000,
  exhaleMs: 6000,
  cycles: 5
};

export const CARE_KEYWORDS = [
  'bunuh diri',
  'mengakhiri hidup',
  'ingin mati',
  'menyakiti diri',
  'self harm'
];

// Periksa ulang kontak ini sebelum rilis; layanan dapat berubah.
export const SUPPORT = {
  serviceName: 'Healing119 (Kementerian Kesehatan RI)',
  phoneText: 'Hubungi 119, lalu pilih ekstensi 8',
  telHref: 'tel:119',
  siteLabel: 'healing119.id',
  siteHref: 'https://healing119.id',
  emergencyText: 'Dalam keadaan darurat medis, hubungi 119.'
};

export const AUTH = {
  minNameChars: 2,
  maxNameChars: 24
};

export const INSPECT = {
  distance: 4.2
};

export const SIMULATE_FAILURE_RATE = 0;
