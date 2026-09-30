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

const initialState = {
  initialized: false,
  user: null,
  token: null,
  flash: null,
  loginLoading: false,
  loginSuccess: false,
  loginError: null,
  logoutLoading: false,
  logoutSuccess: false,
  logoutError: null,
};

export function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_RESET:
      return { ...initialState };
    case AUTH_LOGIN_REQUEST:
      return { ...state, loginLoading: true, loginSuccess: false, loginError: null };
    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        initialized: true,
        user: action.payload?.user ?? null,
        token: action.payload?.token ?? null,
        loginLoading: false,
        loginSuccess: true,
      };
    case AUTH_LOGIN_FAILURE:
      return { ...state, loginLoading: false, loginSuccess: false, loginError: action.payload };
    case AUTH_LOGOUT_REQUEST:
      return { ...state, logoutLoading: true, logoutSuccess: false, logoutError: null };
    case AUTH_LOGOUT_SUCCESS:
      return {
        ...state,
        initialized: true,
        user: null,
        token: null,
        logoutLoading: false,
        logoutSuccess: true,
      };
    case AUTH_LOGOUT_FAILURE:
      return { ...state, logoutLoading: false, logoutSuccess: false, logoutError: action.payload };
    case AUTH_FLASH_SET:
      return { ...state, flash: action.payload };
    case AUTH_FLASH_CLEAR:
      return { ...state, flash: null };
    default:
      return state;
  }
}
