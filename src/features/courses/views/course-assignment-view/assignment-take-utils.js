export function formatCountdown(totalSec) {
  const s = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

export function resolveAssignmentDurationMinutes(assignment) {
  if (!assignment || typeof assignment !== 'object') {
    return 0;
  }
  const fromField = Number(assignment.durationMinutes);
  if (Number.isFinite(fromField) && fromField > 0) {
    return Math.round(fromField);
  }
  const duration = Number(assignment.duration);
  if (!Number.isFinite(duration) || duration <= 0) {
    return 0;
  }
  return assignment.timeUnit === 'hours' ? Math.round(duration * 60) : Math.round(duration);
}

export function normalizeAssignmentQuestions(rows) {
  return (Array.isArray(rows) ? rows : []).map((q, idx) => ({
    id: String(q?.id ?? `q-${idx}`),
    prompt: String(q?.prompt ?? ''),
    options: (Array.isArray(q?.options) ? q.options : []).map((o, oi) => ({
      id: String(o?.id ?? `o-${idx}-${oi}`),
      label: String(o?.label ?? ''),
      isCorrect: Boolean(o?.isCorrect),
    })),
  }));
}

export function computeAssignmentScore(questions, selections) {
  let correct = 0;
  const total = questions.length;
  questions.forEach((q) => {
    const sel = selections[q.id];
    const picked = q.options.find((o) => o.id === sel);
    if (picked?.isCorrect) {
      correct += 1;
    }
  });
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  return { correct, total, pct };
}

export function assignmentAttemptsStorageKey(assignmentId) {
  return `lms-assignment-attempts:${encodeURIComponent(String(assignmentId ?? ''))}`;
}

export function readAssignmentAttemptsUsed(assignmentId) {
  try {
    const raw = localStorage.getItem(assignmentAttemptsStorageKey(assignmentId));
    if (!raw) {
      return 0;
    }
    const parsed = JSON.parse(raw);
    return typeof parsed?.count === 'number' && Number.isFinite(parsed.count) ? Math.max(0, parsed.count) : 0;
  } catch {
    return 0;
  }
}

export function writeAssignmentAttemptsUsed(assignmentId, count) {
  try {
    localStorage.setItem(
      assignmentAttemptsStorageKey(assignmentId),
      JSON.stringify({ count: Math.max(0, count) })
    );
  } catch {
    // ignore quota / privacy mode
  }
}

export function assignmentSessionStorageKey(courseLookup, assignmentId) {
  return `lms-assignment-take:${encodeURIComponent(String(courseLookup ?? ''))}:${encodeURIComponent(String(assignmentId ?? ''))}`;
}
