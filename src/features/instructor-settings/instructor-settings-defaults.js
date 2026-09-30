export function splitInstructorName(value) {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) {
    return { firstName: '', lastName: '' };
  }
  const [firstName = '', ...rest] = trimmed.split(/\s+/);

  return {
    firstName,
    lastName: rest.join(' '),
  };
}

export function getInstructorSettingsInitialValues(user) {
  const fullName = String(user?.fullName || '').trim();
  const fromParts = {
    firstName: String(user?.firstName ?? '').trim(),
    lastName: String(user?.lastName ?? '').trim(),
  };
  const split = splitInstructorName(fullName || user?.displayName);
  const firstName = fromParts.firstName || split.firstName;
  const lastName = fromParts.lastName || split.lastName;
  const displayName = String(user?.displayName || `${firstName} ${lastName}`.trim()).trim();

  return {
    firstName,
    lastName,
    position: String(user?.position ?? ''),
    bio: String(user?.bio ?? ''),
    displayName,
    facebook: String(user?.facebook ?? ''),
    linkedin: String(user?.linkedin ?? ''),
    twitter: String(user?.twitter ?? ''),
    instagram: String(user?.instagram ?? ''),
    coverUrl: user?.coverUrl ?? '',
    profileUrl: user?.profileUrl ?? '',
    coverFile: null,
    avatarFile: null,
    coverPreview: '',
    avatarPreview: '',
    newPassword: '',
    repeatPassword: '',
  };
}
