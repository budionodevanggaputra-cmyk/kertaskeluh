// FILE: js/main.js
import { initNotes, getAllNotes, onNotesChange } from './modules/notes.js';
import { initTunnelScene, updateTunnelNotes } from './modules/tunnel/scene.js';
import { initZoomControls } from './modules/zoom-controls.js';
import { initEditor } from './modules/editor.js';
import { initUploader } from './modules/uploader.js';
import { initCare } from './modules/care.js';
import { initComposer, updateDraftValidity } from './modules/composer.js';
import { initNav } from './modules/nav.js';
import { initHero } from './modules/hero.js';
import { initAuth } from './modules/auth.js';
import { initInspector } from './modules/inspector.js';

function boot() {
  // 1. Inisialisasi data catatan
  initNotes();

  // 2. Inisialisasi autentikasi pengguna
  initAuth();

  // 3. Inisialisasi terowongan 3D (Three.js WebGL)
  initTunnelScene(getAllNotes());

  // Pantau pembaruan catatan untuk menyinkronkan panel terowongan
  onNotesChange((notes) => {
    updateTunnelNotes(notes);
  });

  // 4. Inisialisasi kontrol zoom & navigasi terowongan
  initZoomControls();

  // 5. Inisialisasi editor rich text
  initEditor(() => {
    updateDraftValidity();
  });

  // 6. Inisialisasi pengunggah fail
  initUploader(() => {
    updateDraftValidity();
  });

  // 7. Inisialisasi pesan peduli (care monitor)
  initCare();

  // 8. Inisialisasi komposer cerita
  initComposer();

  // 9. Inisialisasi navigasi
  initNav();

  // 10. Inisialisasi interaktivitas hero
  initHero();

  // 11. Inisialisasi inspektor catatan
  initInspector();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
