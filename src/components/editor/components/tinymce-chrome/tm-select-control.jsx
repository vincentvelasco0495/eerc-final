import { usePopover } from 'minimal-shared/hooks';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { listClasses } from '@mui/material/List';
import ButtonBase, { buttonBaseClasses } from '@mui/material/ButtonBase';

import { Iconify } from 'src/components/iconify';

import { TINYMCE } from './tinymce-theme';

export function TmSelectControl({
  label,
  /** Shown on the closed control (e.g. "Arial"). */
  displayValue,
  /** Option `value` for `selected` state (e.g. font stack or ''). */
  selectedValue,
  options,
  onSelect,
  minWidth = 124,
}) {
  const { anchorEl, open, onOpen, onClose } = usePopover();

  return (
    <>
      <ButtonBase
        onClick={onOpen}
        sx={(theme) => ({
          px: 0.75,
          gap: 0,
          minWidth: { xs: 108, sm: minWidth },
          height: { xs: 36, sm: TINYMCE.controlHeight },
          justifyContent: 'space-between',
          borderRadius: TINYMCE.buttonRadius,
          typography: 'caption',
          fontWeight: 600,
          color: 'text.primary',
          border: `1px solid ${TINYMCE.border}`,
          backgroundColor: theme.vars.palette.brand.surface,
        })}
      >
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'left',
            flex: 1,
          }}
        >
          {displayValue || label}
        </span>
        <Iconify width={14} icon={open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'} />
      </ButtonBase>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        slotProps={{
          paper: {
            sx: {
              minWidth,
              [`& .${listClasses.root}`]: { py: 0.5 },
              [`& .${buttonBaseClasses.root}`]: {
                width: 1,
                justifyContent: 'flex-start',
                px: 1.5,
                py: 0.75,
                typography: 'body2',
                borderRadius: 0.5,
                '&:hover': { backgroundColor: 'action.hover' },
              },
            },
          },
        }}
      >
        {options.map((opt) => (
          <MenuItem
            key={opt.value || opt.label}
            dense
            selected={opt.value === selectedValue}
            onClick={() => {
              onSelect(opt.value);
              onClose();
            }}
            sx={(theme) => ({
              fontFamily: opt.cssFamily,
              ...(opt.value === '' && { color: theme.vars.palette.text.primary }),
            })}
          >
            {opt.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
