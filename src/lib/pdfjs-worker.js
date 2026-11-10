import { GlobalWorkerOptions } from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'; // eslint-disable-line import/no-unresolved

// Browsers that saved the old worker response keep its "plain text" label on
// refresh, because the file bytes did not change. A new URL skips that copy.
const workerSrc = `${pdfjsWorker}?v=2`;

export function ensurePdfWorker() {
  GlobalWorkerOptions.workerSrc = workerSrc;
}
