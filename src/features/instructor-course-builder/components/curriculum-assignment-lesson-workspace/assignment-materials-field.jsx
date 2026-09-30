import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import { materialStyles } from './assignment-materials-styles';

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

function createMaterialFromFile(file) {
  return {
    id: `material-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: file.name,
    sizeBytes: file.size,
    file,
  };
}

export function AssignmentMaterialsField({ materials = [], onMaterialsChange, disabled = false }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (!acceptedFiles?.length) {
        return;
      }
      const next = [
        ...(Array.isArray(materials) ? materials : []),
        ...acceptedFiles.map(createMaterialFromFile),
      ];
      onMaterialsChange?.(next);
    },
    [materials, onMaterialsChange]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: true,
    noClick: true,
    noKeyboard: true,
    disabled,
  });

  const handleRemove = useCallback(
    (materialId) => {
      onMaterialsChange?.((Array.isArray(materials) ? materials : []).filter((m) => m.id !== materialId));
    },
    [materials, onMaterialsChange]
  );

  const rows = Array.isArray(materials) ? materials : [];

  return (
    <Box sx={{ mt: 2.5 }}>
      <Typography sx={materialStyles.label}>Assignment materials</Typography>

      <Box
        {...getRootProps()}
        sx={[
          (theme) => materialStyles.dropzone(theme),
          isDragActive ? (theme) => materialStyles.dropzoneActive(theme) : null,
          disabled ? { opacity: 0.75, cursor: 'not-allowed' } : null,
        ]}
      >
        <input {...getInputProps()} />
        <Stack direction="column" alignItems="center" spacing={1.5} sx={{ width: 1, maxWidth: 480, mx: 'auto' }}>
          <Iconify icon="solar:upload-minimalistic-bold" width={40} sx={{ color: 'brand.accentText' }} />
          <Typography sx={materialStyles.hint}>
            Drag &amp; drop files here or browse files from your computer.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={materialStyles.browseButton}
            disabled={disabled}
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

      {rows.length ? (
        <Stack spacing={0.75} sx={materialStyles.fileList}>
          {rows.map((material) => (
            <Stack
              key={material.id}
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
                {material.name}
                {material.sizeBytes ? (
                  <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    {formatBytes(material.sizeBytes)}
                  </Typography>
                ) : null}
              </Typography>
              <IconButton
                size="small"
                color="error"
                aria-label={`Remove ${material.name}`}
                disabled={disabled}
                onClick={() => handleRemove(material.id)}
              >
                <Iconify icon="solar:trash-bin-trash-bold-duotone" width={18} />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      ) : null}
    </Box>
  );
}
