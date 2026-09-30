import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { styles } from './styles';

export function InstructorSettingsProfileFields({ values, displayOptions, onChange }) {
  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            name="firstName"
            fullWidth
            label="First Name"
            value={values.firstName}
            onChange={(event) => onChange('firstName', event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            name="lastName"
            fullWidth
            label="Last Name"
            value={values.lastName}
            onChange={(event) => onChange('lastName', event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
      </Grid>

      <TextField
        name="position"
        fullWidth
        label="Position"
        value={values.position}
        onChange={(event) => onChange('position', event.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <TextField
        name="bio"
        fullWidth
        multiline
        minRows={4}
        label="Bio"
        value={values.bio}
        onChange={(event) => onChange('bio', event.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Stack spacing={1}>
        <TextField
          fullWidth
          select
          label="Display name publicly as:"
          value={values.displayName}
          onChange={(event) => onChange('displayName', event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        >
          {displayOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
          {displayOptions.length === 0 ? (
            <MenuItem value={values.displayName || ' '}>{values.displayName || '—'}</MenuItem>
          ) : null}
        </TextField>
        <Typography variant="body2" sx={styles.hint}>
          The display name is shown in all public fields, such as the author name, instructor
          name, and student name.
        </Typography>
      </Stack>
    </Stack>
  );
}
