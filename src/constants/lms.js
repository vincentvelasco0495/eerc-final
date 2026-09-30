export const LMS_PROGRAMS = ['CE', 'Master Plumbing', 'Materials Engineering'];

/** Program ids + display labels (enrollment form, course settings, etc.). */
export const LMS_PROGRAM_SELECT_OPTIONS = [
  { id: 'program-ce', label: 'Civil Engineering' },
  { id: 'program-plumbing', label: 'Master Plumbing' },
  { id: 'program-materials', label: 'Materials Engineering' },
];

export const LEARNING_FLOW_STEPS = [
  'Review',
  'Practice',
  'Refresher',
  'Final Coaching',
];

export const LEADERBOARD_PERIODS = ['daily', 'weekly', 'overall'];

export const ENROLLMENT_STATUSES = ['pending', 'approved', 'rejected', 'hold'];

/** Only `approved` enrollments unlock program and course access for learners. */
export function enrollmentGrantsCourseAccess(status) {
  return String(status ?? '').toLowerCase() === 'approved';
}

export const BADGE_VARIANTS = {
  top10: 'Top 10',
  mostImproved: 'Most Improved',
  consistency: 'Consistency',
};

export const COURSE_FORMATS = ['Video', 'PDF', 'eBook'];
