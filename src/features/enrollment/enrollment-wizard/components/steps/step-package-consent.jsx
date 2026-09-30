import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { EnrollmentRadioCards } from '../enrollment-radio-cards';
import { EnrollmentSectionCard } from '../enrollment-section-card';
import { EnrollmentFileDropzone } from '../enrollment-file-dropzone';
import { ENROLLMENT_IMAGE_ACCEPT, ENROLLMENT_IMPORTANT_NOTICE } from '../../constants';

export function StepPackageConsent({ options }) {
  const { control } = useFormContext();

  return (
    <Stack spacing={3}>
      <EnrollmentSectionCard
        title="Package enroll"
        description="Select the enrollment package that applies to you."
      >
        <Controller
          name="packageEnrollId"
          control={control}
          render={({ field, fieldState }) => (
            <EnrollmentRadioCards
              name="packageEnrollId"
              value={field.value}
              onChange={field.onChange}
              options={options.packageEnrolls ?? []}
              error={fieldState.error?.message}
            />
          )}
        />
      </EnrollmentSectionCard>

      <EnrollmentSectionCard title="Important notice" description="Please read carefully before signing.">
        <Box
          component="ol"
          sx={{
            m: 0,
            pl: 2.5,
            color: 'text.secondary',
            '& li': { mb: 1.25 },
          }}
        >
          {ENROLLMENT_IMPORTANT_NOTICE.map((item) => (
            <Typography key={item} component="li" variant="body2">
              {item}
            </Typography>
          ))}
        </Box>
      </EnrollmentSectionCard>

      <EnrollmentSectionCard
        title="Signature"
        description="Upload a picture or screenshot of your signature over printed name."
      >
        <Controller
          name="signature"
          control={control}
          render={({ field, fieldState }) => (
            <EnrollmentFileDropzone
              label="Signature over printed name"
              helperText="Upload one supported file: image or PDF."
              value={field.value}
              onChange={field.onChange}
              accept={ENROLLMENT_IMAGE_ACCEPT}
              error={fieldState.error?.message}
              required
            />
          )}
        />
      </EnrollmentSectionCard>
    </Stack>
  );
}
