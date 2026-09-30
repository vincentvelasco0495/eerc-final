import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';
import { EnrolledQuizRow } from '../enrolled-quiz-row';

export function EnrolledQuizCourseGroup({ group }) {
  const quizCount = group.items?.length ?? 0;
  const quizLabel = quizCount === 1 ? '1 quiz' : `${quizCount} quizzes`;

  return (
    <Card sx={styles.card}>
      <Box sx={styles.header}>
        <Stack direction="row" spacing={1.25} alignItems="center" sx={styles.headerMain}>
          <Box sx={styles.headerIconWrap}>
            <Iconify icon="solar:book-2-bold-duotone" width={20} />
          </Box>
          <Stack spacing={0.2} sx={styles.headerText}>
            <Typography variant="caption" sx={styles.courseCaption}>
              Course
            </Typography>
            <Typography variant="subtitle1" sx={styles.courseTitle}>
              {group.courseTitle}
            </Typography>
          </Stack>
        </Stack>
        <Chip size="small" label={quizLabel} variant="soft" color="default" sx={styles.countChip} />
      </Box>

      <CardContent sx={styles.cardContent}>
        <Stack sx={styles.rowsStack}>
          {group.items.map((quiz, index) => (
            <EnrolledQuizRow
              key={quiz.id}
              quiz={quiz}
              isLast={index === group.items.length - 1}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
