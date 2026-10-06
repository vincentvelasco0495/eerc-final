import { useNavigate } from 'react-router';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { useLmsAssignmentSummaries } from 'src/hooks/use-lms';

import { CONFIG } from 'src/global-config';
import { downloadLmsExcelExport } from 'src/lib/lms-excel-export';
import { InstructorWorkspaceShell } from 'src/features/instructor-profile/components/instructor-workspace-shell';

import { ExportExcelButton } from 'src/components/export-excel-button';

import { styles } from './styles';
import { InstructorAssignmentsTable } from '../../components/instructor-assignments-table';
import { InstructorAssignmentsToolbar } from '../../components/instructor-assignments-toolbar';
import {
  instructorAssignmentSummaries,
  instructorAssignmentStatusOptions,
} from '../../instructor-assignments-data';

function descendingComparator(a, b, orderByKey) {
  if (b[orderByKey] < a[orderByKey]) return -1;
  if (b[orderByKey] > a[orderByKey]) return 1;
  return 0;
}

function getComparator(order, orderByKey) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderByKey)
    : (a, b) => -descendingComparator(a, b, orderByKey);
}

function buildCourseOptions(rows) {
  return [
    { value: 'all', label: 'Select course' },
    ...Array.from(new Map(rows.map((r) => [r.courseId, r.course])).entries()).map(([value, label]) => ({
      value,
      label,
    })),
  ];
}

export function InstructorAssignmentsView() {
  const navigate = useNavigate();
  const apiEnabled = Boolean(CONFIG.serverUrl?.trim());
  const { summaries: liveSummaries, isLoading } = useLmsAssignmentSummaries(apiEnabled);

  const sourceRows = apiEnabled ? liveSummaries : instructorAssignmentSummaries;

  const [query, setQuery] = useState('');
  const [course, setCourse] = useState('all');
  const [status, setStatus] = useState('all');
  const [orderBy, setOrderBy] = useState('total');
  const [order, setOrder] = useState('desc');

  const courseOptions = useMemo(() => buildCourseOptions(sourceRows), [sourceRows]);

  const handleRequestSort = useCallback(
    (property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    },
    [order, orderBy]
  );

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return sourceRows.filter((row) => {
      const matchesQuery =
        !q ||
        row.title.toLowerCase().includes(q) ||
        row.course.toLowerCase().includes(q);

      const matchesCourse = course === 'all' || row.courseId === course;

      const matchesStatus =
        status === 'all' ||
        (status === 'pending' && row.pending > 0) ||
        (status === 'issues' && row.nonPassed > 0);

      return matchesQuery && matchesCourse && matchesStatus;
    });
  }, [query, course, status, sourceRows]);

  const sortedRows = useMemo(
    () => [...filteredRows].sort(getComparator(order, orderBy)),
    [filteredRows, order, orderBy]
  );

  const handleViewAssignment = useCallback(
    (row) => {
      if (row?.id) {
        navigate(paths.dashboard.assignmentStudents(row.id));
      }
    },
    [navigate]
  );

  const handleLeaderboard = useCallback(
    (row) => {
      if (row?.id) {
        navigate(paths.dashboard.assignmentLeaderboard(row.id));
      }
    },
    [navigate]
  );

  return (
    <InstructorWorkspaceShell>
      <Stack spacing={3}>
        <InstructorAssignmentsToolbar
          title="Student Assignments"
          query={query}
          course={course}
          status={status}
          courseOptions={courseOptions}
          statusOptions={instructorAssignmentStatusOptions}
          onQueryChange={setQuery}
          onCourseChange={setCourse}
          onStatusChange={setStatus}
        />

        <Stack direction="row" justifyContent="flex-end">
          <ExportExcelButton
            disabled={isLoading}
            onExport={({ from, to }) =>
              downloadLmsExcelExport(
                '/api/assignment-summaries/export',
                { search: query, courseId: course, status, from, to },
                'assignments.xlsx'
              )
            }
            successMessage="Assignment summaries exported to Excel."
          />
        </Stack>

        {apiEnabled && isLoading && !sourceRows.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress aria-label="Loading assignments" />
          </Box>
        ) : sortedRows.length ? (
          <InstructorAssignmentsTable
            rows={sortedRows}
            orderBy={orderBy}
            order={order}
            onRequestSort={handleRequestSort}
            onViewAssignment={handleViewAssignment}
            onLeaderboard={handleLeaderboard}
          />
        ) : (
          <Box sx={styles.emptyState}>
            <Typography variant="body2" sx={styles.emptyText}>
              {apiEnabled
                ? 'No assignments yet. Add assignments from a course curriculum, or adjust your filters.'
                : 'No assignments matched your filters. Try another course, status, or search.'}
            </Typography>
          </Box>
        )}
      </Stack>
    </InstructorWorkspaceShell>
  );
}
