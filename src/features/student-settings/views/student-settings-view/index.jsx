import { useMemo, useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useLmsUser } from 'src/hooks/use-lms';

import { CONFIG } from 'src/global-config';
import { getLmsSanctumToken } from 'src/lib/lms-sanctum-session';
import { StudentWorkspaceShell } from 'src/features/student-profile/components/student-workspace-shell';
import {
  patchLmsUser,
  getLmsAxiosFieldErrors,
  getLmsAxiosErrorMessage,
} from 'src/redux/api/lmsApi';

import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';
import { mapLmsUserToAuthSessionUser } from 'src/auth/context/jwt/laravel-lms-api';

import { styles } from './styles';
import { StudentSettingsAvatarPanel } from '../../components/student-settings-avatar-panel';
import { StudentSettingsProfileFields } from '../../components/student-settings-profile-fields';
import { StudentSettingsPasswordFields } from '../../components/student-settings-password-fields';
import {
  maxBirthdayForAge18,
  validateStudentProfileFields,
} from '../../student-profile-validation';

function splitName(displayName = '') {
  const trimmed = String(displayName).trim();
  if (!trimmed) {
    return { firstName: '', lastName: '' };
  }
  const [firstName = '', ...rest] = trimmed.split(/\s+/);

  return {
    firstName,
    lastName: rest.join(' '),
  };
}

function buildInitialValues(user) {
  const nameParts = splitName(user?.displayName);

  return {
    firstName: nameParts.firstName,
    lastName: nameParts.lastName,
    phoneNumber: user?.phoneNumber ?? '',
    birthday: user?.birthday ?? '',
    schoolHeld: user?.schoolHeld ?? '',
    watermarkName: user?.watermarkName ?? user?.displayName ?? '',
    newPassword: '',
    repeatPassword: '',
  };
}

export function StudentSettingsView() {
  const { user, mutate: mutateUser } = useLmsUser();
  const { checkUserSession } = useAuthContext();
  const [values, setValues] = useState(() => buildInitialValues(user));
  const [fieldErrors, setFieldErrors] = useState({});
  const [showFieldErrors, setShowFieldErrors] = useState(false);
  const [saving, setSaving] = useState(false);
  const maxBirthday = useMemo(() => maxBirthdayForAge18(), []);

  useEffect(() => {
    setValues((current) => ({
      ...buildInitialValues(user),
      newPassword: current.newPassword,
      repeatPassword: current.repeatPassword,
    }));
  }, [user]);

  const initials = `${values.firstName?.[0] ?? ''}${values.lastName?.[0] ?? ''}`.toUpperCase();

  const handleChange = (field, nextValue) => {
    setValues((current) => ({ ...current, [field]: nextValue }));

    if (showFieldErrors && (field === 'phoneNumber' || field === 'birthday')) {
      setFieldErrors(
        validateStudentProfileFields({
          phoneNumber: field === 'phoneNumber' ? nextValue : values.phoneNumber,
          birthday: field === 'birthday' ? nextValue : values.birthday,
        })
      );
      return;
    }

    setFieldErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }
      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const displayFieldErrors = useMemo(() => {
    if (!showFieldErrors) {
      return {};
    }

    return {
      ...validateStudentProfileFields({
        phoneNumber: values.phoneNumber,
        birthday: values.birthday,
      }),
      ...fieldErrors,
    };
  }, [fieldErrors, showFieldErrors, values.birthday, values.phoneNumber]);

  const passwordMismatch =
    Boolean(values.newPassword || values.repeatPassword) &&
    values.newPassword !== values.repeatPassword;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (passwordMismatch) {
      toast.error('Passwords do not match.');
      return;
    }

    if (values.newPassword && values.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    setShowFieldErrors(true);

    const nextFieldErrors = validateStudentProfileFields({
      phoneNumber: values.phoneNumber,
      birthday: values.birthday,
    });
    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      toast.error('Please fix the highlighted fields.');
      return;
    }

    setFieldErrors({});

    setSaving(true);
    try {
      const payload = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phoneNumber: values.phoneNumber.trim() || null,
        birthday: values.birthday || null,
        schoolHeld: values.schoolHeld.trim() || null,
        watermarkName: (values.watermarkName ?? '').trim() || values.firstName.trim(),
      };

      if (values.newPassword) {
        payload.password = values.newPassword;
        payload.password_confirmation = values.repeatPassword;
      }

      let updatedUser;
      if (CONFIG.serverUrl?.trim()) {
        updatedUser = await patchLmsUser(payload);
      } else {
        updatedUser = {
          ...user,
          displayName: `${payload.firstName} ${payload.lastName}`.trim(),
          phoneNumber: payload.phoneNumber ?? '',
          birthday: payload.birthday ?? '',
          schoolHeld: payload.schoolHeld ?? '',
          watermarkName: payload.watermarkName ?? '',
        };
      }

      const token = getLmsSanctumToken();
      const sessionUser = mapLmsUserToAuthSessionUser(updatedUser, token);
      if (sessionUser) {
        await checkUserSession?.();
      }

      await mutateUser?.();

      setValues((current) => ({
        ...buildInitialValues(updatedUser ?? user),
        newPassword: '',
        repeatPassword: '',
      }));

      setShowFieldErrors(false);
      setFieldErrors({});
      toast.success('Profile saved.');
    } catch (error) {
      const apiFieldErrors = getLmsAxiosFieldErrors(error);
      if (Object.keys(apiFieldErrors).length > 0) {
        setShowFieldErrors(true);
        setFieldErrors(apiFieldErrors);
      }
      toast.error(getLmsAxiosErrorMessage(error, 'Could not save profile.'));
    } finally {
      setSaving(false);
    }
  };

  const canSave = useMemo(
    () => Boolean(values.firstName.trim()) && !passwordMismatch && !saving,
    [passwordMismatch, saving, values.firstName]
  );

  return (
    <StudentWorkspaceShell>
      <Stack component="form" spacing={4} onSubmit={handleSubmit}>
        <Typography variant="h3" sx={styles.pageTitle}>
          Profile
        </Typography>

        <StudentSettingsAvatarPanel initials={initials} />

        <StudentSettingsProfileFields
          values={values}
          errors={displayFieldErrors}
          maxBirthday={maxBirthday}
          onChange={handleChange}
        />

        <StudentSettingsPasswordFields values={values} onChange={handleChange} />

        <Button type="submit" variant="contained" sx={styles.saveButton} disabled={!canSave}>
          Save Changes
        </Button>
      </Stack>
    </StudentWorkspaceShell>
  );
}
