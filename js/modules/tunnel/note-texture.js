// FILE: js/modules/tunnel/note-texture.js
import { THREE } from 'three';

const CANVAS_WIDTH = 512;
const CANVAS_HEIGHT = 680;
const RADIUS = 22;

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

function getThemeColor(varName, fallback) {
  const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return val || fallback;
}

function getNoteColor(colorName) {
  const val = getComputedStyle(document.documentElement).getPropertyValue(`--note-${colorName}`).trim();
  if (val) return val;
  return getComputedStyle(document.documentElement).getPropertyValue('--note-butter').trim() || '#D8C886';
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function formatStampDate(timestamp) {
  const d = new Date(timestamp);
  const day = d.getDate();
  const month = MONTH_NAMES[d.getMonth()] || 'Bln';
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function createPlaceholderTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 4;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#CCCCCC';
  ctx.fillRect(0, 0, 4, 4);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function renderNoteToTexture(note) {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d');

  const bgColor = getNoteColor(note.color);
  const inkColor = getThemeColor('--color-note-ink', '#0A0F1D');

  // Latar kartu dengan sudut membulat setara 10px pada skala 3D
  ctx.save();
  roundRect(ctx, 4, 4, CANVAS_WIDTH - 8, CANVAS_HEIGHT - 8, RADIUS);
  ctx.fillStyle = bgColor;
  ctx.fill();

  // Bingkai tepi kertas yang tegas dan rapi
  ctx.lineWidth = 2.0;
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.16)';
  ctx.stroke();

  ctx.clip();

  // Pita lakban / masking tape dekoratif di tengah atas kertas
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
  ctx.fillRect(CANVAS_WIDTH / 2 - 48, 2, 96, 22);
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.14)';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(CANVAS_WIDTH / 2 - 48, 2, 96, 22);
  ctx.restore();

  // Header: Nama penulis di kiri, tanggal di kanan
  const authorName = note.authorName || (note.authorId === 'starter' ? 'Kertas Keluh' : 'Anonim');
  const stampText = formatStampDate(note.createdAt);

  ctx.font = '700 22px "Plus Jakarta Sans", "Poppins", sans-serif';
  ctx.fillStyle = inkColor;
  ctx.textAlign = 'left';
  ctx.fillText(authorName, 36, 50);

  ctx.font = '600 20px "Plus Jakarta Sans", "Poppins", sans-serif';
  ctx.fillStyle = '#334155';
  ctx.textAlign = 'right';
  ctx.fillText(stampText, CANVAS_WIDTH - 36, 50);

  // Garis pemisah tipis di bawah header
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(32, 64);
  ctx.lineTo(CANVAS_WIDTH - 32, 64);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;

  let contentTop = 82;

  const drawBody = (startY) => {
    ctx.textAlign = 'left';
    ctx.fillStyle = inkColor;

    // Garis buku bergaris (ruled notebook lines) halus di badan kartu
    ctx.save();
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.07)';
    ctx.lineWidth = 1;
    for (let gy = startY + 12; gy < CANVAS_HEIGHT - 30; gy += 46) {
      ctx.beginPath();
      ctx.moveTo(32, gy);
      ctx.lineTo(CANVAS_WIDTH - 32, gy);
      ctx.stroke();
    }
    ctx.restore();

    // Parse elemen dari HTML tersanitasi menggunakan DOMParser tanpa innerHTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(note.html || '', 'text/html');
    const rootEl = doc.body;

    const lines = [];
    const maxLineW = CANVAS_WIDTH - 64;

    function addWrappedText(text, prefix = '', font = '600 36px "Patrick Hand", "Caveat", cursive') {
      ctx.font = font;
      const words = text.split(/\s+/).filter(Boolean);
      let cur = prefix;

      words.forEach((w) => {
        const test = cur ? `${cur} ${w}` : w;
        if (ctx.measureText(test).width <= maxLineW) {
          cur = test;
        } else {
          if (cur) lines.push({ text: cur, font });
          cur = (prefix ? '   ' : '') + w;
        }
      });
      if (cur) lines.push({ text: cur, font });
    }

    rootEl.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.trim()) {
          addWrappedText(node.textContent.trim());
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toUpperCase();
        if (tag === 'UL' || tag === 'OL') {
          node.querySelectorAll('li').forEach((li, idx) => {
            const bullet = tag === 'UL' ? '• ' : `${idx + 1}. `;
            addWrappedText(li.textContent.trim(), bullet);
          });
        } else if (tag === 'B' || tag === 'STRONG') {
          addWrappedText(node.textContent.trim(), '', '700 38px "Patrick Hand", "Caveat", cursive');
        } else if (tag === 'I' || tag === 'EM') {
          addWrappedText(node.textContent.trim(), '', 'italic 600 36px "Patrick Hand", "Caveat", cursive');
        } else {
          addWrappedText(node.textContent.trim());
        }
      }
    });

    let lineY = startY;
    const lineHeight = 46;
    for (const item of lines) {
      if (lineY > CANVAS_HEIGHT - 36) break;
      ctx.font = item.font;
      ctx.fillText(item.text, 36, lineY);
      lineY += lineHeight;
    }

    ctx.restore();
    texture.needsUpdate = true;
  };

  if (note.image) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.save();
      const imgH = Math.min(240, CANVAS_HEIGHT * 0.38);
      const imgW = CANVAS_WIDTH - 64;
      roundRect(ctx, 32, contentTop, imgW, imgH, 12);
      ctx.clip();
      ctx.drawImage(img, 32, contentTop, imgW, imgH);
      ctx.restore();
      drawBody(contentTop + imgH + 40);
    };
    img.onerror = () => {
      drawBody(contentTop + 20);
    };
    img.src = note.image;
  } else {
    drawBody(contentTop + 20);
  }

  return texture;
}

export function renderSpecialPanelTexture(title, message, isEnd = false) {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d');

  const bgColor = '#FFFFFF';
  const textColor = '#0A0F1D';
  const accentColor = '#D97706';

  roundRect(ctx, 4, 4, CANVAS_WIDTH - 8, CANVAS_HEIGHT - 8, RADIUS);
  ctx.fillStyle = bgColor;
  ctx.fill();

  ctx.lineWidth = 2.5;
  ctx.strokeStyle = accentColor;
  ctx.stroke();

  // Garis bingkai dalam halus khas plakat galeri
  roundRect(ctx, 16, 16, CANVAS_WIDTH - 32, CANVAS_HEIGHT - 32, RADIUS - 4);
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(229, 163, 53, 0.35)';
  ctx.stroke();

  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';

  if (title) {
    ctx.font = '700 46px "Playfair Display", Georgia, serif';
    ctx.fillText(title, CANVAS_WIDTH / 2, 210);
  }

  // Aksen dekoratif pemisah
  ctx.font = '600 22px "Playfair Display", Georgia, serif';
  ctx.fillStyle = accentColor;
  ctx.fillText('• ✦ •', CANVAS_WIDTH / 2, 255);

  ctx.fillStyle = textColor;
  ctx.font = 'italic 600 30px "Playfair Display", Georgia, serif';
  const words = message.split(' ');
  let cur = '';
  let y = isEnd ? 320 : 300;
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(test).width <= CANVAS_WIDTH - 90) {
      cur = test;
    } else {
      ctx.fillText(cur, CANVAS_WIDTH / 2, y);
      cur = w;
      y += 46;
    }
  }
  if (cur) ctx.fillText(cur, CANVAS_WIDTH / 2, y);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
