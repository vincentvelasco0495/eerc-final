import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import { InstructorAssignmentMetricCell } from 'src/features/instructor-assignments/components/instructor-assignment-metric-cell';

import { styles } from './styles';

export function InstructorStudentQuizTableRow({ row, onView, onLeaderboard }) {
  return (
    <TableRow hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
      <TableCell sx={{ py: 2, borderColor: 'divider' }}>
        <Typography sx={styles.quizTitle}>{row.title}</Typography>
        <Typography sx={styles.courseLine}>{row.course}</Typography>
      </TableCell>
      <TableCell sx={{ borderColor: 'divider' }}>
        <Typography sx={styles.totalCell}>Total: {row.total}</Typography>
      </TableCell>
      <TableCell sx={{ borderColor: 'divider' }}>
        <InstructorAssignmentMetricCell variant="passed" value={row.passed} />
      </TableCell>
      <TableCell sx={{ borderColor: 'divider' }}>
        <InstructorAssignmentMetricCell variant="nonPassed" value={row.nonPassed} />
      </TableCell>
      <TableCell sx={{ borderColor: 'divider' }}>
        <InstructorAssignmentMetricCell variant="pending" value={row.pending} />
      </TableCell>
      <TableCell align="right" sx={{ borderColor: 'divider' }}>
        <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
          <Button
            size="small"
            variant="contained"
            disableElevation
            onClick={() => onView?.(row)}
            sx={styles.viewButton}
          >
            View
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            disableElevation
            onClick={() => onLeaderboard?.(row)}
            sx={styles.leaderboardButton}
          >
            Leaderboard
          </Button>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
