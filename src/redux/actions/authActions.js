import {
  AUTH_RESET,
  AUTH_FLASH_SET,
  AUTH_FLASH_CLEAR,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGOUT_REQUEST,
  AUTH_LOGOUT_SUCCESS,
  AUTH_LOGOUT_FAILURE,
} from 'src/redux/constants/authTypes';

export const authReset = () => ({ type: AUTH_RESET });

export const authLoginRequest = (payload) => ({ type: AUTH_LOGIN_REQUEST, payload });
export const authLoginSuccess = (payload) => ({ type: AUTH_LOGIN_SUCCESS, payload });
export const authLoginFailure = (payload) => ({ type: AUTH_LOGIN_FAILURE, payload });

export const authLogoutRequest = (payload) => ({ type: AUTH_LOGOUT_REQUEST, payload });
export const authLogoutSuccess = (payload) => ({ type: AUTH_LOGOUT_SUCCESS, payload });
export const authLogoutFailure = (payload) => ({ type: AUTH_LOGOUT_FAILURE, payload });

export const authFlashSet = (payload) => ({ type: AUTH_FLASH_SET, payload });
export const authFlashClear = () => ({ type: AUTH_FLASH_CLEAR });
