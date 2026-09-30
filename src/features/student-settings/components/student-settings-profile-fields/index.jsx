import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

export function StudentSettingsProfileFields({ values, errors = {}, onChange, maxBirthday }) {
  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="First Name"
            value={values.firstName}
            onChange={(event) => onChange('firstName', event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Last Name"
            value={values.lastName}
            onChange={(event) => onChange('lastName', event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
            label="Phone number"
            value={values.phoneNumber}
            onChange={(event) => onChange('phoneNumber', event.target.value)}
            error={Boolean(errors.phoneNumber)}
            helperText={errors.phoneNumber || '10–15 digits; spaces and + - ( ) allowed.'}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            required
            type="date"
            label="Birthday"
            value={values.birthday}
            onChange={(event) => onChange('birthday', event.target.value)}
            error={Boolean(errors.birthday)}
            helperText={errors.birthday || 'You must be at least 18 years old.'}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { max: maxBirthday },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="School held"
            value={values.schoolHeld}
            onChange={(event) => onChange('schoolHeld', event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
