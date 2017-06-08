import { schema, normalize } from 'normalizr';
import { resultActions, fetchApi } from 'app/actions';
import { sourcesSchema, postsSchema } from 'app/normalizerSchemas';

export const HOME_POSTS_FETCH_RESULT_ACTIONS = resultActions('HOME_POSTS_FETCH');
export const SOURCES_FETCH_RESULT_ACTIONS = resultActions('SOURCES_FETCH');

export const fetchHomePosts = (offset = 0, ...nextActions) => {
  return (dispatch) => {
    dispatch(fetchApi({
      url: `/api/posts?offset=${offset}`,
      resultActions: HOME_POSTS_FETCH_RESULT_ACTIONS,
      normalizer: (data) => Object.assign({}, data, { posts: normalize(data.posts, postsSchema) }),
      nextActions,
    }));
  }
}

export const fetchHomeNextPosts = (...nextActions) => {
  return (dispatch, getState) => {
    const { nextOffset } = getState().home;
    return dispatch(fetchHomePosts(nextOffset, ...nextActions));
  }
}

export const fetchSources = (...nextActions) => {
  return (dispatch) => {
    dispatch(fetchApi({
      url: '/api/sources',
      resultActions: SOURCES_FETCH_RESULT_ACTIONS,
      normalizer: (data) => normalize(data, new schema.Array(sourcesSchema)),
      nextActions,
    }));
  }
}