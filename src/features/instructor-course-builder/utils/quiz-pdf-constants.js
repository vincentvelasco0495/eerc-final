export const QUIZ_PDF_MAX_ITEMS = 50;
export const QUIZ_PDF_MAX_PAGES = 80;
export const QUIZ_PDF_MAX_FILE_BYTES = 40 * 1024 * 1024;

export function parseQuizPdfItemCount(raw, { min = 1, max = QUIZ_PDF_MAX_ITEMS } = {}) {
  const n = Number.parseInt(String(raw ?? '').trim(), 10);
  if (!Number.isInteger(n) || n < min || n > max) {
    return null;
  }
  return n;
}

export function isQuizPdfAsset({ mime, fileName, url } = {}) {
  const type = String(mime ?? '').toLowerCase();
  if (type.includes('pdf')) {
    return true;
  }
  const name = `${fileName ?? ''} ${url ?? ''}`.toLowerCase();
  return name.includes('.pdf');
}
