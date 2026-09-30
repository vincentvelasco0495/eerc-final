import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { ENROLLMENT_MAX_FILE_BYTES } from '../constants';

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return '';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function EnrollmentFileDropzone({
  label,
  helperText,
  value,
  onChange,
  accept,
  error,
  required = false,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState('');

  const validateFile = useCallback((file) => {
    if (!file) return '';
    if (file.size > ENROLLMENT_MAX_FILE_BYTES) {
      return 'File must be 10 MB or smaller.';
    }
    return '';
  }, []);

  const handleFiles = useCallback(
    (files) => {
      const file = files?.[0] ?? null;
      if (!file) {
        onChange(null);
        return;
      }
      const message = validateFile(file);
      setLocalError(message);
      if (!message) {
        onChange(file);
      }
    },
    [onChange, validateFile]
  );

  const displayError = error || localError;

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">
        {label}
        {required ? (
          <Box component="span" sx={{ color: 'error.main' }}>
            {' '}
            *
          </Box>
        ) : null}
      </Typography>
      {helperText ? (
        <Typography variant="body2" color="text.secondary">
          {helperText}
        </Typography>
      ) : null}
      <Box
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          handleFiles(event.dataTransfer.files);
        }}
        sx={{
          p: 3,
          borderRadius: 1.5,
          textAlign: 'center',
          border: '1px dashed',
          borderColor: displayError ? 'error.main' : dragOver ? 'primary.main' : 'divider',
          bgcolor: (theme) =>
            dragOver ? theme.vars.palette.brand.accentSoft : theme.vars.palette.background.neutral,
          transition: (theme) => theme.transitions.create(['border-color', 'background-color']),
        }}
      >
        <Iconify icon="solar:cloud-upload-bold-duotone" width={40} sx={{ color: 'brand.accentText', mb: 1 }} />
        <Typography variant="body2" sx={{ mb: 1 }}>
          Drag and drop a file here, or browse from your device.
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
          Accepted: image, PDF, or document · Max 10 MB
        </Typography>
        <Button variant="outlined" onClick={() => inputRef.current?.click()}>
          Choose file
        </Button>
        <input
          ref={inputRef}
          type="file"
          hidden
          accept={Object.keys(accept).join(',')}
          onChange={(event) => handleFiles(event.target.files)}
        />
      </Box>
      {value ? (
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Typography variant="body2" noWrap sx={{ maxWidth: '75%' }}>
            {value.name} · {formatBytes(value.size)}
          </Typography>
          <Button size="small" color="inherit" onClick={() => onChange(null)}>
            Remove
          </Button>
        </Stack>
      ) : null}
      {displayError ? (
        <Typography variant="caption" color="error.main">
          {displayError}
        </Typography>
      ) : null}
    </Stack>
  );
}
