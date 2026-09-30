import { createTodayLabel, getCompletionState } from 'src/utils/lms';

import {
  LMS_PROGRAMS,
  BADGE_VARIANTS,
  ENROLLMENT_STATUSES,
  LEADERBOARD_PERIODS,
  LEARNING_FLOW_STEPS,
} from 'src/constants/lms';

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

const user = {
  id: 'learner-01',
  displayName: 'Hello Friend',
  email: 'hello.friend@eerc.edu',
  role: 'student',
  isStudent: true,
  status: 'active',
  activeProgram: LMS_PROGRAMS[0],
  joinedAt: '2026-01-12',
  streak: 14,
  badges: [BADGE_VARIANTS.top10, BADGE_VARIANTS.consistency],
  watermarkName: 'Hello Friend',
  sessionWarning: true,
  phoneNumber: '',
  birthday: '',
  schoolHeld: '',
};

const programs = [
  {
    id: 'program-ce',
    code: 'CE',
    title: 'Civil Engineering',
    description: 'A guided civil engineering board review path with coaching checkpoints and timed practice.',
    enrollmentFee: 8500,
  },
  {
    id: 'program-plumbing',
    code: 'MPL',
    title: 'Master Plumbing',
    description: 'Licensure preparation focused on design, code review, and field scenarios.',
    enrollmentFee: 12000,
  },
  {
    id: 'program-materials',
    code: 'MSE',
    title: 'Materials Engineering',
    description: 'Core material behavior, manufacturing processes, and exam-ready drills.',
    enrollmentFee: 10500,
  },
];

const batchEnrolls = [
  {
    id: 'batch-enroll-1',
    programId: 'program-ce',
    name: 'Batch 1',
    tentativeStart: 'April 3rd week',
    description: '',
    status: 'active',
    sortOrder: 1,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'batch-enroll-2',
    programId: 'program-ce',
    name: 'Batch 2',
    tentativeStart: 'First week of June',
    description:
      '<p>For Batch 2 once they start they will join the current topic being discussed in Batch 1 and they will have makeup classes for past topics while having the regular class.</p>',
    status: 'active',
    sortOrder: 2,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
];

const learningModes = [
  {
    id: 'learning-mode-online',
    name: 'PURE ONLINE CLASS',
    description: '',
    status: 'active',
    sortOrder: 1,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'learning-mode-face-to-face',
    name: 'FACE TO FACE CLASS',
    description: '',
    status: 'active',
    sortOrder: 2,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'learning-mode-blended',
    name: 'BLENDED LEARNING (ACCESS TO ONLINE AND FACE TO FACE CLASS)',
    description: '',
    status: 'active',
    sortOrder: 3,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
];

const branchEnrolls = [
  {
    id: 'branch-enroll-manila',
    name: 'MANILA BRANCH',
    description: '',
    status: 'active',
    sortOrder: 1,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'branch-enroll-baguio',
    name: 'BAGUIO BRANCH',
    description: '',
    status: 'active',
    sortOrder: 2,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'branch-enroll-legazpi',
    name: 'LEGAZPI BRANCH',
    description: '',
    status: 'active',
    sortOrder: 3,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'branch-enroll-cebu',
    name: 'CEBU BRANCH',
    description: '',
    status: 'active',
    sortOrder: 4,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'branch-enroll-pure-online',
    name: 'PURE ONLINE CLASS',
    description: '',
    status: 'active',
    sortOrder: 5,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
];

const reviewSchedules = [
  {
    id: 'review-schedule-pure-online',
    branchEnrollId: 'branch-enroll-pure-online',
    branchName: 'PURE ONLINE CLASS',
    name: 'PURE ONLINE CLASS MONDAY-THURSDAY 8AM TO 12NN',
    description: '',
    status: 'active',
    sortOrder: 1,
    studentCapacity: 50,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'review-schedule-baguio',
    branchEnrollId: 'branch-enroll-baguio',
    branchName: 'BAGUIO BRANCH',
    name: 'BAGUIO BRANCH SECTION D 4:30PM TO 8:30PM',
    description: '',
    status: 'active',
    sortOrder: 2,
    studentCapacity: 25,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'review-schedule-manila',
    branchEnrollId: 'branch-enroll-manila',
    branchName: 'MANILA BRANCH',
    name: 'MANILA BRANCH SECTION D TUESDAY TO FRIDAY 4:30PM TO 8:30PM',
    description: '',
    status: 'active',
    sortOrder: 3,
    studentCapacity: 30,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'review-schedule-legazpi',
    branchEnrollId: 'branch-enroll-legazpi',
    branchName: 'LEGAZPI BRANCH',
    name: 'LEGAZPI BRANCH MONDAY TO THURSDAY 8am to 12nn',
    description: '',
    status: 'active',
    sortOrder: 4,
    studentCapacity: 20,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'review-schedule-cebu',
    branchEnrollId: 'branch-enroll-cebu',
    branchName: 'CEBU BRANCH',
    name: 'CEBU BRANCH MONDAY TO THURSDAY 9AM TO 4PM',
    description: '',
    status: 'active',
    sortOrder: 5,
    studentCapacity: 35,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
];

const honorAwardDiscounts = [
  {
    id: 'honor-award-discount-president-quiz-champion',
    name: 'ACES/PICE PRESIDENT/ MAGNA OR SUMMA CUMLAUDE, CHAMPION OF NATIONAL QUIZ SHOW (MATEMATICS RELATED)',
    description: '',
    status: 'active',
    sortOrder: 1,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'honor-award-discount-cum-laude-finalist',
    name: 'CUM LAUDE/NATIONAL QUIZ SHOW FINALIST/ FREE VOUCHER',
    description: '',
    status: 'active',
    sortOrder: 2,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'honor-award-discount-quizzer-officer',
    name: 'NATIONAL QUIZZER PACTICIPANT / PICE/ACES OFFICER',
    description: '',
    status: 'active',
    sortOrder: 3,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'honor-award-discount-former-reviewee',
    name: 'FORMER REVIEWEE',
    description: '',
    status: 'active',
    sortOrder: 4,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'honor-award-discount-none',
    name: 'NONE',
    description: '',
    status: 'active',
    sortOrder: 5,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
];

const packageEnrolls = [
  {
    id: 'package-enroll-review-and-refresher',
    name: 'PACKAGE REVIEW AND REFRESHER',
    description: '',
    status: 'active',
    sortOrder: 1,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'package-enroll-review-only',
    name: 'REVIEW ONLY',
    description: '',
    status: 'active',
    sortOrder: 2,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'package-enroll-refresher-only',
    name: 'REFRESHER ONLY',
    description: '',
    status: 'active',
    sortOrder: 3,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'package-enroll-free-package',
    name: 'FREE PACKAGE (ACES OR PICE PRESIDENT, CHAMPION, 1ST AND 2ND PLACER, MAGNA OR SUMA CUMLAUDE)',
    description: '',
    status: 'active',
    sortOrder: 4,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'package-enroll-free-review-scholarship-voucher',
    name: 'FREE REVIEW SCHOLARSHIP (VOUCHER OR CUMLAUDE) (REVIEW ONLY)',
    description: '',
    status: 'active',
    sortOrder: 5,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'package-enroll-pice-aces-officers-quizzer',
    name: 'PICE/ACES OFFICERS AND NATIONAL QUIZZER PARTICIPANT',
    description: '',
    status: 'active',
    sortOrder: 6,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'package-enroll-free-review-paid-refresher',
    name: 'FREE REVIEW SCHOLARSHIP (FREE REVIEW AND PAID FOR REFRESHER )',
    description: '',
    status: 'active',
    sortOrder: 7,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
  {
    id: 'package-enroll-former-eerc-reviewee',
    name: 'FORMER EERC REVIEWEE',
    description: '',
    status: 'active',
    sortOrder: 8,
    updatedAt: '2026-03-01T08:00:00.000Z',
  },
];

const instructorsMock = [
  {
    id: 'learner-01',
    name: 'Alex E. Rivera',
    email: 'alex.rivera@eerc.edu',
    role: 'admin',
    status: 'active',
    achievements: '',
    profilePath: '',
  },
  {
    id: 'inst-user-hannah',
    name: 'Hannah Cruz',
    email: 'hannah.cruz@eerc.edu',
    role: 'instructor',
    status: 'active',
    achievements: '<p>Lead CE coordinator.</p>',
    profilePath: '',
  },
  {
    id: 'inst-user-miguel',
    name: 'Miguel Santos',
    email: 'miguel.santos@eerc.edu',
    role: 'instructor',
    status: 'active',
    achievements: '',
    profilePath: '',
  },
  {
    id: 'inst-user-priya',
    name: 'Priya Nandakumar',
    email: 'priya.n@eerc.edu',
    role: 'instructor',
    status: 'active',
    achievements: '',
    profilePath: '',
  },
  {
    id: 'inst-user-jordan',
    name: 'Jordan Lee',
    email: 'jordan.lee@eerc.edu',
    role: 'instructor',
    status: 'inactive',
    achievements: '<p>On sabbatical.</p>',
    profilePath: '',
  },
  {
    id: 'inst-user-sam',
    name: 'Sam Okonkwo',
    email: 'sam.okonkwo@eerc.edu',
    role: 'instructor',
    status: 'active',
    achievements: '',
    profilePath: '',
  },
];

const studentsMock = [
  {
    id: 'eerc-demo-student-user',
    name: 'Mina Santos',
    email: 'mina@demo.edu',
    role: 'student',
    status: 'active',
    notes: '<p>Prefers evening cohort sessions.</p>',
    profilePath: '',
  },
  {
    id: 'learner-01',
    name: 'Alex E. Rivera',
    email: 'alex.rivera@eerc.edu',
    role: 'admin',
    status: 'active',
    notes: '',
    profilePath: '',
  },
  {
    id: 'stud-user-aria',
    name: 'Aria Mendoza',
    email: 'aria.mendoza@eerc.edu',
    role: 'student',
    status: 'active',
    notes: '',
    profilePath: '',
  },
  {
    id: 'stud-user-chen',
    name: 'Wei Chen',
    email: 'wei.chen@eerc.edu',
    role: 'student',
    status: 'active',
    notes: '<p>Scholarship track.</p>',
    profilePath: '',
  },
  {
    id: 'stud-user-sofia',
    name: 'Sofia Reyes',
    email: 'sofia.reyes@eerc.edu',
    role: 'student',
    status: 'inactive',
    notes: '',
    profilePath: '',
  },
];

const courses = [
  {
    id: 'course-ce-review',
    slug: 'ce-board-review',
    title: 'CE Board Review',
    programId: 'program-ce',
    mentor: 'Engr. Hannah Cruz',
    description: 'Structured review sessions covering hydraulics, structures, and environmental systems.',
    level: 'Advanced',
    totalModules: 8,
    completedModules: 5,
    hours: 36,
    learners: 1842,
    nextModuleId: 'module-hydraulics-review',
    tags: ['Streaming only', 'Board exam'],
    subjects: ['Hydraulics', 'Structures', 'Environmental Engineering'],
    marketing: {
      bannerImageUrl: 'https://picsum.photos/seed/eerc-banner-course-ce-review/1200/675',
    },
  },
  {
    id: 'course-ce-structures',
    slug: 'ce-structures-workshop',
    title: 'CE Structures Workshop',
    programId: 'program-ce',
    mentor: 'Engr. Hannah Cruz',
    description: 'Focused structural analysis drills and load-path review for board candidates.',
    level: 'Advanced',
    totalModules: 6,
    completedModules: 2,
    hours: 24,
    learners: 640,
    nextModuleId: 'module-hydraulics-review',
    tags: ['Practice heavy'],
    subjects: ['Structures'],
    marketing: {
      bannerImageUrl: 'https://picsum.photos/seed/eerc-banner-course-ce-structures/1200/675',
    },
  },
  {
    id: 'course-plumbing-mastery',
    slug: 'master-plumbing-fast-track',
    title: 'Master Plumbing Fast Track',
    programId: 'program-plumbing',
    mentor: 'Engr. Miguel Santos',
    description: 'Code interpretation, system sizing, and troubleshooting walkthroughs.',
    level: 'Intermediate',
    totalModules: 7,
    completedModules: 3,
    hours: 29,
    learners: 1297,
    nextModuleId: 'module-pipe-sizing-practice',
    tags: ['Practice heavy', 'Case studies'],
    subjects: ['Plumbing Code', 'Pipe Design', 'Sanitary Systems'],
    marketing: {
      bannerImageUrl: 'https://picsum.photos/seed/eerc-banner-course-plumbing-mastery/1200/675',
    },
  },
  {
    id: 'course-materials-intensive',
    slug: 'materials-engineering-intensive',
    title: 'Materials Engineering Intensive',
    programId: 'program-materials',
    mentor: 'Dr. Reese Navarro',
    description: 'Materials characterization, failures, and thermodynamics for exam prep.',
    level: 'Advanced',
    totalModules: 9,
    completedModules: 4,
    hours: 41,
    learners: 913,
    nextModuleId: 'module-heat-treatment-refresher',
    tags: ['Lab aligned', 'Coaching'],
    subjects: ['Metallurgy', 'Thermodynamics', 'Failure Analysis'],
    marketing: {
      bannerImageUrl: 'https://picsum.photos/seed/eerc-banner-course-materials-intensive/1200/675',
    },
  },
  {
    id: 'course-how-to-design-components',
    slug: 'how-to-design-components-right',
    title: 'How to Design Components Right',
    programId: 'program-environmental-sciences',
    mentor: 'Demo Instructor',
    description:
      'Learn how to compose interfaces with clarity—from layout grids to typography systems—so learners can absorb content faster.',
    level: 'Advanced',
    totalModules: 4,
    completedModules: 4,
    hours: 9,
    learners: 842,
    nextModuleId: 'module-design-02-layout-systems',
    tags: ['Component systems', 'UI craft'],
    subjects: ['UI systems', 'Layout'],
    /** Displayed in “Video” detail row instead of deriving from module resource tags. */
    videoHoursLabel: '5 hours',
    /** First sidebar card mimics learner “course complete” preview in instructor View. */
    previewCompleted: true,
    marketing: {
      bannerImageUrl: 'https://picsum.photos/seed/eerc-banner-course-design-components/1200/675',
    },
  },
];

const modules = [
  {
    id: 'module-hydraulics-review',
    courseId: 'course-ce-review',
    title: 'Hydraulics Review Session',
    subject: 'Hydraulics',
    topic: 'Fluid Flow',
    subtopic: 'Bernoulli and Energy Losses',
    type: LEARNING_FLOW_STEPS[0],
    duration: '42 min',
    lastPosition: '31:10',
    progress: 74,
    visible: true,
    streamingOnly: true,
    resources: ['Video', 'PDF', 'eBook'],
    summary: 'Review losses, pressure heads, and exam shortcuts.',
  },
  {
    id: 'module-hydraulics-practice',
    courseId: 'course-ce-review',
    title: 'Hydraulics Practice Problems',
    subject: 'Hydraulics',
    topic: 'Fluid Flow',
    subtopic: 'Pump and Pipeline Problems',
    type: LEARNING_FLOW_STEPS[1],
    duration: '28 min',
    lastPosition: '00:00',
    progress: 0,
    visible: true,
    streamingOnly: true,
    resources: ['Video', 'PDF'],
    summary: 'Timed practice set with guided solutions.',
  },
  {
    id: 'module-structural-refresher',
    courseId: 'course-ce-review',
    title: 'Structural Refresher',
    subject: 'Structures',
    topic: 'Reinforced Concrete',
    subtopic: 'Shear and Flexure',
    type: LEARNING_FLOW_STEPS[2],
    duration: '25 min',
    lastPosition: '12:44',
    progress: 52,
    visible: false,
    streamingOnly: true,
    resources: ['PDF', 'eBook'],
    summary: 'Formula refresher for high-frequency board questions.',
  },
  {
    id: 'module-pipe-sizing-practice',
    courseId: 'course-plumbing-mastery',
    title: 'Pipe Sizing Practice',
    subject: 'Pipe Design',
    topic: 'Sizing',
    subtopic: 'Fixture Units',
    type: LEARNING_FLOW_STEPS[1],
    duration: '35 min',
    lastPosition: '09:30',
    progress: 33,
    visible: true,
    streamingOnly: true,
    resources: ['Video', 'PDF'],
    summary: 'Practice scenarios for domestic and sanitary systems.',
  },
  {
    id: 'module-code-final-coaching',
    courseId: 'course-plumbing-mastery',
    title: 'Code Review Final Coaching',
    subject: 'Plumbing Code',
    topic: 'Compliance',
    subtopic: 'Inspection and Exceptions',
    type: LEARNING_FLOW_STEPS[3],
    duration: '48 min',
    lastPosition: '00:00',
    progress: 0,
    visible: true,
    streamingOnly: true,
    resources: ['Video', 'eBook'],
    summary: 'Instructor-led final coaching before mock exam day.',
  },
  {
    id: 'module-heat-treatment-refresher',
    courseId: 'course-materials-intensive',
    title: 'Heat Treatment Refresher',
    subject: 'Metallurgy',
    topic: 'Heat Treatment',
    subtopic: 'Phase Transformation',
    type: LEARNING_FLOW_STEPS[2],
    duration: '32 min',
    lastPosition: '16:25',
    progress: 58,
    visible: true,
    streamingOnly: true,
    resources: ['Video', 'PDF', 'eBook'],
    summary: 'Fast review of heat treatment charts and material response.',
  },
  {
    id: 'module-design-01-foundations',
    courseId: 'course-how-to-design-components',
    title: 'Foundations & composition',
    subject: 'UI systems',
    topic: 'Layout',
    subtopic: 'Hierarchy and rhythm',
    type: LEARNING_FLOW_STEPS[0],
    duration: '2h 10m',
    lastPosition: '00:00',
    progress: 100,
    visible: true,
    streamingOnly: false,
    resources: ['Video', 'PDF'],
    summary: 'Contrast, spacing, and grid principles for teachable screens.',
  },
  {
    id: 'module-design-02-layout-systems',
    courseId: 'course-how-to-design-components',
    title: 'Layout systems & modules',
    subject: 'UI systems',
    topic: 'Layout',
    subtopic: 'Modular UI',
    type: LEARNING_FLOW_STEPS[1],
    duration: '2h 25m',
    lastPosition: '00:00',
    progress: 100,
    visible: true,
    streamingOnly: false,
    resources: ['Video', 'PDF', 'eBook'],
    summary: 'Break pages into reusable regions and responsive columns.',
  },
  {
    id: 'module-design-03-typography',
    courseId: 'course-how-to-design-components',
    title: 'Typography & affordance',
    subject: 'UI systems',
    topic: 'Type',
    subtopic: 'Scale and emphasis',
    type: LEARNING_FLOW_STEPS[2],
    duration: '2h 15m',
    lastPosition: '00:00',
    progress: 100,
    visible: true,
    streamingOnly: false,
    resources: ['Video', 'PDF'],
    summary: 'Readable type ramps, links, and states that guide attention.',
  },
  {
    id: 'module-design-04-critique',
    courseId: 'course-how-to-design-components',
    title: 'Critique & handoff',
    subject: 'UI systems',
    topic: 'Process',
    subtopic: 'Review cadence',
    type: LEARNING_FLOW_STEPS[3],
    duration: '2h 10m',
    lastPosition: '00:00',
    progress: 100,
    visible: true,
    streamingOnly: false,
    resources: ['Video', 'PDF'],
    summary: 'Structured feedback loops before implementation.',
  },
];

const quizzes = [
  {
    id: 'quiz-hydraulics-timed',
    courseId: 'course-ce-review',
    moduleId: 'module-hydraulics-review',
    title: 'Hydraulics Timed Quiz',
    durationMinutes: 20,
    attemptsAllowed: 3,
    attemptsUsed: 2,
    questionCount: 20,
    questionPoolCount: 80,
    bestScore: 88,
  },
  {
    id: 'quiz-plumbing-code',
    courseId: 'course-plumbing-mastery',
    moduleId: 'module-code-final-coaching',
    title: 'Plumbing Code Quiz',
    durationMinutes: 15,
    attemptsAllowed: 4,
    attemptsUsed: 1,
    questionCount: 15,
    questionPoolCount: 48,
    bestScore: 76,
  },
  {
    id: 'quiz-design-layout-check',
    courseId: 'course-how-to-design-components',
    moduleId: 'module-design-02-layout-systems',
    title: 'Layout systems check-in',
    durationMinutes: 12,
    attemptsAllowed: 3,
    attemptsUsed: 1,
    questionCount: 10,
    questionPoolCount: 24,
    bestScore: 100,
  },
  {
    id: 'quiz-design-critique',
    courseId: 'course-how-to-design-components',
    moduleId: 'module-design-04-critique',
    title: 'Critique readiness quiz',
    durationMinutes: 10,
    attemptsAllowed: 3,
    attemptsUsed: 1,
    questionCount: 8,
    questionPoolCount: 20,
    bestScore: 100,
  },
];

const questionPool = {
  'quiz-hydraulics-timed': Array.from({ length: 80 }, (_, index) => ({
    id: `hydraulics-q-${index + 1}`,
    prompt: `Hydraulics question ${index + 1}: identify the correct pressure head relation.`,
    choices: ['Choice A', 'Choice B', 'Choice C', 'Choice D'],
  })),
  'quiz-plumbing-code': Array.from({ length: 48 }, (_, index) => ({
    id: `plumbing-code-q-${index + 1}`,
    prompt: `Plumbing code question ${index + 1}: determine the compliant fixture requirement.`,
    choices: ['Option A', 'Option B', 'Option C', 'Option D'],
  })),
  'quiz-design-layout-check': Array.from({ length: 24 }, (_, index) => ({
    id: `design-layout-q-${index + 1}`,
    prompt: `Layout question ${index + 1}: pick the best modular structure for the scenario.`,
    choices: ['Option A', 'Option B', 'Option C', 'Option D'],
  })),
  'quiz-design-critique': Array.from({ length: 20 }, (_, index) => ({
    id: `design-critique-q-${index + 1}`,
    prompt: `Critique question ${index + 1}: identify the strongest review practice.`,
    choices: ['Option A', 'Option B', 'Option C', 'Option D'],
  })),
};

const quizResults = [
  {
    id: 'attempt-001',
    quizId: 'quiz-hydraulics-timed',
    date: '2026-04-20',
    score: 84,
    durationUsed: '16m 10s',
    correctAnswers: 17,
    totalQuestions: 20,
  },
  {
    id: 'attempt-002',
    quizId: 'quiz-hydraulics-timed',
    date: '2026-04-22',
    score: 88,
    durationUsed: '14m 55s',
    correctAnswers: 18,
    totalQuestions: 20,
  },
  {
    id: 'attempt-003',
    quizId: 'quiz-plumbing-code',
    date: '2026-04-19',
    score: 76,
    durationUsed: '11m 37s',
    correctAnswers: 11,
    totalQuestions: 15,
  },
];

const leaderboard = {
  daily: [
    { id: 'rank-1', name: 'Alex E. Rivera', program: 'CE', score: 985, badge: BADGE_VARIANTS.top10 },
    { id: 'rank-2', name: 'Mina Santos', program: 'MPL', score: 960, badge: BADGE_VARIANTS.mostImproved },
    { id: 'rank-3', name: 'Caleb Lim', program: 'MSE', score: 931, badge: BADGE_VARIANTS.consistency },
  ],
  weekly: [
    { id: 'rank-4', name: 'Mina Santos', program: 'MPL', score: 6720, badge: BADGE_VARIANTS.top10 },
    { id: 'rank-5', name: 'Alex E. Rivera', program: 'CE', score: 6550, badge: BADGE_VARIANTS.consistency },
    { id: 'rank-6', name: 'Jiro Tan', program: 'MSE', score: 6430, badge: BADGE_VARIANTS.mostImproved },
  ],
  overall: [
    { id: 'rank-7', name: 'Alex E. Rivera', program: 'CE', score: 31220, badge: BADGE_VARIANTS.top10 },
    { id: 'rank-8', name: 'Diane Uy', program: 'MPL', score: 30110, badge: BADGE_VARIANTS.top10 },
    { id: 'rank-9', name: 'Mina Santos', program: 'MPL', score: 29440, badge: BADGE_VARIANTS.mostImproved },
  ],
};

const enrollments = [
  {
    id: 'enrollment-001',
    programId: 'program-ce',
    programTitle: 'Civil Engineering',
    courseId: 'course-ce-review',
    courseTitle: 'CE Board Review',
    userName: 'Alex E. Rivera',
    userEmail: 'alex@example.com',
    phoneNumber: '+1 (555) 010-2001',
    schoolHeld: 'Metro State University',
    submittedAt: '2026-04-10',
    status: ENROLLMENT_STATUSES[1],
  },
  {
    id: 'enrollment-002',
    programId: 'program-materials',
    programTitle: 'Materials Engineering',
    courseId: 'course-materials-intensive',
    courseTitle: 'Materials Engineering Intensive',
    userName: 'Alex E. Rivera',
    userEmail: 'alex@example.com',
    phoneNumber: '+1 (555) 010-2001',
    schoolHeld: 'Metro State University',
    submittedAt: '2026-04-21',
    status: ENROLLMENT_STATUSES[0],
    formData: {
      fullName: 'Alex E. Rivera',
      aliasName: 'Alex',
      schoolName: 'Metro State University',
      gender: 'male',
      dateOfBirth: '1998-03-15',
      contactNumber: '+1 (555) 010-2001',
      homeAddress: '123 Campus Drive, Metro City',
      learningModeId: 'learning-mode-blended',
      branchEnrollId: 'branch-main',
      reviewScheduleId: 'schedule-weekend',
      honorAwardDiscountId: 'discount-none',
      examExperience: 'first-time',
      downpaymentAmount: '5000',
      packageEnrollId: 'package-standard',
    },
  },
];

const admin = {
  users: [
    { id: 'user-1', name: 'Alex E. Rivera', role: 'Learner', activeProgram: 'CE', status: 'Active' },
    { id: 'user-2', name: 'Mina Santos', role: 'Learner', activeProgram: 'Master Plumbing', status: 'Active' },
    { id: 'user-3', name: 'Dr. Reese Navarro', role: 'Instructor', activeProgram: 'Materials Engineering', status: 'Active' },
  ],
  uploads: [
    { id: 'upload-1', title: 'Hydraulics Solution Manual', type: 'PDF', status: 'Published' },
  ],
};

function courseWithProgramTitle(course) {
  const p = programs.find((x) => x.id === course.programId);
  return {
    ...course,
    courseFee:
      typeof course.courseFee === 'number' && Number.isFinite(course.courseFee)
        ? course.courseFee
        : 0,
    programTitle: p?.title ?? '',
    status: course.status ?? (course.isPublished === false ? 'draft' : 'published'),
    isPublished: course.isPublished ?? true,
    averageRating:
      typeof course.averageRating === 'number' && Number.isFinite(course.averageRating)
        ? course.averageRating
        : null,
    updatedAt: course.updatedAt ?? new Date().toISOString(),
  };
}

function buildProgressSummary() {
  const completedModules = courses.reduce((sum, course) => sum + course.completedModules, 0);
  const totalModules = courses.reduce((sum, course) => sum + course.totalModules, 0);
  const completionRate = getCompletionState(completedModules, totalModules);

  return {
    completedModules,
    totalModules,
    completionRate,
    pendingModules: totalModules - completedModules,
    strengths: ['Hydraulics', 'Code Familiarity', 'Material Selection'],
    weaknesses: ['Open channel flow', 'Sanitary vent layouts', 'Heat treatment cycles'],
    suggestedModuleIds: ['module-hydraulics-practice', 'module-code-final-coaching', 'module-heat-treatment-refresher'],
    instructorSummary: {
      programs: programs.filter(
        (program) => String(program?.status ?? 'active').toLowerCase() === 'active'
      ).length,
      enrollments: enrollments.length,
      students: studentsMock.length,
    },
  };
}

export async function mockResponseForKey(key) {
  if (typeof key !== 'string') {
    return null;
  }

  await delay(30);
  const [rawPath, qs = ''] = key.split('?');
  const path = rawPath || '';
  const params = new URLSearchParams(qs);

  if (path === '/api/user') {
    return user;
  }

  if (path === '/api/meta') {
    return {
      todayLabel: createTodayLabel(),
      leaderboardPeriods: LEADERBOARD_PERIODS,
      learningFlowSteps: LEARNING_FLOW_STEPS,
    };
  }

  if (path === '/api/programs') {
    if (!params.get('page')) {
      return { data: programs };
    }

    const pageNum = Math.max(1, parseInt(params.get('page') || '1', 10));
    let perPageNum = parseInt(params.get('per_page') || '10', 10);
    if (![5, 10, 20, 50, 100].includes(perPageNum)) {
      perPageNum = 10;
    }
    const searchRaw = (params.get('search') || '').trim().toLowerCase();
    let list = programs.map((p) => ({
      ...p,
      slug: p.slug ?? '',
      status: p.status ?? 'active',
      bannerPath: p.bannerPath ?? '',
      bannerUrl: p.bannerUrl ?? '',
    }));
    if (searchRaw) {
      list = list.filter(
        (p) =>
          String(p.title || '')
            .toLowerCase()
            .includes(searchRaw) ||
          String(p.code || '')
            .toLowerCase()
            .includes(searchRaw) ||
          String(p.slug || '')
            .toLowerCase()
            .includes(searchRaw)
      );
    }
    const total = list.length;
    const lastPage = Math.max(1, Math.ceil(total / perPageNum));
    const currentPage = Math.min(pageNum, lastPage);
    const start = (currentPage - 1) * perPageNum;
    const slice = list.slice(start, start + perPageNum);

    return {
      data: slice,
      meta: {
        current_page: currentPage,
        last_page: lastPage,
        per_page: perPageNum,
        total,
        from: total === 0 ? 0 : start + 1,
        to: total === 0 ? 0 : Math.min(start + perPageNum, total),
      },
    };
  }

  if (path === '/api/batch-enrolls') {
    if (!params.get('page')) {
      return { data: batchEnrolls };
    }

    const pageNum = Math.max(1, parseInt(params.get('page') || '1', 10));
    let perPageNum = parseInt(params.get('per_page') || '10', 10);
    if (![5, 10, 20, 50, 100].includes(perPageNum)) {
      perPageNum = 10;
    }
    const searchRaw = (params.get('search') || '').trim().toLowerCase();
    let list = [...batchEnrolls].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    if (searchRaw) {
      list = list.filter((row) => {
        const programTitle =
          programs.find((program) => program.id === row.programId)?.title ?? row.programId ?? '';
        const haystack = `${row.name} ${row.tentativeStart} ${row.description} ${programTitle}`.toLowerCase();
        return haystack.includes(searchRaw);
      });
    }
    const total = list.length;
    const lastPage = Math.max(1, Math.ceil(total / perPageNum));
    const currentPage = Math.min(pageNum, lastPage);
    const start = (currentPage - 1) * perPageNum;
    const slice = list.slice(start, start + perPageNum);

    return {
      data: slice,
      meta: {
        current_page: currentPage,
        last_page: lastPage,
        per_page: perPageNum,
        total,
        from: total === 0 ? 0 : start + 1,
        to: total === 0 ? 0 : Math.min(start + perPageNum, total),
      },
    };
  }

  if (path === '/api/learning-modes') {
    if (!params.get('page')) {
      return { data: learningModes };
    }

    const pageNum = Math.max(1, parseInt(params.get('page') || '1', 10));
    let perPageNum = parseInt(params.get('per_page') || '10', 10);
    if (![5, 10, 20, 50, 100].includes(perPageNum)) {
      perPageNum = 10;
    }
    const searchRaw = (params.get('search') || '').trim().toLowerCase();
    let list = [...learningModes].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    if (searchRaw) {
      list = list.filter((row) => {
        const haystack = `${row.name} ${row.description}`.toLowerCase();
        return haystack.includes(searchRaw);
      });
    }
    const total = list.length;
    const lastPage = Math.max(1, Math.ceil(total / perPageNum));
    const currentPage = Math.min(pageNum, lastPage);
    const start = (currentPage - 1) * perPageNum;
    const slice = list.slice(start, start + perPageNum);

    return {
      data: slice,
      meta: {
        current_page: currentPage,
        last_page: lastPage,
        per_page: perPageNum,
        total,
        from: total === 0 ? 0 : start + 1,
        to: total === 0 ? 0 : Math.min(start + perPageNum, total),
      },
    };
  }

  if (path === '/api/branch-enrolls') {
    if (!params.get('page')) {
      return { data: branchEnrolls };
    }

    const pageNum = Math.max(1, parseInt(params.get('page') || '1', 10));
    let perPageNum = parseInt(params.get('per_page') || '10', 10);
    if (![5, 10, 20, 50, 100].includes(perPageNum)) {
      perPageNum = 10;
    }
    const searchRaw = (params.get('search') || '').trim().toLowerCase();
    let list = [...branchEnrolls].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    if (searchRaw) {
      list = list.filter((row) => {
        const haystack = `${row.name} ${row.description}`.toLowerCase();
        return haystack.includes(searchRaw);
      });
    }
    const total = list.length;
    const lastPage = Math.max(1, Math.ceil(total / perPageNum));
    const currentPage = Math.min(pageNum, lastPage);
    const start = (currentPage - 1) * perPageNum;
    const slice = list.slice(start, start + perPageNum);

    return {
      data: slice,
      meta: {
        current_page: currentPage,
        last_page: lastPage,
        per_page: perPageNum,
        total,
        from: total === 0 ? 0 : start + 1,
        to: total === 0 ? 0 : Math.min(start + perPageNum, total),
      },
    };
  }

  if (path === '/api/review-schedules') {
    if (!params.get('page')) {
      return { data: reviewSchedules };
    }

    const pageNum = Math.max(1, parseInt(params.get('page') || '1', 10));
    let perPageNum = parseInt(params.get('per_page') || '10', 10);
    if (![5, 10, 20, 50, 100].includes(perPageNum)) {
      perPageNum = 10;
    }
    const searchRaw = (params.get('search') || '').trim().toLowerCase();
    let list = [...reviewSchedules].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    if (searchRaw) {
      list = list.filter((row) => {
        const haystack = `${row.name} ${row.description} ${row.branchName ?? ''}`.toLowerCase();
        return haystack.includes(searchRaw);
      });
    }
    const total = list.length;
    const lastPage = Math.max(1, Math.ceil(total / perPageNum));
    const currentPage = Math.min(pageNum, lastPage);
    const start = (currentPage - 1) * perPageNum;
    const slice = list.slice(start, start + perPageNum);

    return {
      data: slice,
      meta: {
        current_page: currentPage,
        last_page: lastPage,
        per_page: perPageNum,
        total,
        from: total === 0 ? 0 : start + 1,
        to: total === 0 ? 0 : Math.min(start + perPageNum, total),
      },
    };
  }

  if (path === '/api/honor-award-discounts') {
    if (!params.get('page')) {
      return { data: honorAwardDiscounts };
    }

    const pageNum = Math.max(1, parseInt(params.get('page') || '1', 10));
    let perPageNum = parseInt(params.get('per_page') || '10', 10);
    if (![5, 10, 20, 50, 100].includes(perPageNum)) {
      perPageNum = 10;
    }
    const searchRaw = (params.get('search') || '').trim().toLowerCase();
    let list = [...honorAwardDiscounts].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    if (searchRaw) {
      list = list.filter((row) => {
        const haystack = `${row.name} ${row.description}`.toLowerCase();
        return haystack.includes(searchRaw);
      });
    }
    const total = list.length;
    const lastPage = Math.max(1, Math.ceil(total / perPageNum));
    const currentPage = Math.min(pageNum, lastPage);
    const start = (currentPage - 1) * perPageNum;
    const slice = list.slice(start, start + perPageNum);

    return {
      data: slice,
      meta: {
        current_page: currentPage,
        last_page: lastPage,
        per_page: perPageNum,
        total,
        from: total === 0 ? 0 : start + 1,
        to: total === 0 ? 0 : Math.min(start + perPageNum, total),
      },
    };
  }

  if (path === '/api/package-enrolls') {
    if (!params.get('page')) {
      return { data: packageEnrolls };
    }

    const pageNum = Math.max(1, parseInt(params.get('page') || '1', 10));
    let perPageNum = parseInt(params.get('per_page') || '10', 10);
    if (![5, 10, 20, 50, 100].includes(perPageNum)) {
      perPageNum = 10;
    }
    const searchRaw = (params.get('search') || '').trim().toLowerCase();
    let list = [...packageEnrolls].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    if (searchRaw) {
      list = list.filter((row) => {
        const haystack = `${row.name} ${row.description}`.toLowerCase();
        return haystack.includes(searchRaw);
      });
    }
    const total = list.length;
    const lastPage = Math.max(1, Math.ceil(total / perPageNum));
    const currentPage = Math.min(pageNum, lastPage);
    const start = (currentPage - 1) * perPageNum;
    const slice = list.slice(start, start + perPageNum);

    return {
      data: slice,
      meta: {
        current_page: currentPage,
        last_page: lastPage,
        per_page: perPageNum,
        total,
        from: total === 0 ? 0 : start + 1,
        to: total === 0 ? 0 : Math.min(start + perPageNum, total),
      },
    };
  }

  if (path === '/api/instructors/linkable-users') {
    const assigned = new Set(instructorsMock.map((r) => r.id));
    const pool = [
      {
        publicUid: 'eerc-demo-student-user',
        name: 'Mina Santos',
        email: 'mina@demo.edu',
        role: 'student',
      },
      {
        publicUid: 'eerc-demo-instructor-user',
        name: 'Dr. Reese Navarro',
        email: 'reese@demo.edu',
        role: 'instructor',
      },
    ];
    return { data: pool.filter((u) => !assigned.has(u.publicUid)) };
  }

  if (path === '/api/students/linkable-users') {
    const assigned = new Set(studentsMock.map((r) => r.id));
    const pool = [
      {
        publicUid: 'eerc-demo-instructor-user',
        name: 'Dr. Reese Navarro',
        email: 'reese@demo.edu',
        role: 'instructor',
      },
      {
        publicUid: 'inst-user-hannah',
        name: 'Hannah Cruz',
        email: 'hannah.cruz@eerc.edu',
        role: 'instructor',
      },
    ];
    return { data: pool.filter((u) => !assigned.has(u.publicUid)) };
  }

  if (path === '/api/instructors') {
    if (!params.get('page')) {
      return { data: instructorsMock };
    }

    const pageNum = Math.max(1, parseInt(params.get('page') || '1', 10));
    let perPageNum = parseInt(params.get('per_page') || '10', 10);
    if (![5, 10, 20, 50, 100].includes(perPageNum)) {
      perPageNum = 10;
    }
    const searchRaw = (params.get('search') || '').trim().toLowerCase();
    let list = instructorsMock.map((row) => ({
      ...row,
      status: row.status ?? 'active',
      achievements: row.achievements ?? '',
      profilePath: row.profilePath ?? '',
      profileUrl: row.profileUrl ?? '',
    }));
    if (searchRaw) {
      list = list.filter((row) => {
        const plain = String(row.achievements || '').replace(/<[^>]+>/g, ' ');
        const hay = `${row.name || ''} ${row.email || ''} ${plain}`.toLowerCase();
        return hay.includes(searchRaw);
      });
    }
    const total = list.length;
    const lastPage = Math.max(1, Math.ceil(total / perPageNum));
    const currentPage = Math.min(pageNum, lastPage);
    const start = (currentPage - 1) * perPageNum;
    const slice = list.slice(start, start + perPageNum);

    return {
      data: slice,
      meta: {
        current_page: currentPage,
        last_page: lastPage,
        per_page: perPageNum,
        total,
        from: total === 0 ? 0 : start + 1,
        to: total === 0 ? 0 : Math.min(start + perPageNum, total),
      },
    };
  }

  if (path === '/api/students') {
    if (!params.get('page')) {
      return { data: studentsMock };
    }

    const pageNum = Math.max(1, parseInt(params.get('page') || '1', 10));
    let perPageNum = parseInt(params.get('per_page') || '10', 10);
    if (![5, 10, 20, 50, 100].includes(perPageNum)) {
      perPageNum = 10;
    }
    const searchRaw = (params.get('search') || '').trim().toLowerCase();
    let list = studentsMock.map((row) => ({
      ...row,
      status: row.status ?? 'active',
      notes: row.notes ?? '',
      profilePath: row.profilePath ?? '',
      profileUrl: row.profileUrl ?? '',
    }));
    if (searchRaw) {
      list = list.filter((row) => {
        const plain = String(row.notes || '').replace(/<[^>]+>/g, ' ');
        const hay = `${row.name || ''} ${row.email || ''} ${plain}`.toLowerCase();
        return hay.includes(searchRaw);
      });
    }
    const total = list.length;
    const lastPage = Math.max(1, Math.ceil(total / perPageNum));
    const currentPage = Math.min(pageNum, lastPage);
    const start = (currentPage - 1) * perPageNum;
    const slice = list.slice(start, start + perPageNum);

    return {
      data: slice,
      meta: {
        current_page: currentPage,
        last_page: lastPage,
        per_page: perPageNum,
        total,
        from: total === 0 ? 0 : start + 1,
        to: total === 0 ? 0 : Math.min(start + perPageNum, total),
      },
    };
  }

  if (path === '/api/courses') {
    const page = Math.max(1, parseInt(params.get('page') || '1', 10));
    const limit = Math.min(500, Math.max(1, parseInt(params.get('limit') || '100', 10)));
    const programRaw = (params.get('program') || '').trim();
    const programNorm = programRaw.toLowerCase();
    const statusRaw = (params.get('status') || '').trim().toLowerCase();

    let list = courses;
    if (programRaw) {
      list = courses.filter((course) => {
        const programId = String(course.programId ?? '');
        if (programId === programRaw) {
          return true;
        }
        const programRow = programs.find((p) => p.id === programId);
        if (!programRow) {
          return false;
        }
        const code = String(programRow.code ?? '').trim().toLowerCase();
        const title = String(programRow.title ?? '').trim().toLowerCase();
        return (
          programId.toLowerCase() === programNorm ||
          code === programNorm ||
          title === programNorm.replace(/-/g, ' ')
        );
      });
    }

    if (statusRaw === 'published') {
      list = list.filter((course) => course.isPublished !== false && course.status !== 'draft');
    } else if (statusRaw === 'draft') {
      list = list.filter((course) => course.isPublished === false || course.status === 'draft');
    } else if (statusRaw === 'upcoming') {
      list = [];
    }

    const start = (page - 1) * limit;
    const slice = list.slice(start, start + limit).map(courseWithProgramTitle);
    const lastPage = Math.max(1, Math.ceil(list.length / limit));

    return { data: slice, meta: { page, limit, total: list.length, lastPage } };
  }

  if (path === '/api/enrollments') {
    if (!params.get('page')) {
      return { data: enrollments };
    }

    const pageNum = Math.max(1, parseInt(params.get('page') || '1', 10));
    let perPageNum = parseInt(params.get('per_page') || '10', 10);
    if (![5, 10, 20, 50, 100].includes(perPageNum)) {
      perPageNum = 10;
    }
    const searchRaw = (params.get('search') || '').trim().toLowerCase();
    const courseFilter = (params.get('course') || '').trim();
    const statusFilter = (params.get('status') || '').trim().toLowerCase();
    let list = [...enrollments];
    if (courseFilter) {
      list = list.filter(
        (row) =>
          row.courseId === courseFilter ||
          (!row.courseId && row.programId && courses.some((c) => c.id === courseFilter && c.programId === row.programId))
      );
    }
    if (statusFilter) {
      list = list.filter((row) => String(row.status ?? '').toLowerCase() === statusFilter);
    }
    if (searchRaw) {
      list = list.filter((row) => {
        const hay = `${row.id} ${row.programId} ${row.programTitle} ${row.courseId ?? ''} ${row.courseTitle ?? ''} ${row.userName} ${row.userEmail} ${row.phoneNumber ?? ''} ${row.schoolHeld ?? ''} ${row.status}`.toLowerCase();
        return hay.includes(searchRaw);
      });
    }

    const groupByLearner = !courseFilter;
    if (groupByLearner) {
      const byLearner = new Map();
      list.forEach((row) => {
        const learnerKey = `${row.userEmail ?? ''}|${row.userName ?? ''}`;
        if (!byLearner.has(learnerKey)) {
          byLearner.set(learnerKey, []);
        }
        byLearner.get(learnerKey).push(row);
      });

      list = [...byLearner.values()].map((items) => {
        const sorted = [...items].sort((a, b) => String(b.submittedAt ?? '').localeCompare(String(a.submittedAt ?? '')));
        const primary = sorted[0];
        const programTitles = [...new Set(sorted.map((item) => item.programTitle).filter(Boolean))];
        const courseTitles = [...new Set(sorted.map((item) => item.courseTitle).filter(Boolean))];
        const hasProgramWide = sorted.some((item) => !item.courseId);
        const statuses = [...new Set(sorted.map((item) => item.status))];
        const statusSummary = statuses.map((status) => ({
          status,
          count: sorted.filter((item) => item.status === status).length,
        }));

        let courseTitle = '—';
        if (courseTitles.length > 0 && hasProgramWide) {
          courseTitle = `${courseTitles.join(', ')}, All courses`;
        } else if (courseTitles.length > 0) {
          courseTitle = courseTitles.join(', ');
        } else if (hasProgramWide) {
          courseTitle = 'All courses';
        }

        return {
          id: `learner-${primary.userEmail ?? primary.userName ?? primary.id}`,
          userName: primary.userName ?? '',
          userEmail: primary.userEmail ?? '',
          phoneNumber: primary.phoneNumber ?? '',
          schoolHeld: primary.schoolHeld ?? '',
          programTitle: programTitles.join(', '),
          courseTitle,
          submittedAt: primary.submittedAt ?? '',
          status: statuses.length === 1 ? statuses[0] : 'mixed',
          statusSummary,
          hasPaymentProof: sorted.some((item) => item.hasPaymentProof),
          enrollmentCount: sorted.length,
          enrollments: sorted.map((item) => ({
            ...item,
            hasFormData: Boolean(item.formData),
          })),
          isLearnerGroup: true,
        };
      });

      list.sort((a, b) => String(b.submittedAt ?? '').localeCompare(String(a.submittedAt ?? '')));
    }

    const total = list.length;
    const lastPage = Math.max(1, Math.ceil(total / perPageNum));
    const currentPage = Math.min(pageNum, lastPage);
    const start = (currentPage - 1) * perPageNum;
    const slice = list.slice(start, start + perPageNum).map((row) => {
      if (row.isLearnerGroup) {
        return row;
      }
      return {
        ...row,
        hasFormData: Boolean(row.formData),
      };
    });

    return {
      data: slice,
      meta: {
        current_page: currentPage,
        last_page: lastPage,
        per_page: perPageNum,
        total,
        from: total === 0 ? 0 : start + 1,
        to: total === 0 ? 0 : Math.min(start + perPageNum, total),
      },
    };
  }

  if (path === '/api/modules') {
    const courseId = params.get('courseId');
    const ids = params.get('ids');
    if (ids) {
      const idList = ids.split(',').map((s) => s.trim()).filter(Boolean);
      const order = new Map(idList.map((id, i) => [id, i]));
      return {
        data: [...modules].filter((m) => order.has(m.id)).sort((a, b) => order.get(a.id) - order.get(b.id)),
      };
    }
    if (courseId) {
      return { data: modules.filter((m) => m.courseId === courseId) };
    }
    return { data: [] };
  }

  if (path === '/api/quizzes') {
    const moduleId = params.get('moduleId');
    const list = moduleId ? quizzes.filter((q) => q.moduleId === moduleId) : quizzes;
    return { data: list };
  }

  if (path === '/api/quiz-results') {
    return { data: quizResults };
  }

  if (path === '/api/leaderboard') {
    const type = params.get('type') || 'daily';
    return { data: leaderboard[type] ?? [] };
  }

  if (path === '/api/analytics') {
    return buildProgressSummary();
  }

  if (path === '/api/admin') {
    return admin;
  }

  const enrollmentDetailMatch = path.match(/^\/api\/enrollments\/([^/]+)$/);
  if (enrollmentDetailMatch) {
    const row = enrollments.find((item) => item.id === enrollmentDetailMatch[1]);
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      status: row.status,
      rejectionReason: row.rejectionReason ?? '',
      submittedAt: row.submittedAt ?? '',
      programId: row.programId ?? '',
      programTitle: row.programTitle ?? '',
      courseId: row.courseId ?? null,
      courseTitle: row.courseTitle ?? '',
      userName: row.userName ?? '',
      userEmail: row.userEmail ?? '',
      phoneNumber: row.phoneNumber ?? '',
      schoolHeld: row.schoolHeld ?? '',
      hasFormData: Boolean(row.formData),
      formData: row.formData ?? null,
      documents: {},
      hasPaymentProof: Boolean(row.hasPaymentProof),
      paymentProofFileName: row.paymentProofFileName ?? null,
    };
  }

  return null;
}

export async function submitEnrollmentRequest(payload) {
  const { courseId, programId, paymentProofFile, formData } = payload ?? {};
  await delay(180);

  let resolvedProgramId = programId;
  let parsedFormData = null;
  let resolvedPaymentProofFile = paymentProofFile;

  if (formData instanceof FormData) {
    resolvedProgramId = String(formData.get('program_id') ?? programId ?? '');
    const rawFormData = formData.get('form_data');
    if (typeof rawFormData === 'string' && rawFormData.trim()) {
      try {
        parsedFormData = JSON.parse(rawFormData);
      } catch {
        parsedFormData = null;
      }
    }
    resolvedPaymentProofFile = formData.get('payment_proof') ?? paymentProofFile;
  }

  const isPublishedEnrollmentCourse = (course) => {
    if (!course) {
      return false;
    }
    if (course.isPublished === false) {
      return false;
    }
    if (typeof course.status === 'string' && course.status.toLowerCase() === 'draft') {
      return false;
    }
    return true;
  };

  if (!resolvedPaymentProofFile) {
    throw new Error('Upload proof of payment before submitting.');
  }

  if (!courseId && !resolvedProgramId) {
    throw new Error('Select a course or program before submitting.');
  }

  if (courseId) {
    const course = courses.find((c) => c.id === courseId);
    if (!isPublishedEnrollmentCourse(course)) {
      throw new Error('This course is not open for enrollment yet.');
    }

    const rejected = enrollments.find(
      (row) => row.courseId === courseId && row.status === ENROLLMENT_STATUSES[2]
    );
    if (rejected) {
      rejected.status = ENROLLMENT_STATUSES[0];
      rejected.submittedAt = new Date().toISOString().slice(0, 10);
      rejected.hasPaymentProof = true;
      rejected.paymentProofFileName = resolvedPaymentProofFile?.name ?? 'payment-proof.pdf';
      if (parsedFormData) {
        rejected.formData = parsedFormData;
      }
      return { ...rejected };
    }

    const hasActive = enrollments.some(
      (row) =>
        row.courseId === courseId &&
        (row.status === ENROLLMENT_STATUSES[0] || row.status === ENROLLMENT_STATUSES[1])
    );
    if (hasActive) {
      throw new Error('You already have an enrollment application for this course.');
    }

    const created = {
      id: `enrollment-${Date.now()}`,
      programId: course?.programId ?? programId ?? '',
      programTitle: programs.find((p) => p.id === (course?.programId ?? programId))?.title ?? '',
      courseId,
      courseTitle: course?.title ?? '',
      userName: user.displayName,
      userEmail: user.email,
      phoneNumber: user.phoneNumber ?? '',
      schoolHeld: user.schoolHeld ?? '',
      submittedAt: new Date().toISOString().slice(0, 10),
      status: ENROLLMENT_STATUSES[0],
      hasPaymentProof: true,
      paymentProofFileName: resolvedPaymentProofFile?.name ?? 'payment-proof.pdf',
      ...(parsedFormData ? { formData: parsedFormData } : {}),
    };
    enrollments.unshift(created);
    return created;
  }

  const publishedInProgram = courses.filter(
    (c) => c.programId === resolvedProgramId && isPublishedEnrollmentCourse(c)
  );
  if (publishedInProgram.length === 0) {
    throw new Error('This program has no published courses available for enrollment.');
  }

  const rejected = enrollments.find(
    (row) => row.programId === resolvedProgramId && !row.courseId && row.status === ENROLLMENT_STATUSES[2]
  );
  if (rejected) {
    rejected.status = ENROLLMENT_STATUSES[0];
    rejected.submittedAt = new Date().toISOString().slice(0, 10);
    rejected.hasPaymentProof = true;
    rejected.paymentProofFileName = resolvedPaymentProofFile?.name ?? 'payment-proof.pdf';
    if (parsedFormData) {
      rejected.formData = parsedFormData;
    }
    return { ...rejected };
  }

  const hasActive = enrollments.some(
    (row) =>
      row.programId === resolvedProgramId &&
      !row.courseId &&
      (row.status === ENROLLMENT_STATUSES[0] || row.status === ENROLLMENT_STATUSES[1])
  );
  if (hasActive) {
    throw new Error('You already have an enrollment application for this program.');
  }

  const created = {
    id: `enrollment-${Date.now()}`,
    programId: resolvedProgramId,
    programTitle: programs.find((p) => p.id === resolvedProgramId)?.title ?? '',
    courseId: null,
    courseTitle: '',
    userName: user.displayName,
    userEmail: user.email,
    phoneNumber: user.phoneNumber ?? '',
    schoolHeld: user.schoolHeld ?? '',
    submittedAt: new Date().toISOString().slice(0, 10),
    status: ENROLLMENT_STATUSES[0],
    hasPaymentProof: true,
    paymentProofFileName: resolvedPaymentProofFile?.name ?? 'payment-proof.pdf',
    ...(parsedFormData ? { formData: parsedFormData } : {}),
  };
  enrollments.unshift(created);

  return created;
}

export async function simulateQuizAttempt(quizId) {
  await delay(180);

  const quiz = quizzes.find((item) => item.id === quizId);
  const correctAnswers = Math.max(8, Math.min(quiz.questionCount, Math.floor(Math.random() * quiz.questionCount)));
  const score = Math.round((correctAnswers / quiz.questionCount) * 100);

  return {
    id: `attempt-${Date.now()}`,
    quizId,
    date: new Date().toISOString().slice(0, 10),
    score,
    durationUsed: `${Math.max(8, quiz.durationMinutes - 3)}m ${Math.floor(Math.random() * 59)}s`,
    correctAnswers,
    totalQuestions: quiz.questionCount,
  };
}

export async function toggleModuleVisibility(moduleId) {
  await delay(150);

  return { moduleId };
}

export async function uploadAdminModule(payload) {
  await delay(220);

  return {
    id: `upload-${Date.now()}`,
    title: payload.title,
    type: payload.assetType,
    status: 'Queued',
  };
}

export async function updateEnrollmentStatus({ enrollmentId, status, rejectionReason = '' }) {
  await delay(150);

  const row = enrollments.find((item) => item.id === enrollmentId);
  if (row) {
    row.status = status;
    row.rejectionReason = status === 'rejected' ? rejectionReason : '';
  }

  return { enrollmentId, status };
}

export async function submitEnrollmentPartialPayment({ enrollmentId, amount, paymentProofFile }) {
  await delay(150);

  const row = enrollments.find((item) => item.id === enrollmentId);
  if (!row) {
    throw new Error('Enrollment not found.');
  }

  const parsedAmount = Number(amount);
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    throw new Error('Enter a valid payment amount.');
  }

  if (!['pending', 'approved', 'hold'].includes(String(row.status ?? ''))) {
    throw new Error('Partial payments can only be submitted for active enrollment applications.');
  }

  const entry = {
    id: `pp-${Date.now()}`,
    amount: parsedAmount,
    paidAt: new Date().toISOString().slice(0, 10),
    documentKey: `partialPayment_${Date.now()}`,
    originalName: paymentProofFile?.name ?? 'payment-proof.pdf',
  };

  row.formData = row.formData && typeof row.formData === 'object' ? row.formData : {};
  row.formData.partialPayments = Array.isArray(row.formData.partialPayments)
    ? row.formData.partialPayments
    : [];
  row.formData.partialPayments.push(entry);
  row.formData.totalPartialPaid = row.formData.partialPayments.reduce(
    (sum, item) => sum + Number(item.amount ?? 0),
    0
  );
  row.partialPayments = row.formData.partialPayments;
  row.totalPartialPaid = row.formData.totalPartialPaid;
  row.totalPaid = row.formData.totalPartialPaid;

  return {
    enrollmentId,
    partialPayment: entry,
    partialPayments: row.formData.partialPayments,
    totalPartialPaid: row.formData.totalPartialPaid,
  };
}

export async function createBatchEnroll(payload = {}) {
  await delay(150);

  const created = {
    id: `batch-enroll-${Date.now()}`,
    programId: String(payload.programId ?? '').trim(),
    name: String(payload.name ?? '').trim(),
    tentativeStart: String(payload.tentativeStart ?? '').trim(),
    description: payload.description ?? '',
    status: payload.status === 'inactive' ? 'inactive' : 'active',
    sortOrder: Number(payload.sortOrder) || 1,
    updatedAt: new Date().toISOString(),
  };
  batchEnrolls.unshift(created);
  return created;
}

export async function updateBatchEnroll(publicId, payload = {}) {
  await delay(150);

  const row = batchEnrolls.find((item) => item.id === publicId);
  if (!row) {
    throw new Error('Batch enroll entry not found.');
  }

  if (payload.programId != null) row.programId = String(payload.programId).trim();
  if (payload.name != null) row.name = String(payload.name).trim();
  if (payload.tentativeStart != null) row.tentativeStart = String(payload.tentativeStart).trim();
  if (payload.description != null) row.description = payload.description;
  if (payload.status != null) row.status = payload.status === 'inactive' ? 'inactive' : 'active';
  if (payload.sortOrder != null) row.sortOrder = Number(payload.sortOrder) || 1;
  row.updatedAt = new Date().toISOString();

  return { ...row };
}

export async function deleteBatchEnroll(publicId) {
  await delay(150);

  const index = batchEnrolls.findIndex((item) => item.id === publicId);
  if (index === -1) {
    throw new Error('Batch enroll entry not found.');
  }
  batchEnrolls.splice(index, 1);
  return { id: publicId };
}

export async function createLearningMode(payload = {}) {
  await delay(150);

  const created = {
    id: `learning-mode-${Date.now()}`,
    name: String(payload.name ?? '').trim(),
    description: payload.description ?? '',
    status: payload.status === 'inactive' ? 'inactive' : 'active',
    sortOrder: Number(payload.sortOrder) || 1,
    updatedAt: new Date().toISOString(),
  };
  learningModes.unshift(created);
  return created;
}

export async function updateLearningMode(publicId, payload = {}) {
  await delay(150);

  const row = learningModes.find((item) => item.id === publicId);
  if (!row) {
    throw new Error('Learning mode not found.');
  }

  if (payload.name != null) row.name = String(payload.name).trim();
  if (payload.description != null) row.description = payload.description;
  if (payload.status != null) row.status = payload.status === 'inactive' ? 'inactive' : 'active';
  if (payload.sortOrder != null) row.sortOrder = Number(payload.sortOrder) || 1;
  row.updatedAt = new Date().toISOString();

  return { ...row };
}

export async function deleteLearningMode(publicId) {
  await delay(150);

  const index = learningModes.findIndex((item) => item.id === publicId);
  if (index === -1) {
    throw new Error('Learning mode not found.');
  }
  learningModes.splice(index, 1);
  return { id: publicId };
}

export async function createBranchEnroll(payload = {}) {
  await delay(150);

  const created = {
    id: `branch-enroll-${Date.now()}`,
    name: String(payload.name ?? '').trim(),
    description: payload.description ?? '',
    status: payload.status === 'inactive' ? 'inactive' : 'active',
    sortOrder: Number(payload.sortOrder) || 1,
    updatedAt: new Date().toISOString(),
  };
  branchEnrolls.unshift(created);
  return created;
}

export async function updateBranchEnroll(publicId, payload = {}) {
  await delay(150);

  const row = branchEnrolls.find((item) => item.id === publicId);
  if (!row) {
    throw new Error('Branch to enroll not found.');
  }

  if (payload.name != null) row.name = String(payload.name).trim();
  if (payload.description != null) row.description = payload.description;
  if (payload.status != null) row.status = payload.status === 'inactive' ? 'inactive' : 'active';
  if (payload.sortOrder != null) row.sortOrder = Number(payload.sortOrder) || 1;
  row.updatedAt = new Date().toISOString();

  return { ...row };
}

export async function deleteBranchEnroll(publicId) {
  await delay(150);

  const index = branchEnrolls.findIndex((item) => item.id === publicId);
  if (index === -1) {
    throw new Error('Branch to enroll not found.');
  }
  branchEnrolls.splice(index, 1);
  return { id: publicId };
}

export async function createReviewSchedule(payload = {}) {
  await delay(150);

  const branch = branchEnrolls.find((item) => item.id === payload.branchEnrollId);
  const created = {
    id: `review-schedule-${Date.now()}`,
    branchEnrollId: payload.branchEnrollId ?? '',
    branchName: branch?.name ?? '',
    name: String(payload.name ?? '').trim(),
    description: payload.description ?? '',
    status: payload.status === 'inactive' ? 'inactive' : 'active',
    sortOrder: Number(payload.sortOrder) || 1,
    studentCapacity: Number(payload.studentCapacity) || 30,
    updatedAt: new Date().toISOString(),
  };
  reviewSchedules.unshift(created);
  return created;
}

export async function updateReviewSchedule(publicId, payload = {}) {
  await delay(150);

  const row = reviewSchedules.find((item) => item.id === publicId);
  if (!row) {
    throw new Error('Review schedule not found.');
  }

  if (payload.branchEnrollId != null) {
    row.branchEnrollId = String(payload.branchEnrollId).trim();
    const branch = branchEnrolls.find((item) => item.id === row.branchEnrollId);
    row.branchName = branch?.name ?? '';
  }
  if (payload.name != null) row.name = String(payload.name).trim();
  if (payload.description != null) row.description = payload.description;
  if (payload.status != null) row.status = payload.status === 'inactive' ? 'inactive' : 'active';
  if (payload.sortOrder != null) row.sortOrder = Number(payload.sortOrder) || 1;
  if (payload.studentCapacity != null) row.studentCapacity = Number(payload.studentCapacity) || 1;
  row.updatedAt = new Date().toISOString();

  return { ...row };
}

export async function deleteReviewSchedule(publicId) {
  await delay(150);

  const index = reviewSchedules.findIndex((item) => item.id === publicId);
  if (index === -1) {
    throw new Error('Review schedule not found.');
  }
  reviewSchedules.splice(index, 1);
  return { id: publicId };
}

export async function createHonorAwardDiscount(payload = {}) {
  await delay(150);

  const created = {
    id: `honor-award-discount-${Date.now()}`,
    name: String(payload.name ?? '').trim(),
    description: payload.description ?? '',
    status: payload.status === 'inactive' ? 'inactive' : 'active',
    sortOrder: Number(payload.sortOrder) || 1,
    updatedAt: new Date().toISOString(),
  };
  honorAwardDiscounts.unshift(created);
  return created;
}

export async function updateHonorAwardDiscount(publicId, payload = {}) {
  await delay(150);

  const row = honorAwardDiscounts.find((item) => item.id === publicId);
  if (!row) {
    throw new Error('Honor / award / discount not found.');
  }

  if (payload.name != null) row.name = String(payload.name).trim();
  if (payload.description != null) row.description = payload.description;
  if (payload.status != null) row.status = payload.status === 'inactive' ? 'inactive' : 'active';
  if (payload.sortOrder != null) row.sortOrder = Number(payload.sortOrder) || 1;
  row.updatedAt = new Date().toISOString();

  return { ...row };
}

export async function deleteHonorAwardDiscount(publicId) {
  await delay(150);

  const index = honorAwardDiscounts.findIndex((item) => item.id === publicId);
  if (index === -1) {
    throw new Error('Honor / award / discount not found.');
  }
  honorAwardDiscounts.splice(index, 1);
  return { id: publicId };
}

export async function createPackageEnroll(payload = {}) {
  await delay(150);

  const created = {
    id: `package-enroll-${Date.now()}`,
    name: String(payload.name ?? '').trim(),
    description: payload.description ?? '',
    status: payload.status === 'inactive' ? 'inactive' : 'active',
    sortOrder: Number(payload.sortOrder) || 1,
    updatedAt: new Date().toISOString(),
  };
  packageEnrolls.unshift(created);
  return created;
}

export async function updatePackageEnroll(publicId, payload = {}) {
  await delay(150);

  const row = packageEnrolls.find((item) => item.id === publicId);
  if (!row) {
    throw new Error('Package enroll option not found.');
  }

  if (payload.name != null) row.name = String(payload.name).trim();
  if (payload.description != null) row.description = payload.description;
  if (payload.status != null) row.status = payload.status === 'inactive' ? 'inactive' : 'active';
  if (payload.sortOrder != null) row.sortOrder = Number(payload.sortOrder) || 1;
  row.updatedAt = new Date().toISOString();

  return { ...row };
}

export async function deletePackageEnroll(publicId) {
  await delay(150);

  const index = packageEnrolls.findIndex((item) => item.id === publicId);
  if (index === -1) {
    throw new Error('Package enroll option not found.');
  }
  packageEnrolls.splice(index, 1);
  return { id: publicId };
}

export async function fetchQuizQuestionSet(quizId) {
  await delay(120);

  return questionPool[quizId] ?? [];
}
