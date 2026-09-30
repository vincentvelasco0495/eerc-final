import { usePopover } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import ButtonBase from '@mui/material/ButtonBase';

import { Iconify } from 'src/components/iconify';

import { TINYMCE } from './tinymce-theme';

export function TmColorGridButton({ label, swatches, currentColor, onPick, marker = false }) {
  const { anchorEl, open, onOpen, onClose } = usePopover();

  return (
    <>
      <ButtonBase
        aria-label={label}
        onClick={onOpen}
        disableRipple
        sx={{
          height: TINYMCE.controlHeight,
          px: 0.5,
          gap: 0,
          borderRadius: TINYMCE.buttonRadius,
          border: `1px solid ${TINYMCE.border}`,
          backgroundColor: TINYMCE.chromeSurface,
        }}
      >
        {marker ? (
          <Iconify icon="solar:pen-bold" width={18} sx={{ color: 'text.primary' }} />
        ) : (
          <Box
            component="span"
            sx={{
              fontWeight: 800,
              fontSize: 15,
              lineHeight: 1,
              color: currentColor || 'text.primary',
              fontFamily: 'Georgia, serif',
            }}
          >
            A
          </Box>
        )}
        <Box
          sx={{
            width: 14,
            height: 3,
            borderRadius: 0.5,
            backgroundColor: marker ? currentColor || '#fef08a' : currentColor || '#000',
            alignSelf: 'flex-end',
            mb: 0.35,
          }}
        />
        <Iconify width={12} icon="eva:arrow-ios-downward-fill" sx={{ color: 'text.secondary', ml: 0 }} />
      </ButtonBase>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: { p: 1, width: 200 },
          },
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0.75 }}>
          {swatches.map((c) => (
            <ButtonBase
              key={c}
              onClick={() => {
                onPick(c);
                onClose();
              }}
              sx={{
                width: 24,
                height: 24,
                borderRadius: TINYMCE.buttonRadius,
                border: `1px solid ${TINYMCE.border}`,
                backgroundColor: c,
                '&:hover': { opacity: 0.9 },
              }}
            />
          ))}
        </Box>
        <ButtonBase
          onClick={() => {
            onPick(null);
            onClose();
          }}
          sx={{ mt: 1, typography: 'caption', color: 'brand.accentText', width: 1, justifyContent: 'center' }}
        >
          Reset
        </ButtonBase>
      </Popover>
    </>
  );
}
