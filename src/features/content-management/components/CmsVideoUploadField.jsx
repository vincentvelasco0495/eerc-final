import { useDropzone } from 'react-dropzone';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import { deleteCmsMedia } from 'src/features/homepage-v2/api/homepage-v2-api';
import { getLmsAxiosErrorMessage, uploadLessonVideoInChunks } from 'src/redux/api/lmsApi';
import {
  resolveCmsMediaFromRecord,
  resolveCmsVideoPlaybackUrls,
} from 'src/features/homepage-v2/utils/resolve-cms-media-url';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { PremiumPlayableVideo } from 'src/components/common/premium-playable-video';

function slugifyLabel(label) {
  return String(label ?? 'video')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function unwrapUploadedCmsVideo(raw) {
  let payload = raw;
  for (let i = 0; i < 3; i += 1) {
    const nested = payload?.data;
    if (!nested || typeof nested !== 'object' || Array.isArray(nested)) {
      break;
    }
    if (nested.id || nested.mediaId || nested.publicId || nested.url || nested.fileUrl) {
      payload = nested;
    } else {
      break;
    }
  }
  if (!payload || typeof payload !== 'object') {
    return null;
  }
  const id = String(payload.id ?? payload.mediaId ?? payload.publicId ?? '').trim();
  if (!id) {
    return null;
  }
  return {
    id,
    url: payload.url ?? payload.fileUrl ?? payload.inlineFileUrl ?? null,
    filename: payload.filename ?? payload.originalName ?? payload.name ?? null,
    mime: payload.mime ?? null,
    size: payload.size ?? payload.sizeBytes ?? null,
    alt: payload.alt ?? null,
  };
}

export function CmsVideoUploadField({
  label,
  value,
  posterMedia,
  onChange,
  onUploaded,
  disabled,
  targetId = 'homepage-v2',
  watermarkText = '',
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(null);
  const [blobPreviewUrl, setBlobPreviewUrl] = useState('');
  const inputId = useMemo(() => `cms-video-upload-${slugifyLabel(label)}`, [label]);
  const playbackUrls = useMemo(() => resolveCmsVideoPlaybackUrls(value), [value]);
  const posterUrl = resolveCmsMediaFromRecord(posterMedia);
  const hasStoredVideo = playbackUrls.length > 0;
  const playerSources = useMemo(() => {
    const list = [];
    if (blobPreviewUrl) {
      list.push(blobPreviewUrl);
    }
    list.push(...playbackUrls);
    return [...new Set(list.filter(Boolean))];
  }, [blobPreviewUrl, playbackUrls]);
  const previewUrl = playerSources[0] || '';
  const playerKey = playerSources[0] || 'empty';

  const assignBlobPreview = useCallback((nextUrl) => {
    setBlobPreviewUrl((current) => {
      if (current && current.startsWith('blob:')) {
        URL.revokeObjectURL(current);
      }
      return nextUrl || '';
    });
  }, []);

  useEffect(
    () => () => {
      if (blobPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blobPreviewUrl);
      }
    },
    [blobPreviewUrl]
  );

  const onDrop = useCallback(
    async (files) => {
      const file = files?.[0];
      if (!file || disabled) {
        return;
      }
      setUploading(true);
      setUploadPercent(0);
      assignBlobPreview(URL.createObjectURL(file));
      try {
        const raw = await uploadLessonVideoInChunks({
          file,
          target: { kind: 'cms', id: targetId },
          onProgress: ({ percent }) => setUploadPercent(percent),
        });
        const media = unwrapUploadedCmsVideo(raw);
        if (!media) {
          throw new Error('Upload response missing media id.');
        }
        const next = {
          ...value,
          url: media.url,
          mediaId: media.id,
          filename: media.filename,
          alt: media.alt ?? value?.alt ?? label,
          size: media.size,
          mime: media.mime,
        };
        onChange(next);
        try {
          await onUploaded?.(next);
          toast.success('Video uploaded.');
        } catch {
          toast.success('Video uploaded. Click Save changes to keep it on this page.');
        }
      } catch (e) {
        toast.error(getLmsAxiosErrorMessage(e, 'Upload failed.'));
      } finally {
        setUploading(false);
        setUploadPercent(null);
      }
    },
    [assignBlobPreview, disabled, label, onChange, onUploaded, targetId, value]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'video/*': ['.mp4', '.webm', '.ogg'] },
    maxFiles: 1,
    disabled: disabled || uploading,
    noClick: true,
    noKeyboard: true,
  });

  const handleRemove = async () => {
    if (value?.mediaId) {
      try {
        await deleteCmsMedia(value.mediaId);
      } catch {
        /* file may already be gone */
      }
    }
    assignBlobPreview('');
    onChange({ ...value, url: null, mediaId: null, filename: null, size: null, mime: null });
    toast.info('Video removed.');
  };

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2">{label}</Typography>
      <input {...getInputProps()} id={inputId} />
      {previewUrl ? (
        <Box
          {...getRootProps()}
          sx={{
            borderRadius: 2,
            border: (theme) => `2px dashed ${theme.palette.divider}`,
            bgcolor: 'background.neutral',
            p: 2,
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <Box sx={{ position: 'relative' }}>
            {blobPreviewUrl || hasStoredVideo ? (
              <PremiumPlayableVideo
                key={playerKey}
                src={previewUrl}
                sources={playerSources}
                poster={posterUrl}
                title={value?.alt || label}
                aspectRatio="16 / 9"
                watermarkText={watermarkText}
              />
            ) : null}
            {uploading ? (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0,0,0,0.62)',
                  borderRadius: 1.5,
                }}
              >
                <Stack spacing={1.25} sx={{ alignItems: 'center', px: 3, width: 1, maxWidth: 360 }}>
                  <CircularProgress size={40} sx={{ color: 'common.white' }} />
                  {Number.isFinite(Number(uploadPercent)) ? (
                    <>
                      <LinearProgress
                        variant="determinate"
                        value={Math.max(0, Math.min(100, Number(uploadPercent)))}
                        sx={{ width: 1, height: 8, borderRadius: 99 }}
                      />
                      <Typography variant="body2" sx={{ color: 'common.white', textAlign: 'center' }}>
                        {Number(uploadPercent) >= 99
                          ? 'Assembling video… keep this tab open.'
                          : `Uploading ${Math.round(Number(uploadPercent))}% — large files resume if interrupted.`}
                      </Typography>
                    </>
                  ) : null}
                </Stack>
              </Box>
            ) : null}
          </Box>
        </Box>
      ) : (
        <Box
          {...getRootProps()}
          sx={{
            borderRadius: 2,
            border: (theme) => `2px dashed ${theme.palette.divider}`,
            bgcolor: 'background.neutral',
            p: 2,
            cursor: disabled ? 'not-allowed' : 'default',
            opacity: disabled ? 0.6 : 1,
          }}
        >
          {uploading ? (
            <Stack alignItems="center" spacing={1.25} py={4}>
              <CircularProgress size={32} />
              {Number.isFinite(Number(uploadPercent)) ? (
                <>
                  <LinearProgress
                    variant="determinate"
                    value={Math.max(0, Math.min(100, Number(uploadPercent)))}
                    sx={{ width: 1, maxWidth: 360, height: 8, borderRadius: 99 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {Number(uploadPercent) >= 99
                      ? 'Assembling video… keep this tab open.'
                      : `Uploading ${Math.round(Number(uploadPercent))}%`}
                  </Typography>
                </>
              ) : null}
            </Stack>
          ) : (
            <Stack alignItems="center" spacing={1} py={3}>
              <Iconify icon="solar:videocamera-add-bold-duotone" width={36} />
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {isDragActive
                  ? 'Drop video here'
                  : 'Drag & drop or browse to upload. Large files upload in chunks and can resume if interrupted.'}
              </Typography>
            </Stack>
          )}
        </Box>
      )}
      <TextField
        size="small"
        label="Alt text"
        value={value?.alt ?? ''}
        disabled={disabled}
        onChange={(e) => onChange({ ...value, alt: e.target.value })}
      />
      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          variant="outlined"
          disabled={disabled || uploading}
          onClick={() => open()}
        >
          {previewUrl ? 'Replace' : 'Browse files'}
        </Button>
        <Button
          size="small"
          color="error"
          variant="outlined"
          disabled={disabled || uploading || !previewUrl}
          onClick={handleRemove}
        >
          Remove
        </Button>
      </Stack>
    </Stack>
  );
}
