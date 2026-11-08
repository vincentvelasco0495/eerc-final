import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';

export function rowSelectionState(rows = [], selectedIds = []) {
  const selectedIdSet = new Set(selectedIds);
  const someSelected = rows.some((row) => selectedIdSet.has(row.id));
  const allSelected = rows.length > 0 && rows.every((row) => selectedIdSet.has(row.id));
  return { selectedIdSet, someSelected, allSelected };
}

export function SelectAllCell({ checked, indeterminate, disabled, onChange }) {
  return (
    <TableCell padding="checkbox">
      <Checkbox
        size="small"
        checked={checked}
        indeterminate={indeterminate}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
        slotProps={{ input: { 'aria-label': 'Select all' } }}
      />
    </TableCell>
  );
}

export function RowSelectCell({ checked, disabled, onChange, label }) {
  return (
    <TableCell padding="checkbox">
      <Checkbox
        size="small"
        checked={checked}
        disabled={disabled}
        onChange={() => onChange?.()}
        slotProps={{ input: { 'aria-label': `Select ${label || 'row'}` } }}
      />
    </TableCell>
  );
}
