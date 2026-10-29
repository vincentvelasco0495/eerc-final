function hasDirtyValue(value) {
  if (value === true) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.some((item) => hasDirtyValue(item));
  }
  if (value && typeof value === 'object') {
    return Object.values(value).some((item) => hasDirtyValue(item));
  }
  return false;
}

/** Section keys that react-hook-form marked dirty. */
export function changedSectionKeys(dirtySections) {
  if (!dirtySections || typeof dirtySections !== 'object') {
    return [];
  }
  return Object.keys(dirtySections).filter((key) => hasDirtyValue(dirtySections[key]));
}

export function pickChangedSections(sections, dirtySections) {
  return Object.fromEntries(
    changedSectionKeys(dirtySections).map((key) => [key, sections?.[key]])
  );
}
