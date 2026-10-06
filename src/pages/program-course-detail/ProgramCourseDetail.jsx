import styled from 'styled-components';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';

import { paths } from 'src/routes/paths';

import {
  useLmsActions,
  useLmsCourses,
  useLmsQuizzes,
  useEnrollment,
  useLmsPrograms,
  useLmsProgramStats,
  useLmsModulesByCourse,
} from 'src/hooks/use-lms';

import { resolveProgramBannerSrc } from 'src/utils/program-banner';
import { htmlToPlainText, normalizeHtmlForDisplay } from 'src/utils/html-content';

import { brandVars } from 'src/theme';
import { InstructorCourseCard } from 'src/features/instructor-profile/components/instructor-course-card';
import { InstructorProfileTabs } from 'src/features/instructor-profile/components/instructor-profile-tabs';
import { getProgramEnrollmentKind, isPublishedCatalogCourse } from 'src/features/student-profile/student-profile-data';
import { mapLmsCatalogCourseToInstructorCard } from 'src/features/instructor-profile/map-lms-catalog-course-to-instructor-card';
import { getCourseAccessEnrollment, resolveStudentCourseAccessAction } from 'src/features/enrollment/utils/program-course-enrollment';

import { toast } from 'src/components/snackbar';
import { EnrollmentPaymentDialog } from 'src/components/enrollments/enrollment-payment-dialog';

import { useAuthContext } from 'src/auth/hooks';
import { getAuthSignInPath } from 'src/auth/utils';
import { normalizeUserRole } from 'src/auth/utils/role';

import { SidebarCard } from '../../components/course-detail/SidebarCard';
import { CourseDetailsCard } from '../../components/course-detail/CourseDetailsCard';
import { space, colors, shadow } from '../../components/course-detail/course-detail-tokens';
import { CourseDetailBackArrowSvg } from '../../components/course-detail/course-detail-back-arrow';
import { mapLmsToStyledCourseDetail } from '../../components/course-detail/map-lms-to-styled-shell';

const PageBg = styled.div`
  min-height: 100vh;
  background: ${brandVars.page};
  color: ${colors.headingNavy};
  font-family:
    'Public Sans',
    system-ui,
    -apple-system,
    sans-serif;
`;

const PageInner = styled.div`
  max-width: 1224px;
  margin: 0 auto;
  padding: ${space(3)} ${space(3)} ${space(6)};

  @media (max-width: 900px) {
    padding: ${space(2)};
  }
`;

const PageMain = styled.main`
  width: 100%;
`;

const LocalHeader = styled.header`
  width: 100%;
  margin-bottom: ${space(4)};
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: 0 0 ${space(2)};
  padding: 0;
  border: none;
  border-radius: 8px;
  color: ${colors.headingNavy};
  background: transparent;
  cursor: pointer;

  &:hover {
    background: ${brandVars.hoverWash};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

const Title = styled.h1`
  margin: 0 0 ${space(1.5)};
  font-size: clamp(1.6rem, 3vw, 2.05rem);
  font-weight: 700;
  line-height: 1.22;
  color: ${colors.headingNavy};
  letter-spacing: -0.02em;
`;

const ProgramDescription = styled.div`
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  color: ${colors.muted};

  p {
    margin: 0 0 0.75em;
  }

  p:last-child {
    margin-bottom: 0;
  }

  ul,
  ol {
    margin: 0.5em 0;
    padding-left: 1.25em;
  }
`;

const DescRow = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  color: ${colors.muted};
`;

const DescToggle = styled.button`
  display: inline;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-size: inherit;
  line-height: inherit;
  font-weight: 600;
  color: ${colors.primary};

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

const DESCRIPTION_PREVIEW = 148;

function ProgramDescriptionBlock({ html }) {
  const [expanded, setExpanded] = useState(false);
  const plainText = useMemo(() => htmlToPlainText(html), [html]);
  const needsToggle = plainText.length > DESCRIPTION_PREVIEW;
  const collapsedText = needsToggle
    ? `${plainText.slice(0, DESCRIPTION_PREVIEW).trimEnd()}…`
    : plainText;

  if (!html) {
    return null;
  }

  if (!needsToggle) {
    return <ProgramDescription dangerouslySetInnerHTML={{ __html: html }} />;
  }

  if (expanded) {
    return (
      <>
        <ProgramDescription dangerouslySetInnerHTML={{ __html: html }} />
        <DescRow>
          <DescToggle type="button" onClick={() => setExpanded(false)}>
            See less
          </DescToggle>
        </DescRow>
      </>
    );
  }

  return (
    <DescRow>
      {collapsedText}{' '}
      <DescToggle type="button" onClick={() => setExpanded(true)}>
        See more
      </DescToggle>
    </DescRow>
  );
}

/** Narrow sidebar + wide content; mobile: flex column — main (hero) above sidebar. */
const TwoColGrid = styled.div`
  display: grid;
  grid-template-columns: 316px minmax(0, 1fr);
  gap: 28px;
  align-items: start;

  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
    gap: ${space(3)};
  }
`;

const AsideColumn = styled.aside`
  position: sticky;
  top: ${space(2)};
  display: flex;
  flex-direction: column;
  gap: ${space(2.5)};

  @media (max-width: 900px) {
    position: relative;
    top: auto;
    order: 2;
  }
`;

const MainColumn = styled.section`
  min-width: 0;

  @media (max-width: 900px) {
    order: 1;
  }
`;

const HeroFigure = styled.figure`
  margin: 0;
`;

const HeroImg = styled.img`
  display: block;
  width: 100%;
  border-radius: 12px;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  box-shadow: ${shadow.card};
  background: ${colors.bg};
`;

const programHeroBannerFrameSx = {
  position: 'relative',
  width: '100%',
  aspectRatio: '16 / 9',
  borderRadius: '12px',
  overflow: 'hidden',
  bgcolor: brandVars.sunken,
  boxShadow: shadow.card,
};

const ProgramCoursesGridWrap = styled.section`
  margin-top: ${space(2.5)};
`;

const PROGRAM_COURSE_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'In Draft' },
];

const PROGRAM_ALIAS_TO_ID = {
  'civil-engineering': 'program-ce',
  'civil_engineering': 'program-ce',
  'civil-engineing': 'program-ce',
  'civil_engineing': 'program-ce',
  civilengineering: 'program-ce',
  ce: 'program-ce',
  'master-plumbing': 'program-plumbing',
  'master_plumbing': 'program-plumbing',
  masterplumbing: 'program-plumbing',
  mpl: 'program-plumbing',
  'materials-engineering': 'program-materials',
  'materials_engineering': 'program-materials',
  materialsengineering: 'program-materials',
  mse: 'program-materials',
};

function resolveProgramDetailBackPath(authenticated, role) {
  if (!authenticated) {
    return paths.dashboard.availablePrograms;
  }
  const normalized = normalizeUserRole(role);
  if (normalized === 'admin') {
    return paths.dashboard.home;
  }
  if (normalized === 'instructor') {
    return paths.dashboard.instructorHome;
  }
  return paths.dashboard.availablePrograms;
}

export default function ProgramCourseDetail() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [enrollSubmitting, setEnrollSubmitting] = useState(false);
  const [requestingCourseId, setRequestingCourseId] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticated, loading: authLoading, user } = useAuthContext();
  const enrollments = useEnrollment(authenticated && !authLoading);
  const { submitEnrollment, requestCourseAccess } = useLmsActions();
  const requestedProgram = String(searchParams.get('program') ?? '').trim().toLowerCase();
  const { programs, isLoading: programsLoading, error: programsError } = useLmsPrograms();
  const { courses, isLoading: coursesLoading, error: coursesError, mutate: mutateCourses } = useLmsCourses(1, 500, requestedProgram);
  const { quizzes } = useLmsQuizzes();

  const normalize = (v) =>
    String(v ?? '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const selectedProgram = useMemo(() => {
    const p = programs ?? [];
    if (!requestedProgram) {
      return p[0] ?? null;
    }
    const aliasProgramId = PROGRAM_ALIAS_TO_ID[requestedProgram];
    const normalizedRequested = normalize(requestedProgram);
    return (
      p.find(
        (row) =>
          (aliasProgramId && String(row?.id) === aliasProgramId) ||
          normalize(row?.slug) === normalizedRequested ||
          normalize(row?.code) === requestedProgram ||
          normalize(row?.title) === requestedProgram ||
          normalize(row?.id) === requestedProgram
      ) ?? p[0] ?? null
    );
  }, [programs, requestedProgram]);
  const { stats: programStats } = useLmsProgramStats(selectedProgram?.id ?? null);

  const programCourses = useMemo(() => {
    const source = courses ?? [];
    if (!source.length) {
      return [];
    }
    const requestedAliasProgramId = PROGRAM_ALIAS_TO_ID[requestedProgram];
    const selectedProgramId = selectedProgram?.id ? String(selectedProgram.id) : '';
    const selectedProgramTitle = normalize(selectedProgram?.title);
    const requestedNormalized = normalize(requestedProgram);

    return source.filter((c) => {
      const courseProgramId = c?.programId ? String(c.programId) : '';
      const courseProgramTitle = normalize(c?.programTitle);
      const bySelectedId = Boolean(selectedProgramId && courseProgramId === selectedProgramId);
      const byAliasId = Boolean(requestedAliasProgramId && courseProgramId === requestedAliasProgramId);
      const bySelectedTitle = Boolean(selectedProgramTitle && courseProgramTitle === selectedProgramTitle);
      const byRequestedTitle = Boolean(requestedNormalized && courseProgramTitle === requestedNormalized);
      return bySelectedId || byAliasId || bySelectedTitle || byRequestedTitle;
    });
  }, [courses, requestedProgram, selectedProgram]);
  const staffCurriculumBypass = useMemo(() => {
    const r = normalizeUserRole(user?.role);
    return r === 'admin' || r === 'instructor';
  }, [user?.role]);

  const isStaffViewer = staffCurriculumBypass;

  const [localCourseCardPatches, setLocalCourseCardPatches] = useState({});

  useEffect(() => {
    setLocalCourseCardPatches({});
  }, [courses]);

  const catalogCourses = useMemo(
    () => (isStaffViewer ? programCourses : programCourses.filter(isPublishedCatalogCourse)),
    [programCourses, isStaffViewer]
  );

  const handleCourseUpdate = useCallback(
    (courseId, updater) => {
      setLocalCourseCardPatches((prev) => {
        const base = catalogCourses.find((course) => course.id === courseId);
        const mappedBase = base ? mapLmsCatalogCourseToInstructorCard(base) : null;
        const current = prev[courseId] ?? mappedBase;
        if (!current) {
          return prev;
        }
        const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
        return { ...prev, [courseId]: next };
      });
    },
    [catalogCourses]
  );

  const programCourseCards = useMemo(() => {
    const mapped = catalogCourses.map((course) => mapLmsCatalogCourseToInstructorCard(course));
    if (Object.keys(localCourseCardPatches).length === 0) {
      return mapped;
    }
    return mapped.map((card) => {
      const patch = localCourseCardPatches[card.id];
      return patch ? { ...card, ...patch } : card;
    });
  }, [catalogCourses, localCourseCardPatches]);

  const catalogSidebarStats = useMemo(() => {
    const publishedCourses = programCourseCards.filter((course) => course.status === 'published');
    const totalPublishedCourses = publishedCourses.length;
    const totalDurationHours = catalogCourses.reduce(
      (sum, course) => sum + (Number(course.hours) || 0),
      0
    );
    const totalLectures = catalogCourses.reduce(
      (sum, course) => sum + (Number(course.totalModules) || 0),
      0
    );
    return { totalPublishedCourses, totalDurationHours, totalLectures };
  }, [catalogCourses, programCourseCards]);

  const visibleProgramCourseCards = useMemo(() => {
    if (selectedFilter === 'all') {
      return programCourseCards;
    }
    if (selectedFilter === 'published') {
      return programCourseCards.filter((course) => course.status === 'published');
    }
    if (selectedFilter === 'draft') {
      return programCourseCards.filter((course) => course.status === 'draft');
    }
    return programCourseCards;
  }, [programCourseCards, selectedFilter]);

  const selectedCourse = catalogCourses[0] ?? null;
  const { modules } = useLmsModulesByCourse(selectedCourse?.id ?? null);
  const quizzesForCourse = useMemo(
    () => (selectedCourse?.id ? (quizzes ?? []).filter((q) => q.courseId === selectedCourse.id) : []),
    [quizzes, selectedCourse?.id]
  );

  const applyLessonLocks = authenticated && !authLoading && !staffCurriculumBypass;

  const shell = useMemo(
    () =>
      selectedCourse
        ? mapLmsToStyledCourseDetail(selectedCourse, modules ?? [], quizzesForCourse, [], [], null, {
            applyLessonLocks,
          })
        : null,
    [selectedCourse, modules, quizzesForCourse, applyLessonLocks]
  );

  const programTitle = selectedProgram?.title || shell?.data?.title || 'Program';
  const programDescriptionRaw =
    selectedProgram?.description || shell?.data?.shortDescription || '';
  const programDescriptionHtml = useMemo(
    () => normalizeHtmlForDisplay(programDescriptionRaw),
    [programDescriptionRaw]
  );
  const programBannerSrc = resolveProgramBannerSrc(selectedProgram?.bannerUrl || selectedProgram?.bannerPath);

  const programEnrollmentKind = useMemo(() => {
    if (!selectedProgram?.id) {
      return 'none';
    }
    return getProgramEnrollmentKind(selectedProgram.id, enrollments ?? [], courses ?? []);
  }, [courses, enrollments, selectedProgram?.id]);

  const showProgramEnrollButton = useMemo(() => {
    if (isStaffViewer) {
      return false;
    }
    if (!authenticated) {
      return true;
    }
    if (authLoading) {
      return false;
    }
    return programEnrollmentKind === 'none' || programEnrollmentKind === 'rejected';
  }, [authLoading, authenticated, isStaffViewer, programEnrollmentKind]);

  const showCourseAccessHint =
    authenticated && !authLoading && !isStaffViewer && programEnrollmentKind === 'approved';

  const handleRequestCourseAccess = useCallback(
    async (course) => {
      if (!course?.id || requestingCourseId) {
        return;
      }
      setRequestingCourseId(course.id);
      try {
        await requestCourseAccess(course.id);
        toast.success('Access requested. An administrator will review it.');
      } catch (error) {
        const message =
          typeof error === 'string' ? error : error?.message ?? 'Could not request course access.';
        toast.error(message);
      } finally {
        setRequestingCourseId(null);
      }
    },
    [requestCourseAccess, requestingCourseId]
  );

  const studentActionForCard = useCallback(
    (card) => {
      if (isStaffViewer || !authenticated || authLoading) {
        return null;
      }
      return resolveStudentCourseAccessAction({
        programEnrollmentKind,
        courseEnrollment: getCourseAccessEnrollment(enrollments ?? [], card.id),
        requesting: requestingCourseId === card.id,
        onRequestAccess: () => handleRequestCourseAccess(card),
      });
    },
    [
      authLoading,
      authenticated,
      enrollments,
      handleRequestCourseAccess,
      isStaffViewer,
      programEnrollmentKind,
      requestingCourseId,
    ]
  );

  const handleEnrollClick = useCallback(() => {
    if (!authenticated) {
      const returnTo = `${location.pathname}${location.search}`;
      const query = new URLSearchParams({ returnTo }).toString();
      navigate(`${getAuthSignInPath()}?${query}`);
      return;
    }
    if (!selectedProgram?.id) {
      return;
    }
    navigate(`${paths.dashboard.enrollmentApply}?programId=${encodeURIComponent(selectedProgram.id)}`);
  }, [authenticated, location.pathname, location.search, navigate, selectedProgram?.id]);

  const handleEnrollSubmit = useCallback(
    async (paymentProofFile) => {
      if (!selectedProgram?.id) {
        return;
      }

      setEnrollSubmitting(true);
      try {
        await submitEnrollment({ programId: selectedProgram.id, paymentProofFile });
        setEnrollDialogOpen(false);
        toast.success('Enrollment submitted successfully.');
      } catch (error) {
        const message =
          typeof error === 'string' ? error : error?.message ?? 'Could not submit enrollment.';
        toast.error(message);
      } finally {
        setEnrollSubmitting(false);
      }
    },
    [selectedProgram?.id, submitEnrollment]
  );

  const handleBack = useCallback(() => {
    const returnTo = location.state?.from;
    if (typeof returnTo === 'string' && returnTo.startsWith('/')) {
      navigate(returnTo);
      return;
    }
    navigate(resolveProgramDetailBackPath(authenticated, user?.role));
  }, [authenticated, location.state, navigate, user?.role]);

  const isInitialLoad =
    (programsLoading && !(programs?.length ?? 0)) || (coursesLoading && !(courses?.length ?? 0));

  if (isInitialLoad) {
    return (
      <PageBg>
        <PageInner>
          <PageMain>
            <h2>Loading program courses...</h2>
          </PageMain>
        </PageInner>
      </PageBg>
    );
  }

  if (programsError || coursesError) {
    const message = coursesError?.message || programsError?.message || 'Unable to load program courses.';
    return (
      <PageBg>
        <PageInner>
          <PageMain>
            <h2>Unable to load courses right now.</h2>
            <p>{message}</p>
          </PageMain>
        </PageInner>
      </PageBg>
    );
  }

  if (!selectedProgram) {
    return (
      <PageBg>
        <PageInner>
          <PageMain>
            <h2>Program not found.</h2>
          </PageMain>
        </PageInner>
      </PageBg>
    );
  }

  const programDetailsRows = [
    {
      key: 'program_courses',
      icon: 'clipboard',
      label: 'Published courses',
      value: String(catalogSidebarStats.totalPublishedCourses),
    },
    {
      key: 'program_duration',
      icon: 'clock',
      label: 'Duration',
      value: `${String(catalogSidebarStats.totalDurationHours)} hours`,
    },
    {
      key: 'program_lectures',
      icon: 'book',
      label: 'Lectures',
      value: String(catalogSidebarStats.totalLectures),
    },
    {
      key: 'program_videos',
      icon: 'play',
      label: 'Video',
      value: String(programStats?.totalVideos ?? 0),
    },
    {
      key: 'program_quizzes',
      icon: 'check',
      label: 'Quizzes',
      value: String(programStats?.totalQuizzes ?? 0),
    },
  ];

  return (
    <PageBg>
      <PageInner>
        <PageMain>
          <LocalHeader>
            <BackButton type="button" aria-label="Go back" onClick={handleBack}>
              <CourseDetailBackArrowSvg />
            </BackButton>
            <Title>{programTitle}</Title>
            {programDescriptionHtml ? (
              <ProgramDescriptionBlock html={programDescriptionHtml} />
            ) : null}
          </LocalHeader>
          <TwoColGrid>
            <AsideColumn aria-label="Course summary sidebar">
              <SidebarCard $variant="muted">
                <CourseDetailsCard rows={programDetailsRows} heading="Program details" />
                {showProgramEnrollButton ? (
                  <Stack spacing={2} sx={{ mt: 3, pt: 0.5 }}>
                    <Button fullWidth variant="contained" size="medium" onClick={handleEnrollClick}>
                      Enroll now
                    </Button>
                  </Stack>
                ) : null}
              </SidebarCard>
            </AsideColumn>

            <MainColumn aria-label="Lesson content">
              {programBannerSrc ? (
                <HeroFigure role="presentation">
                  <HeroImg src={programBannerSrc} alt="" />
                </HeroFigure>
              ) : (
                <HeroFigure role="presentation">
                  <Box sx={programHeroBannerFrameSx}>
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      aria-hidden
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        width: 1,
                        height: 1,
                        transform: 'none',
                      }}
                    />
                  </Box>
                </HeroFigure>
              )}
              <ProgramCoursesGridWrap>
                {isStaffViewer ? (
                  <InstructorProfileTabs
                    value={selectedFilter}
                    tabs={PROGRAM_COURSE_FILTERS}
                    onChange={setSelectedFilter}
                  />
                ) : null}
                {showCourseAccessHint ? (
                  <DescRow style={{ marginBottom: 12 }}>
                    Request access for each course. An administrator will approve or reject the
                    request.
                  </DescRow>
                ) : null}
                <Grid container spacing={{ xs: 2, sm: 2, md: 2.5 }} sx={{ mt: isStaffViewer ? 0.25 : 0 }}>
                  {visibleProgramCourseCards.map((card) => (
                    <Grid key={card.id} size={{ xs: 12, sm: 6, lg: 6, xl: 6 }}>
                      <InstructorCourseCard
                        course={card}
                        onCourseUpdate={handleCourseUpdate}
                        onRemoteCoursesInvalidate={mutateCourses}
                        studentAction={studentActionForCard(card)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </ProgramCoursesGridWrap>
            </MainColumn>
          </TwoColGrid>
        </PageMain>
      </PageInner>

      <EnrollmentPaymentDialog
        open={enrollDialogOpen}
        onClose={() => setEnrollDialogOpen(false)}
        title="Enroll in program"
        programId={selectedProgram?.id ?? ''}
        programCode={selectedProgram?.code}
        programTitle={selectedProgram?.title ?? programTitle}
        submitting={enrollSubmitting}
        onSubmit={handleEnrollSubmit}
      />
    </PageBg>
  );
}
