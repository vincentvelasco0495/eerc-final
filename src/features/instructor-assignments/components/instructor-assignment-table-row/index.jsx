import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import { styles } from './styles';
import { InstructorAssignmentMetricCell } from '../instructor-assignment-metric-cell';

export function InstructorAssignmentTableRow({ row, onView, onLeaderboard }) {
  return (
    <TableRow hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
      <TableCell sx={{ py: 2, borderColor: 'divider' }}>
        <Typography sx={styles.assignmentTitle}>{row.title}</Typography>
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
