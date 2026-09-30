import Stack from '@mui/material/Stack';

import { TINYMCE } from './tinymce-theme';

/**
 * One horizontal strip in the toolbar. Use {@link ToolbarGroup} for clustered controls
 * and place multiple groups with {@link TINYMCE.groupGapPx} spacing.
 */
export function ToolbarRow({ children, divider = true, sx }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={[
        (theme) => ({
          flexWrap: { xs: 'nowrap', md: 'wrap' },
          overflowX: { xs: 'auto', md: 'visible' },
          WebkitOverflowScrolling: 'touch',
          rowGap: 0.75,
          columnGap: { xs: '10px', md: `${TINYMCE.groupGapPx}px` },
          px: { xs: 1, sm: 1.5 },
          py: { xs: 1, sm: 0.75 },
          minHeight: { xs: 48, md: 40 },
          maxWidth: 1,
          backgroundColor: TINYMCE.chromeSurface,
          borderBottom: divider ? `1px solid ${TINYMCE.hairline}` : 'none',
          [theme.breakpoints.down('md')]: {
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': { height: 6 },
            '&::-webkit-scrollbar-thumb': {
              borderRadius: 99,
              backgroundColor: theme.palette.divider,
            },
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Stack>
  );
}
