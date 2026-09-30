export const selectAuthState = (state) => state.auth;
export const selectAuthUser = (state) => state.auth?.user ?? null;
export const selectAuthToken = (state) => state.auth?.token ?? null;
export const selectAuthFlash = (state) => state.auth?.flash ?? null;

export const selectAuthLoginStatus = (state) => ({
  loading: Boolean(state.auth?.loginLoading),
  success: Boolean(state.auth?.loginSuccess),
  error: state.auth?.loginError ?? null,
});

export const selectAuthLogoutStatus = (state) => ({
  loading: Boolean(state.auth?.logoutLoading),
  success: Boolean(state.auth?.logoutSuccess),
  error: state.auth?.logoutError ?? null,
});
