import { getJSON } from '../app/utils';

export function getPosts(offset = 0) {
  return getJSON(`/api/posts?offset=${offset}`)
    .then((postsResponse) => {
      if(postsResponse.error){
        throw new Error(postsResponse.error);
      }
      return postsResponse;
    })
}

export function getSources() {
  return getJSON(`/api/sources`)
    .then((srcRes) => {
      if(srcRes.error){
        throw new Error(srcRes.error);
      }
      return srcRes;
    })
}