import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'; // eslint-disable-line import/no-unresolved

import { QUIZ_PDF_MAX_PAGES, QUIZ_PDF_MAX_FILE_BYTES } from './quiz-pdf-constants';

let pdfWorkerConfigured = false;

function ensurePdfWorker() {
  if (pdfWorkerConfigured) {
    return;
  }
  GlobalWorkerOptions.workerSrc = pdfjsWorker;
  pdfWorkerConfigured = true;
}

export async function peekQuizPdfPageCount(file) {
  if (!(file instanceof File) || file.size <= 0) {
    throw new Error('Choose a PDF file to import.');
  }
  if (file.size > QUIZ_PDF_MAX_FILE_BYTES) {
    throw new Error('That PDF is too large. Use a file under 40 MB.');
  }

  ensurePdfWorker();
  const data = new Uint8Array(await file.arrayBuffer());
  const loadingTask = getDocument({ data });
  const pdf = await loadingTask.promise;
  try {
    const pageCount = Math.min(pdf.numPages, QUIZ_PDF_MAX_PAGES);
    if (pageCount < 1) {
      throw new Error('That PDF has no pages.');
    }
    return pageCount;
  } finally {
    await pdf.destroy();
  }
}
