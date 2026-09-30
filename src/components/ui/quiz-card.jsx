import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

export function QuizCard({ quiz }) {
  return (
    <Card
      sx={{
        width: 1,
        height: '100%',
        border: (theme) => `1px solid ${theme.vars.palette.divider}`,
        boxShadow: 'none',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          <Box
            sx={{
              width: 48,
              height: 48,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 1.5,
              bgcolor: 'warning.lighter',
              color: 'warning.main',
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              {quiz.durationMinutes}
            </Typography>
          </Box>
          <Stack spacing={1}>
            <Typography variant="h6">{quiz.title}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Timed quiz with randomized questions and tracked attempt history.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label={`${quiz.durationMinutes} min`} size="small" />
            <Chip label={`${quiz.questionCount} questions`} size="small" />
            <Chip
              label={
                quiz.limitedRetakeAttempts
                  ? `${quiz.attemptsUsed}/${quiz.attemptsAllowed} attempts`
                  : `${quiz.attemptsUsed} attempts · unlimited`
              }
              size="small"
            />
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Stack spacing={0.5}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Best score
              </Typography>
              <Typography variant="subtitle2">{quiz.bestScore}%</Typography>
            </Stack>
            <Button
              component={RouterLink}
              href={paths.dashboard.quizzes.details(quiz.id)}
              variant="contained"
            >
              Start quiz
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
