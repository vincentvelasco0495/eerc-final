import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Editor } from 'src/components/editor';
import { toast } from 'src/components/snackbar';

import { styles } from './styles';
import { courseNoticeSeedHtml } from '../../instructor-course-curriculum-data';

/** Navbar “Notice” tab — mirrors `/course-curriculum` rich-editor layout with optional LMS save. */
export function CourseNoticeWorkspace({
  persisted = false,
  noticeHeading = '',
  onNoticeHeadingChange,
  noticeHtml = '',
  onNoticeHtmlChange,
  onPersist,
} = {}) {
  const [localHtml, setLocalHtml] = useState(courseNoticeSeedHtml);

  const displayedHtml = persisted ? noticeHtml : localHtml;
  const onHtmlChange =
    persisted && typeof onNoticeHtmlChange === 'function'
      ? onNoticeHtmlChange
      : setLocalHtml;

  const handleDemoSave = useCallback(() => {
    toast.success('Notice saved (demo).');
  }, []);

  const handlePersist = useCallback(async () => {
    if (!onPersist) {
      return;
    }
    try {
      await onPersist();
    } catch (e) {
      toast.error(e?.message ?? 'Save failed.');
    }
  }, [onPersist]);

  return (
    <Box sx={styles.workspaceRoot}>
      <Box sx={styles.pageCard}>
        <Typography sx={styles.cardTitle} component="h2">
          Notice
        </Typography>
        <Divider sx={styles.dividerUnderTitle} />

        {persisted ? (
          <TextField
            label="Notice heading"
            fullWidth
            value={noticeHeading}
            onChange={(e) => onNoticeHeadingChange?.(e.target.value)}
            sx={{ mb: 2 }}
            size="small"
          />
        ) : null}

        <Editor
          value={displayedHtml}
          onChange={onHtmlChange}
          placeholder="Write a notice for enrolled students…"
          chrome="tinymce"
          sx={{
            mt: 0,
            minHeight: 360,
            maxHeight: 640,
          }}
          tinymceResizeBounds={{
            min: 180,
            max: 520,
          }}
        />

        <Box sx={styles.footerRow}>
          <Button
            variant="contained"
            color="primary"
            sx={styles.saveBtn}
            onClick={persisted ? handlePersist : handleDemoSave}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
