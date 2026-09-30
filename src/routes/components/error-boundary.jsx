import { useRouteError, isRouteErrorResponse } from 'react-router';

import GlobalStyles from '@mui/material/GlobalStyles';

// ----------------------------------------------------------------------

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <>
      {inputGlobalStyles()}

      <div className={errorBoundaryClasses.root}>
        <div className={errorBoundaryClasses.container}>{renderErrorMessage(error)}</div>
      </div>
    </>
  );
}

// ----------------------------------------------------------------------

function parseStackTrace(stack) {
  if (!stack) return { filePath: null, functionName: null };

  const filePathMatch = stack.match(/\/src\/[^?]+/);
  const functionNameMatch = stack.match(/at (\S+)/);

  return {
    filePath: filePathMatch ? filePathMatch[0] : null,
    functionName: functionNameMatch ? functionNameMatch[1] : null,
  };
}

function renderErrorMessage(error) {
  if (isRouteErrorResponse(error)) {
    return (
      <>
        <h1 className={errorBoundaryClasses.title}>
          {error.status}: {error.statusText}
        </h1>
        <p className={errorBoundaryClasses.message}>{error.data}</p>
      </>
    );
  }

  if (error instanceof Error) {
    const { filePath, functionName } = parseStackTrace(error.stack);

    return (
      <>
        <h1 className={errorBoundaryClasses.title}>Unexpected Application Error!</h1>
        <p className={errorBoundaryClasses.message}>
          {error.name}: {error.message}
        </p>
        <pre className={errorBoundaryClasses.details}>{error.stack}</pre>
        {(filePath || functionName) && (
          <p className={errorBoundaryClasses.filePath}>
            {filePath} ({functionName})
          </p>
        )}
      </>
    );
  }

  return <h1 className={errorBoundaryClasses.title}>Unknown Error</h1>;
}

// ----------------------------------------------------------------------

const errorBoundaryClasses = {
  root: 'error-boundary-root',
  container: 'error-boundary-container',
  title: 'error-boundary-title',
  details: 'error-boundary-details',
  message: 'error-boundary-message',
  filePath: 'error-boundary-file-path',
};

/**
 * Prefer the scheme-aware brand variables from `global.css`, but keep literal dark
 * fallbacks: this screen has to render even when the theme or stylesheet failed to load.
 */
const cssVars = {
  '--text-color': 'var(--color-text-primary, #FFFFFF)',
  '--title-color': 'var(--color-accent-text, #FFD400)',
  '--info-color': 'var(--color-info, #7DD8FB)',
  '--warning-color': 'var(--color-warning, #FFD95C)',
  '--error-color': 'var(--color-error, #F89A9A)',
  '--error-accent-color': 'var(--color-error, #EF4444)',
  '--error-background': 'rgb(239 68 68 / 0.12)',
  '--details-background': 'var(--color-surface-dark, #041D3A)',
  '--details-border-color': 'var(--color-border-subtle, rgb(255 255 255 / 0.1))',
  '--root-background': 'var(--color-bg-primary, #001632)',
  '--container-background': 'var(--color-surface, #06244A)',
  '--font-stack-monospace':
    '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
  '--font-stack-sans':
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
};

const rootStyles = () => ({
  display: 'flex',
  flex: '1 1 auto',
  alignItems: 'center',
  padding: '10vh 15px 0',
  flexDirection: 'column',
  fontFamily: 'var(--font-stack-sans)',
});

const contentStyles = () => ({
  gap: 24,
  padding: 20,
  width: '100%',
  maxWidth: 960,
  display: 'flex',
  borderRadius: 8,
  flexDirection: 'column',
  border: '1px solid rgb(255 212 0 / 0.25)',
  backgroundColor: 'var(--container-background)',
});

const titleStyles = (theme) => ({
  margin: 0,
  lineHeight: 1.2,
  color: 'var(--title-color)',
  fontSize: theme.typography.pxToRem(20),
  fontWeight: theme.typography.fontWeightBold,
});

const messageStyles = (theme) => ({
  margin: 0,
  lineHeight: 1.5,
  padding: '12px 16px',
  whiteSpace: 'pre-wrap',
  color: 'var(--error-color)',
  fontSize: theme.typography.pxToRem(14),
  fontFamily: 'var(--font-stack-monospace)',
  backgroundColor: 'var(--error-background)',
  borderLeft: '2px solid var(--error-accent-color)',
  fontWeight: theme.typography.fontWeightBold,
});

const detailsStyles = () => ({
  margin: 0,
  padding: 16,
  lineHeight: 1.5,
  overflow: 'auto',
  borderRadius: 8,
  color: 'var(--warning-color)',
  border: '1px solid var(--details-border-color)',
  backgroundColor: 'var(--details-background)',
});

const filePathStyles = () => ({
  marginTop: 0,
  color: 'var(--info-color)',
});

const inputGlobalStyles = () => (
  <GlobalStyles
    styles={(theme) => ({
      body: {
        ...cssVars,
        margin: 0,
        color: 'var(--text-color)',
        backgroundColor: 'var(--root-background)',
        [`& .${errorBoundaryClasses.root}`]: rootStyles(),
        [`& .${errorBoundaryClasses.container}`]: contentStyles(),
        [`& .${errorBoundaryClasses.title}`]: titleStyles(theme),
        [`& .${errorBoundaryClasses.message}`]: messageStyles(theme),
        [`& .${errorBoundaryClasses.filePath}`]: filePathStyles(),
        [`& .${errorBoundaryClasses.details}`]: detailsStyles(),
      },
    })}
  />
);
