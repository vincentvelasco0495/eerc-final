import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { styles } from './styles';

function AssignmentMetaBlock({ label, value, children }) {
  return (
    <Stack spacing={0.35} sx={styles.metaBlock}>
      <Typography variant="caption" sx={styles.metaCaption}>
        {label}
      </Typography>
      {children ?? (
        <Typography variant="body2" sx={styles.metaValue}>
          {value}
        </Typography>
      )}
    </Stack>
  );
}

function statusChipColor(status) {
  if (status === 'Passed') {
    return 'success';
  }
  if (status === 'Failed') {
    return 'error';
  }
  return 'warning';
}

function gradeAvatarSx(status) {
  if (status === 'Passed') {
    return { bgcolor: 'success.main', color: 'common.white' };
  }
  if (status === 'Failed') {
    return { bgcolor: 'error.main', color: 'common.white' };
  }
  return { bgcolor: 'warning.darker', color: 'warning.light' };
}

export function StudentAssignmentCard({ assignment }) {
  const courseKey =
    (typeof assignment?.courseSlug === 'string' && assignment.courseSlug.trim()) ||
    (typeof assignment?.courseId === 'string' && assignment.courseId.trim()) ||
    '';
  const assignmentHref =
    courseKey && assignment?.id
      ? paths.dashboard.courseAssignment(courseKey, assignment.id)
      : null;
  const leaderboardHref =
    assignment?.id && assignment.status !== 'Pending'
      ? paths.dashboard.studentAssignmentLeaderboard(assignment.id)
      : null;
  const actionHref = assignment.status === 'Pending' ? assignmentHref : leaderboardHref;
  const actionLabel = assignment.status === 'Pending' ? 'Start' : 'Leaderboard';

  return (
    <Card sx={styles.card}>
      <CardContent sx={styles.cardContent}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
          >
            <Typography variant="h6" sx={styles.title}>
              {assignment.title}
            </Typography>
            {actionHref ? (
              <Button
                component={RouterLink}
                href={actionHref}
                size="small"
                variant="contained"
                disableElevation
              >
                {actionLabel}
              </Button>
            ) : null}
          </Stack>

          <Box sx={styles.grid}>
            <AssignmentMetaBlock label="Course:" value={assignment.course} />

            <AssignmentMetaBlock
              label="Status:"
              children={
                <Chip
                  size="small"
                  label={assignment.status}
                  color={statusChipColor(assignment.status)}
                  variant="soft"
                  sx={{ alignSelf: 'flex-start', fontWeight: 600 }}
                />
              }
            />

            <Stack direction="row" spacing={1} alignItems="center" sx={styles.gradeRow}>
              <Avatar sx={[styles.gradeAvatar, gradeAvatarSx(assignment.status)]}>
                {assignment.gradeLabel}
              </Avatar>
              <Stack spacing={0.15}>
                <Typography variant="body2" sx={styles.gradeScoreLine}>
                  {assignment.scoreLabel}
                </Typography>
                <Typography variant="caption" sx={styles.gradeProgress}>
                  {assignment.progressLabel}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
