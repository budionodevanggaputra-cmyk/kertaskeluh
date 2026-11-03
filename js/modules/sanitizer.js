// FILE: js/modules/sanitizer.js
const ALLOWED_TAGS = new Set([
  'B', 'STRONG', 'I', 'EM', 'UL', 'OL', 'LI', 'BR', 'DIV', 'P'
]);

const FORBIDDEN_CONTENT_TAGS = new Set([
  'SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'NOSCRIPT'
]);

export function sanitizeHtml(rawHtml) {
  if (!rawHtml || typeof rawHtml !== 'string') return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  function cleanNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return document.createTextNode(node.textContent);
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toUpperCase();

      if (FORBIDDEN_CONTENT_TAGS.has(tagName)) {
        return null;
      }

      if (ALLOWED_TAGS.has(tagName)) {
        const cleanEl = document.createElement(tagName.toLowerCase());
        while (cleanEl.attributes.length > 0) {
          cleanEl.removeAttribute(cleanEl.attributes[0].name);
        }
        node.childNodes.forEach((child) => {
          const cleanedChild = cleanNode(child);
          if (cleanedChild) cleanEl.appendChild(cleanedChild);
        });
        return cleanEl;
      }

      // Tag tak dikenal di-unwrap
      const fragment = document.createDocumentFragment();
      node.childNodes.forEach((child) => {
        const cleanedChild = cleanNode(child);
        if (cleanedChild) fragment.appendChild(cleanedChild);
      });
      return fragment;
    }

    return null;
  }

  const container = document.createElement('div');
  doc.body.childNodes.forEach((node) => {
    const cleaned = cleanNode(node);
    if (cleaned) container.appendChild(cleaned);
  });

  return container.innerHTML;
}
