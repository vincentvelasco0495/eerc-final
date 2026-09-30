import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { RHFTextField, RHFDatePicker } from 'src/components/hook-form';

import { EnrollmentRadioCards } from '../enrollment-radio-cards';
import { EnrollmentSectionCard } from '../enrollment-section-card';

const GENDER_OPTIONS = [
  { id: 'female', name: 'Female' },
  { id: 'male', name: 'Male' },
];

export function StepPersonalInformation() {
  const { control } = useFormContext();

  return (
    <EnrollmentSectionCard
      title="Personal information"
      description="Details from your previous application or account registration are filled in automatically. You can edit them before continuing."
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <RHFTextField name="fullName" label="Name" placeholder="Del Cruz, Juan A." required />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <RHFTextField
            name="aliasName"
            label="Alias name"
            placeholder="Nickname or preferred name"
            required
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <RHFTextField name="schoolName" label="Complete name of school" required />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Gender <Box component="span" sx={{ color: 'error.main' }}>*</Box>
          </Typography>
          <Controller
            name="gender"
            control={control}
            render={({ field, fieldState }) => (
              <EnrollmentRadioCards
                name="gender"
                value={field.value}
                onChange={field.onChange}
                options={GENDER_OPTIONS}
                error={fieldState.error?.message}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <RHFDatePicker
            name="dateOfBirth"
            label="Date of birth"
            slotProps={{ textField: { required: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <RHFTextField name="contactNumber" label="Contact number" required />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <RHFTextField
            name="homeAddress"
            label="Complete home address"
            multiline
            minRows={3}
            required
          />
        </Grid>
      </Grid>
    </EnrollmentSectionCard>
  );
}
