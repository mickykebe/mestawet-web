import { resultActions, fetchApi } from 'app/actions';
import { articleNormalizer } from 'app/normalizers';

export const ARTICLE_FETCH_RESULT_ACTIONS = resultActions('ARTICLE_FETCH');

export const fetchArticle = (id, ...nextActions) => {
  return (dispatch) => {
    dispatch(fetchApi({
      url: `/api/articles/${id}`,
      resultActions: ARTICLE_FETCH_RESULT_ACTIONS,
      normalizer: articleNormalizer,
      nextActions,
    }));
  }
}