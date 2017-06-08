import { combineReducers } from 'redux';
import home from 'home/reducers';
import { 
  HOME_POSTS_FETCH_RESULT_ACTIONS, 
  SOURCES_FETCH_RESULT_ACTIONS,
} from 'home/actions';
import {
  SCHEMA_NAME_YOUTUBEVIDEOS,
  SCHEMA_NAME_ARTICLES,
  SCHEMA_NAME_SOURCES
} from 'app/normalizerSchemas';
import { VIDEO_FETCH_RESULT_ACTIONS } from 'video/actions';
import { ARTICLE_FETCH_RESULT_ACTIONS } from 'article/actions';


const ui = (state = {
  isFetching: false,
  fetchError: false,
}, action) => {
  switch(action.type) {
    case HOME_POSTS_FETCH_RESULT_ACTIONS.PENDING:
    case SOURCES_FETCH_RESULT_ACTIONS.PENDING:
    case VIDEO_FETCH_RESULT_ACTIONS.PENDING:
    case ARTICLE_FETCH_RESULT_ACTIONS.PENDING: {
      return Object.assign({}, state, {
        isFetching: true,
      });
    }
    case HOME_POSTS_FETCH_RESULT_ACTIONS.ERROR:
    case SOURCES_FETCH_RESULT_ACTIONS.ERROR:
    case VIDEO_FETCH_RESULT_ACTIONS.ERROR:
    case ARTICLE_FETCH_RESULT_ACTIONS.ERROR: {
      return Object.assign({}, state, { 
        fetchError: true,
        isFetching: false,
      });
    }
    case HOME_POSTS_FETCH_RESULT_ACTIONS.SUCCESS:
    case SOURCES_FETCH_RESULT_ACTIONS.SUCCESS:
    case VIDEO_FETCH_RESULT_ACTIONS.SUCCESS:
    case ARTICLE_FETCH_RESULT_ACTIONS.SUCCESS: {
      return Object.assign({}, state, {
        isFetching: false,
        fetchError: false,
      });
    }
    default:
      return state;
  }
}

const youtubeVideos = (state = {}, action) => {
  switch(action.type) {
    case HOME_POSTS_FETCH_RESULT_ACTIONS.SUCCESS: {
      return Object.assign({}, state, action.data.posts.entities[SCHEMA_NAME_YOUTUBEVIDEOS])
    }
    case VIDEO_FETCH_RESULT_ACTIONS: {
      return Object.assign({}, state, action.data.entities[SCHEMA_NAME_YOUTUBEVIDEOS])
    }
    default:
      return state;
  }
}

const videos = (state = {
  youtubeVideos: {},
}, action) => {
  switch(action.type) {
    case HOME_POSTS_FETCH_RESULT_ACTIONS.SUCCESS:
    case VIDEO_FETCH_RESULT_ACTIONS.SUCCESS: {
      return Object.assign({}, state, {
        youtubeVideos: youtubeVideos(state.youtubeVideos, action),
      });
    }
    default:
      return state;
  }
}

const articles = (state = {}, action) => {
  switch(action.type) {
    case HOME_POSTS_FETCH_RESULT_ACTIONS.SUCCESS: {
      return Object.assign({}, state, action.data.posts.entities[SCHEMA_NAME_ARTICLES]);
    }
    case ARTICLE_FETCH_RESULT_ACTIONS.SUCCESS: {
      return Object.assign({}, state, action.data.entities[SCHEMA_NAME_ARTICLES]);
    }
    default:
      return state;
  }
}

const sources = (state = {}, action) => {
  switch(action.type) {
    case SOURCES_FETCH_RESULT_ACTIONS.SUCCESS: {
      return Object.assign({}, state, action.data.entities[SCHEMA_NAME_SOURCES])
    }
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  ui,
  home,
  sources,
  videos,
  articles,
});

export default rootReducer;