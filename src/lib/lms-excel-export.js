import { downloadBlob, parseContentDispositionFileName } from 'src/utils/export-excel';

import axios from 'src/lib/axios';

function toDateParam(value) {
  if (!value) {
    return '';
  }
  if (typeof value === 'string') {
    return value.slice(0, 10);
  }
  if (typeof value.format === 'function') {
    return value.format('YYYY-MM-DD');
  }
  return '';
}

export function exportDateQuery({ from, to } = {}) {
  return {
    from: toDateParam(from),
    to: toDateParam(to),
  };
}

function appendParams(params, extras = {}) {
  Object.entries(extras).forEach(([key, value]) => {
    if (value == null) {
      return;
    }
    const str = String(value).trim();
    if (str !== '') {
      params.set(key, str);
    }
  });
}

export async function fetchLmsExcelExport(path, query = {}, fallbackFileName = 'export.xlsx') {
  const params = new URLSearchParams();
  appendParams(params, query);
  const qs = params.toString();
  const url = `${path}${qs ? `?${qs}` : ''}`;

  try {
    const response = await axios.get(url, { responseType: 'blob' });
    const blob = response.data;
    if (blob instanceof Blob && blob.type && blob.type.includes('application/json')) {
      const text = await blob.text();
      let message = 'Could not export to Excel.';
      try {
        const parsed = JSON.parse(text);
        if (typeof parsed?.message === 'string' && parsed.message.trim()) {
          message = parsed.message.trim();
        }
      } catch {
        // ignore parse errors
      }
      throw new Error(message);
    }

    const fileName =
      parseContentDispositionFileName(response.headers?.['content-disposition']) || fallbackFileName;

    return { blob, fileName };
  } catch (error) {
    const data = error?.response?.data;
    if (data instanceof Blob) {
      try {
        const text = await data.text();
        const parsed = JSON.parse(text);
        if (typeof parsed?.message === 'string' && parsed.message.trim()) {
          throw new Error(parsed.message.trim());
        }
      } catch (inner) {
        if (inner instanceof Error && inner.name !== 'SyntaxError') {
          throw inner;
        }
      }
    }
    throw error instanceof Error ? error : new Error('Could not export to Excel.');
  }
}

export async function downloadLmsExcelExport(path, query = {}, fallbackFileName = 'export.xlsx') {
  const { blob, fileName } = await fetchLmsExcelExport(path, query, fallbackFileName);
  downloadBlob(blob, fileName);
}
