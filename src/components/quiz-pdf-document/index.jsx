import { useRef, useState, useEffect } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'; // eslint-disable-line import/no-unresolved

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { fetchLessonMaterialBlob } from 'src/lib/lms-instructor-api';
import { QUIZ_PDF_MAX_PAGES } from 'src/features/instructor-course-builder/utils/quiz-pdf-constants';

import { Iconify } from 'src/components/iconify';

const pdfBytesCache = new Map();

function ensurePdfWorker() {
  GlobalWorkerOptions.workerSrc = pdfjsWorker;
}

function trimId(value) {
  return typeof value === 'string' ? value.trim() : '';
}

async function loadPdfBytes(materialPublicId, src) {
  const id = trimId(materialPublicId);
  const key = id || src;
  if (!key) {
    throw new Error('Missing PDF.');
  }
  if (!pdfBytesCache.has(key)) {
    pdfBytesCache.set(
      key,
      (async () => {
        if (id) {
          const blob = await fetchLessonMaterialBlob(id, { inline: 1 });
          return new Uint8Array(await blob.arrayBuffer());
        }
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error('Could not load the PDF.');
        }
        return new Uint8Array(await response.arrayBuffer());
      })().catch((err) => {
        pdfBytesCache.delete(key);
        throw err;
      })
    );
  }
  const bytes = await pdfBytesCache.get(key);
  return bytes.slice();
}

function PdfPages({ materialPublicId, src, maxHeight = 520 }) {
  const hostRef = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current;
    if (!host) {
      return undefined;
    }

    host.replaceChildren();
    setStatus('loading');
    ensurePdfWorker();

    (async () => {
      try {
        await new Promise((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(resolve));
        });
        if (cancelled) {
          return;
        }
        const data = await loadPdfBytes(materialPublicId, src);
        if (cancelled) {
          return;
        }
        const pdf = await getDocument({ data }).promise;
        if (cancelled) {
          await pdf.destroy();
          return;
        }
        const pageLimit = Math.min(pdf.numPages, QUIZ_PDF_MAX_PAGES);
        for (let pageNumber = 1; pageNumber <= pageLimit; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          if (cancelled) {
            break;
          }
          const unscaled = page.getViewport({ scale: 1 });
          const width = Math.max(host.clientWidth || 560, 240);
          const scale = width / unscaled.width;
          const viewport = page.getViewport({ scale: Math.min(Math.max(scale, 0.6), 2) });
          const canvas = document.createElement('canvas');
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          canvas.style.width = '100%';
          canvas.style.height = 'auto';
          canvas.style.display = 'block';
          canvas.style.marginBottom = '8px';
          canvas.style.background = '#fff';
          const ctx = canvas.getContext('2d', { alpha: false });
          if (!ctx) {
            continue;
          }
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport }).promise;
          if (!cancelled) {
            host.appendChild(canvas);
            if (pageNumber === 1) {
              setStatus('ready');
            }
          }
        }
        await pdf.destroy();
        if (!cancelled) {
          setStatus('ready');
        }
      } catch {
        if (!cancelled) {
          setStatus('error');
        }
      }
    })();

    return () => {
      cancelled = true;
      host.replaceChildren();
    };
  }, [materialPublicId, src]);

  return (
    <Box sx={{ position: 'relative', width: 1 }}>
      {status === 'loading' ? (
        <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
          <CircularProgress aria-label="Loading PDF" size={28} />
        </Box>
      ) : null}
      {status === 'error' ? (
        <Box sx={{ color: 'error.main', typography: 'body2', py: 2, textAlign: 'center' }}>
          Could not display this PDF.
        </Box>
      ) : null}
      <Box
        ref={hostRef}
        sx={{
          display: status === 'error' ? 'none' : 'block',
          maxHeight,
          overflow: 'auto',
          px: 1,
          py: 1,
          bgcolor: 'background.neutral',
          borderRadius: 1,
        }}
      />
    </Box>
  );
}

export function QuizPdfDocument({ materialPublicId, src, fileName, maxHeight = 520 }) {
  const [open, setOpen] = useState(false);
  const id = trimId(materialPublicId);

  if (!id && !src) {
    return null;
  }

  return (
    <Box sx={{ width: 1, position: 'relative' }}>
      <IconButton
        size="small"
        title="Enlarge PDF"
        aria-label="Enlarge PDF"
        onClick={() => setOpen(true)}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          bgcolor: 'rgba(0, 22, 50, 0.55)',
          color: 'common.white',
          '&:hover': { bgcolor: 'rgba(0, 22, 50, 0.72)' },
        }}
      >
        <Iconify icon="eva:expand-fill" width={18} />
      </IconButton>
      <PdfPages materialPublicId={id} src={src} maxHeight={maxHeight} />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: 'background.paper',
              backgroundImage: 'none',
              height: '90vh',
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pr: 6 }}>{fileName || 'PDF'}</DialogTitle>
        <IconButton
          aria-label="Close"
          onClick={() => setOpen(false)}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <Iconify icon="eva:close-fill" width={22} />
        </IconButton>
        <DialogContent sx={{ pt: 0 }}>
          {open ? (
            <PdfPages materialPublicId={id} src={src} maxHeight="calc(90vh - 88px)" />
          ) : null}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
