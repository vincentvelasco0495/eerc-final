import { getProgramEnrollmentRows } from 'src/features/student-profile/student-profile-data';
import {
  formatPesoAmount,
  getProgramEnrollmentFeeAmount,
} from 'src/config/enrollment-payment';

export const PAYMENT_VERIFICATION = {
  PENDING: 'pending',
  CORRECT: 'correct',
  INVALID: 'invalid',
};

/** Enrollment row used for partial payments (prefers whole-program application). */
export function getProgramEnrollmentForPayment(programId, enrollments = [], courses = []) {
  const rows = getProgramEnrollmentRows(programId, enrollments, courses);
  if (!rows.length) {
    return null;
  }

  const programLevel = rows.find((item) => !item.courseId);
  if (programLevel) {
    return programLevel;
  }

  return [...rows].sort((a, b) =>
    String(b.submittedAt ?? '').localeCompare(String(a.submittedAt ?? ''))
  )[0];
}

export function canSubmitPartialPayment(enrollment) {
  const status = String(enrollment?.status ?? '').toLowerCase();
  return ['pending', 'hold', 'approved'].includes(status);
}

export function normalizePaymentVerificationStatus(status, legacyAsCorrect = true) {
  const raw = String(status ?? '').trim().toLowerCase();
  if (
    raw === PAYMENT_VERIFICATION.PENDING ||
    raw === PAYMENT_VERIFICATION.CORRECT ||
    raw === PAYMENT_VERIFICATION.INVALID
  ) {
    return raw;
  }
  return legacyAsCorrect ? PAYMENT_VERIFICATION.CORRECT : PAYMENT_VERIFICATION.PENDING;
}

export function isPaymentCounted(status) {
  return normalizePaymentVerificationStatus(status) === PAYMENT_VERIFICATION.CORRECT;
}

export function isPaymentPendingReview(status) {
  return normalizePaymentVerificationStatus(status) === PAYMENT_VERIFICATION.PENDING;
}

export function getPartialPaymentsFromEnrollment(enrollment) {
  const list = enrollment?.partialPayments ?? enrollment?.formData?.partialPayments;
  return Array.isArray(list) ? list : [];
}

export function parseMoneyAmount(value) {
  if (value == null || value === '') {
    return 0;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value > 0 ? value : 0;
  }

  const cleaned = String(value).replace(/[^\d.]/g, '');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function getInitialDownpaymentAmount(enrollment) {
  if (!enrollment) {
    return 0;
  }

  if (Number.isFinite(Number(enrollment.initialDownpayment))) {
    return Number(enrollment.initialDownpayment);
  }

  const formData = enrollment.formData ?? {};
  return parseMoneyAmount(formData.downpaymentAmount);
}

export function getInitialDownpaymentVerificationStatus(enrollment) {
  if (!enrollment) {
    return PAYMENT_VERIFICATION.CORRECT;
  }
  return normalizePaymentVerificationStatus(
    enrollment.downpaymentVerificationStatus ??
      enrollment.formData?.downpaymentVerificationStatus ??
      null
  );
}

export function summarizeEnrollmentPayments(enrollment) {
  if (!enrollment) {
    return { verifiedTotal: 0, hasUnreviewed: false, paymentCount: 0 };
  }

  let verifiedTotal = 0;
  let hasUnreviewed = false;
  let paymentCount = 0;

  const initialAmount = getInitialDownpaymentAmount(enrollment);
  if (initialAmount > 0) {
    paymentCount += 1;
    const initialStatus = getInitialDownpaymentVerificationStatus(enrollment);
    if (isPaymentPendingReview(initialStatus)) {
      hasUnreviewed = true;
    }
    if (isPaymentCounted(initialStatus)) {
      verifiedTotal += initialAmount;
    }
  }

  getPartialPaymentsFromEnrollment(enrollment).forEach((item) => {
    const amount = Number(item?.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return;
    }
    paymentCount += 1;
    const status = normalizePaymentVerificationStatus(item?.verificationStatus ?? null, false);
    if (isPaymentPendingReview(status)) {
      hasUnreviewed = true;
    }
    if (isPaymentCounted(status)) {
      verifiedTotal += amount;
    }
  });

  return {
    verifiedTotal,
    hasUnreviewed: hasUnreviewed || Boolean(enrollment.hasUnreviewedPayments),
    paymentCount,
  };
}

export function sumPartialPayments(enrollment) {
  return summarizeEnrollmentPayments(enrollment).verifiedTotal;
}

export function sumEnrollmentPayments(enrollment) {
  return summarizeEnrollmentPayments(enrollment).verifiedTotal;
}

export function enrollmentHasUnreviewedPayments(enrollment) {
  return summarizeEnrollmentPayments(enrollment).hasUnreviewed;
}

export function buildPartialPaymentSummary(program, enrollment) {
  const hasBackendFeeField =
    program != null &&
    (Object.prototype.hasOwnProperty.call(program, 'enrollmentFee') ||
      Object.prototype.hasOwnProperty.call(program, 'enrollment_fee'));
  const rawBackendFee = program?.enrollmentFee ?? program?.enrollment_fee;
  const backendFee =
    rawBackendFee != null && rawBackendFee !== '' && Number.isFinite(Number(rawBackendFee))
      ? Number(rawBackendFee)
      : null;
  const totalFee = hasBackendFeeField
    ? backendFee
    : getProgramEnrollmentFeeAmount({
        programId: program?.id ?? enrollment?.programId,
        programCode: program?.category ?? program?.programCode,
        programTitle: program?.title ?? enrollment?.programTitle,
        enrollmentFee: rawBackendFee,
      });
  const paymentSummary = summarizeEnrollmentPayments(enrollment);
  const totalPaid = paymentSummary.verifiedTotal;
  const remaining =
    totalFee != null && Number.isFinite(totalFee) ? Math.max(0, totalFee - totalPaid) : null;

  return {
    totalFee,
    totalFeeLabel: totalFee != null ? formatPesoAmount(totalFee) : null,
    totalPaid,
    totalPaidLabel: formatPesoAmount(totalPaid),
    remaining,
    remainingLabel: remaining != null ? formatPesoAmount(remaining) : null,
    paymentCount: paymentSummary.paymentCount,
    hasUnreviewedPayments: paymentSummary.hasUnreviewed,
  };
}

export function buildEnrollmentPaymentHistory(enrollment) {
  if (!enrollment) {
    return [];
  }

  const rows = [];
  const initialAmount = getInitialDownpaymentAmount(enrollment);
  if (initialAmount > 0) {
    const verificationStatus = getInitialDownpaymentVerificationStatus(enrollment);
    rows.push({
      id: 'initial-downpayment',
      type: 'initial',
      label: 'Initial downpayment',
      amount: initialAmount,
      paidAt: enrollment.submittedAt ?? null,
      verificationStatus,
      hasProof: Boolean(enrollment?.hasPaymentProof),
      proofKind: enrollment?.hasPaymentProof ? 'initial' : null,
      documentKey: null,
      originalName: enrollment?.paymentProofFileName ?? null,
    });
  }

  const partialRows = getPartialPaymentsFromEnrollment(enrollment)
    .map((item, index) => {
      const amount = Number(item?.amount);
      if (!Number.isFinite(amount) || amount <= 0) {
        return null;
      }
      return {
        id: String(item?.id ?? `partial-${index + 1}`),
        type: 'partial',
        label: `Partial payment ${index + 1}`,
        amount,
        paidAt: item?.paidAt ?? null,
        verificationStatus: normalizePaymentVerificationStatus(item?.verificationStatus ?? null, false),
        hasProof: Boolean(item?.documentKey),
        proofKind: 'partial',
        documentKey: item?.documentKey ?? null,
        originalName: item?.originalName ?? null,
      };
    })
    .filter(Boolean);

  rows.push(...partialRows);

  return rows.sort((a, b) => String(b.paidAt ?? '').localeCompare(String(a.paidAt ?? '')));
}

export function paymentVerificationLabel(status) {
  const normalized = normalizePaymentVerificationStatus(status);
  if (normalized === PAYMENT_VERIFICATION.CORRECT) {
    return 'Correct';
  }
  if (normalized === PAYMENT_VERIFICATION.INVALID) {
    return 'Invalid';
  }
  return 'Pending review';
}
