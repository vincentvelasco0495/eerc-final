import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';
import { CurriculumBuilderModuleCard } from '../curriculum-builder-module-card';
import { CurriculumSelectLessonTypeDialog } from '../curriculum-select-lesson-type-dialog';

export function CurriculumBuilderSidebar({
  modules,
  expandedByModuleId,
  onToggleModule,
  selectedLessonId,
  onSelectLesson,
  onAddLesson,
  disableAddLesson = false,
  onAddModule,
  disableAddModule = false,
  addLessonUnavailableTitle,
  onDeleteModule,
  onRenameModule,
  onDeleteLesson,
  liveMode = false,
  onReorderModules,
  onReorderLessons,
}) {
  const theme = useTheme();
  const [lessonPickerOpen, setLessonPickerOpen] = useState(false);
  const [lessonPickerModuleId, setLessonPickerModuleId] = useState(null);
  const [modulePickerAnchor, setModulePickerAnchor] = useState(null);
  const [dragModuleId, setDragModuleId] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  const handleCloseLessonPicker = useCallback(() => {
    setLessonPickerOpen(false);
    setLessonPickerModuleId(null);
  }, []);

  const handleLessonTypeSelected = useCallback(
    (type) => {
      if (lessonPickerModuleId != null && typeof onAddLesson === 'function') {
        onAddLesson(lessonPickerModuleId, type);
      }
    },
    [lessonPickerModuleId, onAddLesson]
  );

  const handleOpenModulePicker = useCallback((event) => {
    setModulePickerAnchor(event.currentTarget);
  }, []);

  const handleCloseModulePicker = useCallback(() => {
    setModulePickerAnchor(null);
  }, []);

  const handleAddModuleType = useCallback(
    (moduleType) => {
      if (typeof onAddModule === 'function') {
        onAddModule(moduleType);
      }
      handleCloseModulePicker();
    },
    [handleCloseModulePicker, onAddModule]
  );

  const handleModuleDragStart = useCallback(
    (event, moduleId) => {
      if (typeof onReorderModules !== 'function') {
        return;
      }
      setDragModuleId(moduleId);
      setDropTarget(null);
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(moduleId));
    },
    [onReorderModules]
  );

  const handleModuleDragOver = useCallback(
    (event, moduleId) => {
      if (typeof onReorderModules !== 'function' || !dragModuleId || dragModuleId === moduleId) {
        return;
      }
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      const edge = event.clientY < rect.top + rect.height / 2 ? 'top' : 'bottom';
      setDropTarget({ moduleId, edge });
    },
    [dragModuleId, onReorderModules]
  );

  const handleModuleDrop = useCallback(
    (event, moduleId) => {
      if (typeof onReorderModules !== 'function') {
        return;
      }
      event.preventDefault();
      const fromId = dragModuleId;
      const edge = dropTarget?.moduleId === moduleId ? dropTarget.edge : 'bottom';
      setDragModuleId(null);
      setDropTarget(null);
      if (!fromId || fromId === moduleId) {
        return;
      }
      onReorderModules(fromId, moduleId, edge);
    },
    [dragModuleId, dropTarget, onReorderModules]
  );

  const handleModuleDragEnd = useCallback(() => {
    setDragModuleId(null);
    setDropTarget(null);
  }, []);

  return (
    <Box sx={styles.root(theme)}>
      <Box sx={styles.heading}>
        <Stack direction="row" spacing={1} alignItems="center" sx={styles.headingLeft}>
          <Iconify icon="solar:widget-4-bold-duotone" width={22} color="brand.accentText" />
          <Typography variant="subtitle1" sx={styles.headingTitle}>
            Curriculum
          </Typography>
        </Stack>

        {typeof onAddModule === 'function' ? (
          <>
            <Button
              variant="text"
              color="primary"
              disableElevation
              disabled={disableAddModule}
              onClick={handleOpenModulePicker}
              startIcon={
                <Box sx={styles.addModuleIconWrap}>
                  <Iconify icon="mingcute:add-line" width={12} sx={styles.addModuleIcon} />
                </Box>
              }
              endIcon={<Iconify icon="solar:alt-arrow-down-linear" width={14} />}
              sx={styles.addModuleButton}
            >
              Add a module
            </Button>
            <Menu
              anchorEl={modulePickerAnchor}
              open={Boolean(modulePickerAnchor)}
              onClose={handleCloseModulePicker}
            >
              <MenuItem onClick={() => handleAddModuleType('document')}>Text module</MenuItem>
              <MenuItem onClick={() => handleAddModuleType('video')}>Video module</MenuItem>
            </Menu>
          </>
        ) : null}
      </Box>

      <Stack spacing={2}>
        {modules.map((mod) => (
          <CurriculumBuilderModuleCard
            key={mod.id}
            module={mod}
            expanded={expandedByModuleId[mod.id]}
            onToggle={onToggleModule}
            selectedLessonId={selectedLessonId}
            onSelectLesson={onSelectLesson}
            onBeginAddLesson={
              typeof onAddLesson === 'function' && !disableAddLesson
                ? () => {
                    setLessonPickerModuleId(mod.id);
                    setLessonPickerOpen(true);
                  }
                : undefined
            }
            disableAddLesson={disableAddLesson}
            addLessonUnavailableTitle={addLessonUnavailableTitle}
            onDeleteModule={onDeleteModule}
            onRenameModule={onRenameModule}
            onDeleteLesson={onDeleteLesson}
            liveMode={liveMode}
            onReorderLessons={onReorderLessons}
            draggable={typeof onReorderModules === 'function'}
            isDragging={dragModuleId === mod.id}
            dropEdge={dropTarget?.moduleId === mod.id ? dropTarget.edge : null}
            onDragStart={handleModuleDragStart}
            onDragOver={handleModuleDragOver}
            onDrop={handleModuleDrop}
            onDragEnd={handleModuleDragEnd}
          />
        ))}
      </Stack>

      {!disableAddLesson ? (
        <CurriculumSelectLessonTypeDialog
          open={lessonPickerOpen}
          onClose={handleCloseLessonPicker}
          onSelectType={handleLessonTypeSelected}
        />
      ) : null}
    </Box>
  );
}
