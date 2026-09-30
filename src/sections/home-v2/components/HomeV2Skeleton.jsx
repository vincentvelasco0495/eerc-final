import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';

import { sectionStyles } from '../styles/section-styles';

export function HomeV2Skeleton() {
  return (
    <Box sx={sectionStyles.pageRoot}>
      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack spacing={3}>
          <Skeleton variant="rounded" height={48} width={280} />
          <Skeleton variant="rounded" height={72} />
          <Skeleton variant="rounded" height={120} />
          <Skeleton variant="rounded" height={360} />
        </Stack>
      </Container>
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Stack direction="row" spacing={2}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Skeleton key={n} variant="rounded" height={220} sx={{ flex: 1 }} />
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
