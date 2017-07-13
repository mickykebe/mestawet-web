import { configureStore } from '../dallol-web/src/app/store';
import { sourcesNormalizer, homeNormalizer } from '../dallol-web/src/app/normalizers';
import { SOURCES_FETCH_RESULT_ACTIONS, HOME_POSTS_FETCH_RESULT_ACTIONS } from '../dallol-web/src/home/actions';

const PostsController = require('../controllers/posts-controller');
const SourcesController = require('../controllers/sources-controller');
const { buildHtmlHeaders } = require('../utils');
const pageHtml = require('./page-helpers');

module.exports = (url) => {
  const store = configureStore();
  return SourcesController.get()
    .then((sourceDocs) => {
      const sources = sourceDocs.map(sourceDoc => sourceDoc.toObject());
      store.dispatch({
        type: SOURCES_FETCH_RESULT_ACTIONS.SUCCESS,
        data: sourcesNormalizer(sources),
      });
      return PostsController.getPosts();
    })
    .then((postDocs) => {
      const posts = postDocs.map(postDoc => postDoc.toObject());
      store.dispatch({
        type: HOME_POSTS_FETCH_RESULT_ACTIONS.SUCCESS,
        data: homeNormalizer({ posts, nextOffset: 30 }),
      });
      const html = pageHtml(buildHtmlHeaders(), url, store);
      return html;
    });
};
