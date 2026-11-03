// FILE: js/modules/uploader.js
import { LIMITS } from './config.js';
import { showToast } from './toast.js';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const EMPTY_PREVIEW_SRC = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E";

let currentImageDataUrl = null;
let fileInput = null;
let dropZone = null;
let selectButton = null;
let previewWrap = null;
let previewImg = null;
let removeButton = null;
let promptWrap = null;
let onImageChangeCallback = null;

function compressImage(dataUrl, callback) {
  const img = new Image();
  img.onload = () => {
    const maxDim = 800;
    let w = img.width;
    let h = img.height;
    if (w > maxDim || h > maxDim) {
      if (w > h) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      } else {
        w = Math.round((w * maxDim) / h);
        h = maxDim;
      }
    }
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    const optimized = canvas.toDataURL('image/jpeg', 0.85);
    callback(optimized);
  };
  img.onerror = () => {
    callback(dataUrl);
  };
  img.src = dataUrl;
}

function validateAndProcessFile(file) {
  if (!file) return;

  if (!ALLOWED_TYPES.includes(file.type)) {
    showToast('Format belum didukung. Gunakan PNG, JPG, atau WebP.', true);
    return;
  }

  if (file.size > LIMITS.maxFileSize) {
    showToast('Fail terlalu besar. Maksimal 2 MB.', true);
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    compressImage(e.target.result, (optimized) => {
      currentImageDataUrl = optimized;
      if (previewImg) previewImg.src = currentImageDataUrl;
      if (previewWrap) previewWrap.hidden = false;
      if (promptWrap) promptWrap.hidden = true;
      if (onImageChangeCallback) onImageChangeCallback();
    });
  };
  reader.readAsDataURL(file);
}

export function getUploadedImage() {
  return currentImageDataUrl;
}

export function setUploadedImage(dataUrl) {
  currentImageDataUrl = dataUrl || null;
  if (currentImageDataUrl) {
    if (previewImg) previewImg.src = currentImageDataUrl;
    if (previewWrap) previewWrap.hidden = false;
    if (promptWrap) promptWrap.hidden = true;
  } else {
    clearUploadedImage();
  }
}

export function hasImage() {
  return Boolean(currentImageDataUrl);
}

export function clearUploadedImage() {
  currentImageDataUrl = null;
  if (fileInput) fileInput.value = '';
  if (previewImg) previewImg.src = EMPTY_PREVIEW_SRC;
  if (previewWrap) previewWrap.hidden = true;
  if (promptWrap) promptWrap.hidden = false;
  if (onImageChangeCallback) onImageChangeCallback();
}

export function initUploader(onChange) {
  fileInput = document.querySelector('[data-js="uploader-input"]');
  dropZone = document.querySelector('[data-js="uploader-zone"]');
  selectButton = document.querySelector('[data-js="uploader-button"]');
  previewWrap = document.querySelector('[data-js="uploader-preview-wrap"]');
  previewImg = document.querySelector('[data-js="uploader-preview-img"]');
  removeButton = document.querySelector('[data-js="uploader-remove"]');
  promptWrap = document.querySelector('[data-js="uploader-prompt"]');
  onImageChangeCallback = onChange;

  if (selectButton && fileInput) {
    selectButton.addEventListener('click', () => fileInput.click());
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) validateAndProcessFile(file);
    });
  }

  if (removeButton) {
    removeButton.addEventListener('click', () => clearUploadedImage());
  }

  if (dropZone) {
    ['dragenter', 'dragover'].forEach((eventName) => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('uploader--dragover');
      });
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('uploader--dragover');
      });
    });

    dropZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const file = dt && dt.files && dt.files[0];
      if (file) validateAndProcessFile(file);
    });
  }
}
