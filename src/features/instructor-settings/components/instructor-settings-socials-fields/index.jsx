import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { styles } from './styles';

export function InstructorSettingsSocialsFields({ values, onChange }) {
  return (
    <Stack spacing={2}>
      <Typography variant="h6" sx={styles.sectionTitle}>
        Socials
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            name="facebook"
            fullWidth
            label="Facebook"
            value={values.facebook}
            onChange={(event) => onChange('facebook', event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            placeholder="https://www.facebook.com/"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="LinkedIn"
            value={values.linkedin}
            onChange={(event) => onChange('linkedin', event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            placeholder="https://www.linkedin.com/in/"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="X (Twitter)"
            value={values.twitter}
            onChange={(event) => onChange('twitter', event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            placeholder="https://x.com/"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Instagram"
            value={values.instagram}
            onChange={(event) => onChange('instagram', event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            placeholder="https://www.instagram.com/"
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
