import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import createPalette from 'material-ui/styles/palette';
import { lightGreen } from 'material-ui/styles/colors';
import { configureStore } from './dallol-web/src/app/store';
import { videoPath, articlePath, videoStandalonePath } from './dallol-web/src/app/routes';
import { sourcesNormalizer, homeNormalizer } from './dallol-web/src/app/normalizers';
import { SOURCES_FETCH_RESULT_ACTIONS, HOME_POSTS_FETCH_RESULT_ACTIONS } from './dallol-web/src/home/actions';
import App from './dallol-web/src/app/App';

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const favicon = require('serve-favicon');
require('./initModels');
const apiRoute = require('./routes');
const PostsController = require('./controllers/posts-controller');
const SourcesController = require('./controllers/sources-controller');
const { metaSubstitute, genericMetas } = require('./utils');

mongoose.Promise = global.Promise;

const app = express();

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

function homeRender() {
  const store = configureStore();
  SourcesController.get()
    .then((sourceDocs) => {
      const sources = sourceDocs.map(sourceDoc => sourceDoc.toObject());
      store.dispatch({ type: SOURCES_FETCH_RESULT_ACTIONS.SUCCESS, data: sourcesNormalizer(sources) });
      return PostsController.getPosts();
    })
    .then((postDocs) => {
      const posts = postDocs.map(postDoc => postDoc.toObject());
      store.dispatch({ type: HOME_POSTS_FETCH_RESULT_ACTIONS.SUCCESS, data: homeNormalizer({ posts, nextOffset: 30 }) });
      const { styleManager, theme } = createStyleManager();

      const html = renderToString(
        <MuiThemeProvider styleManager={styleManager} theme={theme}>
          <Provider store={store}>
            <StaticRouter location='/' context={{}}>
              <App />
            </StaticRouter>
          </Provider>
        </MuiThemeProvider>
      );

      const css = styleManager.sheetsToString();
      // console.log(html);
      // console.log(css);
    })
    .catch(console.log);
}

homeRender();

function genericPathHandler(req, res, next) {
  metaSubstitute(`${__dirname}/dallol-web/build/index.html`, genericMetas())
    .then(htmlStr => res.send(htmlStr))
    .catch(next);
}

app.use(favicon(path.join(__dirname, 'dallol-web/build/favicon', 'favicon.ico')));
app.use(bodyParser.json({ limit: '1mb' }));
app.get('/', genericPathHandler);
app.use(express.static(path.join(__dirname, 'dallol-web', 'build')));
app.use('/api', apiRoute);
app.get([videoPath, videoStandalonePath], (req, res, next) => {
  PostsController.getVideoMetas(req.params.id)
    .then(metas => metaSubstitute(`${__dirname}/dallol-web/build/index.html`, metas))
    .then(htmlStr => res.send(htmlStr))
    .catch(next);
});
app.get(articlePath, (req, res, next) => {
  PostsController.getArticleMetas(req.params.id)
    .then(metas => metaSubstitute(`${__dirname}/dallol-web/build/index.html`, metas))
    .then(htmlStr => res.send(htmlStr))
    .catch(next);
});
app.get('*', genericPathHandler);
app.use((err, req, res) => {
  res.status(422).send({ error: err.message });
});


module.exports = app;
