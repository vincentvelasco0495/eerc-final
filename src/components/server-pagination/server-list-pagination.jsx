import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { buildPageList } from './server-pagination-meta';

// ----------------------------------------------------------------------

/**
 * Footer: range summary (left) and Previous / page numbers / Next (right).
 * Same layout as the Programs dashboard list — use for any server-paginated table.
 */
export function ServerListPagination({
  page = 1,
  lastPage = 1,
  total = 0,
  from = 0,
  to = 0,
  onPageChange,
  disabled = false,
  singularItemLabel = 'item',
  pluralItemLabel = 'items',
  sx,
}) {
  const pages = buildPageList(page, lastPage);
  const items = [];

  for (let i = 0; i < pages.length; i += 1) {
    const p = pages[i];
    const prev = pages[i - 1];
    if (i > 0 && p - prev > 1) {
      items.push(
        <Typography key={`ellipsis-${prev}-${p}`} variant="body2" color="text.secondary" sx={{ px: 0.5 }}>
          …
        </Typography>
      );
    }
    items.push(
      <Button
        key={p}
        size="small"
        variant={p === page ? 'contained' : 'text'}
        color={p === page ? 'primary' : 'inherit'}
        onClick={() => onPageChange(p)}
        disabled={disabled || p === page}
        sx={{ minWidth: 40 }}
      >
        {p}
      </Button>
    );
  }

  const noun = total === 1 ? singularItemLabel : pluralItemLabel;
  const rangeLabel =
    total === 0
      ? `Showing 0 of 0 ${pluralItemLabel}`
      : `Showing ${from}–${to} of ${total} ${noun}`;

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      alignItems={{ xs: 'stretch', sm: 'center' }}
      justifyContent="space-between"
      sx={[
        { pt: 2, borderTop: (t) => `1px solid ${t.vars.palette.divider}` },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 0 }}>
        {rangeLabel}
      </Typography>

      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        flexWrap="wrap"
        justifyContent="flex-end"
        sx={{ ml: { xs: 0, sm: 'auto' }, width: { xs: '100%', sm: 'auto' } }}
      >
        <Button size="small" variant="outlined" disabled={disabled || page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 0.5,
            justifyContent: 'flex-end',
          }}
        >
          {items}
        </Box>

        <Button
          size="small"
          variant="outlined"
          disabled={disabled || page >= lastPage}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </Stack>
    </Stack>
  );
}
