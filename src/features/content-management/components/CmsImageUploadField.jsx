import { useDropzone } from 'react-dropzone';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { resolveCmsMediaUrl } from 'src/features/homepage-v2/utils/resolve-cms-media-url';
import { uploadCmsMedia, deleteCmsMedia } from 'src/features/homepage-v2/api/homepage-v2-api';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

export function CmsImageUploadField({ label, value, onChange, disabled, inputId }) {
  const [uploading, setUploading] = useState(false);
  const url = resolveCmsMediaUrl(value?.url, value?.mediaId ?? null);
  const uploadInputId = inputId || `cms-upload-${String(label ?? 'image').replace(/\s+/g, '-').toLowerCase()}`;

  const onDrop = useCallback(
    async (files) => {
      const file = files?.[0];
      if (!file || disabled) {
        return;
      }
      setUploading(true);
      try {
        const media = await uploadCmsMedia(file, value?.alt ?? label);
        onChange({
          ...value,
          url: media.url,
          mediaId: media.id,
          filename: media.filename,
          alt: media.alt ?? value?.alt ?? label,
          size: media.size,
        });
        toast.success('Image uploaded.');
      } catch (e) {
        toast.error(e?.message ?? 'Upload failed.');
      } finally {
        setUploading(false);
      }
    },
    [disabled, label, onChange, value]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxFiles: 1,
    disabled: disabled || uploading,
  });

  const handleRemove = async () => {
    if (value?.mediaId) {
      try {
        await deleteCmsMedia(value.mediaId);
      } catch {
        /* file may already be gone */
      }
    }
    onChange({ ...value, url: null, mediaId: null, filename: null, size: null });
    toast.info('Image removed.');
  };

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2">{label}</Typography>
      <Box
        {...getRootProps()}
        sx={{
          borderRadius: 2,
          border: (theme) => `2px dashed ${theme.palette.divider}`,
          bgcolor: 'background.neutral',
          p: 2,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <input {...getInputProps()} id={uploadInputId} />
        {uploading ? (
          <Stack alignItems="center" py={4}>
            <CircularProgress size={32} />
          </Stack>
        ) : url ? (
          <Box
            component="img"
            src={url}
            alt={value?.alt ?? label}
            sx={{ width: 1, maxHeight: 200, objectFit: 'cover', borderRadius: 1.5 }}
          />
        ) : (
          <Stack alignItems="center" spacing={1} py={3}>
            <Iconify icon="solar:gallery-add-bold-duotone" width={36} />
            <Typography variant="body2" color="text.secondary">
              {isDragActive ? 'Drop image here' : 'Drag & drop or click to upload (JPG, PNG, WebP)'}
            </Typography>
          </Stack>
        )}
      </Box>
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
          onClick={() => document.getElementById(uploadInputId)?.click()}
        >
          Replace
        </Button>
        <Button
          size="small"
          color="error"
          variant="outlined"
          disabled={disabled || !url}
          onClick={handleRemove}
        >
          Remove
        </Button>
      </Stack>
    </Stack>
  );
}
