import { Controller, useFormContext } from 'react-hook-form';

import { ENROLLMENT_FILE_ACCEPT } from '../../constants';
import { EnrollmentRadioCards } from '../enrollment-radio-cards';
import { EnrollmentSectionCard } from '../enrollment-section-card';
import { EnrollmentFileDropzone } from '../enrollment-file-dropzone';

export function StepDocumentsDiscounts({ options }) {
  const { control } = useFormContext();

  return (
    <EnrollmentSectionCard
      title="Documents & discounts"
      description="Upload your photo and select any applicable honors, awards, or discount."
    >
      <Controller
        name="profilePicture"
        control={control}
        render={({ field, fieldState }) => (
          <EnrollmentFileDropzone
            label="Recent formal picture or graduation picture"
            helperText="Upload one supported file: image, PDF, or document."
            value={field.value}
            onChange={field.onChange}
            accept={ENROLLMENT_FILE_ACCEPT}
            error={fieldState.error?.message}
            required
          />
        )}
      />

      <Controller
        name="honorAwardDiscountId"
        control={control}
        render={({ field, fieldState }) => (
          <EnrollmentRadioCards
            name="honorAwardDiscountId"
            value={field.value}
            onChange={field.onChange}
            options={options.honorAwardDiscounts ?? []}
            error={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="discountProof"
        control={control}
        render={({ field, fieldState }) => (
          <EnrollmentFileDropzone
            label="Proof for selected discount (optional)"
            helperText="Upload supporting documentation if applicable."
            value={field.value}
            onChange={field.onChange}
            accept={ENROLLMENT_FILE_ACCEPT}
            error={fieldState.error?.message}
          />
        )}
      />
    </EnrollmentSectionCard>
  );
}
