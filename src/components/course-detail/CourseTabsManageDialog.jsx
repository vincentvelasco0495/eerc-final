import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { getLmsAxiosErrorMessage } from 'src/lib/lms-instructor-api';
import {
  postCourseLibraryTab,
  patchCourseLibraryTab,
  deleteCourseLibraryTab,
} from 'src/redux/api/lmsApi';

import { toast } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { DEFAULT_COURSE_TAB_LABELS } from './course-detail-data';

export function CourseTabsManageDialog({ open, onClose, courseId, customTabs, onChanged }) {
  const [title, setTitle] = useState('');
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const resetDraft = () => {
    setTitle('');
    setEditing(null);
  };

  const handleClose = () => {
    resetDraft();
    onClose?.();
  };

  const saveTab = async () => {
    const nextTitle = title.trim();
    if (!nextTitle) {
      toast.error('Tab name is required.');
      return;
    }
    setBusy(true);
    try {
      if (editing?.id) {
        await patchCourseLibraryTab(editing.id, { title: nextTitle });
        toast.success('Tab updated.');
      } else {
        await postCourseLibraryTab(courseId, { title: nextTitle });
        toast.success('Tab added.');
      }
      resetDraft();
      await onChanged?.();
    } catch (error) {
      toast.error(getLmsAxiosErrorMessage(error, 'Could not save tab.'));
    } finally {
      setBusy(false);
    }
  };

  const removeTab = async () => {
    if (!pendingDelete?.id) {
      return;
    }
    setBusy(true);
    try {
      await deleteCourseLibraryTab(pendingDelete.id);
      toast.success('Tab deleted.');
      if (editing?.id === pendingDelete.id) {
        resetDraft();
      }
      setPendingDelete(null);
      await onChanged?.();
    } catch (error) {
      toast.error(getLmsAxiosErrorMessage(error, 'Could not delete tab.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Course tabs</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Quiz, Handouts, Lecture video, and Group study stay as the default tabs. Extra tabs are
              for folders of images, PDFs, and other files (10 MB max per file).
            </Typography>

            <Stack spacing={1}>
              {Object.entries(DEFAULT_COURSE_TAB_LABELS).map(([key, label]) => (
                <Stack
                  key={key}
                  direction="row"
                  justifyContent="space-between"
                  sx={{ px: 1.5, py: 1, borderRadius: 1, bgcolor: 'action.hover' }}
                >
                  <Typography variant="body2">{label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Default
                  </Typography>
                </Stack>
              ))}
              {(customTabs ?? []).map((tab) => (
                <Stack
                  key={tab.id}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ px: 1.5, py: 1, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
                >
                  <Typography variant="body2">{tab.title}</Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      onClick={() => {
                        setEditing(tab);
                        setTitle(tab.title);
                      }}
                    >
                      Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => setPendingDelete(tab)}>
                      Delete
                    </Button>
                  </Stack>
                </Stack>
              ))}
            </Stack>

            <TextField
              label={editing ? 'Rename tab' : 'New tab name'}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          {editing ? (
            <Button onClick={resetDraft} disabled={busy}>
              Cancel edit
            </Button>
          ) : null}
          <Button onClick={handleClose}>Close</Button>
          <Button variant="contained" onClick={saveTab} disabled={busy}>
            {editing ? 'Update tab' : 'Add tab'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Delete tab"
        content={`Delete “${pendingDelete?.title ?? 'this tab'}” and all of its folders and files?`}
        action={
          <Button color="error" variant="contained" onClick={removeTab} disabled={busy}>
            Delete
          </Button>
        }
      />
    </>
  );
}
