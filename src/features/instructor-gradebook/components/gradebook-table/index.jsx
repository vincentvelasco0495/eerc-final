import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { styles } from './styles';
import { GradebookStudentCell } from '../gradebook-student-cell';

const COLUMNS = [
  { id: 'student', label: 'Student', minWidth: 220 },
  { id: 'lessons', label: 'Lessons:', minWidth: 100 },
  { id: 'quizzes', label: 'Quizzes:', minWidth: 100 },
  { id: 'assignments', label: 'Assignments:', minWidth: 120 },
  { id: 'progress', label: 'Progress:', minWidth: 100 },
  { id: 'started', label: 'Started:', minWidth: 150 },
];

export function GradebookTable({ rows }) {
  return (
    <TableContainer component={Paper} variant="outlined" sx={styles.container}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow sx={styles.headRow}>
            {COLUMNS.map((col) => (
              <TableCell key={col.id} sx={{ minWidth: col.minWidth }}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.id} hover sx={styles.bodyRow(index)}>
              <TableCell>
                <GradebookStudentCell name={row.name} email={row.email} />
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={styles.cellBold}>
                  {row.lessons}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={styles.cellBold}>
                  {row.quizzes}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={styles.cellBold}>
                  {row.assignments}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={styles.cellBold}>
                  {row.progress}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={styles.cellBold}>
                  {row.startedAt ?? row.started_at ?? '—'}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
