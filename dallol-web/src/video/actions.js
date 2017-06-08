import { normalize } from 'normalizr';
import { resultActions, fetchApi } from 'app/actions';
import schemas from 'app/normalizerSchemas';

export const VIDEO_FETCH_RESULT_ACTIONS = resultActions('VIDEO_FETCH');

export const fetchVideo = (id, ...nextActions) => {
  return (dispatch) => {
    dispatch(fetchApi({
      url: `/api/videos/${id}`,
      resultActions: VIDEO_FETCH_RESULT_ACTIONS,
      normalizer: (data) => normalize(data, schemas[`${data.kind}s`]),
      nextActions,
    }));
  }
}

