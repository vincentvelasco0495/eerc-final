import { varAlpha } from 'minimal-shared/utils';

import { tableRowClasses } from '@mui/material/TableRow';
import { tableCellClasses } from '@mui/material/TableCell';

// ----------------------------------------------------------------------

const MuiTableContainer = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      ...theme.mixins.scrollbarStyles(theme),
      position: 'relative',
    }),
  },
};

const MuiTableRow = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: ({ theme }) => ({
      '@media (hover: hover)': {
        '&:hover': {
          backgroundColor: varAlpha(theme.vars.palette.primary.mainChannel, 0.05),
        },
      },
      [`&.${tableRowClasses.selected}`]: {
        backgroundColor: varAlpha(theme.vars.palette.primary.mainChannel, 0.1),
        '&:hover': {
          backgroundColor: varAlpha(theme.vars.palette.primary.mainChannel, 0.16),
        },
      },
      '&:last-of-type': {
        [`& .${tableCellClasses.root}`]: {
          border: 0,
        },
      },
    }),
  },
};

const MuiTableCell = {
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: {
      borderBottomStyle: 'solid',
    },
    head: ({ theme }) => ({
      fontSize: theme.typography.pxToRem(14),
      // Deep gold on light, bright gold on navy — bright gold on white is unreadable.
      color: theme.vars.palette.brand.accentText,
      fontWeight: theme.typography.fontWeightBold,
      backgroundColor: theme.vars.palette.brand.surface,
    }),
    stickyHeader: ({ theme }) => ({
      backgroundColor: theme.vars.palette.brand.surface,
      backgroundImage: `linear-gradient(to bottom, ${theme.vars.palette.brand.surface}, ${theme.vars.palette.brand.surface})`,
    }),
    paddingCheckbox: ({ theme }) => ({
      paddingLeft: theme.spacing(1),
    }),
  },
};

const MuiTablePagination = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    backIconButtonProps: { size: 'small' },
    nextIconButtonProps: { size: 'small' },
    slotProps: { select: { name: 'table-pagination-select' } },
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    root: { width: '100%' },
    toolbar: { height: 64 },
    actions: { marginRight: 8 },
    select: {
      display: 'flex',
      alignItems: 'center',
    },
    selectIcon: {
      right: 4,
      width: 16,
      height: 16,
      top: 'calc(50% - 8px)',
    },
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const table = {
  MuiTableRow,
  MuiTableCell,
  MuiTableContainer,
  MuiTablePagination,
};
