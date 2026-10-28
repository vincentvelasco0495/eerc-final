import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
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

import { courseTabTypeLabel, COURSE_TAB_TYPE_OPTIONS } from './course-detail-data';

export function CourseTabsManageDialog({ open, onClose, courseId, tabs, onChanged }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('folder');
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const resetDraft = () => {
    setTitle('');
    setType('folder');
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
    const payload = { title: nextTitle, type };
    setBusy(true);
    try {
      if (editing?.id) {
        await patchCourseLibraryTab(editing.id, payload);
        toast.success('Tab updated.');
      } else {
        await postCourseLibraryTab(courseId, payload);
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

  const deleteContent =
    (pendingDelete?.type || 'folder') === 'folder'
      ? `Delete “${pendingDelete?.title ?? 'this tab'}” and all of its folders and files?`
      : `Delete the “${pendingDelete?.title ?? 'this tab'}” tab? Lessons stay on the course.`;

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Course tabs</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Every tab can be renamed, retyped, or deleted. Quiz, Handouts, Lecture video, and Group
              study show course lessons. Folder tabs hold images, PDFs, and other files (10 MB max per
              file).
            </Typography>

            <Stack spacing={1}>
              {(tabs ?? []).map((tab) => (
                <Stack
                  key={tab.id}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ px: 1.5, py: 1, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
                >
                  <Stack spacing={0.25}>
                    <Typography variant="body2">{tab.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {courseTabTypeLabel(tab.type)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      onClick={() => {
                        setEditing(tab);
                        setTitle(tab.title);
                        setType(tab.type || 'folder');
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
              label={editing ? 'Tab name' : 'New tab name'}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel id="course-tab-type-label">Type</InputLabel>
              <Select
                labelId="course-tab-type-label"
                label="Type"
                value={type}
                onChange={(event) => setType(event.target.value)}
              >
                {COURSE_TAB_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
        content={deleteContent}
        action={
          <Button color="error" variant="contained" onClick={removeTab} disabled={busy}>
            Delete
          </Button>
        }
      />
    </>
  );
}
