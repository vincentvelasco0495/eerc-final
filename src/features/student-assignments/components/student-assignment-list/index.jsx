import Stack from '@mui/material/Stack';

import { styles } from './styles';
import { StudentAssignmentCard } from '../student-assignment-card';

export function StudentAssignmentList({ assignments }) {
  return (
    <Stack spacing={1.5} sx={styles.stack}>
      {assignments.map((assignment) => (
        <StudentAssignmentCard key={assignment.id} assignment={assignment} />
      ))}
    </Stack>
  );
}
