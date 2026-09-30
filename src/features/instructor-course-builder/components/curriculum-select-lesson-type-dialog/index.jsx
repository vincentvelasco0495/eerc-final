import { useMemo, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';
import { curriculumLessonTypePickerGroups } from '../../instructor-course-curriculum-data';

/** Same modal everywhere `CurriculumBuilderModuleCard` is used (demo + live LMS edit via `InstructorCourseCurriculumView`). */
export function CurriculumSelectLessonTypeDialog({
  open,
  onClose,
  onSelectType,
  /** When set (e.g. `['quiz']` for live LMS), only those lesson types appear. */
  attachableLessonTypes = null,
}) {
  const narrowedToLmsQuiz =
    Array.isArray(attachableLessonTypes) && attachableLessonTypes.length > 0;

  const pickerGroups = useMemo(() => {
    if (!narrowedToLmsQuiz) {
      return curriculumLessonTypePickerGroups;
    }
    const allowed = new Set(attachableLessonTypes);
    return curriculumLessonTypePickerGroups
      .map((group) => ({
        ...group,
        options: group.options.filter((o) => allowed.has(o.type)),
      }))
      .filter((group) => group.options.length > 0);
  }, [narrowedToLmsQuiz, attachableLessonTypes]);

  const handlePick = useCallback(
    (type) => {
      onSelectType?.(type);
      onClose?.();
    },
    [onClose, onSelectType]
  );

  const subtitleText = narrowedToLmsQuiz
    ? 'Add a quiz to this module.'
    : 'Select material type to continue';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="body"
      slotProps={{
        backdrop: { sx: { bgcolor: 'rgba(15, 23, 42, 0.45)' } },
      }}
      PaperProps={{ sx: styles.paper }}
    >
      <DialogTitle component="div" sx={{ px: { xs: 2, sm: 3 }, pt: 2.5, pb: 1.5 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Box sx={styles.titleBlock}>
            <Typography component="span" sx={styles.title}>
              Select lesson type
            </Typography>
            <Typography sx={styles.subtitle}>{subtitleText}</Typography>
          </Box>
          <IconButton
            aria-label="Close"
            onClick={onClose}
            size="small"
            sx={styles.closeButton}
          >
            <Iconify icon="mingcute:close-line" width={22} />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={styles.content}>
        {pickerGroups.map((group) => (
          <Box key={group.id} sx={styles.section}>
            <Typography sx={styles.sectionLabel}>{group.label}</Typography>
            <Box sx={styles.tileGrid}>
              {group.options.map((opt) => (
                <Box
                  key={opt.type}
                  component="button"
                  type="button"
                  onClick={() => handlePick(opt.type)}
                  sx={(theme) => styles.tile(theme)}
                >
                  <Iconify icon={opt.icon} width={36} sx={styles.tileIcon} />
                  <Typography sx={styles.tileLabel}>{opt.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
}
