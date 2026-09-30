import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';
import { CurriculumLessonRow } from '../curriculum-lesson-row';
import { CurriculumDragHandle } from '../curriculum-drag-handle';
import { CurriculumModuleFooterActions } from '../curriculum-module-footer-actions';

export function CurriculumBuilderModuleCard({
  module: mod,
  expanded,
  onToggle,
  selectedLessonId,
  onSelectLesson,
  disableAddLesson = false,
  /** Opens the shared lesson-type dialog (provided by sidebar). */
  onBeginAddLesson,
  addLessonUnavailableTitle,
  onDeleteModule,
  onRenameModule,
  onDeleteLesson,
  liveMode = false,
  onReorderLessons,
  draggable = false,
  isDragging = false,
  dropEdge = null,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameDraft, setRenameDraft] = useState(() => mod.title ?? '');
  const [dragLessonId, setDragLessonId] = useState(null);
  const [dropLessonTarget, setDropLessonTarget] = useState(null);

  useEffect(() => {
    if (!renameOpen) {
      setRenameDraft(mod.title ?? '');
    }
  }, [mod.title, renameOpen]);

  const handleCommitRename = useCallback(() => {
    const t = renameDraft.trim() === '' ? 'Untitled module' : renameDraft.trim();
    onRenameModule?.(mod.id, t);
    setRenameOpen(false);
  }, [mod.id, onRenameModule, renameDraft]);

  const handleLessonDragStart = useCallback(
    (event, lessonId) => {
      if (typeof onReorderLessons !== 'function') return;
      setDragLessonId(lessonId);
      setDropLessonTarget(null);
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(lessonId));
    },
    [onReorderLessons]
  );

  const handleLessonDragOver = useCallback(
    (event, lessonId) => {
      if (typeof onReorderLessons !== 'function' || !dragLessonId || dragLessonId === lessonId) {
        return;
      }
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      const edge = event.clientY < rect.top + rect.height / 2 ? 'top' : 'bottom';
      setDropLessonTarget({ lessonId, edge });
    },
    [dragLessonId, onReorderLessons]
  );

  const handleLessonDrop = useCallback(
    (event, lessonId) => {
      if (typeof onReorderLessons !== 'function') return;
      event.preventDefault();
      const fromId = dragLessonId;
      const edge = dropLessonTarget?.lessonId === lessonId ? dropLessonTarget.edge : 'bottom';
      setDragLessonId(null);
      setDropLessonTarget(null);
      if (!fromId || fromId === lessonId) return;

      const list = Array.isArray(mod.lessons) ? [...mod.lessons] : [];
      const fromIndex = list.findIndex((l) => l.id === fromId);
      const toIndex = list.findIndex((l) => l.id === lessonId);
      if (fromIndex === -1 || toIndex === -1) return;
      const [moved] = list.splice(fromIndex, 1);
      const insertBase = list.findIndex((l) => l.id === lessonId);
      const insertAt = edge === 'top' ? insertBase : insertBase + 1;
      list.splice(Math.max(0, insertAt), 0, moved);
      onReorderLessons(mod.id, list.map((l) => l.id));
    },
    [dragLessonId, dropLessonTarget, mod.id, mod.lessons, onReorderLessons]
  );

  const handleLessonDragEnd = useCallback(() => {
    setDragLessonId(null);
    setDropLessonTarget(null);
  }, []);

  return (
    <Card
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, mod.id)}
      onDragOver={(e) => onDragOver?.(e, mod.id)}
      onDrop={(e) => onDrop?.(e, mod.id)}
      onDragEnd={onDragEnd}
      sx={(theme) => ({
        ...styles.card(theme),
        ...(isDragging ? styles.cardDragging(theme) : null),
        ...(dropEdge === 'top' ? styles.cardDropTop(theme) : null),
        ...(dropEdge === 'bottom' ? styles.cardDropBottom(theme) : null),
      })}
    >
      <Box
        className="module-header-item"
        onClick={() => onToggle?.(mod.id)}
        sx={(theme) => styles.header(theme)}
      >
        <Stack direction="row" alignItems="center" sx={styles.headerLeft}>
          <CurriculumDragHandle />
          <Typography variant="subtitle2" sx={styles.title}>
            {mod.title}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" sx={styles.headerRight}>
          {typeof onRenameModule === 'function' || typeof onDeleteModule === 'function' ? (
            <Stack
              direction="row"
              alignItems="center"
              className="module-header-actions"
              sx={{
                gap: '8px',
                minWidth:
                  typeof onRenameModule === 'function' && typeof onDeleteModule === 'function'
                    ? 72
                    : 36,
              }}
            >
              {typeof onRenameModule === 'function' ? (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRenameDraft(mod.title ?? '');
                    setRenameOpen(true);
                  }}
                  sx={(theme) => styles.editTitleButton(theme)}
                  aria-label="Rename module"
                >
                  <Iconify icon="solar:pen-bold-duotone" width={18} />
                </IconButton>
              ) : null}
              {typeof onDeleteModule === 'function' ? (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteModule(mod.id);
                  }}
                  sx={(theme) => styles.deleteButton(theme)}
                  aria-label="Delete module"
                >
                  <Iconify icon="solar:trash-bin-trash-bold-duotone" width={18} />
                </IconButton>
              ) : null}
            </Stack>
          ) : null}

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.(mod.id);
            }}
            sx={styles.expandButton}
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse module' : 'Expand module'}
          >
            <Iconify
              icon={expanded ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'}
              width={18}
            />
          </IconButton>
        </Stack>
      </Box>

      {expanded ? (
        <>
          <Divider />
          <Box sx={styles.lessons}>
            {mod.lessons.map((lesson) => {
              const showTrash =
                typeof onDeleteLesson === 'function' && !(liveMode && lesson.type === 'quiz');

              return (
                <CurriculumLessonRow
                  key={lesson.id}
                  lesson={lesson}
                  selected={lesson.id === selectedLessonId}
                  onSelect={onSelectLesson}
                  draggable={typeof onReorderLessons === 'function' && !String(lesson.id).endsWith('-core')}
                  isDragging={dragLessonId === lesson.id}
                  dropEdge={dropLessonTarget?.lessonId === lesson.id ? dropLessonTarget.edge : null}
                  onDragStart={handleLessonDragStart}
                  onDragOver={handleLessonDragOver}
                  onDrop={handleLessonDrop}
                  onDragEnd={handleLessonDragEnd}
                  showDeleteLesson={showTrash}
                  onDeleteLesson={
                    showTrash ? (l) => onDeleteLesson(mod.id, l) : undefined
                  }
                />
              );
            })}
          </Box>
        </>
      ) : (
        <Divider />
      )}

      <CurriculumModuleFooterActions
        onAddLessonClick={disableAddLesson ? undefined : () => onBeginAddLesson?.()}
        addLessonUnavailableTitle={disableAddLesson ? addLessonUnavailableTitle : undefined}
      />

      <Dialog
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        maxWidth="sm"
        fullWidth
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>Rename module</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Module title"
            fullWidth
            value={renameDraft}
            onChange={(e) => setRenameDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCommitRename();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setRenameOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleCommitRename}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
