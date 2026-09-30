import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

import { styles } from './styles';

export function QuestionSettings({ required, onRequiredChange }) {
  return (
    <Box sx={styles.settingsRowTop}>
      <FormControlLabel
        sx={styles.settingsRequiredLabel}
        control={
          <Switch
            checked={required}
            onChange={(e) => onRequiredChange(e.target.checked)}
            color="primary"
          />
        }
        label="Required Question"
      />
    </Box>
  );
}
