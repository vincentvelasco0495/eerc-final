export {
  downloadBlob,
  buildSpreadsheetMlBlob,
  parseContentDispositionFileName,
} from 'src/utils/export-excel';

export const ENROLLMENT_EXCEL_HEADERS = [
  'Enrollment ID',
  'Learner',
  'Email',
  'Phone',
  'School',
  'Program',
  'Application type',
  'Course',
  'Courses',
  'Status',
  'Submitted',
  'Payment proof',
  'Total paid',
  'Unreviewed payments',
];

export function enrollmentRowToExcelCells(row) {
  return [
    row?.id ?? '',
    row?.userName ?? '',
    row?.userEmail ?? '',
    row?.phoneNumber ?? '',
    row?.schoolHeld ?? '',
    row?.programTitle ?? row?.programId ?? '',
    row?.requestKind === 'course_access' || row?.courseTitle ? 'Course access' : 'Program application',
    row?.courseTitle ?? '',
    Array.isArray(row?.courses) ? row.courses.filter(Boolean).join(', ') : (row?.courses ?? ''),
    row?.status ?? '',
    row?.submittedAt ?? '',
    row?.hasPaymentProof ? 'Yes' : 'No',
    row?.totalPaid ?? '',
    row?.hasUnreviewedPayments ? 'Yes' : 'No',
  ];
}
