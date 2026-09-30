import { useRef, useMemo, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { resolveApiAssetUrl } from 'src/utils/resolve-api-asset-url';

import { CONFIG } from 'src/global-config';
import {
  deleteLessonMaterial,
  getLmsAxiosErrorMessage,
  postLessonMaterialForModule,
} from 'src/lib/lms-instructor-api';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { QuizPdfDocument } from 'src/components/quiz-pdf-document';
import { Lightbox, useLightbox, QuizEnlargeableImage } from 'src/components/lightbox';

import { styles } from './styles';
import { isQuizPdfAsset } from '../../utils/quiz-pdf-constants';
import { normalizeUploadedLessonMaterial } from '../../utils/lesson-materials-cache';

function normalizeAssetUrl(path, materialPublicId = null, inline = false) {
  const id = typeof materialPublicId === 'string' ? materialPublicId.trim() : '';
  const base = String(CONFIG.serverUrl ?? '').trim().replace(/\/$/, '');
  if (id && base) {
    return `${base}/api/lesson-materials/${encodeURIComponent(id)}/file${inline ? '?inline=1' : ''}`;
  }
  return resolveApiAssetUrl(path);
}

export function QuestionImageUploadField({
  label,
  modulePublicId,
  materialPublicId,
  previewUrl,
  fileName,
  fileMime = null,
  skipMaterialDelete = false,
  uploading = false,
  onUploadingChange,
  onImageChange,
  onAfterMaterialsChange,
  borderedRight = false,
}) {
  const inputRef = useRef(null);

  const previewSrc = useMemo(() => {
    const direct = normalizeAssetUrl(previewUrl, materialPublicId, true);
    if (direct) return direct;
    const id = typeof materialPublicId === 'string' ? materialPublicId.trim() : '';
    if (!id || !CONFIG.serverUrl?.trim()) return '';
    const base = String(CONFIG.serverUrl).trim().replace(/\/$/, '');
    return `${base}/api/lesson-materials/${encodeURIComponent(id)}/file?inline=1`;
  }, [materialPublicId, previewUrl]);

  const isPdf = isQuizPdfAsset({ mime: fileMime, fileName, url: previewUrl || previewSrc });
  const hasImage = Boolean(materialPublicId?.trim() || previewSrc);
  const displayName = fileName?.trim() || (hasImage ? (isPdf ? 'PDF selected' : 'Image selected') : 'No file chosen');
  const imageSlides = useMemo(
    () => (previewSrc && !isPdf ? [{ src: previewSrc, alt: fileName || label }] : []),
    [fileName, isPdf, label, previewSrc]
  );
  const lightbox = useLightbox(imageSlides);

  const uploadFile = useCallback(
    async (file) => {
      if (!file) return;
      if (!CONFIG.serverUrl?.trim()) {
        toast.error(
          'Set VITE_SERVER_URL to your Laravel app origin (e.g. http://127.0.0.1:8000) and restart the dev server.'
        );
        return;
      }
      if (!modulePublicId) {
        toast.error('Select a quiz lesson in your course curriculum before uploading images.');
        return;
      }

      onUploadingChange?.(true);
      const previousId = typeof materialPublicId === 'string' ? materialPublicId.trim() : '';

      try {
        const payload = await postLessonMaterialForModule(modulePublicId, file, {
          usage: 'quiz_question_image',
        });
        const material = normalizeUploadedLessonMaterial(payload);
        if (!material?.id) {
          toast.error('Upload succeeded but the server did not return a file id.');
          return;
        }

        onImageChange?.({
          materialPublicId: material.id,
          previewUrl: material.fileUrl ?? material.inlineFileUrl ?? null,
          fileName: material.name ?? file.name,
          mime: material.mime ?? file.type ?? null,
        });

        const staleIds = [previousId].filter((id) => id && id !== material.id);
        if (staleIds.length > 0 && !skipMaterialDelete) {
          try {
            await deleteLessonMaterial(previousId);
          } catch {
            /* best-effort cleanup */
          }
          onAfterMaterialsChange?.({
            modulePublicId,
            removeIds: staleIds,
          });
        }

        toast.success(`${label.replace(/:$/, '')} uploaded.`);
      } catch (err) {
        toast.error(getLmsAxiosErrorMessage(err, `Could not upload ${label.toLowerCase()}`));
      } finally {
        onUploadingChange?.(false);
      }
    },
    [
      label,
      materialPublicId,
      modulePublicId,
      onAfterMaterialsChange,
      onImageChange,
      onUploadingChange,
      skipMaterialDelete,
    ]
  );

  const handleRemove = useCallback(async () => {
    const id = typeof materialPublicId === 'string' ? materialPublicId.trim() : '';
    if (id && modulePublicId && !skipMaterialDelete) {
      try {
        await deleteLessonMaterial(id);
        onAfterMaterialsChange?.({
          modulePublicId,
          removeIds: [id],
        });
      } catch (err) {
        toast.error(getLmsAxiosErrorMessage(err, `Could not remove ${label.toLowerCase()}`));
        return;
      }
    }
    onImageChange?.({
      materialPublicId: null,
      previewUrl: null,
      fileName: null,
      mime: null,
    });
  }, [
    label,
    materialPublicId,
    modulePublicId,
    onAfterMaterialsChange,
    onImageChange,
    skipMaterialDelete,
  ]);

  const handleFileInput = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (file) void uploadFile(file);
    },
    [uploadFile]
  );

  return (
    <Box sx={[styles.questionImageField, borderedRight && styles.questionImageFieldBorderRight]}>
      <Typography sx={styles.questionImageLabel}>{label}</Typography>

      {hasImage && isPdf ? (
        <QuizPdfDocument
          materialPublicId={materialPublicId}
          src={previewSrc}
          fileName={fileName || label}
          maxHeight={520}
        />
      ) : null}

      {hasImage && previewSrc && !isPdf ? (
        <QuizEnlargeableImage
          src={previewSrc}
          alt={fileName || label}
          onOpen={lightbox.onOpen}
          wrapSx={{ maxWidth: 560 }}
          imgSx={styles.questionImagePreview}
        />
      ) : null}

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1}
        flexWrap="wrap"
        sx={styles.questionImageFileRow}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml,application/pdf,.pdf"
          hidden
          onChange={handleFileInput}
        />
        <Button
          size="small"
          variant="outlined"
          disabled={uploading || !modulePublicId}
          onClick={() => inputRef.current?.click()}
          sx={styles.questionImageChooseBtn}
        >
          Choose File
        </Button>
        <Typography variant="body2" color="text.secondary" noWrap sx={styles.questionImageFileName}>
          {uploading ? 'Uploading…' : displayName}
        </Typography>
        {uploading ? <CircularProgress size={18} aria-label="Uploading" /> : null}
        {hasImage && !uploading ? (
          <IconButton
            size="small"
            aria-label={`Remove ${label}`}
            onClick={() => void handleRemove()}
            sx={styles.diagramRemoveBtn}
          >
            <Iconify icon="solar:trash-bin-trash-bold" width={18} />
          </IconButton>
        ) : null}
      </Stack>
      {!isPdf ? (
        <Lightbox
          index={lightbox.selected}
          slides={imageSlides}
          open={lightbox.open}
          close={lightbox.onClose}
          disableThumbnails
          disableSlideshow
          disableCaptions
          disableVideo
          disableTotal
        />
      ) : null}
    </Box>
  );
}
