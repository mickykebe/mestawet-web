import { getJSON } from 'app/utils';

export function getPosts(offset = 0) {
  return getJSON(`/api/posts?offset=${offset}`);
}

export function getSources() {
  return getJSON(`/api/sources`);
}