import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useLmsUser } from 'src/hooks/use-lms';

import { resolveApiAssetUrl } from 'src/utils/resolve-api-asset-url';

import { CONFIG } from 'src/global-config';
import { getInstructorNameInitials } from 'src/features/instructor-profile/instructor-profile-data';
import {
  patchLmsUser,
  getLmsAxiosFieldErrors,
  getLmsAxiosErrorMessage,
} from 'src/redux/api/lmsApi';
import { InstructorWorkspaceShell } from 'src/features/instructor-profile/components/instructor-workspace-shell';

import { toast } from 'src/components/snackbar';

import { useAuthContext } from 'src/auth/hooks';

import { styles } from './styles';
import { getInstructorSettingsInitialValues } from '../../instructor-settings-defaults';
import { InstructorSettingsBannerAvatar } from '../../components/instructor-settings-banner-avatar';
import { InstructorSettingsProfileFields } from '../../components/instructor-settings-profile-fields';
import { InstructorSettingsSocialsFields } from '../../components/instructor-settings-socials-fields';
import { InstructorSettingsPasswordFields } from '../../components/instructor-settings-password-fields';

function buildDisplayOptions(firstName, lastName, currentDisplayName) {
  const fullName = `${firstName} ${lastName}`.trim();
  const firstNameOnly = firstName || '';
  const initialFormat = lastName
    ? `${firstName} ${lastName.charAt(0).toUpperCase()}.`
    : firstNameOnly;

  return [currentDisplayName, fullName, firstNameOnly, initialFormat].filter(
    (option, index, items) => option && items.indexOf(option) === index
  );
}

function revokeIfBlob(url) {
  if (typeof url === 'string' && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

export function InstructorSettingsView() {
  const { user, checkUserSession } = useAuthContext();
  const { mutate: mutateUser } = useLmsUser();
  const hydratedUserIdRef = useRef(null);
  const [values, setValues] = useState(() => getInstructorSettingsInitialValues(user));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      return;
    }
    setValues((current) => {
      const hasLocalEdits = Boolean(
        current.coverFile || current.avatarFile || current.newPassword || current.repeatPassword
      );
      const formIsBlank =
        !current.firstName &&
        !current.lastName &&
        !current.position &&
        !current.bio &&
        !current.coverFile &&
        !current.avatarFile;
      if (hydratedUserIdRef.current === user.id && (hasLocalEdits || !formIsBlank)) {
        return current;
      }
      hydratedUserIdRef.current = user.id;
      revokeIfBlob(current.coverPreview);
      revokeIfBlob(current.avatarPreview);
      return getInstructorSettingsInitialValues(user);
    });
  }, [user]);

  useEffect(
    () => () => {
      revokeIfBlob(values.coverPreview);
      revokeIfBlob(values.avatarPreview);
    },
    [values.avatarPreview, values.coverPreview]
  );

  const displayOptions = useMemo(
    () => buildDisplayOptions(values.firstName, values.lastName, values.displayName),
    [values.displayName, values.firstName, values.lastName]
  );

  const profileInitials = useMemo(
    () => getInstructorNameInitials(values.displayName || `${values.firstName} ${values.lastName}`),
    [values.displayName, values.firstName, values.lastName]
  );

  const coverSrc = values.coverPreview || resolveApiAssetUrl(values.coverUrl);
  const avatarSrc = values.avatarPreview || resolveApiAssetUrl(values.profileUrl);

  const handleChange = (field, nextValue) => {
    setValues((current) => ({ ...current, [field]: nextValue }));
  };

  const handleCoverFile = useCallback((file) => {
    setValues((current) => {
      revokeIfBlob(current.coverPreview);
      return {
        ...current,
        coverFile: file,
        coverPreview: URL.createObjectURL(file),
      };
    });
  }, []);

  const handleAvatarFile = useCallback((file) => {
    setValues((current) => {
      revokeIfBlob(current.avatarPreview);
      return {
        ...current,
        avatarFile: file,
        avatarPreview: URL.createObjectURL(file),
      };
    });
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    if (values.newPassword && values.newPassword !== values.repeatPassword) {
      toast.error('New password and repeat password do not match.');
      return;
    }
    if (values.newPassword && values.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    const firstName = values.firstName.trim();
    if (!firstName) {
      toast.error('First name is required.');
      return;
    }

    const displayName =
      values.displayName.trim() || `${firstName} ${values.lastName.trim()}`.trim();
    const payload = {
      firstName,
      lastName: values.lastName.trim(),
      displayName,
      watermarkName: displayName,
      position: values.position.trim(),
      bio: values.bio.trim(),
      facebook: values.facebook.trim(),
      linkedin: values.linkedin.trim(),
      twitter: values.twitter.trim(),
      instagram: values.instagram.trim(),
    };
    if (values.newPassword) {
      payload.password = values.newPassword;
      payload.password_confirmation = values.repeatPassword;
    }

    if (!CONFIG.serverUrl?.trim()) {
      toast.success('Profile changes saved (demo).');
      return;
    }

    setSaving(true);
    try {
      const hasFiles = Boolean(values.coverFile || values.avatarFile);
      let requestBody = payload;
      if (hasFiles) {
        const form = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          form.append(key, value ?? '');
        });
        if (values.avatarFile) {
          form.append('profileImage', values.avatarFile);
        }
        if (values.coverFile) {
          form.append('coverImage', values.coverFile);
        }
        requestBody = form;
      }

      const updatedUser = await patchLmsUser(requestBody);
      hydratedUserIdRef.current = updatedUser?.id ?? user?.id ?? hydratedUserIdRef.current;
      setValues((current) => {
        revokeIfBlob(current.coverPreview);
        revokeIfBlob(current.avatarPreview);
        return getInstructorSettingsInitialValues(updatedUser ?? user);
      });
      toast.success('Profile saved.');
      await checkUserSession?.();
      mutateUser?.();
    } catch (error) {
      const apiFieldErrors = getLmsAxiosFieldErrors(error);
      const firstFieldError = Object.values(apiFieldErrors)[0];
      toast.error(
        (typeof firstFieldError === 'string' && firstFieldError) ||
          getLmsAxiosErrorMessage(error, 'Could not save profile.')
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <InstructorWorkspaceShell>
      <Stack spacing={4} component="form" onSubmit={handleSave}>
        <Typography variant="h3" sx={styles.pageTitle}>
          Profile
        </Typography>

        <InstructorSettingsBannerAvatar
          initials={profileInitials}
          coverSrc={coverSrc}
          avatarSrc={avatarSrc}
          disabled={saving}
          onCoverFile={handleCoverFile}
          onAvatarFile={handleAvatarFile}
        />

        <InstructorSettingsProfileFields
          values={values}
          displayOptions={displayOptions}
          onChange={handleChange}
        />

        <InstructorSettingsSocialsFields values={values} onChange={handleChange} />

        <InstructorSettingsPasswordFields values={values} onChange={handleChange} />

        <Button type="submit" variant="contained" sx={styles.saveButton} disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </Stack>
    </InstructorWorkspaceShell>
  );
}
