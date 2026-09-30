import Fade from '@mui/material/Fade';
import { styled } from '@mui/material/styles';

// ----------------------------------------------------------------------

const NavDropdownPaper = styled('div')(({ theme }) => ({
  ...theme.mixins.paperStyles(theme, { dropdown: true }),
  padding: theme.spacing(2, 1.5, 1.5, 1.5),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  minWidth: 260,
  border: `1px solid ${theme.vars.palette.brand.borderDefault}`,
  boxShadow: theme.vars.customShadows.dropdown,
}));

// ----------------------------------------------------------------------

export const NavDropdown = styled(({ open, children, ...other }) => (
  <Fade in={open}>
    <div {...other}>
      <NavDropdownPaper>{children}</NavDropdownPaper>
    </div>
  </Fade>
))(({ theme }) => ({
  left: 0,
  marginTop: 12,
  width: 'max-content',
  maxWidth: 'min(320px, calc(100vw - 24px))',
  position: 'absolute',
  zIndex: theme.zIndex.drawer * 2,
  top: '100%',
}));
