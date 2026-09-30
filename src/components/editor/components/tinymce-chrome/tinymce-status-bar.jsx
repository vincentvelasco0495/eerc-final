import { useEditorState } from '@tiptap/react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { TINYMCE } from './tinymce-theme';

function blockTagFromSelection(editor) {
  const { $from } = editor.state.selection;
  const name = $from.parent.type.name;
  if (name === 'paragraph') return 'p';
  if (name === 'heading') return `h${$from.parent.attrs.level}`;
  return name;
}

/** Path / element context only (word count + resize live on the document wrapper). */
export function TinyMcePathStrip({ editor }) {
  const { path } = useEditorState({
    editor,
    selector: (ctx) => ({
      path: blockTagFromSelection(ctx.editor),
    }),
  });

  if (!editor) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        px: 1,
        py: 0.5,
        minHeight: 26,
        borderTop: `1px solid ${TINYMCE.hairline}`,
        backgroundColor: TINYMCE.chromeSurface,
      }}
    >
      <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
        {path}
      </Typography>
    </Box>
  );
}
