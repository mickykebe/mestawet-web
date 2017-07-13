import { configureStore } from '../dallol-web/src/app/store';
import { sourcesNormalizer, articleNormalizer } from '../dallol-web/src/app/normalizers';
import { SOURCES_FETCH_RESULT_ACTIONS } from '../dallol-web/src/home/actions';
import { ARTICLE_FETCH_RESULT_ACTIONS } from '../dallol-web/src/article/actions';

const he = require('he');
const PostsController = require('../controllers/posts-controller');
const SourcesController = require('../controllers/sources-controller');
const { buildHtmlHeaders, fetchClientPostUrl } = require('../utils');
const pageHtml = require('./page-helpers');

function articlePage(articleId, url) {
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
      const postUrl = fetchClientPostUrl(post);
      const metas = buildHtmlHeaders({
        ogType: 'article',
        ogTitle: he.encode(post.title),
        ogUrl: postUrl,
        ogDescription: post.description && he.encode(post.description),
        ogImage: encodeURI(post.thumbnailUrl),
        canonicalUrl: postUrl,
      });
      const html = pageHtml(metas, url, store);
      return html;
    });
}

module.exports = articlePage;
