import { paths } from 'src/routes/paths';

import { resolveCourseMarketingBannerUrl } from 'src/utils/course-hero-image';

import { enrollmentGrantsCourseAccess } from 'src/constants/lms';

const DEFAULT_STARTED_AT = 'April 24, 2026';

export function getStudentWorkspaceNavGroups(pathname) {
  return [
    {
      title: 'Main',
      items: [
        {
          label: 'Programs',
          icon: 'solar:layers-minimalistic-bold-duotone',
          path: paths.dashboard.availablePrograms,
          active: pathname === paths.dashboard.availablePrograms,
        },
        {
          label: 'My Assignments',
          icon: 'solar:clipboard-list-bold-duotone',
          path: paths.dashboard.studentAssignments,
          active:
            pathname === paths.dashboard.studentAssignments ||
            /^\/assignments\/[^/]+\/leaderboard\/?$/.test(pathname ?? ''),
        },
        {
          label: 'Quizzes',
          icon: 'solar:document-text-bold-duotone',
          path: paths.dashboard.quizzes.root,
          active:
            pathname === paths.dashboard.quizzes.root ||
            /^\/quizzes\/[^/]+\/leaderboard\/?$/.test(pathname ?? ''),
        },
      ],
    },
    {
      title: 'System Setting',
      items: [
        {
          label: 'Profile',
          icon: 'solar:settings-bold-duotone',
          path: paths.dashboard.studentSettings,
          active: pathname === paths.dashboard.studentSettings,
        },
        { label: 'Log out', icon: 'solar:logout-3-bold-duotone', action: 'logout' },
      ],
    },
  ];
}

const derivedCourseConfig = {
  'course-ce-review': {
    rating: 4.7,
    startedAt: DEFAULT_STARTED_AT,
    variant: 'stage',
  },
  'course-ce-structures': {
    rating: 4.6,
    startedAt: 'April 20, 2026',
    variant: 'cobalt',
  },
  'course-plumbing-mastery': {
    rating: 4.5,
    startedAt: 'April 22, 2026',
    variant: 'linen',
  },
  'course-materials-intensive': {
    rating: 4.9,
    startedAt: 'April 20, 2026',
    variant: 'slate',
  },
};

/** Approved program ids for legacy enrollments only (no `courseId` — unlocks all courses in the program). */
export function getApprovedProgramIds(enrollments = [], courses = []) {
  const approved = new Set();

  for (const item of enrollments) {
    if (!enrollmentGrantsCourseAccess(item?.status)) {
      continue;
    }

    if (item.courseId) {
      continue;
    }

    if (item.programId) {
      approved.add(item.programId);
    }
  }

  return approved;
}

/**
 * Approved course public ids plus legacy full-program approvals.
 * @returns {{ approvedCourseIds: Set<string>, legacyApprovedProgramIds: Set<string> }}
 */
export function getLearnerEnrollmentAccessSets(enrollments = []) {
  const approvedCourseIds = new Set();
  const legacyApprovedProgramIds = new Set();

  for (const item of enrollments ?? []) {
    if (!enrollmentGrantsCourseAccess(item?.status)) {
      continue;
    }
    if (item.courseId) {
      approvedCourseIds.add(item.courseId);
    } else if (item.programId) {
      legacyApprovedProgramIds.add(item.programId);
    }
  }

  return { approvedCourseIds, legacyApprovedProgramIds };
}

export function buildStudentProfileCourses(courses, programs, enrollments = []) {
  const programMap = new Map((programs ?? []).map((program) => [program.id, program.title]));
  const { approvedCourseIds, legacyApprovedProgramIds } = getLearnerEnrollmentAccessSets(enrollments);

  if (approvedCourseIds.size === 0 && legacyApprovedProgramIds.size === 0) {
    return [];
  }

  return (courses ?? [])
    .filter(
      (course) =>
        isPublishedCatalogCourse(course) &&
        (approvedCourseIds.has(course.id) || legacyApprovedProgramIds.has(course.programId))
    )
    .map((course) => {
      const config = derivedCourseConfig[course.id] ?? {
        rating: 4.5,
        startedAt: DEFAULT_STARTED_AT,
        variant: 'cobalt',
      };

      const isCompleted =
        Number(course.totalModules) > 0 &&
        Number(course.completedModules) >= Number(course.totalModules);

      return {
        id: course.id,
        courseId: course.id,
        courseSlug: course.slug,
        category: programMap.get(course.programId) ?? course.subjects?.[0] ?? 'Learning Track',
        title: course.title,
        lessons: course.totalModules,
        durationHours: course.hours,
        rating: config.rating,
        status: isCompleted ? 'completed' : 'in-progress',
        startedAt: config.startedAt,
        variant: config.variant,
        badge: isCompleted ? 'Completed' : null,
        bannerImageUrl: resolveCourseMarketingBannerUrl(course),
      };
    });
}

/** Matches LMS catalog rules used for learner-facing program aggregates. */
export function isPublishedCatalogCourse(course) {
  if (course?.isPublished === false) {
    return false;
  }
  if (typeof course?.status === 'string' && course.status.toLowerCase() === 'draft') {
    return false;
  }
  return true;
}

/** Enrollment rows that apply to a program (direct program id or legacy course enrollment). */
export function getProgramEnrollmentRows(programId, enrollments = [], courses = []) {
  return (enrollments ?? []).filter((item) => {
    if (item?.programId === programId) {
      return true;
    }

    if (!item?.courseId) {
      return false;
    }

    const legacyCourse = (courses ?? []).find((course) => course.id === item.courseId);
    return legacyCourse?.programId === programId;
  });
}

/** Highest-priority enrollment state for a program card (pending blocks "approved" badge). */
export function getProgramEnrollmentKind(programId, enrollments = [], courses = []) {
  const rows = getProgramEnrollmentRows(programId, enrollments, courses);

  if (!rows.length) {
    return 'none';
  }

  if (rows.some((item) => item.status === 'pending')) {
    return 'pending';
  }

  if (rows.some((item) => item.status === 'hold')) {
    return 'hold';
  }

  if (rows.some((item) => enrollmentGrantsCourseAccess(item.status))) {
    return 'approved';
  }

  if (rows.some((item) => item.status === 'rejected')) {
    return 'rejected';
  }

  return 'none';
}

function deriveProgramProgressStatus(programCourses) {
  if (!programCourses.length) {
    return 'in-progress';
  }

  const allCompleted = programCourses.every(
    (course) =>
      Number(course.totalModules) > 0 &&
      Number(course.completedModules) >= Number(course.totalModules)
  );

  return allCompleted ? 'completed' : 'in-progress';
}

/** Active `programs` rows for the Available programs grid (`title` + `description` from DB). */
export function buildAvailableProgramCards(programs, courses, enrollments = []) {
  const publishedCourses = (courses ?? []).filter(isPublishedCatalogCourse);

  return (programs ?? [])
    .filter((program) => String(program?.status ?? 'active').toLowerCase() === 'active')
    .map((program) => {
      const programCourses = publishedCourses.filter((course) => course.programId === program.id);
      const totalLectures = programCourses.reduce(
        (sum, course) => sum + (Number(course.totalModules) || 0),
        0
      );
      const totalHours = programCourses.reduce((sum, course) => sum + (Number(course.hours) || 0), 0);
      const programSlug =
        String(program?.slug ?? '').trim() ||
        String(program?.code ?? '')
          .trim()
          .toLowerCase();

      const enrollmentKind = getProgramEnrollmentKind(program.id, enrollments, publishedCourses);
      const enrollmentRows = getProgramEnrollmentRows(program.id, enrollments, publishedCourses);
      const approvedEnrollment = enrollmentRows.find((item) => enrollmentGrantsCourseAccess(item.status));

      let status = 'available';
      let enrollmentCaption = 'Available to enroll';
      let actionLabel = 'Browse program';
      let startedAt = null;
      let badge = null;

      if (enrollmentKind === 'approved') {
        status = deriveProgramProgressStatus(programCourses);
        enrollmentCaption = status === 'completed' ? 'Enrolled · Completed' : 'Enrolled · In progress';
        actionLabel = status === 'completed' ? 'Review program' : 'Continue program';
        badge = status === 'completed' ? 'Completed' : 'Enrolled';
        startedAt = approvedEnrollment?.submittedAt ?? null;
      } else if (enrollmentKind === 'pending') {
        status = 'pending';
        enrollmentCaption = 'Enrollment pending approval';
        actionLabel = 'View program';
        badge = 'Pending';
      } else if (enrollmentKind === 'hold') {
        status = 'hold';
        enrollmentCaption = 'Enrollment on hold';
        actionLabel = 'View program';
        badge = 'On hold';
      } else if (enrollmentKind === 'rejected') {
        status = 'failed';
        enrollmentCaption = 'Enrollment not approved';
        actionLabel = 'Browse program';
        badge = 'Not approved';
      }

      return {
        id: program.id,
        category: String(program?.code ?? '').trim() || 'Program',
        title: String(program?.title ?? '').trim() || 'Program',
        description: String(program?.description ?? '').trim(),
        lessons: programCourses.length,
        lessonsMetaLabel: 'Courses',
        durationHours: totalHours,
        lectureCount: totalLectures,
        rating: null,
        status,
        enrollmentKind,
        enrollmentCaption,
        startedAt,
        bannerPath: program?.bannerPath ?? '',
        bannerUrl: program?.bannerUrl ?? '',
        programSlug,
        actionLabel,
        badge,
      };
    });
}

export const studentAssignments = [
  {
    id: 'assignment-001',
    title: 'Practical homework',
    course: 'CE Board Review',
    teacher: 'Engr. Hannah Cruz',
    updatedAt: '2 years ago',
    status: 'Passed',
    gradeLabel: 'A+',
    scoreLabel: '(5.00/5.00)',
    progressLabel: '100%',
  },
  {
    id: 'assignment-002',
    title: 'Make a presentation about your career',
    course: 'Master Plumbing Fast Track',
    teacher: 'Engr. Miguel Santos',
    updatedAt: '1 year ago',
    status: 'Failed',
    gradeLabel: 'B',
    scoreLabel: '(3.40/5.00)',
    progressLabel: '68%',
  },
  {
    id: 'assignment-003',
    title: 'Practical homework',
    course: 'Materials Engineering Intensive',
    teacher: 'Dr. Reese Navarro',
    updatedAt: '2 years ago',
    status: 'Passed',
    gradeLabel: 'A+',
    scoreLabel: '(5.00/5.00)',
    progressLabel: '100%',
  },
];

export const studentAssignmentStatuses = ['All', 'Pending', 'Passed', 'Failed'];

export const studentQuizStatuses = ['All', 'Pending', 'Passed', 'Failed'];
