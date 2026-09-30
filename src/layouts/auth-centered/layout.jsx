import { merge } from 'es-toolkit';

import Alert from '@mui/material/Alert';

import { CONFIG } from 'src/global-config';

import { Logo } from 'src/components/logo';

import { AuthCenteredContent } from './content';
import { Footer } from '../components/site-footer';
import { MainSection, LayoutSection, HeaderSection } from '../core';

// ----------------------------------------------------------------------

export function AuthCenteredLayout({ sx, cssVars, children, slotProps, layoutQuery = 'md' }) {
  const renderHeader = () => {
    const headerSlotProps = { container: { maxWidth: false } };

    const headerSlots = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      leftArea: (
        <>
          {/** @slot Logo */}
          <Logo />
        </>
      ),
      rightArea: null,
    };

    return (
      <HeaderSection
        disableElevation
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={[
          { position: { [layoutQuery]: 'fixed' } },
          ...(Array.isArray(slotProps?.header?.sx) ? slotProps.header.sx : [slotProps?.header?.sx]),
        ]}
      />
    );
  };

  const renderFooter = () => <Footer layoutQuery={layoutQuery} sx={slotProps?.footer?.sx} />;

  const renderMain = () => (
    <MainSection
      {...slotProps?.main}
      sx={[
        (theme) => ({
          alignItems: 'center',
          p: theme.spacing(3, 2, 10, 2),
          [theme.breakpoints.up(layoutQuery)]: {
            justifyContent: 'center',
            p: theme.spacing(10, 0, 10, 0),
          },
        }),
        ...(Array.isArray(slotProps?.main?.sx) ? slotProps.main.sx : [slotProps?.main?.sx]),
      ]}
    >
      <AuthCenteredContent {...slotProps?.content}>{children}</AuthCenteredContent>
    </MainSection>
  );

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={{ '--layout-auth-content-width': '420px', ...cssVars }}
      sx={[
        (theme) => ({
          position: 'relative',
          '&::before': backgroundStyles(theme),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {renderMain()}
    </LayoutSection>
  );
}

// ----------------------------------------------------------------------

const backgroundStyles = (theme) => ({
  ...theme.mixins.bgGradient({
    images: [`url(${CONFIG.assetsDir}/assets/background/background-3-blur.webp)`],
  }),
  zIndex: 1,
  opacity: 0.08,
  width: '100%',
  height: '100%',
  content: "''",
  position: 'absolute',
});
