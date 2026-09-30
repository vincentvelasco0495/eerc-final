/** @typedef {{ id: string; title: string; course: string; courseId: string; total: number; passed: number; nonPassed: number; pending: number }} InstructorQuizSummary */

/** @type {InstructorQuizSummary[]} */
export const instructorQuizSummaries = [
  {
    id: 'quiz-1',
    title: 'Module 1 checkpoint',
    course: 'CE Board Review',
    courseId: 'course-ce',
    total: 12,
    passed: 7,
    nonPassed: 2,
    pending: 3,
  },
  {
    id: 'quiz-2',
    title: 'Security fundamentals quiz',
    course: 'Cyber Security Fundamentals',
    courseId: 'course-cyber',
    total: 24,
    passed: 20,
    nonPassed: 1,
    pending: 3,
  },
];

export const instructorQuizStatusOptions = [
  { value: 'all', label: 'Status: Show All' },
  { value: 'pending', label: 'Status: With pending' },
  { value: 'issues', label: 'Status: Has non-passed' },
];
