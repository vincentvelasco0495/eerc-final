import { useRef, useState, useEffect } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'; // eslint-disable-line import/no-unresolved

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import CircularProgress from '@mui/material/CircularProgress';

import { fetchLessonMaterialBlob } from 'src/lib/lms-instructor-api';
import { QUIZ_PDF_MAX_PAGES } from 'src/features/instructor-course-builder/utils/quiz-pdf-constants';

import { Iconify } from 'src/components/iconify';

const pdfBytesCache = new Map();
const MAX_CANVAS_EDGE = 4096;
const PDF_CACHE_NAME = 'eerc-quiz-pdf-v1';
const PDF_CACHE_MAX_BYTES = 15 * 1024 * 1024;

function ensurePdfWorker() {
  GlobalWorkerOptions.workerSrc = pdfjsWorker;
}

function trimId(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function pdfCacheRequest(key) {
  return new Request(`https://eerc.local/pdf-cache/${encodeURIComponent(key)}`);
}

async function readPersistentPdf(key) {
  if (typeof caches === 'undefined') {
    return null;
  }
  try {
    const store = await caches.open(PDF_CACHE_NAME);
    const hit = await store.match(pdfCacheRequest(key));
    if (!hit) {
      return null;
    }
    return new Uint8Array(await hit.arrayBuffer());
  } catch {
    return null;
  }
}

async function writePersistentPdf(key, bytes) {
  if (typeof caches === 'undefined' || bytes.length > PDF_CACHE_MAX_BYTES) {
    return;
  }
  try {
    const store = await caches.open(PDF_CACHE_NAME);
    await store.put(
      pdfCacheRequest(key),
      new Response(bytes, { headers: { 'Content-Type': 'application/pdf' } })
    );
  } catch {
    // Quota or private mode.
  }
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
        const persisted = await readPersistentPdf(key);
        if (persisted?.byteLength) {
          return persisted;
        }
        if (id) {
          const blob = await fetchLessonMaterialBlob(id, { inline: 1 });
          const bytes = new Uint8Array(await blob.arrayBuffer());
          await writePersistentPdf(key, bytes);
          return bytes;
        }
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error('Could not load the PDF.');
        }
        const bytes = new Uint8Array(await response.arrayBuffer());
        await writePersistentPdf(key, bytes);
        return bytes;
      })().catch((err) => {
        pdfBytesCache.delete(key);
        throw err;
      })
    );
  }
  const bytes = await pdfBytesCache.get(key);
  return bytes.slice();
}

function outputScale() {
  const dpr = Number(window.devicePixelRatio) || 1;
  return Math.min(Math.max(dpr, 1), 3);
}

function PdfPages({ materialPublicId, src, maxHeight = 520 }) {
  const hostRef = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    let lastWidth = 0;
    const host = hostRef.current;
    if (!host) {
      return undefined;
    }

    ensurePdfWorker();

    const render = async () => {
      const cssWidth = host.clientWidth;
      if (cssWidth < 40) {
        return;
      }
      host.replaceChildren();
      setStatus('loading');
      try {
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
        const pixelRatio = outputScale();
        for (let pageNumber = 1; pageNumber <= pageLimit; pageNumber += 1) {
          const page = await pdf.getPage(pageNumber);
          if (cancelled) {
            break;
          }
          const unscaled = page.getViewport({ scale: 1 });
          const fitWidth = Math.max(host.clientWidth, 240);
          const viewport = page.getViewport({ scale: fitWidth / unscaled.width });
          let drawScale = pixelRatio;
          if (viewport.width * drawScale > MAX_CANVAS_EDGE) {
            drawScale = MAX_CANVAS_EDGE / viewport.width;
          }
          const canvas = document.createElement('canvas');
          canvas.width = Math.floor(viewport.width * drawScale);
          canvas.height = Math.floor(viewport.height * drawScale);
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
          const transform = drawScale !== 1 ? [drawScale, 0, 0, drawScale, 0, 0] : null;
          await page.render({ canvasContext: ctx, viewport, transform }).promise;
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
    };

    const schedule = () => {
      const nextWidth = host.clientWidth;
      if (nextWidth < 40) {
        return;
      }
      if (lastWidth > 0 && Math.abs(nextWidth - lastWidth) < 8) {
        return;
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        lastWidth = host.clientWidth;
        void render();
      }, lastWidth === 0 ? 0 : 120);
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(host);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      observer.disconnect();
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
          WebkitOverflowScrolling: 'touch',
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
        fullScreen={isMobile}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: 'background.paper',
              backgroundImage: 'none',
              height: isMobile ? '100%' : '90vh',
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
        <DialogContent sx={{ pt: 0, px: { xs: 1, sm: 3 } }}>
          {open ? (
            <PdfPages
              materialPublicId={id}
              src={src}
              maxHeight={isMobile ? 'calc(100dvh - 72px)' : 'calc(90vh - 88px)'}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
