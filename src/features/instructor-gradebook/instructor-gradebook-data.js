// Mock gradebook: course → summary stats and student rows

export const gradebookCourseOptions = [
  { id: 'basics', title: 'Basics of MasterStudy' },
  { id: 'ce-review', title: 'CE Board Review' },
  { id: 'plumbing', title: 'Master Plumbing Fast Track' },
];

const summaryByCourse = {
  basics: [
    { id: 'students', label: 'All time course students', value: '38' },
    { id: 'avg', label: 'Course average progress', value: '4.05%' },
    { id: 'quizzes', label: 'Course passed quizzes', value: '100%' },
    { id: 'lessons', label: 'Course passed lessons', value: '100%' },
    { id: 'sub', label: 'Course enrolled by subscription', value: '0' },
    { id: 'assign', label: 'Course passed assignments', value: '10.53%' },
  ],
  'ce-review': [
    { id: 'students', label: 'All time course students', value: '22' },
    { id: 'avg', label: 'Course average progress', value: '6.2%' },
    { id: 'quizzes', label: 'Course passed quizzes', value: '92%' },
    { id: 'lessons', label: 'Course passed lessons', value: '88%' },
    { id: 'sub', label: 'Course enrolled by subscription', value: '2' },
    { id: 'assign', label: 'Course passed assignments', value: '15%' },
  ],
  plumbing: [
    { id: 'students', label: 'All time course students', value: '16' },
    { id: 'avg', label: 'Course average progress', value: '3.1%' },
    { id: 'quizzes', label: 'Course passed quizzes', value: '95%' },
    { id: 'lessons', label: 'Course passed lessons', value: '100%' },
    { id: 'sub', label: 'Course enrolled by subscription', value: '0' },
    { id: 'assign', label: 'Course passed assignments', value: '8.2%' },
  ],
};

const studentsByCourse = {
  basics: [
    {
      id: 'g1',
      name: 'Alex E. Rivera',
      email: 'alex.rivera@workmail.com',
      lessons: '0/16',
      quizzes: '0/16',
      assignments: '0/3',
      progress: '0%',
      startedAt: '24 April, 2026',
    },
    {
      id: 'g2',
      name: 'Jamie Chen',
      email: 'j.chen@email.com',
      lessons: '2/16',
      quizzes: '1/16',
      assignments: '1/3',
      progress: '3%',
      startedAt: '22 April, 2026',
    },
    {
      id: 'g3',
      name: 'Sam O. Park',
      email: 's.park@outlook.com',
      lessons: '4/16',
      quizzes: '2/16',
      assignments: '0/3',
      progress: '5%',
      startedAt: '20 April, 2026',
    },
    {
      id: 'g4',
      name: 'Morgan I. Blake',
      email: 'morgan.blake@inbox.com',
      lessons: '1/16',
      quizzes: '0/16',
      assignments: '0/3',
      progress: '1%',
      startedAt: '18 April, 2026',
    },
    {
      id: 'g5',
      name: 'Rina De Vera',
      email: 'r.dv@protonmail.com',
      lessons: '8/16',
      quizzes: '5/16',
      assignments: '1/3',
      progress: '12%',
      startedAt: '15 April, 2026',
    },
    {
      id: 'g6',
      name: 'Chris P. Lano',
      email: 'cplano@fastmail.com',
      lessons: '0/16',
      quizzes: '0/16',
      assignments: '0/3',
      progress: '0%',
      startedAt: '12 April, 2026',
    },
    {
      id: 'g7',
      name: 'Dana S. Wills',
      email: 'dana.w@company.org',
      lessons: '3/16',
      quizzes: '1/16',
      assignments: '0/3',
      progress: '2%',
      startedAt: '10 April, 2026',
    },
    {
      id: 'g8',
      name: 'Evan T. Hsu',
      email: 'evan.hsu@dev.io',
      lessons: '10/16',
      quizzes: '6/16',
      assignments: '2/3',
      progress: '18%',
      startedAt: '8 April, 2026',
    },
    {
      id: 'g9',
      name: 'Nina A. Koro',
      email: 'nina@studio.net',
      lessons: '0/16',
      quizzes: '0/16',
      assignments: '0/3',
      progress: '0%',
      startedAt: '5 April, 2026',
    },
    {
      id: 'g10',
      name: 'Omar B. Fayed',
      email: 'o.fayed@learner.edu',
      lessons: '6/16',
      quizzes: '3/16',
      assignments: '1/3',
      progress: '7%',
      startedAt: '3 April, 2026',
    },
    {
      id: 'g11',
      name: 'Pat Q. Lumen',
      email: 'pat.l@example.com',
      lessons: '12/16',
      quizzes: '8/16',
      assignments: '2/3',
      progress: '22%',
      startedAt: '1 April, 2026',
    },
    {
      id: 'g12',
      name: 'Quinn M. Rae',
      email: 'quinn.rae@mail.com',
      lessons: '0/16',
      quizzes: '0/16',
      assignments: '0/3',
      progress: '0%',
      startedAt: '30 March, 2026',
    },
  ],
  'ce-review': null,
  plumbing: null,
};

export function getGradebookStats(courseId) {
  return summaryByCourse[courseId] ?? summaryByCourse.basics;
}

export function getGradebookStudents(courseId) {
  if (studentsByCourse[courseId]) {
    return studentsByCourse[courseId];
  }
  // fallback sample rows for other courses
  return studentsByCourse.basics.map((row, i) => ({ ...row, id: `${courseId}-${i}` }));
}

export const gradebookPageSizeOptions = [10, 20, 30];
