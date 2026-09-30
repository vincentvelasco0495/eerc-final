import { useState } from 'react';

import Button from '@mui/material/Button';

import { exportRowsToExcel } from 'src/utils/export-excel';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';

export function ExportExcelButton({
  fileName,
  sheetName = 'Sheet1',
  headers,
  rows = [],
  mapRow,
  disabled = false,
  onExport,
  successMessage = 'List exported to Excel.',
}) {
  const [exporting, setExporting] = useState(false);

  const handleClick = async () => {
    setExporting(true);
    try {
      if (onExport) {
        await onExport();
      } else {
        exportRowsToExcel({ fileName, sheetName, headers, rows, mapRow });
      }
      toast.success(successMessage);
    } catch (error) {
      const message =
        typeof error === 'string' ? error : error?.message ?? 'Could not export to Excel.';
      toast.error(message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      size="small"
      variant="outlined"
      color="inherit"
      startIcon={<Iconify icon="solar:export-bold" />}
      onClick={handleClick}
      disabled={disabled || exporting}
    >
      {exporting ? 'Exporting…' : 'Export Excel'}
    </Button>
  );
}
