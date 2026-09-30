import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';

export function AssignmentHeader({ title, onTitleChange, onCreate, createDisabled = false }) {
  return (
    <Box sx={styles.header}>
      <Box sx={styles.headerLeft}>
        <Box sx={styles.headerQuizBadge}>
          <Box sx={styles.headerQuizIconWrap} aria-hidden>
            <Iconify
              icon="solar:bill-list-bold-duotone"
              width={16}
              sx={{ width: { xs: 14, sm: 16 }, height: { xs: 14, sm: 16 } }}
            />
          </Box>
          <Typography component="span" sx={styles.headerQuizBadgeLabel}>
            Assignment
          </Typography>
        </Box>
        <TextField
          value={title}
          onChange={(e) => onTitleChange?.(e.target.value)}
          placeholder="Enter assignment name"
          size="small"
          fullWidth
          inputProps={{ 'aria-label': 'Assignment title' }}
          sx={styles.headerTitleField}
        />
      </Box>
      <Button
        variant="contained"
        color="primary"
        sx={styles.saveBtn}
        onClick={onCreate}
        disabled={createDisabled}
      >
        Create
      </Button>
    </Box>
  );
}
