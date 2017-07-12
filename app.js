import { homePath, videoPath, articlePath, videoStandalonePath } from './dallol-web/src/app/routes';

const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const favicon = require('serve-favicon');
require('./initModels');
const apiRoute = require('./routes');
const homePage = require('./pages/home-page');
const videoPage = require('./pages/video-page');
const articlePage = require('./pages/article-page');
const PostsController = require('./controllers/posts-controller');
const { fbRss } = require('./feed');

mongoose.Promise = global.Promise;

const app = express();

function renderWithFallback(pagePromise, req, res, next) {
  pagePromise
    .then(html => res.send(html))
    .catch((e) => {
      console.error(e);
      res.sendFile(path.join(__dirname, 'dallol-web/build', 'index.html'));
    })
    .catch(next);
}

function genericPathHandler(req, res, next) {
  renderWithFallback(homePage(req.url), req, res, next);
}

app.use(favicon(path.join(__dirname, 'dallol-web/build/favicon', 'favicon.ico')));
app.use(bodyParser.json({ limit: '1mb' }));
app.get(homePath, genericPathHandler);
app.use(express.static(path.join(__dirname, 'dallol-web', 'build')));
app.use('/api', apiRoute);
app.use('/fbFeed', (req, res, next) => {
  PostsController.getPosts({ populate: 'source', limit: 10 })
    .then(fbRss)
    .then(xml => res.set({ 'Content-Type': 'text/xml' }).send(xml))
    .catch(next);
});
app.get(articlePath, (req, res, next) => {
  renderWithFallback(articlePage(req.params.id, req.url), req, res, next);
});
app.get([videoStandalonePath, videoPath], (req, res, next) => {
  renderWithFallback(videoPage(req.params.id, req.url), req, res, next);
});
app.get('*', genericPathHandler);
app.use((err, req, res) => {
  res.status(422).send({ error: err.message });
});


module.exports = app;
