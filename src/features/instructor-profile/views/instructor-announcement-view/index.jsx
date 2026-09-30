import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import axios from 'src/lib/axios';
import { lmsEndpoints } from 'src/redux/api/lmsEndpoints';

import { Editor } from 'src/components/editor';
import { toast } from 'src/components/snackbar';

import { styles } from './styles';
import { announcementFieldCopy } from '../../instructor-announcement-data';
import { InstructorWorkspaceShell } from '../../components/instructor-workspace-shell';

export function InstructorAnnouncementView() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [messageRevision, setMessageRevision] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter an announcement title.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post(lmsEndpoints.announcements(), {
        title: title.trim(),
        body: message || '',
      });
      const count = Number(res.data?.recipientCount ?? 0);
      if (count > 0) {
        toast.success(`Announcement sent to ${count} enrolled student(s).`);
      } else {
        toast.success('Announcement saved. No approved enrollments to notify yet.');
      }
      setTitle('');
      setMessage('');
      setMessageRevision((n) => n + 1);
    } catch (error) {
      toast.error(error?.message || 'Could not send announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  const { title: titleCopy, message: messageCopy } = announcementFieldCopy;

  return (
    <InstructorWorkspaceShell>
      <Stack spacing={2.5} component="form" onSubmit={handleSubmit}>
        <Typography variant="h4" sx={styles.pageTitle}>
          Announcement
        </Typography>

        <Box sx={styles.formSurface}>
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              required
              label={titleCopy.label}
              helperText={titleCopy.helperText}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={titleCopy.placeholder}
              inputProps={{ 'aria-label': titleCopy.label }}
              sx={styles.textField}
            />

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {messageCopy.label}
              </Typography>
              <Editor
                value={message}
                onChange={setMessage}
                placeholder={messageCopy.placeholder}
                helperText={messageCopy.helperText}
                contentRevision={messageRevision}
                revisionApplyHtml={message}
                chrome="tinymce"
                sx={{
                  mt: 0.5,
                  minHeight: 320,
                  maxHeight: 560,
                }}
                tinymceResizeBounds={{
                  min: 180,
                  max: 520,
                }}
              />
            </Box>

            <Stack direction="row" justifyContent="flex-end" sx={styles.actionsRow}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
                sx={styles.submitButton}
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </InstructorWorkspaceShell>
  );
}
