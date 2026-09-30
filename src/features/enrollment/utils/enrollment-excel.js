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
  'Course',
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
    row?.courseTitle ?? '',
    row?.status ?? '',
    row?.submittedAt ?? '',
    row?.hasPaymentProof ? 'Yes' : 'No',
    row?.totalPaid ?? '',
    row?.hasUnreviewedPayments ? 'Yes' : 'No',
  ];
}
