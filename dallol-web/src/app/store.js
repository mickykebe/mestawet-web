import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { loadState, saveState } from 'app/localstorage';
import throttle from 'lodash/throttle';

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