import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

import { styles } from './styles';

export function QuestionCardChrome({
  collapsed,
  onToggleCollapse,
  onDelete,
  dragHandleRef,
  variant = 'default',
}) {
  const rowSx = variant === 'inline' ? styles.cardChromeInline : styles.cardActionsRow;

  return (
    <Box sx={rowSx}>
      <IconButton
        size="small"
        sx={styles.trashBtn}
        aria-label="Delete question"
        onClick={onDelete}
      >
        <Iconify icon="solar:trash-bin-trash-bold" width={18} sx={{ color: '#fff' }} />
      </IconButton>
      <IconButton
        ref={dragHandleRef}
        size="small"
        sx={styles.cardChromeBtn}
        aria-label="Drag to reorder"
      >
        <Iconify icon="solar:hamburger-menu-linear" width={20} />
      </IconButton>
      <IconButton
        size="small"
        sx={styles.cardChromeBtn}
        aria-expanded={!collapsed}
        aria-label={collapsed ? 'Expand' : 'Collapse'}
        onClick={onToggleCollapse}
      >
        <Iconify icon={collapsed ? 'solar:alt-arrow-down-linear' : 'solar:alt-arrow-up-linear'} width={20} />
      </IconButton>
    </Box>
  );
}
