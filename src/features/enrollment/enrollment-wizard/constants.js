export const ENROLLMENT_WIZARD_STEPS = [
  'Enrollment Setup',
  'Personal Information',
  'Documents & Discounts',
  'Exam & Payment',
  'Package & Consent',
  'Review & Submit',
];

export const ENROLLMENT_WIZARD_DRAFT_KEY = 'eerc-enrollment-wizard-draft';

export const ENROLLMENT_FILE_ACCEPT = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

export const ENROLLMENT_IMAGE_ACCEPT = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
};

export const ENROLLMENT_MAX_FILE_BYTES = 10 * 1024 * 1024;

export const ENROLLMENT_IMPORTANT_NOTICE = [
  'You consent to EERC Learning Center collecting your information in accordance with Republic Act No. 10173 (Data Privacy Act of 2012) and its implementing rules and regulations.',
  'You acknowledge and agree to the collection, generation, use, processing, storage, and retention of your personal data for enrollment, academic, and administrative purposes.',
  'Access to online and blended learning courses is strictly for enrolled individuals. Sharing access is prohibited and may result in legal action or automatic revocation of access without a refund.',
  'All enrollment fees are non-refundable, non-cancellable, and non-transferable, though they may be applied to a subsequent term where applicable.',
  'For scholarship recipients, enrollment is strictly non-transferable, non-cancellable, non-withdrawable, and irrevocable.',
  'You consent to EERC Learning Center using your name and/or photo in promotional materials if you pass the board examination or achieve high scores.',
  'You affirm that you have thoroughly understood and accepted these terms before providing your signature.',
];

export const PURE_ONLINE_BRANCH_HINT = 'pure online';

export const STEP_FIELD_GROUPS = {
  0: ['batchEnrollId', 'learningModeId', 'branchEnrollId', 'reviewScheduleId'],
  1: ['fullName', 'aliasName', 'schoolName', 'gender', 'dateOfBirth', 'contactNumber', 'homeAddress'],
  2: ['profilePicture', 'honorAwardDiscountId', 'discountProof'],
  3: ['examExperience', 'retakerAttempts', 'retakerProof', 'paymentProof', 'downpaymentAmount'],
  4: ['packageEnrollId', 'signature'],
  5: ['confirmTerms'],
};

export const ENROLLMENT_FIELD_LABELS = {
  batchEnrollId: 'Batch enrolled',
  learningModeId: 'Mode of learning',
  branchEnrollId: 'Branch to enroll',
  reviewScheduleId: 'Review schedule',
  fullName: 'Name',
  aliasName: 'Alias name',
  schoolName: 'School',
  gender: 'Gender',
  dateOfBirth: 'Date of birth',
  contactNumber: 'Contact number',
  homeAddress: 'Home address',
  profilePicture: 'Profile picture',
  honorAwardDiscountId: 'Honors / awards / discount',
  discountProof: 'Discount proof',
  examExperience: 'Board exam experience',
  retakerAttempts: 'Retaker attempts',
  retakerProof: 'Retaker proof',
  paymentProof: 'Payment proof',
  downpaymentAmount: 'Downpayment / scholarship',
  packageEnrollId: 'Package enroll',
  signature: 'Signature',
  confirmTerms: 'Terms confirmation',
};

const FIELD_TO_STEP = Object.entries(STEP_FIELD_GROUPS).reduce((acc, [step, fields]) => {
  fields.forEach((field) => {
    acc[field] = Number(step);
  });
  return acc;
}, {});

export function findFirstErrorStep(errors) {
  const walk = (obj) => {
    for (const [key, value] of Object.entries(obj ?? {})) {
      if (value?.message && FIELD_TO_STEP[key] !== undefined) {
        return FIELD_TO_STEP[key];
      }
      if (value && typeof value === 'object' && !value.message) {
        const nested = walk(value);
        if (nested !== undefined) {
          return nested;
        }
      }
    }
    return undefined;
  };

  return walk(errors) ?? 0;
}

export function getFirstErrorMessage(errors) {
  const walk = (obj) => {
    for (const value of Object.values(obj ?? {})) {
      if (value?.message) {
        return value.message;
      }
      if (value && typeof value === 'object') {
        const nested = walk(value);
        if (nested) {
          return nested;
        }
      }
    }
    return null;
  };

  return walk(errors) ?? 'Please complete all required fields before submitting.';
}

export function getStepErrorMessages(errors, stepIndex) {
  const fields = STEP_FIELD_GROUPS[stepIndex] ?? [];

  return fields
    .filter((field) => field !== 'discountProof' && field !== 'retakerProof')
    .filter((field) => errors?.[field]?.message)
    .map((field) => ({
      field,
      label: ENROLLMENT_FIELD_LABELS[field] ?? field,
      message: errors[field].message,
    }));
}

export function getAllErrorMessages(errors) {
  return Object.keys(STEP_FIELD_GROUPS).flatMap((step) => getStepErrorMessages(errors, Number(step)));
}
