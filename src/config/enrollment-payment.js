/**
 * Enrollment fee transfer instructions shown before learners submit an application.
 * Override via Vite env when deploying (comma-separated bank lines use `|` as line break).
 */
const envFeeAmount = String(import.meta.env.VITE_ENROLLMENT_FEE_AMOUNT ?? '').trim();
const envFeeNote = String(import.meta.env.VITE_ENROLLMENT_FEE_NOTE ?? '').trim();
const envMethodsRaw = String(import.meta.env.VITE_ENROLLMENT_PAYMENT_METHODS ?? '').trim();
const envProgramFeesRaw = String(import.meta.env.VITE_ENROLLMENT_PROGRAM_FEES ?? '').trim();

function parsePaymentMethods(raw) {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // fall through to pipe-delimited blocks
  }

  return raw.split('||').map((block) => {
    const [title, ...detailLines] = block.split('|').map((part) => part.trim());
    return {
      title: title || 'Payment method',
      details: detailLines.filter(Boolean),
    };
  });
}

function parseProgramFees(raw) {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

const defaultMethods = [
  {
    title: 'Bank transfer',
    details: [
      'Account name: EERC Training Center',
      'Bank: [Your bank name]',
      'Account number: [Your account number]',
      'Reference: Your full name + program code',
    ],
  },
  {
    title: 'GCash / Maya',
    details: [
      'Mobile number: [Your registered number]',
      'Account name: EERC Training Center',
      'Reference: Your full name + program code',
    ],
  },
];

/** Sample enrollment fees per program (`public_id` from the API). */
export const PROGRAM_ENROLLMENT_FEES = {
  'program-ce': 8500,
  'program-plumbing': 12000,
  'program-materials': 10500,
  CE: 8500,
  MPL: 12000,
  MSE: 10500,
  ...parseProgramFees(envProgramFeesRaw),
};

const DEFAULT_FEE_FALLBACK =
  'Contact the administrator for the current program fee';

function normalizeProgramKey(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Resolve numeric program fee when configured (for balance calculations).
 * @param {{ programId?: string, programCode?: string, programTitle?: string, enrollmentFee?: number|null }} [program]
 */
export function getProgramEnrollmentFeeAmount(program = {}) {
  const configuredFee = program.enrollmentFee ?? program.enrollment_fee;
  if (
    configuredFee != null &&
    configuredFee !== '' &&
    Number.isFinite(Number(configuredFee))
  ) {
    return Number(configuredFee);
  }

  const keys = [
    program.programId,
    program.programCode,
    normalizeProgramKey(program.programId),
    normalizeProgramKey(program.programCode),
    normalizeProgramKey(program.programTitle),
  ].filter(Boolean);

  for (const key of keys) {
    const direct = PROGRAM_ENROLLMENT_FEES[key];
    if (direct != null && Number.isFinite(Number(direct))) {
      return Number(direct);
    }

    const normalized = normalizeProgramKey(key);
    const byNormalized = PROGRAM_ENROLLMENT_FEES[normalized];
    if (byNormalized != null && Number.isFinite(Number(byNormalized))) {
      return Number(byNormalized);
    }
  }

  return null;
}

/**
 * Resolve the amount to display for a program enrollment payment.
 * @param {{ programId?: string, programCode?: string, programTitle?: string }} [program]
 */
export function getProgramEnrollmentFeeLabel(program = {}) {
  if (envFeeAmount) {
    return envFeeAmount;
  }

  const amount = getProgramEnrollmentFeeAmount(program);
  if (amount != null) {
    return formatPesoAmount(amount);
  }

  return DEFAULT_FEE_FALLBACK;
}

export function formatPesoAmount(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value) || value < 0) {
    return DEFAULT_FEE_FALLBACK;
  }

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export const ENROLLMENT_PAYMENT_CONFIG = {
  feeAmount: envFeeAmount || DEFAULT_FEE_FALLBACK,
  feeNote:
    envFeeNote ||
    'Transfer the full enrollment fee, then upload a clear screenshot or photo of your payment receipt. An administrator will verify your proof before approving access.',
  methods: parsePaymentMethods(envMethodsRaw) ?? defaultMethods,
  acceptedProofHint: 'JPG, PNG, WEBP, or PDF · max 10 MB',
  programFees: PROGRAM_ENROLLMENT_FEES,
};
