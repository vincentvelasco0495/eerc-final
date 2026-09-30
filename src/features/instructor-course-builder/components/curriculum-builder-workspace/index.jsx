import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { toast } from 'src/components/snackbar';

import { CurriculumTextLessonWorkspace } from '../curriculum-text-lesson-workspace';
import { CurriculumQuizLessonWorkspace } from '../curriculum-quiz-lesson-workspace';
import { CurriculumVideoLessonWorkspace } from '../curriculum-video-lesson-workspace';
import { CurriculumBuilderEmptyWorkspace } from '../curriculum-builder-empty-workspace';
import { CurriculumAssignmentLessonWorkspace } from '../curriculum-assignment-lesson-workspace';

const placeholderSx = (theme) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 320,
  px: 3,
  bgcolor: alpha(theme.palette.grey[500], 0.04),
  border: '1px dashed',
  borderColor: 'divider',
  borderRadius: 2,
});

export function CurriculumBuilderWorkspace({
  lesson,
  onLessonTitleChange,
  onLessonSave,
  /** When authoring a live text or video lesson, persist rich fields via LMS PATCH. */
  saveLiveRichLesson,
  /** Server snapshot backing the workspace (camelCase from LMS modules payload). */
  liveLessonAuthoring = null,
  liveQuizLoader,
  saveLiveQuizLesson,
  liveQuizAuthoring,
  saveLiveQuizSettings,
  quizModulePublicId,
  onLessonMaterialsChange,
  liveAssignmentLoader,
  saveLiveAssignment,
  liveAssignmentAuthoring,
  uploadAssignmentMaterial,
  onAssignmentMaterialsChange,
}) {
  if (!lesson) {
    return <CurriculumBuilderEmptyWorkspace />;
  }

  const workspaceLessonType = liveLessonAuthoring?.authoringKind ?? lesson.type;

  if (workspaceLessonType === 'document') {
    return (
      <CurriculumTextLessonWorkspace
        lesson={lesson}
        onLessonTitleChange={onLessonTitleChange}
        onLessonSave={onLessonSave}
        saveLiveRichLesson={saveLiveRichLesson}
        liveLessonAuthoring={liveLessonAuthoring}
        onLessonMaterialsChange={onLessonMaterialsChange}
      />
    );
  }

  if (workspaceLessonType === 'video') {
    return (
      <CurriculumVideoLessonWorkspace
        lesson={lesson}
        onLessonTitleChange={onLessonTitleChange}
        onLessonSave={onLessonSave}
        saveLiveRichLesson={saveLiveRichLesson}
        liveLessonAuthoring={liveLessonAuthoring}
        onLessonMaterialsChange={onLessonMaterialsChange}
      />
    );
  }

  if (lesson.type === 'quiz' && workspaceLessonType !== 'document' && workspaceLessonType !== 'video') {
    return (
      <CurriculumQuizLessonWorkspace
        lesson={lesson}
        onLessonTitleChange={onLessonTitleChange}
        onLessonSave={onLessonSave}
        liveQuizLoader={liveQuizLoader}
        saveLiveQuizLesson={saveLiveQuizLesson}
        liveQuizAuthoring={liveQuizAuthoring}
        saveLiveQuizSettings={saveLiveQuizSettings}
        quizModulePublicId={quizModulePublicId}
        onLessonMaterialsChange={onLessonMaterialsChange}
      />
    );
  }

  if (lesson.type === 'assignment') {
    return (
      <Box sx={{ flex: 1, minWidth: 0, width: '100%', display: 'flex', flexDirection: 'column' }}>
        <CurriculumAssignmentLessonWorkspace
          lesson={lesson}
          onLessonTitleChange={onLessonTitleChange}
          onLessonSave={onLessonSave}
          liveAssignmentAuthoring={liveAssignmentAuthoring}
          liveAssignmentLoader={liveAssignmentLoader}
          saveLiveAssignment={saveLiveAssignment}
          uploadAssignmentMaterial={uploadAssignmentMaterial}
          onAssignmentMaterialsChange={onAssignmentMaterialsChange}
        />
      </Box>
    );
  }

  return (
    <Box sx={(theme) => placeholderSx(theme)}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="body1" color="text.secondary" textAlign="center">
          Editor for <strong>{lesson.type}</strong> lessons is not in this prototype. Select a text
          lesson to see the full layout.
        </Typography>
        {lesson.draft ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onLessonSave?.(lesson.id);
              toast.success(`Lesson “${lesson.title}” saved (demo).`);
            }}
          >
            Create
          </Button>
        ) : null}
      </Stack>
    </Box>
  );
}
