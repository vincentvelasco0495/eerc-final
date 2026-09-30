/**
 * Best-effort 11-char YouTube id from HTML or plain text (watch, embed, shorts, youtu.be).
 *
 * @param {string|null|undefined} html
 * @returns {string|null}
 */
export function extractYouTubeVideoIdFromHtml(html) {
  if (!html || typeof html !== 'string') {
    return null;
  }
  const s = html;
  let m = s.match(/youtube\.com\/embed\/([\w-]{11})/i);
  if (m) {
    return m[1];
  }
  m = s.match(/youtube\.com\/watch\?[^"'\s<>]*v=([\w-]{11})/i);
  if (m) {
    return m[1];
  }
  m = s.match(/[?&]v=([\w-]{11})/i);
  if (m) {
    return m[1];
  }
  m = s.match(/youtu\.be\/([\w-]{11})/i);
  if (m) {
    return m[1];
  }
  m = s.match(/youtube\.com\/shorts\/([\w-]{11})/i);
  if (m) {
    return m[1];
  }
  return null;
}
