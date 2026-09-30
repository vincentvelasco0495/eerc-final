import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useLmsCourses, useLmsPrograms, useLmsAnalytics, useRefreshLmsProgramsCatalog } from 'src/hooks/use-lms';

import { ServerListPagination } from 'src/components/server-pagination';

import { styles } from './styles';
import { InstructorProgramCard } from '../../components/instructor-program-card';
import { InstructorProfileTabs } from '../../components/instructor-profile-tabs';
import { InstructorWorkspaceShell } from '../../components/instructor-workspace-shell';
import { InstructorProfileToolbar } from '../../components/instructor-profile-toolbar';
import { mapLmsProgramToInstructorCard } from '../../map-lms-program-to-instructor-card';
import { InstructorProfileStatCard } from '../../components/instructor-profile-stat-card';
import { instructorProgramFilters, buildInstructorAnalyticsStats } from '../../instructor-profile-data';

const ITEMS_PER_PAGE = 6;

function matchesProgramFilter(program, filter) {
  if (filter === 'all') {
    return true;
  }
  return String(program?.status ?? 'active').toLowerCase() === filter;
}

export function InstructorProfileView() {
  const { analytics, isLoading: analyticsLoading } = useLmsAnalytics();
  const [selectedFilter, setSelectedFilter] = useState(instructorProgramFilters[0].value);
  const [page, setPage] = useState(1);

  const {
    programs: apiPrograms,
    isLoading: programsLoading,
    error: programsError,
    mutate: mutatePrograms,
  } = useLmsPrograms();
  const refreshProgramsCatalog = useRefreshLmsProgramsCatalog();
  const { courses, isLoading: coursesLoading } = useLmsCourses(1, 500);

  const analyticsStats = useMemo(
    () => buildInstructorAnalyticsStats(analytics?.instructorSummary),
    [analytics?.instructorSummary]
  );

  const [localProgramPatches, setLocalProgramPatches] = useState({});

  const allPrograms = useMemo(() => {
    const mapped = apiPrograms.map((program) => mapLmsProgramToInstructorCard(program, courses));
    if (Object.keys(localProgramPatches).length === 0) {
      return mapped;
    }
    return mapped.map((program) => {
      const patch = localProgramPatches[program.id];
      return patch ? { ...program, ...patch } : program;
    });
  }, [apiPrograms, courses, localProgramPatches]);

  useEffect(() => {
    setLocalProgramPatches({});
  }, [apiPrograms, selectedFilter, page]);

  const handleProgramUpdate = useCallback((programId, updater) => {
    setLocalProgramPatches((prev) => {
      const fromApi = apiPrograms.find((program) => program.id === programId);
      const base = fromApi ? mapLmsProgramToInstructorCard(fromApi, courses) : null;
      const current = prev[programId] ?? base;
      if (!current) {
        return prev;
      }
      const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
      return { ...prev, [programId]: next };
    });
  }, [apiPrograms, courses]);

  const handleRemoteProgramsInvalidate = useCallback(async () => {
    await Promise.all([mutatePrograms(), refreshProgramsCatalog()]);
  }, [mutatePrograms, refreshProgramsCatalog]);

  const filteredPrograms = useMemo(
    () => allPrograms.filter((program) => matchesProgramFilter(program, selectedFilter)),
    [allPrograms, selectedFilter]
  );

  const totalPrograms = filteredPrograms.length;
  const lastPage = Math.max(1, Math.ceil(totalPrograms / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, lastPage);
  const rangeFrom = totalPrograms === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const rangeTo = totalPrograms === 0 ? 0 : Math.min(currentPage * ITEMS_PER_PAGE, totalPrograms);
  const visiblePrograms = filteredPrograms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const listLoading = (programsLoading || coursesLoading) && allPrograms.length === 0;
  const error = programsError;

  const goToPage = useCallback((nextPage) => {
    setPage(nextPage);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [selectedFilter]);

  useEffect(() => {
    if (page > lastPage) {
      setPage(lastPage);
    }
  }, [page, lastPage]);

  return (
    <InstructorWorkspaceShell>
      <Stack spacing={3}>
        <Stack spacing={0.75}>
          <Typography variant="h3" sx={styles.heading}>
            Analytics
          </Typography>
          <Typography variant="body2" sx={styles.subtitle}>
            Track program availability, enrollments, and student activity from a single instructor
            workspace.
          </Typography>
        </Stack>

        <InstructorProfileToolbar />

        <Grid container spacing={{ xs: 2, sm: 2, md: 2.5 }}>
          {analyticsStats.map((item) => (
            <Grid
              key={item.id}
              size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}
              sx={styles.statGrid}
            >
              <InstructorProfileStatCard item={item} loading={analyticsLoading} />
            </Grid>
          ))}
        </Grid>

        <InstructorProfileTabs
          value={selectedFilter}
          tabs={instructorProgramFilters}
          onChange={setSelectedFilter}
        />

        {error ? (
          <Alert severity="error">
            {error?.message ?? 'Could not load programs. Check your connection and API configuration.'}
          </Alert>
        ) : null}

        {listLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {visiblePrograms.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                {totalPrograms === 0 && selectedFilter === 'all'
                  ? 'No programs are available yet.'
                  : 'No programs match this filter.'}
              </Typography>
            ) : (
              <Grid container spacing={{ xs: 2, sm: 2, md: 2.5 }}>
                {visiblePrograms.map((program) => (
                  <Grid key={program.id} size={{ xs: 12, sm: 6, lg: 4 }} sx={styles.courseGrid}>
                    <InstructorProgramCard
                      program={program}
                      onProgramUpdate={handleProgramUpdate}
                      onRemoteProgramsInvalidate={handleRemoteProgramsInvalidate}
                    />
                  </Grid>
                ))}
              </Grid>
            )}

            {totalPrograms > 0 ? (
              <ServerListPagination
                page={currentPage}
                lastPage={lastPage}
                total={totalPrograms}
                from={rangeFrom}
                to={rangeTo}
                onPageChange={goToPage}
                disabled={programsLoading || coursesLoading}
              />
            ) : null}
          </>
        )}
      </Stack>
    </InstructorWorkspaceShell>
  );
}
