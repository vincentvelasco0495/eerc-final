import { PURE_ONLINE_BRANCH_HINT } from './constants';
import { enrollmentWizardDefaultValues } from './schema';

const WIZARD_FILE_FIELDS = new Set([
  'profilePicture',
  'discountProof',
  'retakerProof',
  'paymentProof',
  'signature',
]);

const WIZARD_META_FIELDS = new Set(['labels', 'confirmTerms', 'activeStep']);

export function isPureOnlineLabel(name = '') {
  return String(name).toLowerCase().includes(PURE_ONLINE_BRANCH_HINT);
}

export function isPureOnlineLearningMode(name = '') {
  const normalized = String(name).toLowerCase();
  return normalized.includes('pure online') && !normalized.includes('blended');
}

export function filterBranchesForLearningMode(branches = [], learningModeName = '') {
  if (isPureOnlineLearningMode(learningModeName)) {
    const online = branches.filter((item) => isPureOnlineLabel(item.name));
    return online.length ? online : branches;
  }
  return branches.filter((item) => !isPureOnlineLabel(item.name) || branches.length === 1);
}

export function filterSchedulesForBranch(schedules = [], branchId = '', branchName = '') {
  if (!branchId) {
    return schedules;
  }
  if (isPureOnlineLabel(branchName)) {
    return schedules.filter(
      (item) => item.branchEnrollId === branchId || isPureOnlineLabel(item.name)
    );
  }
  return schedules.filter((item) => !item.branchEnrollId || item.branchEnrollId === branchId);
}

export function findOptionLabel(options = [], id = '') {
  return options.find((item) => item.id === id)?.name ?? '—';
}

export function stripPlainText(value = '') {
  return String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function filterBatchEnrollsForProgram(batchEnrolls = [], programId = '') {
  const rows = batchEnrolls ?? [];

  if (!programId) {
    return [];
  }

  return rows.filter((item) => String(item.programId ?? '') === String(programId));
}

/** Maps account / registration profile fields into enrollment personal-info fields. */
export function buildEnrollmentPrefillFromUser(user) {
  if (!user) {
    return {};
  }

  const prefill = {};
  const displayName = String(user.displayName ?? user.name ?? '').trim();

  if (displayName) {
    prefill.fullName = displayName;
  }

  const schoolName = String(user.schoolHeld ?? '').trim();
  if (schoolName) {
    prefill.schoolName = schoolName;
  }

  const contactNumber = String(user.phoneNumber ?? '').trim();
  if (contactNumber) {
    prefill.contactNumber = contactNumber;
  }

  const birthday = String(user.birthday ?? '').trim();
  if (birthday) {
    prefill.dateOfBirth = birthday;
  }

  return prefill;
}

/** Restores wizard field values from a stored enrollment `form_data` payload. */
export function buildEnrollmentPrefillFromApplication(formData) {
  if (!formData || typeof formData !== 'object') {
    return {};
  }

  const prefill = {};

  Object.keys(enrollmentWizardDefaultValues).forEach((key) => {
    if (WIZARD_FILE_FIELDS.has(key) || WIZARD_META_FIELDS.has(key)) {
      return;
    }

    const value = formData[key];
    if (value === null || value === undefined) {
      return;
    }
    if (typeof value === 'string' && !value.trim()) {
      return;
    }
    if (typeof value === 'boolean') {
      return;
    }

    prefill[key] = value;
  });

  return prefill;
}

/** Most recent enrollment that includes a saved wizard application payload. */
export function findLatestEnrollmentWithFormData(enrollments = []) {
  const sorted = [...enrollments].sort((left, right) =>
    String(right?.submittedAt ?? '').localeCompare(String(left?.submittedAt ?? ''))
  );

  return (
    sorted.find((item) => {
      const data = item?.formData ?? item?.form_data;
      return data && typeof data === 'object' && Object.keys(data).length > 0;
    }) ?? null
  );
}

export function mergeEnrollmentInitialValues({
  draft = null,
  user = null,
  previousApplication = null,
} = {}) {
  const profilePrefill = buildEnrollmentPrefillFromUser(user);
  const applicationFormData =
    previousApplication?.formData ?? previousApplication?.form_data ?? null;
  const applicationPrefill = buildEnrollmentPrefillFromApplication(applicationFormData);
  const merged = {
    ...enrollmentWizardDefaultValues,
    ...profilePrefill,
    ...applicationPrefill,
  };

  if (!draft || typeof draft !== 'object') {
    return merged;
  }

  Object.entries(draft).forEach(([key, value]) => {
    if (key === 'activeStep') {
      return;
    }
    if (value === null || value === undefined) {
      return;
    }
    merged[key] = value;
  });

  return merged;
}

export function loadEnrollmentDraft() {
  try {
    const raw = localStorage.getItem('eerc-enrollment-wizard-draft');
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

export function saveEnrollmentDraft(values, activeStep) {
  const serializable = { ...values, activeStep };
  ['profilePicture', 'discountProof', 'retakerProof', 'paymentProof', 'signature'].forEach(
    (key) => {
      serializable[key] = null;
    }
  );
  localStorage.setItem('eerc-enrollment-wizard-draft', JSON.stringify(serializable));
}

export function clearEnrollmentDraft() {
  localStorage.removeItem('eerc-enrollment-wizard-draft');
}

/** Opens a selected enrollment file in a new browser tab for preview. */
export function openEnrollmentFileInNewTab(file) {
  if (!(file instanceof File)) {
    return;
  }

  const url = URL.createObjectURL(file);
  const popup = window.open(url, '_blank', 'noopener,noreferrer');

  if (!popup) {
    URL.revokeObjectURL(url);
    return;
  }

  window.setTimeout(() => URL.revokeObjectURL(url), 120_000);
}

export function buildFormDataPayload({ programId, values, labels }) {
  const {
    profilePicture,
    discountProof,
    retakerProof,
    paymentProof,
    signature,
    confirmTerms,
    ...fields
  } = values;

  const fd = new FormData();
  fd.append('program_id', programId);
  fd.append(
    'form_data',
    JSON.stringify({
      ...fields,
      confirmTerms,
      labels,
    })
  );
  if (profilePicture) fd.append('profile_picture', profilePicture);
  if (paymentProof) fd.append('payment_proof', paymentProof);
  if (signature) fd.append('signature', signature);
  if (discountProof) fd.append('discount_proof', discountProof);
  if (retakerProof) fd.append('retaker_proof', retakerProof);
  return fd;
}
