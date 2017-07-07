import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import createPalette from 'material-ui/styles/palette';
import { lightGreen } from 'material-ui/styles/colors';
import { configureStore } from './dallol-web/src/app/store';
import { videoPath, articlePath, videoStandalonePath } from './dallol-web/src/app/routes';
import { sourcesNormalizer, homeNormalizer, videoNormalizer, articleNormalizer } from './dallol-web/src/app/normalizers';
import { SOURCES_FETCH_RESULT_ACTIONS, HOME_POSTS_FETCH_RESULT_ACTIONS } from './dallol-web/src/home/actions';
import { VIDEO_FETCH_RESULT_ACTIONS } from './dallol-web/src/video/actions';
import { ARTICLE_FETCH_RESULT_ACTIONS } from './dallol-web/src/article/actions';
import App from './dallol-web/src/app/App';

const fs = require('fs');
const he = require('he');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const favicon = require('serve-favicon');
require('./initModels');
const apiRoute = require('./routes');
const PostsController = require('./controllers/posts-controller');
const SourcesController = require('./controllers/sources-controller');
const { buildOGMetas, getBuiltCssFileName, getBuiltJsFileName, fetchClientPostUrl } = require('./utils');

mongoose.Promise = global.Promise;

const app = express();


function renderFullPage(metas, html, css) {
  return Promise.all([getBuiltJsFileName(), getBuiltCssFileName()])
    .then(fileNames =>
      `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            ${metas}
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <link rel="apple-touch-icon" sizes="57x57" href="/favicon/apple-icon-57x57.png">
            <link rel="apple-touch-icon" sizes="60x60" href="/favicon/apple-icon-60x60.png">
            <link rel="apple-touch-icon" sizes="72x72" href="/favicon/apple-icon-72x72.png">
            <link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-icon-76x76.png">
            <link rel="apple-touch-icon" sizes="114x114" href="/favicon/apple-icon-114x114.png">
            <link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-icon-120x120.png">
            <link rel="apple-touch-icon" sizes="144x144" href="/favicon/apple-icon-144x144.png">
            <link rel="apple-touch-icon" sizes="152x152" href="/favicon/apple-icon-152x152.png">
            <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-icon-180x180.png">
            <link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-icon-192x192.png">
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">
            <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png">
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png">
            <link rel="manifest" href="/manifest.json">
            <meta name="msapplication-TileColor" content="#ffffff">
            <meta name="msapplication-TileImage" content="/favicon//ms-icon-144x144.png">
            <meta name="theme-color" content="#689f38">
            <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500" rel="stylesheet">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/6.0.0/normalize.min.css">
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
            <script src="https://cdn.polyfill.io/v2/polyfill.min.js" async defer="defer"></script>
            <title>Mestawet - Ethiopian news and videos</title>
            <!--<link href="/static/css/${fileNames[1]}" rel="stylesheet">-->
          </head>
          <body>
            <div id="root">${html}</div>
            <style id="jss-server-side">${css}</style>
            <script type="text/javascript" src="/static/js/${fileNames[0]}"></script>
            <script>window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)},ga.l=+new Date,ga("create","UA-99619740-1","auto"),ga("send","pageview")</script>
            <script async src="https://www.google-analytics.com/analytics.js"></script>
          </body>
        </html>
      `);
}

function pageHtml(metas, location, store) {
  function createStyleManager() {
    return MuiThemeProvider.createDefaultContext({
      theme: createMuiTheme({
        palette: createPalette({
          primary: lightGreen,
          accent: lightGreen,
        }),
      }),
    });
  }
  const { styleManager, theme } = createStyleManager();

  const html = renderToString(
    <MuiThemeProvider styleManager={styleManager} theme={theme}>
      <Provider store={store}>
        <StaticRouter location={location} context={{}}>
          <App />
        </StaticRouter>
      </Provider>
    </MuiThemeProvider>
  );

  const css = styleManager.sheetsToString();
  return renderFullPage(metas, html, css);
}

function homePage(url) {
  const store = configureStore();
  return SourcesController.get()
    .then((sourceDocs) => {
      const sources = sourceDocs.map(sourceDoc => sourceDoc.toObject());
      store.dispatch({ type: SOURCES_FETCH_RESULT_ACTIONS.SUCCESS, data: sourcesNormalizer(sources) });
      return PostsController.getPosts();
    })
    .then((postDocs) => {
      const posts = postDocs.map(postDoc => postDoc.toObject());
      store.dispatch({ type: HOME_POSTS_FETCH_RESULT_ACTIONS.SUCCESS, data: homeNormalizer({ posts, nextOffset: 30 }) });
      return pageHtml(buildOGMetas(), url, store);
    });
}

function videoPage(videoId, url) {
  const store = configureStore();
  return SourcesController.get()
    .then((sourceDocs) => {
      const sources = sourceDocs.map(sourceDoc => sourceDoc.toObject());
      store.dispatch({ type: SOURCES_FETCH_RESULT_ACTIONS.SUCCESS, data: sourcesNormalizer(sources) });
      return PostsController.getVideo(videoId)
    })
    .then((postDoc) => {
      const post = postDoc.toObject();
      store.dispatch({ type: VIDEO_FETCH_RESULT_ACTIONS.SUCCESS, data: videoNormalizer(post)});
      const metas = buildOGMetas({ 
        ogType: 'video.other', 
        ogTitle: he.encode(post.title),
        ogUrl: fetchClientPostUrl(post),
        ogDescription: he.encode(post.description),
        ogImage: encodeURI(post.thumbnailUrl) });
      return pageHtml(metas, url, store);
    })
}

function articlePage(articleId, url) {
  const store = configureStore();
  return SourcesController.get()
    .then((sourceDocs) => {
      const sources = sourceDocs.map(sourceDoc => sourceDoc.toObject());
      store.dispatch({ type: SOURCES_FETCH_RESULT_ACTIONS.SUCCESS, data: sourcesNormalizer(sources) });
      return PostsController.getArticle(articleId)
    })
    .then((postDoc) => {
      const post = postDoc.toObject();
      store.dispatch({ type: ARTICLE_FETCH_RESULT_ACTIONS.SUCCESS, data: articleNormalizer(post)});
      const metas = buildOGMetas({
        ogType: 'article',
        ogTitle: he.encode(post.title),
        ogUrl: fetchClientPostUrl(post),
        ogDescription: he.encode(post.description),
        ogImage: encodeURI(post.thumbnailUrl),
      });
      return pageHtml(metas, url, store);
    })
}

function renderWithFallback(pagePromise, req, res, next) {
  pagePromise
    .then(html => res.send(html))
    .catch(() => res.sendFile(path.join(__dirname, 'dallol-web/build', 'index.html')))
    .catch(next);
}

function genericPathHandler(req, res, next) {
  renderWithFallback(homePage(req.url), req, res, next);
  /*res.send(homePage())
  metaSubstitute(`${__dirname}/dallol-web/build/index.html`, genericMetas())
    .then(htmlStr => res.send(htmlStr))
    .catch(next);*/
}

app.use(favicon(path.join(__dirname, 'dallol-web/build/favicon', 'favicon.ico')));
app.use(bodyParser.json({ limit: '1mb' }));
app.get('/', genericPathHandler);
app.use(express.static(path.join(__dirname, 'dallol-web', 'build')));
app.use('/api', apiRoute);
app.get([videoPath, videoStandalonePath], (req, res, next) => {
  renderWithFallback(videoPage(req.params.id, req.url), req, res, next);
  /*PostsController.getVideoMetas(req.params.id)
    .then(metas => metaSubstitute(`${__dirname}/dallol-web/build/index.html`, metas))
    .then(htmlStr => res.send(htmlStr))
    .catch(next);*/
});
app.get(articlePath, (req, res, next) => {
  renderWithFallback(articlePage(req.params.id, req.url), req, res, next);
});
app.get('*', genericPathHandler);
app.use((err, req, res) => {
  res.status(422).send({ error: err.message });
});


module.exports = app;
