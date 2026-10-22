import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { exportRowsToExcel } from 'src/utils/export-excel';

import { exportDateQuery } from 'src/lib/lms-excel-export';

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
  children,
}) {
  const [exporting, setExporting] = useState(false);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  const rangeError = Boolean(from && to && from.isAfter(to, 'day'));

  const handleClick = async () => {
    if (rangeError) {
      toast.error('End date must be on or after the start date.');
      return;
    }
    setExporting(true);
    try {
      const range = exportDateQuery({ from, to });
      if (onExport) {
        await onExport(range);
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
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'stretch', sm: 'center' }}
      spacing={1}
      flexWrap="wrap"
      useFlexGap
      sx={{ width: { xs: 1, sm: 'auto' } }}
    >
      {children}
      <DatePicker
        label="From"
        value={from}
        onChange={setFrom}
        maxDate={to || undefined}
        slotProps={{
          field: { clearable: true },
          textField: {
            size: 'small',
            sx: { width: { xs: 1, sm: 200 }, minWidth: { xs: 0, sm: 200 } },
          },
        }}
      />
      <DatePicker
        label="To"
        value={to}
        onChange={setTo}
        minDate={from || undefined}
        slotProps={{
          field: { clearable: true },
          textField: {
            size: 'small',
            sx: { width: { xs: 1, sm: 200 }, minWidth: { xs: 0, sm: 200 } },
          },
        }}
      />
      <Button
        size="small"
        variant="outlined"
        color="inherit"
        startIcon={<Iconify icon="solar:export-bold" />}
        onClick={handleClick}
        disabled={disabled || exporting || rangeError}
        sx={{ width: { xs: 1, sm: 'auto' } }}
      >
        {exporting ? 'Exporting…' : 'Export Excel'}
      </Button>
    </Stack>
  );
}
