import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { styles } from './styles';

export function GradebookStatCard({ item }) {
  return (
    <Card sx={styles.card}>
      <CardContent sx={styles.content}>
        <Stack spacing={0.5}>
          <Typography variant="caption" sx={styles.caption}>
            {item.label}:
          </Typography>
          <Typography variant="h5" sx={styles.value}>
            {item.value}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
