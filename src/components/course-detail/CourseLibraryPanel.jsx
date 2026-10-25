import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

import { getLmsAxiosErrorMessage } from 'src/lib/lms-instructor-api';
import {
  postCourseLibraryFile,
  postCourseLibraryFolder,
  deleteCourseLibraryFile,
  patchCourseLibraryFolder,
  deleteCourseLibraryFolder,
  fetchCourseLibraryFileBlob,
  COURSE_LIBRARY_MAX_FILE_BYTES,
} from 'src/redux/api/lmsApi';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

const ACCEPT =
  '.jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,image/*,application/pdf';

function formatSize(bytes) {
  const n = Number(bytes) || 0;
  if (n < 1024) {
    return `${n} B`;
  }
  if (n < 1024 * 1024) {
    return `${(n / 1024).toFixed(1)} KB`;
  }
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function LibraryFileThumb({ file }) {
  const [src, setSrc] = useState('');

  useEffect(() => {
    if (file.kind !== 'image') {
      return undefined;
    }
    let url = '';
    let cancelled = false;
    fetchCourseLibraryFileBlob(file.id, true)
      .then((blob) => {
        if (cancelled) {
          return;
        }
        url = URL.createObjectURL(blob);
        setSrc(url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [file.id, file.kind]);

  if (file.kind === 'image' && src) {
    return (
      <Box
        component="img"
        src={src}
        alt=""
        sx={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 1 }}
      />
    );
  }

  return (
    <Box
      sx={{
        width: 72,
        height: 72,
        borderRadius: 1,
        display: 'grid',
        placeItems: 'center',
        bgcolor: 'action.hover',
        color: 'text.secondary',
      }}
    >
      <Iconify
        icon={file.kind === 'pdf' ? 'solar:document-text-bold' : 'solar:file-bold'}
        width={28}
      />
    </Box>
  );
}

function LibraryFolderCard({
  folder,
  depth,
  canManage,
  dragOverId,
  setDragOverId,
  uploads,
  onRename,
  onCreateChild,
  onDeleteFolder,
  onDeleteFile,
  onOpenFile,
  onDropFiles,
}) {
  const childFolders = Array.isArray(folder.folders) ? folder.folders : [];
  const files = Array.isArray(folder.files) ? folder.files : [];
  const folderUploads = (uploads ?? []).filter((item) => item.folderId === folder.id);
  const empty = childFolders.length === 0 && files.length === 0 && folderUploads.length === 0;

  return (
    <Box
      onDragOver={(event) => {
        if (!canManage) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        setDragOverId(folder.id);
      }}
      onDragLeave={() => setDragOverId((prev) => (prev === folder.id ? '' : prev))}
      onDrop={(event) => {
        if (!canManage) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        setDragOverId('');
        onDropFiles(folder.id, Array.from(event.dataTransfer.files ?? []));
      }}
      sx={{
        p: 2,
        borderRadius: 2,
        border: '1px dashed',
        borderColor: dragOverId === folder.id ? 'primary.main' : 'divider',
        bgcolor: dragOverId === folder.id ? 'action.hover' : 'background.paper',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        flexWrap="wrap"
        useFlexGap
        sx={{ mb: 1.5 }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Iconify icon="solar:folder-bold" width={22} />
          <Typography variant="subtitle1">{folder.name}</Typography>
        </Stack>
        {canManage ? (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {depth < 8 ? (
              <Button size="small" onClick={() => onCreateChild(folder)}>
                New folder
              </Button>
            ) : null}
            <Button size="small" component="label">
              Upload
              <input
                type="file"
                hidden
                multiple
                accept={ACCEPT}
                onChange={(event) => {
                  const picked = Array.from(event.target.files ?? []);
                  event.target.value = '';
                  if (picked.length > 0) {
                    onDropFiles(folder.id, picked);
                  }
                }}
              />
            </Button>
            <Button size="small" onClick={() => onRename(folder)}>
              Rename
            </Button>
            <Button size="small" color="error" onClick={() => onDeleteFolder(folder)}>
              Delete
            </Button>
          </Stack>
        ) : null}
      </Stack>

      {empty ? (
        <Typography variant="body2" color="text.secondary">
          Empty folder
        </Typography>
      ) : null}

      {folderUploads.length > 0 ? (
        <Stack spacing={1.25} sx={{ mb: files.length || childFolders.length ? 1.5 : 0 }}>
          {folderUploads.map((item) => (
            <Box key={item.id} sx={{ px: 0.5 }}>
              <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ mb: 0.5 }}>
                <Typography variant="body2" noWrap>
                  {item.status === 'uploading' ? `Uploading ${item.name}` : item.name}
                </Typography>
                <Typography variant="caption" color={item.status === 'error' ? 'error' : 'text.secondary'}>
                  {item.status === 'error'
                    ? 'Failed'
                    : item.status === 'done'
                      ? 'Done'
                      : `${item.percent}%`}
                </Typography>
              </Stack>
              <LinearProgress
                variant={
                  item.status === 'uploading' && item.percent < 1 ? 'indeterminate' : 'determinate'
                }
                value={item.status === 'error' ? 100 : item.percent}
                color={item.status === 'error' ? 'error' : 'primary'}
              />
            </Box>
          ))}
        </Stack>
      ) : null}

      {files.length > 0 ? (
        <Stack spacing={1} sx={{ mb: childFolders.length ? 1.5 : 0 }}>
          {files.map((file) => (
            <Stack
              key={file.id}
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{
                p: 1,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <LibraryFileThumb file={file} />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="body2" noWrap>
                  {file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatSize(file.sizeBytes)}
                </Typography>
              </Box>
              <Button size="small" onClick={() => onOpenFile(file, true)}>
                View
              </Button>
              <Button size="small" onClick={() => onOpenFile(file, false)}>
                Download
              </Button>
              {canManage ? (
                <Button size="small" color="error" onClick={() => onDeleteFile(file)}>
                  Delete
                </Button>
              ) : null}
            </Stack>
          ))}
        </Stack>
      ) : null}

      {childFolders.length > 0 ? (
        <Stack spacing={1.5} sx={{ pl: { xs: 0, sm: 1.5 } }}>
          {childFolders.map((child) => (
            <LibraryFolderCard
              key={child.id}
              folder={child}
              depth={depth + 1}
              canManage={canManage}
              dragOverId={dragOverId}
              setDragOverId={setDragOverId}
              uploads={uploads}
              onRename={onRename}
              onCreateChild={onCreateChild}
              onDeleteFolder={onDeleteFolder}
              onDeleteFile={onDeleteFile}
              onOpenFile={onOpenFile}
              onDropFiles={onDropFiles}
            />
          ))}
        </Stack>
      ) : null}
    </Box>
  );
}

export function CourseLibraryPanel({ tab, canManage, onChanged }) {
  const [busy, setBusy] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folderDialog, setFolderDialog] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [dragOverId, setDragOverId] = useState('');
  const [uploads, setUploads] = useState([]);

  const folders = Array.isArray(tab?.folders) ? tab.folders : [];

  const openCreateFolder = (parentFolder = null) => {
    setFolderName('');
    setFolderDialog({ mode: 'create', parent: parentFolder });
  };

  const openRenameFolder = (folder) => {
    setFolderName(folder.name);
    setFolderDialog({ mode: 'rename', folder });
  };

  const saveFolder = async () => {
    const name = folderName.trim();
    if (!name) {
      toast.error('Folder name is required.');
      return;
    }
    setBusy(true);
    try {
      if (folderDialog?.mode === 'rename' && folderDialog.folder?.id) {
        await patchCourseLibraryFolder(folderDialog.folder.id, { name });
        toast.success('Folder renamed.');
      } else {
        await postCourseLibraryFolder(tab.id, {
          name,
          parentId: folderDialog?.parent?.id || undefined,
        });
        toast.success(folderDialog?.parent ? 'Subfolder created.' : 'Folder created.');
      }
      setFolderDialog(null);
      await onChanged?.();
    } catch (error) {
      toast.error(getLmsAxiosErrorMessage(error, 'Could not save folder.'));
    } finally {
      setBusy(false);
    }
  };

  const uploadToFolder = useCallback(
    async (folderId, fileList) => {
      const files = Array.isArray(fileList) ? fileList.filter(Boolean) : Array.from(fileList ?? []);
      if (!folderId || files.length === 0) {
        return;
      }
      const tooBig = files.find((file) => file.size > COURSE_LIBRARY_MAX_FILE_BYTES);
      if (tooBig) {
        toast.error(`${tooBig.name} is over 10 MB. Each file must be 10 MB or smaller.`);
        return;
      }

      const jobs = files.map((file, index) => ({
        id: `${folderId}-${Date.now()}-${index}-${file.name}`,
        folderId,
        name: file.name,
        percent: 1,
        status: 'uploading',
        file,
      }));
      setUploads((prev) => [...prev, ...jobs.map(({ file: _file, ...rest }) => rest)]);

      let failed = 0;
      for (const job of jobs) {
        try {
          await postCourseLibraryFile(folderId, job.file, {
            onUploadProgress: (percent) => {
              setUploads((prev) =>
                prev.map((item) => (item.id === job.id ? { ...item, percent } : item))
              );
            },
          });
          setUploads((prev) =>
            prev.map((item) =>
              item.id === job.id ? { ...item, percent: 100, status: 'done' } : item
            )
          );
        } catch (error) {
          failed += 1;
          setUploads((prev) =>
            prev.map((item) => (item.id === job.id ? { ...item, status: 'error' } : item))
          );
          toast.error(getLmsAxiosErrorMessage(error, `Could not upload ${job.name}.`));
        }
      }

      const uploaded = jobs.length - failed;
      if (uploaded > 0) {
        toast.success(uploaded === 1 ? 'File uploaded.' : `${uploaded} files uploaded.`);
        await onChanged?.();
      }
      window.setTimeout(() => {
        setUploads((prev) => prev.filter((item) => item.status === 'error' || item.status === 'uploading'));
      }, 1200);
    },
    [onChanged]
  );

  const openFile = async (file, inline) => {
    try {
      const blob = await fetchCourseLibraryFileBlob(file.id, inline);
      const url = URL.createObjectURL(blob);
      if (inline) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name || 'download';
        link.click();
      }
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (error) {
      toast.error(getLmsAxiosErrorMessage(error, 'Could not open file.'));
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) {
      return;
    }
    setBusy(true);
    try {
      if (pendingDelete.type === 'folder') {
        await deleteCourseLibraryFolder(pendingDelete.id);
        toast.success('Folder deleted.');
      } else {
        await deleteCourseLibraryFile(pendingDelete.id);
        toast.success('File deleted.');
      }
      setPendingDelete(null);
      await onChanged?.();
    } catch (error) {
      toast.error(getLmsAxiosErrorMessage(error, 'Could not delete.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack spacing={2}>
      {canManage ? (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Iconify icon="solar:add-folder-bold" />}
            onClick={() => openCreateFolder(null)}
            disabled={busy}
          >
            New folder
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
            Nested folders are allowed. Images, PDFs, and documents. 10 MB max per file.
          </Typography>
        </Stack>
      ) : null}

      {busy ? (
        <Stack direction="row" spacing={1} alignItems="center">
          <CircularProgress size={18} />
          <Typography variant="body2">Working…</Typography>
        </Stack>
      ) : null}

      {uploads.length > 0 ? (
        <Stack spacing={1.25} sx={{ p: 1.5, borderRadius: 1, bgcolor: 'action.hover' }}>
          {uploads.map((item) => (
            <Box key={item.id}>
              <Stack direction="row" justifyContent="space-between" spacing={1} sx={{ mb: 0.5 }}>
                <Typography variant="body2" noWrap>
                  {item.status === 'uploading' ? `Uploading ${item.name}` : item.name}
                </Typography>
                <Typography
                  variant="caption"
                  color={item.status === 'error' ? 'error' : 'text.secondary'}
                >
                  {item.status === 'error'
                    ? 'Failed'
                    : item.status === 'done'
                      ? 'Done'
                      : `${item.percent}%`}
                </Typography>
              </Stack>
              <LinearProgress
                variant={item.status === 'uploading' && item.percent < 2 ? 'indeterminate' : 'determinate'}
                value={item.status === 'error' ? 100 : item.percent}
                color={item.status === 'error' ? 'error' : 'primary'}
              />
            </Box>
          ))}
        </Stack>
      ) : null}

      {folders.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {canManage
            ? 'Create a folder, then upload or drag files into it.'
            : 'No folders have been added to this tab yet.'}
        </Typography>
      ) : null}

      {folders.map((folder) => (
        <LibraryFolderCard
          key={folder.id}
          folder={folder}
          depth={1}
          canManage={canManage}
          dragOverId={dragOverId}
          setDragOverId={setDragOverId}
          uploads={uploads}
          onRename={openRenameFolder}
          onCreateChild={(parent) => openCreateFolder(parent)}
          onDeleteFolder={(row) => setPendingDelete({ type: 'folder', id: row.id, name: row.name })}
          onDeleteFile={(file) => setPendingDelete({ type: 'file', id: file.id, name: file.name })}
          onOpenFile={openFile}
          onDropFiles={uploadToFolder}
        />
      ))}

      <Dialog open={Boolean(folderDialog)} onClose={() => setFolderDialog(null)} fullWidth maxWidth="xs">
        <DialogTitle>
          {folderDialog?.mode === 'rename'
            ? 'Rename folder'
            : folderDialog?.parent
              ? `New folder in “${folderDialog.parent.name}”`
              : 'New folder'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Folder name"
            value={folderName}
            onChange={(event) => setFolderName(event.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFolderDialog(null)}>Cancel</Button>
          <Button variant="contained" onClick={saveFolder} disabled={busy}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title={pendingDelete?.type === 'folder' ? 'Delete folder' : 'Delete file'}
        content={`Delete ${pendingDelete?.name ?? 'this item'}? This cannot be undone.`}
        action={
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={busy}>
            Delete
          </Button>
        }
      />
    </Stack>
  );
}
