import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableContainer from '@mui/material/TableContainer';

import { styles } from './styles';
import { InstructorAssignmentTableRow } from '../instructor-assignment-table-row';

const SORTABLE = [
  { id: 'total', label: 'Total', align: 'left' },
  { id: 'passed', label: 'Passed', align: 'left' },
  { id: 'nonPassed', label: 'Non passed', align: 'left' },
  { id: 'pending', label: 'Pending', align: 'left' },
];

export function InstructorAssignmentsTable({ rows, orderBy, order, onRequestSort, onViewAssignment, onLeaderboard }) {
  const createSortHandler = (property) => () => {
    onRequestSort(property);
  };

  return (
    <TableContainer component={Paper} variant="outlined" sx={styles.container}>
      <Table size="medium" sx={styles.table}>
        <TableHead>
          <TableRow sx={styles.headRow}>
            <TableCell sx={{ minWidth: 240 }}>Assignment</TableCell>
            {SORTABLE.map((col) => (
              <TableCell key={col.id} sortDirection={orderBy === col.id ? order : false} sx={{ minWidth: 130 }}>
                <TableSortLabel
                  active={orderBy === col.id}
                  direction={orderBy === col.id ? order : 'asc'}
                  onClick={createSortHandler(col.id)}
                  sx={styles.sortLabel}
                >
                  {col.label}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell align="right" sx={{ minWidth: 100 }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <InstructorAssignmentTableRow
              key={row.id}
              row={row}
              onView={onViewAssignment}
              onLeaderboard={onLeaderboard}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
