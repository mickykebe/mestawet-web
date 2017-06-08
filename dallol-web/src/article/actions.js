import { normalize } from 'normalizr';
import { resultActions, fetchApi } from 'app/actions';
import schemas from 'app/normalizerSchemas';

export const ARTICLE_FETCH_RESULT_ACTIONS = resultActions('ARTICLE_FETCH');

export const fetchArticle = (id, ...nextActions) => {
  return (dispatch) => {
    dispatch(fetchApi({
      url: `/api/articles/${id}`,
      resultActions: ARTICLE_FETCH_RESULT_ACTIONS,
      normalizer: (data) => normalize(data, schemas[`${data.kind}s`]),
      nextActions,
    }));
  }
}