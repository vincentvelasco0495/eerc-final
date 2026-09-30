import createSagaMiddleware from 'redux-saga';
import { compose, createStore, applyMiddleware } from 'redux';

import { rootSaga } from 'src/redux/sagas/rootSaga';
import { rootReducer } from 'src/redux/reducers/rootReducer';

export function configureReduxStore() {
  const sagaMiddleware = createSagaMiddleware();
  const composeEnhancers =
    (typeof window !== 'undefined' &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
    compose;
  const enhancers = composeEnhancers(applyMiddleware(sagaMiddleware));
  const store = createStore(rootReducer, enhancers);
  sagaMiddleware.run(rootSaga);
  return store;
}
