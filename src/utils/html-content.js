const UNSAFE_TAGS = ['script', 'style', 'iframe', 'object', 'embed', 'link', 'meta'];

/**
 * Normalize LMS rich-text (HTML from TipTap) for safe display in read-only views.
 * Plain text is wrapped in a paragraph; HTML is parsed and stripped of unsafe nodes.
 */
export function normalizeHtmlForDisplay(html) {
  const raw = String(html ?? '').trim();
  if (!raw) {
    return '';
  }

  if (!/<[a-z][\s\S]*>/i.test(raw)) {
    return `<p>${escapeHtml(raw).replace(/\n/g, '<br />')}</p>`;
  }

  if (typeof document === 'undefined') {
    return raw;
  }

  try {
    const doc = new DOMParser().parseFromString(raw, 'text/html');
    UNSAFE_TAGS.forEach((tag) => {
      doc.body.querySelectorAll(tag).forEach((node) => node.remove());
    });
    doc.body.querySelectorAll('*').forEach((node) => {
      [...node.attributes].forEach((attr) => {
        const name = attr.name.toLowerCase();
        if (name.startsWith('on') || name === 'srcdoc') {
          node.removeAttribute(attr.name);
        }
      });
    });

    const cleaned = doc.body.innerHTML.trim();
    return cleaned || '';
  } catch {
    return `<p>${escapeHtml(raw)}</p>`;
  }
}

/** Plain text for cards / subtitles that must not show markup. */
export function htmlToPlainText(html) {
  const raw = String(html ?? '').trim();
  if (!raw) {
    return '';
  }

  if (typeof document === 'undefined') {
    return raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  const div = document.createElement('div');
  div.innerHTML = normalizeHtmlForDisplay(raw);
  return (div.textContent ?? '').replace(/\s+/g, ' ').trim();
}

function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
