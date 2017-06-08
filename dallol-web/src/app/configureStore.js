import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const middlewares = [];
middlewares.push(thunk);
if(process.env.NODE_ENV === 'development'){
  middlewares.push(createLogger());
}

function configureStore(preloadedState) {
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(...middlewares)
  );
}

export default configureStore;