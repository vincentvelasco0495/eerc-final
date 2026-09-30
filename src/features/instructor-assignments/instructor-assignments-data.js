/** @typedef {{ id: string; title: string; course: string; courseId: string; total: number; passed: number; nonPassed: number; pending: number }} InstructorAssignmentSummary */

/** @type {InstructorAssignmentSummary[]} */
export const instructorAssignmentSummaries = [
  {
    id: 'asg-1',
    title: 'Midterm problem set',
    course: 'Analysis of Algorithms',
    courseId: 'course-algo',
    total: 13,
    passed: 8,
    nonPassed: 2,
    pending: 3,
  },
  {
    id: 'asg-2',
    title: 'Security audit checklist',
    course: 'Cyber Security Fundamentals',
    courseId: 'course-cyber',
    total: 24,
    passed: 18,
    nonPassed: 1,
    pending: 5,
  },
  {
    id: 'asg-3',
    title: 'Keyword research worksheet',
    course: 'SEO Fundamentals for Beginners',
    courseId: 'course-seo',
    total: 31,
    passed: 31,
    nonPassed: 0,
    pending: 0,
  },
  {
    id: 'asg-4',
    title: 'Content calendar draft',
    course: 'Content Strategy Workshop',
    courseId: 'course-content',
    total: 12,
    passed: 6,
    nonPassed: 0,
    pending: 6,
  },
  {
    id: 'asg-5',
    title: 'Cohort readiness survey',
    course: 'Instructor Cohort Launch Kit',
    courseId: 'course-cohort',
    total: 8,
    passed: 3,
    nonPassed: 1,
    pending: 4,
  },
  {
    id: 'asg-6',
    title: 'Lesson storyboard',
    course: 'Course Design Blueprint',
    courseId: 'course-design',
    total: 19,
    passed: 14,
    nonPassed: 3,
    pending: 2,
  },
];

export const instructorAssignmentCourseOptions = [
  { value: 'all', label: 'Select course' },
  ...Array.from(new Map(instructorAssignmentSummaries.map((r) => [r.courseId, r.course])).entries()).map(
    ([value, label]) => ({ value, label })
  ),
];

export const instructorAssignmentStatusOptions = [
  { value: 'all', label: 'Status: Show All' },
  { value: 'pending', label: 'Status: With pending' },
  { value: 'issues', label: 'Status: Has non-passed' },
];
