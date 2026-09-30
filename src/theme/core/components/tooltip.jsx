import { parseCssVar } from 'minimal-shared/utils';

// ----------------------------------------------------------------------

const MuiTooltip = {
  // ▼▼▼▼▼▼▼▼ ⚙️ PROPS ▼▼▼▼▼▼▼▼
  defaultProps: {
    slotProps: {
      popper: {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, -4],
            },
          },
        ],
      },
    },
  },
  // ▼▼▼▼▼▼▼▼ 🎨 STYLE ▼▼▼▼▼▼▼▼
  styleOverrides: {
    // Navy tooltip with white text in both schemes — it must contrast with the surface it floats over.
    tooltip: ({ theme }) => ({
      borderRadius: Number(theme.shape.borderRadius) * 0.75,
      border: `1px solid ${theme.vars.palette.brand.borderSubtle}`,
      color: theme.vars.palette.brand.onNeutralFill,
      [parseCssVar(theme.vars.palette.Tooltip.bg)]: theme.vars.palette.brand.neutralFill,
    }),
  },
};

/* **********************************************************************
 * 🚀 Export
 * **********************************************************************/
export const tooltip = {
  MuiTooltip,
};
