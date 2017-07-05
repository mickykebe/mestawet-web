import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { loadState, saveState } from 'app/localstorage';
import throttle from 'lodash/throttle';

let composeWithEnhancers = compose;
const middlewares = [];
middlewares.push(thunk);
if(process.env.NODE_ENV === 'development' && typeof window !== 'undefined'){
  middlewares.push(createLogger());
  composeWithEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}


export function configureStore(preloadedState) {
  return createStore(
    rootReducer,
    preloadedState,
    composeWithEnhancers(
      applyMiddleware(...middlewares),
    )
  );
}

const store = configureStore(loadState());
store.subscribe(throttle(() => {
  saveState({
    sources: store.getState().sources,
    videos: store.getState().videos,
    articles: store.getState().articles,
    home: {
      youtubeVideos: store.getState().home.youtubeVideos,
      articles: store.getState().home.articles,
    },
  });
}, 1000));

export default store;