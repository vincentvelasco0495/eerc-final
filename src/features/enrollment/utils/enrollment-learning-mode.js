import {
  looksLikeOnlineLearningMode,
  looksLikeBlendedLearningMode,
  looksLikeFaceToFaceLearningMode,
} from 'src/features/courses/utils/learner-course-access';

export const LEARNING_MODE_SWITCH_OPTIONS = [
  { id: 'online', label: 'Pure online' },
  { id: 'face-to-face', label: 'Face to face' },
  { id: 'blended', label: 'Blended' },
];

export function shortLearningModeLabel(id = '', name = '') {
  if (looksLikeBlendedLearningMode(id, name)) {
    return 'Blended';
  }
  if (looksLikeFaceToFaceLearningMode(id, name)) {
    return 'Face to face';
  }
  if (looksLikeOnlineLearningMode(id, name)) {
    return 'Pure online';
  }
  const fallback = String(name ?? '').trim();
  return fallback || '—';
}

export function enrollmentLearningModeFamily(row) {
  const id = row?.learningModeId ?? '';
  const name = row?.learningModeName ?? '';

  if (looksLikeBlendedLearningMode(id, name)) {
    return 'blended';
  }
  if (looksLikeFaceToFaceLearningMode(id, name)) {
    return 'face-to-face';
  }
  if (looksLikeOnlineLearningMode(id, name)) {
    return 'online';
  }

  return null;
}

export function learningModeFamilyLabel(family) {
  return LEARNING_MODE_SWITCH_OPTIONS.find((item) => item.id === family)?.label ?? '—';
}

export function learningModeSwitchEffectCopy(family) {
  if (family === 'face-to-face') {
    return 'Face to face learners keep Quiz, Handouts, and Group study; lecture videos stay hidden.';
  }
  return 'Pure online and blended learners can use Quiz, Handouts, Lecture video, and Group study.';
}

export function learnerGroupLearningModeLabel(row) {
  const enrollments = Array.isArray(row?.enrollments) ? row.enrollments : [];
  const labels = [];
  const seen = new Set();

  enrollments.forEach((item) => {
    const short = shortLearningModeLabel(item?.learningModeId, item?.learningModeName);
    if (short && short !== '—' && !seen.has(short)) {
      seen.add(short);
      labels.push(short);
    }
  });

  return labels.length ? labels.join(' · ') : '—';
}
