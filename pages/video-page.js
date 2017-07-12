import { configureStore } from '../dallol-web/src/app/store';
import { sourcesNormalizer, videoNormalizer } from '../dallol-web/src/app/normalizers';
import { SOURCES_FETCH_RESULT_ACTIONS } from '../dallol-web/src/home/actions';
import { VIDEO_FETCH_RESULT_ACTIONS } from '../dallol-web/src/video/actions';

const he = require('he');
const PostsController = require('../controllers/posts-controller');
const SourcesController = require('../controllers/sources-controller');
const { buildOGMetas, fetchClientPostUrl } = require('../utils');
const pageHtml = require('./page-helpers');

function videoPage(videoId, url) {
  const store = configureStore();
  return SourcesController.get()
    .then((sourceDocs) => {
      const sources = sourceDocs.map(sourceDoc => sourceDoc.toObject());
      store.dispatch({
        type: SOURCES_FETCH_RESULT_ACTIONS.SUCCESS,
        data: sourcesNormalizer(sources),
      });
      return PostsController.getVideo(videoId);
    })
    .then((postDoc) => {
      const post = postDoc.toObject();
      store.dispatch({ type: VIDEO_FETCH_RESULT_ACTIONS.SUCCESS, data: videoNormalizer(post) });
      const metas = buildOGMetas({
        ogType: 'video.other',
        ogTitle: he.encode(post.title),
        ogUrl: fetchClientPostUrl(post),
        ogDescription: he.encode(post.description),
        ogImage: encodeURI(post.thumbnailUrl) });
      const html = pageHtml(metas, url, store);
      return html;
    });
}

module.exports = videoPage;
