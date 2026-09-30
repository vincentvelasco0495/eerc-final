import { useRef } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';

const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp';

/**
 * Cover + profile header: dashed empty cover, upload control, avatar centered
 * on the cover bottom (half the circle above the line, half below).
 */
export function InstructorSettingsBannerAvatar({
  initials,
  coverSrc = '',
  avatarSrc = '',
  disabled = false,
  onCoverFile,
  onAvatarFile,
}) {
  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const pickCover = () => {
    if (!disabled) {
      coverInputRef.current?.click();
    }
  };

  const pickAvatar = () => {
    if (!disabled) {
      avatarInputRef.current?.click();
    }
  };

  return (
    <Box sx={styles.root}>
      <Box
        sx={[
          styles.cover,
          coverSrc
            ? {
                backgroundImage: `url(${coverSrc})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderStyle: 'solid',
              }
            : null,
        ]}
      >
        <Button
          type="button"
          variant="contained"
          size="small"
          startIcon={<Iconify icon="solar:cloud-upload-bold" width={20} />}
          aria-label="Upload cover photo"
          disabled={disabled}
          onClick={pickCover}
          sx={styles.uploadCover}
        >
          Upload Cover
        </Button>
        <input
          ref={coverInputRef}
          type="file"
          accept={IMAGE_ACCEPT}
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (file) {
              onCoverFile?.(file);
            }
          }}
        />

        <Box sx={styles.avatarAnchor}>
          <Box sx={styles.avatarInner}>
            <Avatar alt="Instructor" src={avatarSrc || undefined} sx={styles.avatar}>
              {initials}
            </Avatar>
            <IconButton
              type="button"
              size="small"
              color="primary"
              aria-label="Change profile photo"
              disabled={disabled}
              onClick={pickAvatar}
              sx={styles.avatarEditBtn}
            >
              <Iconify icon="solar:camera-bold" width={18} />
            </IconButton>
            <input
              ref={avatarInputRef}
              type="file"
              accept={IMAGE_ACCEPT}
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = '';
                if (file) {
                  onAvatarFile?.(file);
                }
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
