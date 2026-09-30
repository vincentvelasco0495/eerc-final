import 'src/global.css';

import { SWRConfig } from 'swr';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';

import { usePathname } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';
import { queryClient } from 'src/lib/query-client';
import { LocalizationProvider } from 'src/locales';
import { themeConfig, ThemeProvider } from 'src/theme';
import { I18nProvider } from 'src/locales/i18n-provider';
import { ReduxFlashBridge, configureAppStore } from 'src/app/store';

import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { CheckoutProvider } from 'src/sections/checkout/context';

import { AuthProvider as JwtAuthProvider } from 'src/auth/context/jwt';
import { AuthProvider as Auth0AuthProvider } from 'src/auth/context/auth0';
import { AuthProvider as AmplifyAuthProvider } from 'src/auth/context/amplify';
import { AuthProvider as SupabaseAuthProvider } from 'src/auth/context/supabase';
import { AuthProvider as FirebaseAuthProvider } from 'src/auth/context/firebase';

const store = configureAppStore();

const AuthProvider =
  (CONFIG.auth.method === 'amplify' && AmplifyAuthProvider) ||
  (CONFIG.auth.method === 'firebase' && FirebaseAuthProvider) ||
  (CONFIG.auth.method === 'supabase' && SupabaseAuthProvider) ||
  (CONFIG.auth.method === 'auth0' && Auth0AuthProvider) ||
  JwtAuthProvider;

function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function StoreBootstrapper({ children }) {
  return (
    <>
      <ReduxFlashBridge />
      {children}
    </>
  );
}

export default function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
      <SWRConfig value={{ revalidateOnFocus: false }}>
        <StoreBootstrapper>
          <I18nProvider>
            <AuthProvider>
              <SettingsProvider defaultSettings={defaultSettings}>
                <LocalizationProvider>
                  <ThemeProvider
                    modeStorageKey={themeConfig.modeStorageKey}
                    defaultMode={themeConfig.defaultMode}
                  >
                    <MotionLazy>
                      <CheckoutProvider>
                        <ScrollToTop />
                        <Snackbar />
                        <ProgressBar />
                        <SettingsDrawer defaultSettings={defaultSettings} />
                        {children}
                      </CheckoutProvider>
                    </MotionLazy>
                  </ThemeProvider>
                </LocalizationProvider>
              </SettingsProvider>
            </AuthProvider>
          </I18nProvider>
        </StoreBootstrapper>
      </SWRConfig>
      </QueryClientProvider>
    </Provider>
  );
}
