import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Editor } from 'src/components/editor';

import { styles } from './styles';
import { isQuizPdfAsset } from '../../utils/quiz-pdf-constants';
import { QuestionImageUploadField } from './question-image-upload-field';

export function QuestionEditor({
  mode = 'text',
  questionText,
  onQuestionTextChange,
  modulePublicId,
  problemImageMaterialPublicId,
  problemImagePreviewUrl,
  problemImageName,
  problemImageMime,
  skipMaterialDelete = false,
  imageUploadingSlot,
  onImageUploadingSlotChange,
  onProblemImageChange,
  onAfterMaterialsChange,
}) {
  if (mode === 'image') {
    const isPdf = isQuizPdfAsset({
      mime: problemImageMime,
      fileName: problemImageName,
      url: problemImagePreviewUrl,
    });
    return (
      <Box sx={styles.questionEditorWrap}>
        <QuestionImageUploadField
          label={
            /^Item\s+\d+$/i.test(String(problemImageName ?? '').trim())
              ? problemImageName
              : isPdf
                ? 'Question PDF'
                : 'Question image'
          }
          modulePublicId={modulePublicId}
          materialPublicId={problemImageMaterialPublicId}
          previewUrl={problemImagePreviewUrl}
          fileName={problemImageName}
          fileMime={problemImageMime}
          skipMaterialDelete={skipMaterialDelete}
          uploading={imageUploadingSlot === 'problem'}
          onUploadingChange={(busy) => onImageUploadingSlotChange(busy ? 'problem' : null)}
          onImageChange={onProblemImageChange}
          onAfterMaterialsChange={onAfterMaterialsChange}
        />
        <Typography sx={styles.questionImageHint}>
          {isPdf
            ? 'The full PDF is shown on this item. Mark the correct letter below.'
            : 'Attach an image that includes the question and A–D options. Mark the correct letter below.'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={styles.questionEditorWrap}>
      <Box sx={styles.editorMainFull}>
        <Typography sx={styles.stemLabel}>Enter your question</Typography>
        <Box sx={styles.editorShell}>
          <Editor
            value={questionText}
            onChange={onQuestionTextChange}
            placeholder="What is the primary purpose of a retaining wall?"
            chrome="tinymce"
            sx={{
              minHeight: { xs: 200, sm: 260 },
              maxHeight: { xs: 360, sm: 440 },
              minWidth: 0,
              maxWidth: '100%',
            }}
            tinymceResizeBounds={{
              min: 100,
              max: 320,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
