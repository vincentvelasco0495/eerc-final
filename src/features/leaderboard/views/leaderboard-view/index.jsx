import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { useLeaderboard } from 'src/hooks/use-lms';

import { LmsStatCard } from 'src/components/ui/lms-stat-card';
import { LmsPageShell } from 'src/components/layout/lms-page-shell';
import { LeaderboardTable } from 'src/components/ui/leaderboard-table';
import { ExportExcelButton } from 'src/components/export-excel-button';

import { styles } from './styles';

export function LeaderboardView() {
  const [period, setPeriod] = useState('daily');
  const rows = useLeaderboard(period);

  return (
    <LmsPageShell
      heading="Leaderboard"
      links={[{ name: 'Leaderboard' }]}
      eyebrow="Competitive learning"
      description="A more polished leaderboard with period switching, clearer ranking emphasis, and badge-based recognition."
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <LmsStatCard
            title="Current leader"
            value={rows[0]?.name ?? 'N/A'}
            caption={rows[0] ? `${rows[0].score} points` : 'No data yet'}
            icon="solar:crown-bold-duotone"
            tone="warning"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <LmsStatCard
            title="Tracked period"
            value={period}
            caption="Daily, weekly, or overall view"
            icon="solar:calendar-bold-duotone"
            tone="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <LmsStatCard
            title="Visible ranks"
            value={rows.length}
            caption="Leaderboard entries in the current snapshot"
            icon="solar:medal-ribbons-star-bold-duotone"
            tone="info"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card sx={styles.cardBorderVars}>
            <CardContent>
              <Stack spacing={3}>
                <Stack
                  direction="row"
                  alignItems="flex-start"
                  justifyContent="space-between"
                  spacing={2}
                  flexWrap="wrap"
                  useFlexGap
                >
                  <Stack spacing={1}>
                    <Typography variant="h6">Ranking and badges</Typography>
                    <Typography variant="body2" sx={styles.introText}>
                      Compare daily, weekly, and overall standings with recognition badges.
                    </Typography>
                  </Stack>
                  <ExportExcelButton
                    fileName={`leaderboard-${period}`}
                    sheetName="Leaderboard"
                    headers={['Rank', 'Learner', 'Program', 'Score', 'Badge']}
                    rows={rows}
                    mapRow={(row, index) => [
                      index + 1,
                      row.name ?? '',
                      row.program ?? '',
                      row.score ?? '',
                      row.badge ?? '',
                    ]}
                    disabled={!rows.length}
                  />
                </Stack>

                <Tabs value={period} onChange={(_, value) => setPeriod(value)}>
                  <Tab value="daily" label="Daily" />
                  <Tab value="weekly" label="Weekly" />
                  <Tab value="overall" label="Overall" />
                </Tabs>

                <LeaderboardTable rows={rows} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </LmsPageShell>
  );
}
