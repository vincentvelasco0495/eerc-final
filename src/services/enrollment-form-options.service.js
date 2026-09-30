const MOCK_BATCH_TEMPLATES = [
  {
    suffix: '1',
    name: 'BATCH 1 (TENTATIVE START - APRIL 3RD WEEK)',
    tentativeStart: 'April 3rd week',
    sortOrder: 1,
  },
  {
    suffix: '2',
    name: 'BATCH 2 (TENTATIVE START FIRST WEEK OF JUNE)',
    tentativeStart: 'First week of June',
    sortOrder: 2,
  },
];

const MOCK_PROGRAM_IDS = ['program-ce', 'program-plumbing', 'program-materials'];

const MOCK_OPTIONS = {
  batchEnrolls: MOCK_PROGRAM_IDS.flatMap((programId) =>
    MOCK_BATCH_TEMPLATES.map((template) => ({
      id: `batch-enroll-${template.suffix}-${programId}`,
      programId,
      name: template.name,
      tentativeStart: template.tentativeStart,
      sortOrder: template.sortOrder,
    }))
  ),
  learningModes: [
    { id: 'learning-mode-online', name: 'PURE ONLINE CLASS', sortOrder: 1 },
    { id: 'learning-mode-face', name: 'FACE TO FACE CLASS', sortOrder: 2 },
    {
      id: 'learning-mode-blended',
      name: 'BLENDED LEARNING (ACCESS TO ONLINE AND FACE TO FACE CLASS)',
      sortOrder: 3,
    },
  ],
  branchEnrolls: [
    { id: 'branch-enroll-manila', name: 'MANILA BRANCH', sortOrder: 1 },
    { id: 'branch-enroll-baguio', name: 'BAGUIO BRANCH', sortOrder: 2 },
    { id: 'branch-enroll-legazpi', name: 'LEGAZPI BRANCH', sortOrder: 3 },
    { id: 'branch-enroll-cebu', name: 'CEBU BRANCH', sortOrder: 4 },
    { id: 'branch-enroll-online', name: 'PURE ONLINE CLASS', sortOrder: 5 },
  ],
  reviewSchedules: [
    {
      id: 'review-schedule-online',
      branchEnrollId: 'branch-enroll-online',
      name: 'PURE ONLINE CLASS MONDAY-THURSDAY 8AM TO 12NN',
      sortOrder: 1,
    },
    {
      id: 'review-schedule-baguio',
      branchEnrollId: 'branch-enroll-baguio',
      name: 'BAGUIO BRANCH SECTION D 4:30PM TO 8:30PM',
      sortOrder: 2,
    },
    {
      id: 'review-schedule-manila',
      branchEnrollId: 'branch-enroll-manila',
      name: 'MANILA BRANCH SECTION D TUESDAY TO FRIDAY 4:30PM TO 8:30PM',
      sortOrder: 3,
    },
    {
      id: 'review-schedule-legazpi',
      branchEnrollId: 'branch-enroll-legazpi',
      name: 'LEGAZPI BRANCH MONDAY TO THURSDAY 8AM TO 12NN',
      sortOrder: 4,
    },
    {
      id: 'review-schedule-cebu',
      branchEnrollId: 'branch-enroll-cebu',
      name: 'CEBU BRANCH MONDAY TO THURSDAY 9AM TO 4PM',
      sortOrder: 5,
    },
  ],
  honorAwardDiscounts: [
    {
      id: 'honor-award-discount-president-quiz-champion',
      name: 'ACES/PICE PRESIDENT/ MAGNA OR SUMMA CUMLAUDE, CHAMPION OF NATIONAL QUIZ SHOW (MATEMATICS RELATED)',
      sortOrder: 1,
    },
    {
      id: 'honor-award-discount-cum-laude-finalist',
      name: 'CUM LAUDE/NATIONAL QUIZ SHOW FINALIST/ FREE VOUCHER',
      sortOrder: 2,
    },
    {
      id: 'honor-award-discount-quizzer-officer',
      name: 'NATIONAL QUIZZER PACTICIPANT / PICE/ACES OFFICER',
      sortOrder: 3,
    },
    { id: 'honor-award-discount-former-reviewee', name: 'FORMER REVIEWEE', sortOrder: 4 },
    { id: 'honor-award-discount-none', name: 'NONE', sortOrder: 5 },
  ],
  packageEnrolls: [
    { id: 'package-enroll-review-and-refresher', name: 'PACKAGE REVIEW AND REFRESHER', sortOrder: 1 },
    { id: 'package-enroll-review-only', name: 'REVIEW ONLY', sortOrder: 2 },
    { id: 'package-enroll-refresher-only', name: 'REFRESHER ONLY', sortOrder: 3 },
    {
      id: 'package-enroll-free-package',
      name: 'FREE PACKAGE (ACES OR PICE PRESIDENT, CHAMPION, 1ST AND 2ND PLACER, MAGNA OR SUMA CUMLAUDE)',
      sortOrder: 4,
    },
    {
      id: 'package-enroll-free-review-scholarship-voucher',
      name: 'FREE REVIEW SCHOLARSHIP (VOUCHER OR CUMLAUDE) (REVIEW ONLY)',
      sortOrder: 5,
    },
    {
      id: 'package-enroll-pice-aces-officers-quizzer',
      name: 'PICE/ACES OFFICERS AND NATIONAL QUIZZER PARTICIPANT',
      sortOrder: 6,
    },
    {
      id: 'package-enroll-free-review-paid-refresher',
      name: 'FREE REVIEW SCHOLARSHIP (FREE REVIEW AND PAID FOR REFRESHER )',
      sortOrder: 7,
    },
    { id: 'package-enroll-former-eerc-reviewee', name: 'FORMER EERC REVIEWEE', sortOrder: 8 },
  ],
};

export async function fetchEnrollmentFormOptionsMock(programId = '') {
  await new Promise((resolve) => setTimeout(resolve, 120));

  const batchEnrolls = programId
    ? MOCK_OPTIONS.batchEnrolls.filter((item) => item.programId === programId)
    : MOCK_OPTIONS.batchEnrolls;

  return {
    ...MOCK_OPTIONS,
    batchEnrolls,
  };
}
