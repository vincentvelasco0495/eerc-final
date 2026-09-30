import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { styles } from './styles';

export function InstructorSettingsPasswordFields({ values, onChange }) {
  return (
    <Stack spacing={2.5}>
      <Typography variant="h6" sx={styles.sectionTitle}>
        Change password
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="password"
            label="New password"
            placeholder="Enter new password"
            value={values.newPassword}
            onChange={(event) => onChange('newPassword', event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="password"
            label="Repeat password"
            placeholder="Repeat password"
            value={values.repeatPassword}
            onChange={(event) => onChange('repeatPassword', event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
