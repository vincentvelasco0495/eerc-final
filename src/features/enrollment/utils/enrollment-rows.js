export function enrollmentSelectionId(row) {
  if (row?.isLearnerGroup && Array.isArray(row.enrollments) && row.enrollments.length > 1) {
    return row.id ?? null;
  }
  if (row?.isLearnerGroup && Array.isArray(row.enrollments) && row.enrollments.length === 1) {
    return row.enrollments[0]?.id ?? row.id ?? null;
  }
  return row?.id ?? null;
}

export function enrollmentIdsForSelection(row) {
  if (row?.isLearnerGroup && Array.isArray(row.enrollments) && row.enrollments.length > 1) {
    return row.enrollments.map((item) => item?.id).filter(Boolean);
  }
  const id = enrollmentSelectionId(row);
  return id ? [id] : [];
}

export function flattenEnrollmentRows(rows = []) {
  const out = [];

  for (const row of rows ?? []) {
    if (row?.isLearnerGroup && Array.isArray(row.enrollments)) {
      out.push(...row.enrollments);
    } else if (row) {
      out.push(row);
    }
  }

  return out;
}

export function learnerDetailsFromRow(row) {
  if (!row) {
    return null;
  }

  if (row.isLearnerGroup && Array.isArray(row.enrollments)) {
    return {
      userName: row.userName ?? '',
      userEmail: row.userEmail ?? '',
      phoneNumber: row.phoneNumber ?? '',
      schoolHeld: row.schoolHeld ?? '',
      enrollments: row.enrollments,
    };
  }

  return {
    userName: row.userName ?? '',
    userEmail: row.userEmail ?? '',
    phoneNumber: row.phoneNumber ?? '',
    schoolHeld: row.schoolHeld ?? '',
    enrollments: [row],
  };
}
