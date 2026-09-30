import Grid from '@mui/material/Grid';

import { styles } from './styles';
import { GradebookStatCard } from '../gradebook-stat-card';

export function GradebookSummaryGrid({ stats }) {
  return (
    <Grid container spacing={2}>
      {stats.map((item) => (
        <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }} sx={styles.gridItem}>
          <GradebookStatCard item={item} />
        </Grid>
      ))}
    </Grid>
  );
}
