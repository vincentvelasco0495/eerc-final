const PHONE_DIGITS_MIN = 10;
const PHONE_DIGITS_MAX = 15;

export function normalizePhoneDigits(phone) {
  return String(phone ?? '').replace(/\D/g, '');
}

export function isValidPhoneNumber(phone) {
  const digits = normalizePhoneDigits(phone);
  return digits.length >= PHONE_DIGITS_MIN && digits.length <= PHONE_DIGITS_MAX;
}

/** True when birth date is on or before the calendar day 18 years ago (inclusive = age 18+). */
export function isAtLeast18YearsOld(birthday) {
  const raw = String(birthday ?? '').trim();
  if (!raw) {
    return false;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const birth = new Date(year, month - 1, day);

  if (
    birth.getFullYear() !== year ||
    birth.getMonth() !== month - 1 ||
    birth.getDate() !== day
  ) {
    return false;
  }

  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setFullYear(cutoff.getFullYear() - 18);

  return birth <= cutoff;
}

/**
 * @returns {{ phoneNumber?: string, birthday?: string }}
 */
export function validateStudentProfileFields({ phoneNumber, birthday }) {
  const errors = {};
  const phone = String(phoneNumber ?? '').trim();
  const birth = String(birthday ?? '').trim();

  if (!phone) {
    errors.phoneNumber = 'Phone number is required.';
  } else if (!isValidPhoneNumber(phone)) {
    errors.phoneNumber = 'Enter a valid phone number (10–15 digits).';
  }

  if (!birth) {
    errors.birthday = 'Birthday is required.';
  } else if (!isAtLeast18YearsOld(birth)) {
    errors.birthday = 'You must be at least 18 years old.';
  }

  return errors;
}

/** Latest calendar date allowed for age 18+ (YYYY-MM-DD). */
export function maxBirthdayForAge18() {
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setFullYear(cutoff.getFullYear() - 18);
  const y = cutoff.getFullYear();
  const m = String(cutoff.getMonth() + 1).padStart(2, '0');
  const d = String(cutoff.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
