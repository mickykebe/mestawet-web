import { getJSON } from 'app/utils';

export function getArticle(id) {
    return getJSON(`/api/articles/${id}`);
}