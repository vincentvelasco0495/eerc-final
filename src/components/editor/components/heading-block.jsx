import { useMemo, useCallback } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { usePopover } from 'minimal-shared/hooks';

import Menu from '@mui/material/Menu';
import { listClasses } from '@mui/material/List';
import ButtonBase, { buttonBaseClasses } from '@mui/material/ButtonBase';

import { Iconify } from '../../iconify';
import { ToolbarItem } from './toolbar-item';

// ----------------------------------------------------------------------

const HEADING_OPTIONS = [
  { label: 'Paragraph', level: null },
  { label: 'Heading 1', level: 1 },
  { label: 'Heading 2', level: 2 },
  { label: 'Heading 3', level: 3 },
  { label: 'Heading 4', level: 4 },
  { label: 'Heading 5', level: 5 },
  { label: 'Heading 6', level: 6 },
];

export function HeadingBlock({ editor, isActive, variant = 'default' }) {
  const { anchorEl, open, onOpen, onClose } = usePopover();

  const selectedOption = useMemo(
    () => HEADING_OPTIONS.find((option) => isActive(option.level)),
    [isActive]
  );

  const handleSelect = useCallback(
    (value) => {
      onClose();
      if (value) {
        editor.chain().focus().toggleHeading({ level: value }).run();
      } else {
        editor.chain().focus().setParagraph().run();
      }
    },
    [editor, onClose]
  );

  const buttonId = 'heading-menu-button';
  const menuId = 'heading-menu';

  const buttonProps = {
    id: buttonId,
    'aria-label': 'Heading menu',
    'aria-controls': open ? menuId : undefined,
    'aria-haspopup': 'true',
    'aria-expanded': open ? 'true' : undefined,
  };

  return (
    <>
      <ButtonBase
        {...buttonProps}
        onClick={onOpen}
        sx={(theme) => ({
          px: 1,
          width: variant === 'tinymce' ? 128 : 120,
          height: variant === 'tinymce' ? 26 : 32,
          borderRadius:
            variant === 'tinymce' ? '6px' : Number(theme.shape.borderRadius) * 0.75,
          typography: variant === 'tinymce' ? 'caption' : 'body2',
          fontWeight: variant === 'tinymce' ? 600 : 'fontWeightMedium',
          justifyContent: 'space-between',
          color: theme.vars.palette.text.primary,
          border:
            variant === 'tinymce'
              ? `1px solid ${theme.vars.palette.brand.borderSubtle}`
              : `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
          backgroundColor: variant === 'tinymce' ? theme.vars.palette.brand.surface : undefined,
        })}
      >
        {selectedOption?.label ?? 'Paragraph'}
        <Iconify
          width={variant === 'tinymce' ? 14 : 16}
          icon={open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
        />
      </ButtonBase>

      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        slotProps={{
          list: { 'aria-labelledby': buttonId },
          paper: {
            sx: {
              width: variant === 'tinymce' ? 128 : 120,
              [`& .${listClasses.root}`]: { gap: 0.5, display: 'flex', flexDirection: 'column' },
              [`& .${buttonBaseClasses.root}`]: {
                px: 1,
                width: 1,
                height: 34,
                borderRadius: 0.75,
                justifyContent: 'flex-start',
                '&:hover': { backgroundColor: 'action.hover' },
              },
            },
          },
        }}
      >
        {HEADING_OPTIONS.map((option) => (
          <ToolbarItem
            key={option.label}
            component="li"
            aria-label={option.label}
            label={option.label}
            active={isActive(option.level)}
            onClick={() => handleSelect(option.level)}
            sx={{
              ...(option.level && {
                fontSize: 18 - option.level,
                fontWeight: 'fontWeightBold',
              }),
            }}
          />
        ))}
      </Menu>
    </>
  );
}
