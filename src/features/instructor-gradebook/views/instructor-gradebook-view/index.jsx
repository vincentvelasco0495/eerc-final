import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useLmsGradebookCourses, useLmsGradebookPaginated } from 'src/hooks/use-lms';

import { CONFIG } from 'src/global-config';
import { downloadLmsExcelExport } from 'src/lib/lms-excel-export';
import { InstructorWorkspaceShell } from 'src/features/instructor-profile/components/instructor-workspace-shell';

import { ExportExcelButton } from 'src/components/export-excel-button';

import { styles } from './styles';
import { GradebookTable } from '../../components/gradebook-table';
import { GradebookSummaryGrid } from '../../components/gradebook-summary-grid';
import { GradebookCourseSelect } from '../../components/gradebook-course-select';
import { GradebookPaginationBar } from '../../components/gradebook-pagination-bar';

const PAGE_SIZE_OPTIONS = [10, 20, 30];

export function InstructorGradebookView() {
  const apiEnabled = Boolean(CONFIG.serverUrl?.trim());
  const { courses, isLoading: coursesLoading, error: coursesError } = useLmsGradebookCourses(apiEnabled);

  const [courseId, setCourseId] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  useEffect(() => {
    if (!courseId && courses.length) {
      setCourseId(courses[0].id);
    }
  }, [courseId, courses]);

  useEffect(() => {
    setPage(1);
  }, [courseId, pageSize]);

  const {
    stats,
    students,
    meta,
    isLoading: gradebookLoading,
    error: gradebookError,
  } = useLmsGradebookPaginated(courseId, page, pageSize, apiEnabled && Boolean(courseId));

  const pageCount = meta?.last_page ?? 1;
  const isLoading = coursesLoading || (gradebookLoading && !students.length);

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  return (
    <InstructorWorkspaceShell>
      <Stack spacing={3}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          columnGap={2}
          rowGap={1}
        >
          <Typography variant="h4" sx={styles.title}>
            The Gradebook
          </Typography>
          <ExportExcelButton
            disabled={isLoading || !courseId}
            onExport={({ from, to }) =>
              downloadLmsExcelExport(
                `/api/gradebook/courses/${encodeURIComponent(courseId)}/export`,
                { from, to },
                'gradebook.xlsx'
              )
            }
            successMessage="Gradebook exported to Excel."
          />
        </Stack>

        {!apiEnabled ? (
          <Alert severity="info">
            Gradebook requires the LMS API. Set <code>VITE_SERVER_URL</code> and sign in as an
            instructor or admin.
          </Alert>
        ) : coursesError || gradebookError ? (
          <Alert severity="error">
            {coursesError?.message ?? gradebookError?.message ?? 'Could not load gradebook data.'}
          </Alert>
        ) : null}

        {apiEnabled ? (
          <>
            <GradebookCourseSelect
              value={courseId}
              onChange={setCourseId}
              options={courses}
              disabled={coursesLoading || !courses.length}
            />

            {isLoading ? (
              <Box sx={styles.loadingWrap}>
                <CircularProgress aria-label="Loading gradebook" />
              </Box>
            ) : !courses.length ? (
              <Box sx={styles.emptyState}>
                <Typography variant="body2" color="text.secondary">
                  No courses are available for gradebook reporting yet.
                </Typography>
              </Box>
            ) : (
              <>
                <GradebookSummaryGrid stats={stats} />

                {students.length ? (
                  <GradebookTable rows={students} />
                ) : (
                  <Box sx={styles.emptyState}>
                    <Typography variant="body2" color="text.secondary">
                      No approved student enrollments were found for this course.
                    </Typography>
                  </Box>
                )}

                {(meta?.total ?? 0) > 0 ? (
                  <GradebookPaginationBar
                    page={meta?.current_page ?? page}
                    pageCount={pageCount}
                    onPageChange={setPage}
                    pageSize={pageSize}
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                    onPageSizeChange={setPageSize}
                  />
                ) : null}
              </>
            )}
          </>
        ) : null}
      </Stack>
    </InstructorWorkspaceShell>
  );
}
