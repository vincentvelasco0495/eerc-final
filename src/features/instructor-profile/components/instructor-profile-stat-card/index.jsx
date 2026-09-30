import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';

export function InstructorProfileStatCard({ item, loading = false }) {
  return (
    <Card sx={styles.card}>
      <CardContent sx={styles.cardContent}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Stack sx={styles.iconWrap}>
            <Iconify icon={item.icon} width={20} />
          </Stack>

          <Stack spacing={0.25} sx={styles.metaStack}>
            <Typography variant="caption" sx={styles.caption}>
              {item.label}
            </Typography>
            {loading ? (
              <Skeleton variant="text" width={72} height={28} animation="wave" />
            ) : (
              <Typography variant="h6">{item.value}</Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
