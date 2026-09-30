import { useDropzone } from 'react-dropzone';
import { useState, useCallback } from 'react';

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
  postLessonMaterialForStandaloneLesson,
} from 'src/lib/lms-instructor-api';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

import { styles } from './styles';
import { normalizeUploadedLessonMaterial } from '../../utils/lesson-materials-cache';

function formatBytes(bytes) {
  const n = Number(bytes);
  if (!Number.isFinite(n) || n <= 0) {
    return '';
  }
  if (n < 1024) {
    return `${n} B`;
  }
  const kb = n / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }
  return `${(kb / 1024).toFixed(1)} MB`;
}

function normalizeAssetUrl(path, materialPublicId = null, inline = false) {
  const id = typeof materialPublicId === 'string' ? materialPublicId.trim() : '';
  const base = String(CONFIG.serverUrl ?? '').trim().replace(/\/$/, '');
  if (id && base) {
    return `${base}/api/lesson-materials/${encodeURIComponent(id)}/file${inline ? '?inline=1' : ''}`;
  }
  return resolveApiAssetUrl(path);
}

export function TextLessonWorkspaceMaterials({
  lessonMaterials = [],
  /** When false, uploads show a toast (dropzone stays usable). */
  apiConfigured = false,
  modulePublicId = null,
  /** When uploading into the core module lesson, tag against this `module_resources` row. */
  moduleResourcePublicId = null,
  standaloneLessonPublicId = null,
  materialsTarget = null,
  onAfterMaterialsChange,
}) {
  const [busy, setBusy] = useState(false);

  const targetModulePublicId = materialsTarget?.modulePublicId ?? modulePublicId;
  const targetStandaloneLessonPublicId =
    materialsTarget?.standaloneLessonPublicId ?? standaloneLessonPublicId;
  const hasTarget = Boolean(targetModulePublicId || targetStandaloneLessonPublicId);

  const uploadFiles = useCallback(
    async (acceptedFiles) => {
      if (!acceptedFiles?.length) {
        return;
      }
      if (!CONFIG.serverUrl?.trim()) {
        toast.error(
          'Set VITE_SERVER_URL to your Laravel app origin (e.g. http://127.0.0.1:8000) and restart the dev server.'
        );
        return;
      }
      if (!hasTarget) {
        toast.error('Select a curriculum text lesson tied to your course before uploading.');
        return;
      }

      setBusy(true);
      try {
        const responses = await Promise.all(
          acceptedFiles.map((file) =>
            targetStandaloneLessonPublicId
              ? postLessonMaterialForStandaloneLesson(targetStandaloneLessonPublicId, file)
              : postLessonMaterialForModule(targetModulePublicId, file, {
                  moduleResourcePublicId,
                })
          )
        );
        const added = responses
          .map((payload) => normalizeUploadedLessonMaterial(payload))
          .filter(Boolean);
        if (added.length > 0 && targetModulePublicId) {
          onAfterMaterialsChange?.({
            modulePublicId: targetModulePublicId,
            standaloneLessonPublicId: targetStandaloneLessonPublicId,
            add: added,
          });
        }
        toast.success(`Uploaded ${acceptedFiles.length === 1 ? 'file' : `${acceptedFiles.length} files`}.`);
      } catch (err) {
        toast.error(getLmsAxiosErrorMessage(err, 'Could not upload file(s).'));
      } finally {
        setBusy(false);
      }
    },
    [
      hasTarget,
      moduleResourcePublicId,
      onAfterMaterialsChange,
      targetModulePublicId,
      targetStandaloneLessonPublicId,
    ]
  );

  const onDrop = useCallback(
    (acceptedFiles) => {
      void uploadFiles(acceptedFiles);
    },
    [uploadFiles]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: true,
    noClick: true,
    noKeyboard: true,
    disabled: busy,
  });

  const handleDownload = async (id, fallbackName) => {
    try {
      const material = (Array.isArray(lessonMaterials) ? lessonMaterials : []).find((m) => m?.id === id);
      const directUrl = normalizeAssetUrl(material?.fileUrl, material?.id ?? id, false);
      if (!directUrl) {
        throw new Error('File URL is missing.');
      }
      const a = document.createElement('a');
      a.href = directUrl;
      a.download = fallbackName ?? 'lesson-material';
      a.rel = 'noopener';
      a.click();
    } catch (err) {
      toast.error(getLmsAxiosErrorMessage(err, 'Download failed.'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this file from lesson materials?')) {
      return;
    }
    if (!CONFIG.serverUrl?.trim()) {
      toast.error('Set VITE_SERVER_URL to your Laravel app origin.');
      return;
    }
    setBusy(true);
    try {
      await deleteLessonMaterial(id);
      if (targetModulePublicId) {
        onAfterMaterialsChange?.({
          modulePublicId: targetModulePublicId,
          standaloneLessonPublicId: targetStandaloneLessonPublicId,
          removeIds: [id],
        });
      }
      toast.success('File removed.');
    } catch (err) {
      toast.error(getLmsAxiosErrorMessage(err, 'Could not delete file.'));
    } finally {
      setBusy(false);
    }
  };

  const hintSecondary =
    !apiConfigured || !CONFIG.serverUrl?.trim()
      ? 'Set VITE_SERVER_URL and sign in so uploads reach your Laravel API.'
      : !hasTarget
        ? 'Choose a curriculum text lesson so files attach to the right lesson.'
        : null;

  return (
    <Box>
      <Typography sx={styles.label}>Lesson materials</Typography>

      <Box
        {...getRootProps()}
        sx={[
          (theme) => styles.dropzone(theme),
          isDragActive ? (theme) => styles.dropzoneActive(theme) : null,
          busy ? { opacity: 0.75, cursor: 'wait' } : null,
        ]}
      >
        <input {...getInputProps()} />
        <Stack
          direction="column"
          alignItems="center"
          spacing={1.5}
          sx={{ width: 1, maxWidth: 480, mx: 'auto', position: 'relative', zIndex: 1 }}
        >
          {busy ? (
            <CircularProgress size={24} />
          ) : (
            <Iconify icon="solar:upload-minimalistic-bold" width={40} sx={{ color: 'brand.accentText' }} />
          )}
          <Typography sx={styles.hint}>
            Drag & drop files here or browse files from your computer.
          </Typography>
          {hintSecondary ? (
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', px: 0.5, lineHeight: 1.55 }}>
              {hintSecondary}
            </Typography>
          ) : null}
          <Button
            variant="contained"
            color="primary"
            sx={[styles.browseButton, { alignSelf: 'center' }]}
            disabled={busy}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
          >
            Browse files
          </Button>
        </Stack>
      </Box>

      {lessonMaterials.length ? (
        <Stack spacing={0.75} sx={styles.fileList}>
          {lessonMaterials.map((m) => (
            <Stack
              key={m.id}
              direction="row"
              alignItems="center"
              spacing={1}
              justifyContent="space-between"
              sx={{
                px: 1,
                py: 0.75,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="body2" noWrap sx={{ flex: 1, minWidth: 0 }}>
                {m.name}
                {m.sizeBytes ? (
                  <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    {formatBytes(m.sizeBytes)}
                  </Typography>
                ) : null}
              </Typography>
              <Stack direction="row" spacing={0.25} sx={{ flexShrink: 0 }}>
                <IconButton
                  size="small"
                  aria-label={`Download ${m.name}`}
                  disabled={busy}
                  onClick={() => void handleDownload(m.id, m.name)}
                >
                  <Iconify icon="solar:download-minimalistic-bold" width={18} />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  aria-label={`Delete ${m.name}`}
                  disabled={busy}
                  onClick={() => void handleDelete(m.id)}
                >
                  <Iconify icon="solar:trash-bin-trash-bold-duotone" width={18} />
                </IconButton>
              </Stack>
            </Stack>
          ))}
        </Stack>
      ) : null}
    </Box>
  );
}
