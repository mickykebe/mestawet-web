import { resultActions, fetchApi } from 'app/actions';
import { videoNormalizer } from 'app/normalizers';

export const VIDEO_FETCH_RESULT_ACTIONS = resultActions('VIDEO_FETCH');

export const fetchVideo = (id, ...nextActions) => {
  return (dispatch) => {
    dispatch(fetchApi({
      url: `/api/videos/${id}`,
      resultActions: VIDEO_FETCH_RESULT_ACTIONS,
      normalizer: videoNormalizer,
      nextActions,
    }));
  }
}

export const fetchVideoIfNeeded = (id, ...nextActions) => {
  return (dispatch, getState) => {
    if(!getState().videos.youtubeVideos[id]) {
      dispatch(fetchVideo(id, ...nextActions));
    }
  };
}

