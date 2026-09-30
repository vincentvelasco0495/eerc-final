import { combineReducers } from 'redux';

import { authReducer } from 'src/redux/reducers/authReducer';
import { lmsReducerMap } from 'src/redux/reducers/lmsReducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  ...lmsReducerMap,
});
