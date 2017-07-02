export const resultActions = (type) => ({
  PENDING: `${type}_PENDING`,
  SUCCESS: `${type}_SUCCESS`,
  ERROR: `${type}_ERROR`,
});

export const fetchApi = ({url, resultActions, normalizer, nextActions = []}) => {
  return (dispatch, getState) => {
    dispatch({ type: resultActions.PENDING });
    return fetch(url)
      .then(response => response.json())
      .then(response => {
        let data = response;
        if(normalizer !== undefined){
          data = normalizer(response);
        }
        dispatch({ type: resultActions.SUCCESS, data});
        if(nextActions.length > 0){
          nextActions.forEach((next) => dispatch(next(data)));
        }
      })
      .catch((error) => dispatch({ type: resultActions.ERROR }));
  }
}