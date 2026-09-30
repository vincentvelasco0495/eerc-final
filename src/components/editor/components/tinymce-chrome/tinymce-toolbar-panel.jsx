import Box from '@mui/material/Box';

import { TINYMCE } from './tinymce-theme';

/** Top chrome: white panel with subtle shadow + bottom edge (toolbar only). */
export function TinyMceToolbarPanel({ children }) {
  return (
    <Box
      sx={{
        flexShrink: 0,
        alignSelf: 'stretch',
        width: 1,
        backgroundColor: TINYMCE.chromeSurface,
        borderBottom: `1px solid ${TINYMCE.hairline}`,
        boxShadow: TINYMCE.toolbarShadow,
      }}
    >
      {children}
    </Box>
  );
}
