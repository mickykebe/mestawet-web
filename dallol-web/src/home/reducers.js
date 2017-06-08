import { HOME_POSTS_FETCH_RESULT_ACTIONS, SOURCES_FETCH_RESULT_ACTIONS } from './actions';

const getIdsFromNormalizedData = (result, schemaName) => {
  return result
    .filter((post) => post.schema === schemaName)
    .map((post) => post.id);
}

const youtubeVideos = (state = [], action) => {
  switch(action.type){
    case HOME_POSTS_FETCH_RESULT_ACTIONS.SUCCESS: {
      const { result } = action.data.posts;
      const videoIds = getIdsFromNormalizedData(result, 'youtubeVideos');
      return [...state, ...videoIds ];
    }
    default:
      return state;
  }
}

const articles = (state = [], action) => {
  switch(action.type) {
    case HOME_POSTS_FETCH_RESULT_ACTIONS.SUCCESS: {
      const { result } = action.data.posts;
      const articleIds = getIdsFromNormalizedData(result, 'articles');
      return [...state, ...articleIds];
    }
    default:
      return state;
  }
}

const home = (state = {
  hasMore: true,
  youtubeVideos: [],
  articles: [],
  nextOffset: 0,
}, action) => {
  switch(action.type) {
    case HOME_POSTS_FETCH_RESULT_ACTIONS.ERROR:
    case SOURCES_FETCH_RESULT_ACTIONS.ERROR: {
      return Object.assign({}, state, {
        hasMore: false,
      });
    }
    case HOME_POSTS_FETCH_RESULT_ACTIONS.SUCCESS: {
      const hasMore = state.nextOffset !== action.data.nextOffset;
      return Object.assign({}, state, {
        youtubeVideos: youtubeVideos(state.youtubeVideos, action),
        articles: articles(state.articles, action),
        nextOffset: action.data.nextOffset,
        hasMore,
      });
    }
    default:
      return state;
  }
};

export default home;