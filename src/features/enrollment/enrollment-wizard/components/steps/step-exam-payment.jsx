import { Controller, useFormContext } from 'react-hook-form';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { RHFTextField } from 'src/components/hook-form';

import { ENROLLMENT_FILE_ACCEPT } from '../../constants';
import { EnrollmentRadioCards } from '../enrollment-radio-cards';
import { EnrollmentSectionCard } from '../enrollment-section-card';
import { EnrollmentFileDropzone } from '../enrollment-file-dropzone';

const EXAM_OPTIONS = [
  { id: 'first-time', name: 'First-time taker' },
  { id: 'retaker', name: 'Retaker' },
];

export function StepExamPayment() {
  const { control, watch } = useFormContext();
  const examExperience = watch('examExperience');
  const isRetaker = examExperience === 'retaker';

  return (
    <EnrollmentSectionCard
      title="Exam & payment"
      description="Tell us about your board exam experience and submit payment details."
    >
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Board exam experience
      </Typography>
      <Controller
        name="examExperience"
        control={control}
        render={({ field, fieldState }) => (
          <EnrollmentRadioCards
            name="examExperience"
            value={field.value}
            onChange={field.onChange}
            options={EXAM_OPTIONS}
            error={fieldState.error?.message}
          />
        )}
      />

      {isRetaker ? (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <RHFTextField
              name="retakerAttempts"
              label="Number of times you have taken the board exam"
              placeholder="e.g. 2"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Controller
              name="retakerProof"
              control={control}
              render={({ field, fieldState }) => (
                <EnrollmentFileDropzone
                  label="Documentation verifying retaker status"
                  helperText="Upload one supported file: image, PDF, or document."
                  value={field.value}
                  onChange={field.onChange}
                  accept={ENROLLMENT_FILE_ACCEPT}
                  error={fieldState.error?.message}
                />
              )}
            />
          </Grid>
        </Grid>
      ) : null}

      <Controller
        name="paymentProof"
        control={control}
        render={({ field, fieldState }) => (
          <EnrollmentFileDropzone
            label="Bank deposit slip / tuition receipt / proof of scholarship"
            helperText="Upload one supported file: image, PDF, or document."
            value={field.value}
            onChange={field.onChange}
            accept={ENROLLMENT_FILE_ACCEPT}
            error={fieldState.error?.message}
            required
          />
        )}
      />

      <RHFTextField
        name="downpaymentAmount"
        label="Amount of downpayment (or scholarship type if applicable)"
        placeholder="e.g. PHP 5,000 or Cum Laude Scholarship"
      />
    </EnrollmentSectionCard>
  );
}
