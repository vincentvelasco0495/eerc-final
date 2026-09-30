import { useRef } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';

export function FooterActions({
  onAddQuestion,
  onImportPdf,
  onSave,
  saveDisabled = false,
  importDisabled = false,
}) {
  const pdfInputRef = useRef(null);

  return (
    <Box sx={styles.footer}>
      <span />
      <Box sx={styles.footerCenter}>
        <Button
          variant="outlined"
          color="inherit"
          sx={styles.footerBtn}
          disabled={importDisabled}
          onClick={() => pdfInputRef.current?.click()}
          startIcon={<Iconify icon="solar:file-text-bold" width={18} />}
        >
          Import PDF
        </Button>
        <input
          ref={pdfInputRef}
          type="file"
          accept="application/pdf,.pdf"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            event.target.value = '';
            if (file) {
              onImportPdf?.(file);
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={styles.footerBtn}
          onClick={onAddQuestion}
          disabled={importDisabled}
          endIcon={<Iconify icon="solar:alt-arrow-down-linear" width={18} />}
        >
          + Question
        </Button>
      </Box>
      <Box sx={styles.footerEnd}>
        <Button
          variant="contained"
          color="primary"
          sx={{ ...styles.footerBtn, width: { xs: 1, sm: 'auto' } }}
          onClick={onSave}
          disabled={saveDisabled || importDisabled}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
