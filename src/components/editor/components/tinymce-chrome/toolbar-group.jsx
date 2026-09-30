import Stack from '@mui/material/Stack';

/**
 * Tight cluster of toolbar controls (icons share a small gap).
 */
export function ToolbarGroup({ children, sx }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={0.5}
      sx={[{ flexShrink: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {children}
    </Stack>
  );
}
