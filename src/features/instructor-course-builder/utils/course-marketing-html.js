/** Serialize / parse LMS marketing copy for rich-text editors */

export function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function paragraphsToHtml(paragraphs) {
  const list = Array.isArray(paragraphs) ? paragraphs : [];
  if (!list.length) {
    return '';
  }
  return list.map((p) => `<p>${escapeHtml(String(p)).replace(/\n/g, '<br />')}</p>`).join('');
}

/** Pull plain paragraph strings from pasted HTML (<p>, else whole body text). */
export function htmlToParagraphTexts(html) {
  const raw = String(html ?? '').trim();
  if (!raw) {
    return [];
  }
  try {
    const doc = new DOMParser().parseFromString(raw, 'text/html');
    const ps = [...doc.body.querySelectorAll('p')]
      .map((el) => el.textContent?.replace(/\u00a0/g, ' ').trim() ?? '')
      .filter(Boolean);
    if (ps.length) {
      return ps;
    }
    const t = doc.body.textContent?.trim() ?? '';
    return t ? [t] : [];
  } catch {
    return [stripHtml(raw)].filter(Boolean);
  }
}

export function stripHtml(html) {
  if (typeof document === 'undefined') {
    return String(html ?? '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  const div = document.createElement('div');
  div.innerHTML = html ?? '';
  return (div.textContent ?? '').replace(/\s+/g, ' ').trim();
}
