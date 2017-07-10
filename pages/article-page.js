import { configureStore } from '../dallol-web/src/app/store';
import { sourcesNormalizer, articleNormalizer } from '../dallol-web/src/app/normalizers';
import { SOURCES_FETCH_RESULT_ACTIONS } from '../dallol-web/src/home/actions';
import { ARTICLE_FETCH_RESULT_ACTIONS } from '../dallol-web/src/article/actions';

const he = require('he');
const PostsController = require('../controllers/posts-controller');
const SourcesController = require('../controllers/sources-controller');
const { buildOGMetas, fetchClientPostUrl } = require('../utils');
const pageHtml = require('./page-helpers');

function articlePage(articleId, url, matchedPath) {
  const store = configureStore();
  return SourcesController.get()
    .then((sourceDocs) => {
      const sources = sourceDocs.map(sourceDoc => sourceDoc.toObject());
      store.dispatch({
        type: SOURCES_FETCH_RESULT_ACTIONS.SUCCESS,
        data: sourcesNormalizer(sources),
      });
      return PostsController.getArticle(articleId);
    })
    .then((postDoc) => {
      const post = postDoc.toObject();
      store.dispatch({ type: ARTICLE_FETCH_RESULT_ACTIONS.SUCCESS, data: articleNormalizer(post) });
      const metas = buildOGMetas({
        ogType: 'article',
        ogTitle: he.encode(post.title),
        ogUrl: fetchClientPostUrl(post),
        ogDescription: he.encode(post.description),
        ogImage: encodeURI(post.thumbnailUrl),
      });
      const html = pageHtml(metas, url, store, matchedPath);
      return html;
    });
}

module.exports = articlePage;
