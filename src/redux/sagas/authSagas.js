import { all, put, call, takeLatest } from 'redux-saga/effects';

import { apiErrorHandler } from 'src/redux/utils/apiErrorHandler';
import { authLoginApi, authLogoutApi } from 'src/redux/api/authApi';
import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGOUT_REQUEST,
} from 'src/redux/constants/authTypes';
import {
  authFlashSet,
  authLoginFailure,
  authLoginSuccess,
  authLogoutFailure,
  authLogoutSuccess,
} from 'src/redux/actions/authActions';

function* authLoginSaga(action) {
  try {
    const data = yield call(authLoginApi, action.payload ?? {});
    yield put(authLoginSuccess(data ?? {}));
    yield put(authFlashSet({ severity: 'success', message: 'Signed in successfully.' }));
  } catch (error) {
    yield put(authLoginFailure(apiErrorHandler(error, 'Could not sign in.')));
  }
}

function* authLogoutSaga(action) {
  try {
    yield call(authLogoutApi, action.payload ?? {});
    yield put(authLogoutSuccess({}));
    yield put(authFlashSet({ severity: 'success', message: 'Signed out successfully.' }));
  } catch (error) {
    yield put(authLogoutFailure(apiErrorHandler(error, 'Could not sign out.')));
  }
}

export function* authSagas() {
  yield all([
    takeLatest(AUTH_LOGIN_REQUEST, authLoginSaga),
    takeLatest(AUTH_LOGOUT_REQUEST, authLogoutSaga),
  ]);
}
