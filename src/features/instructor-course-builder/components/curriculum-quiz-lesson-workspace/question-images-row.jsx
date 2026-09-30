import Box from '@mui/material/Box';

import { styles } from './styles';
import { QuestionImageUploadField } from './question-image-upload-field';

export function QuestionImagesRow({
  modulePublicId,
  problemImageMaterialPublicId,
  problemImagePreviewUrl,
  problemImageName,
  solutionImageMaterialPublicId,
  solutionImagePreviewUrl,
  solutionImageName,
  uploadingSlot,
  onUploadingSlotChange,
  onProblemImageChange,
  onSolutionImageChange,
  onAfterMaterialsChange,
}) {
  return (
    <Box sx={styles.questionImagesRow}>
      <QuestionImageUploadField
        label="Problem Image :"
        modulePublicId={modulePublicId}
        materialPublicId={problemImageMaterialPublicId}
        previewUrl={problemImagePreviewUrl}
        fileName={problemImageName}
        uploading={uploadingSlot === 'problem'}
        onUploadingChange={(busy) => onUploadingSlotChange(busy ? 'problem' : null)}
        onImageChange={onProblemImageChange}
        onAfterMaterialsChange={onAfterMaterialsChange}
        borderedRight
      />
      <QuestionImageUploadField
        label="Solution Image :"
        modulePublicId={modulePublicId}
        materialPublicId={solutionImageMaterialPublicId}
        previewUrl={solutionImagePreviewUrl}
        fileName={solutionImageName}
        uploading={uploadingSlot === 'solution'}
        onUploadingChange={(busy) => onUploadingSlotChange(busy ? 'solution' : null)}
        onImageChange={onSolutionImageChange}
        onAfterMaterialsChange={onAfterMaterialsChange}
      />
    </Box>
  );
}
