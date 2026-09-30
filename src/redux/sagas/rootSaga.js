import { all } from 'redux-saga/effects';

import { lmsSagas } from 'src/redux/sagas/lmsSagas';
import { authSagas } from 'src/redux/sagas/authSagas';

export function* rootSaga() {
  yield all([authSagas(), lmsSagas()]);
}
