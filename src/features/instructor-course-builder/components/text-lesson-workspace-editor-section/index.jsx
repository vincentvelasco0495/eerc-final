import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Editor } from 'src/components/editor';

import { styles } from './styles';

export function TextLessonWorkspaceEditorSection({
  label,
  value,
  onChange,
  placeholder,
  minHeight = 280,
  maxHeight = 520,
  fullItem = false,
  /** When this changes while live-authoring, the editor reapplies `value` from the LMS snapshot. */
  contentRevision,
  /** HTML from LMS for this field when `contentRevision` bumps (beats stale React state in the same paint). */
  revisionApplyHtml,
}) {
  return (
    <Box>
      <Typography sx={styles.label}>{label}</Typography>
      <Editor
        value={value}
        contentRevision={contentRevision}
        revisionApplyHtml={revisionApplyHtml}
        onChange={onChange}
        placeholder={placeholder}
        fullItem={fullItem}
        chrome="tinymce"
        sx={{ minHeight, maxHeight }}
        tinymceResizeBounds={{
          min: 150,
          max: Math.max(200, maxHeight - 170),
        }}
      />
    </Box>
  );
}
