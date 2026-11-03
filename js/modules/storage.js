// FILE: js/modules/storage.js
import { showToast } from './toast.js';

const NOTES_KEY = 'kertaskeluh:notes:v1';
const VIEW_KEY = 'kertaskeluh:view:v1';
const DRAFT_KEY = 'kertaskeluh:draft:v1';
const AUTH_KEY = 'kertaskeluh:auth:v1';
const USERS_KEY = 'kertaskeluh:users:v1';

export const DEFAULT_NOTES = [
  {
    id: 'starter-1',
    html: '<p>Hari ini rasanya berat sekali di kantor. Tapi pas pulang, ada kucing liar nyamperin dan ngusel-ngusel kaki. Hal kecil, tapi bikin napas rasanya lebih lega.</p>',
    image: null,
    color: 'butter',
    rotation: -1.8,
    seed: 101,
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    paid: true,
    authorId: 'starter',
    authorName: 'Kertas Keluh'
  },
  {
    id: 'starter-2',
    html: '<p>Kadang capek pura-pura <strong>baik-baik saja</strong> di depan semua orang. Di sini aku cuma mau bilang: aku lelah, dan itu manusiawi.</p>',
    image: null,
    color: 'sky',
    rotation: 2.1,
    seed: 202,
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    paid: true,
    authorId: 'starter',
    authorName: 'Kertas Keluh'
  },
  {
    id: 'starter-3',
    html: '<p>Semoga keputusan besar yang kuambil kemarin bukan sebuah kesalahan. <em>Tolong kuatkan aku</em> menjalani setiap harinya.</p>',
    image: null,
    color: 'rose',
    rotation: -1.2,
    seed: 303,
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    paid: true,
    authorId: 'starter',
    authorName: 'Kertas Keluh'
  },
  {
    id: 'starter-4',
    html: '<p>Terima kasih untuk diriku yang sudah bertahan sejauh ini, meski sering merasa ingin menyerah di tengah jalan.</p>',
    image: null,
    color: 'sage',
    rotation: 1.5,
    seed: 404,
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    paid: true,
    authorId: 'starter',
    authorName: 'Kertas Keluh'
  },
  {
    id: 'starter-5',
    html: '<p>Ternyata mengikhlaskan hal yang paling kita inginkan itu butuh keberanian yang luar biasa. <em>Pelan-pelan ya diriku.</em></p>',
    image: null,
    color: 'lilac',
    rotation: -2.4,
    seed: 505,
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    paid: true,
    authorId: 'starter',
    authorName: 'Kertas Keluh'
  },
  {
    id: 'starter-6',
    html: '<p>Jam 2 pagi dan pikiran masih berisik. Mengingat hal-hal yang sudah lewat dan tak bisa kuubah lagi. Semoga besok pagi ada secercah tenang.</p>',
    image: null,
    color: 'butter',
    rotation: 1.7,
    seed: 606,
    createdAt: Date.now() - 1000 * 60 * 60 * 72,
    paid: true,
    authorId: 'starter',
    authorName: 'Kertas Keluh'
  },
  {
    id: 'starter-7',
    html: '<p>Sudah setahun sejak kepergian Ibu. Rumah ini masih terasa terlalu sepi. Setiap sudut punya kenangan yang bikin rindu menyesak.</p>',
    image: null,
    color: 'sky',
    rotation: -1.9,
    seed: 707,
    createdAt: Date.now() - 1000 * 60 * 60 * 96,
    paid: true,
    authorId: 'starter',
    authorName: 'Kertas Keluh'
  },
  {
    id: 'starter-8',
    html: '<p>Ditolak lagi di wawancara kerja yang kelima. Kecewa iya, tapi besok harus bangun pagi dan kirim lamaran lagi. <strong>Jangan menyerah.</strong></p>',
    image: null,
    color: 'rose',
    rotation: 2.3,
    seed: 808,
    createdAt: Date.now() - 1000 * 60 * 60 * 120,
    paid: true,
    authorId: 'starter',
    authorName: 'Kertas Keluh'
  },
  {
    id: 'starter-9',
    html: '<p>Akhirnya berani bilang "tidak" untuk hal yang merusak batasan diriku. Rasanya cemas campur <em>lega luar biasa</em>.</p>',
    image: null,
    color: 'sage',
    rotation: -1.5,
    seed: 909,
    createdAt: Date.now() - 1000 * 60 * 60 * 144,
    paid: true,
    authorId: 'starter',
    authorName: 'Kertas Keluh'
  },
  {
    id: 'starter-10',
    html: '<p>Makan malam sendirian di warung tenda sehabis lembur. Teh hangat dan sepiring nasi goreng terasa seperti pelukan hangat.</p>',
    image: null,
    color: 'lilac',
    rotation: 1.4,
    seed: 1010,
    createdAt: Date.now() - 1000 * 60 * 60 * 168,
    paid: true,
    authorId: 'starter',
    authorName: 'Kertas Keluh'
  },
  {
    id: 'starter-11',
    html: '<p>Belajar menerima bahwa tidak semua orang harus menyukaiku, dan itu sama sekali tidak mengurangi nilaiku sebagai manusia.</p>',
    image: null,
    color: 'butter',
    rotation: -2.1,
    seed: 1111,
    createdAt: Date.now() - 1000 * 60 * 60 * 192,
    paid: true,
    authorId: 'starter',
    authorName: 'Kertas Keluh'
  },
  {
    id: 'starter-12',
    html: '<p>Untuk siapa pun yang sedang membaca ini di ujung malam: <em>kamu berharga</em>, kamu tidak sendirian, dan harimu akan membaik.</p>',
    image: null,
    color: 'sky',
    rotation: 1.9,
    seed: 1212,
    createdAt: Date.now() - 1000 * 60 * 60 * 216,
    paid: true,
    authorId: 'starter',
    authorName: 'Kertas Keluh'
  }
];

export function loadNotes() {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) {
      saveNotes(DEFAULT_NOTES);
      return DEFAULT_NOTES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveNotes(DEFAULT_NOTES);
      return DEFAULT_NOTES;
    }
    // Bila hanya ada sedikit catatan bawaan lama (<= 5), perbarui dengan 12 catatan bawaan penuh
    // sambil tetap mempertahankan catatan baru buatan pengguna
    if (parsed.length <= 5) {
      const userNotes = parsed.filter((n) => !n.id.startsWith('starter-'));
      const combined = [...userNotes, ...DEFAULT_NOTES];
      saveNotes(combined);
      return combined;
    }
    return parsed;
  } catch (error) {
    return DEFAULT_NOTES;
  }
}

export function saveNotes(notes) {
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    return true;
  } catch (error) {
    showToast('Penyimpanan penuh. Coba kurangi ukuran gambar.', true);
    return false;
  }
}

export function loadView() {
  try {
    const raw = localStorage.getItem(VIEW_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.progress === 'number') {
      return parsed;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export function saveView(view) {
  try {
    localStorage.setItem(VIEW_KEY, JSON.stringify(view));
    return true;
  } catch (error) {
    return false;
  }
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

export function saveDraft(draft) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    return true;
  } catch (error) {
    return false;
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (error) {}
}

export function loadAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

export function saveAuth(user) {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return true;
  } catch (_) {
    return false;
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch (_) {}
}

export function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch (_) {
    return false;
  }
}
