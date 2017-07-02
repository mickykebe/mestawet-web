const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const favicon = require('serve-favicon');
require('./initModels');
const apiRoute = require('./routes');
const PostsController = require('./controllers/posts-controller');
const { metaSubstitute } = require('./utils');

import { videoPath, articlePath, videoStandalonePath } from './dallol-web/src/app/routes';

mongoose.Promise = global.Promise;

const app = express();

app.use(express.static(path.join(__dirname, 'dallol-web', 'build')));
app.use(favicon(path.join(__dirname, 'dallol-web/build/favicon', 'favicon.ico')));
app.use(bodyParser.json({ limit: '1mb' }));
app.use('/api', apiRoute);
app.get([videoPath, videoStandalonePath], (req, res, next) => {
    PostsController.getVideoMetas(req.params.id)
        .then((metas) => metaSubstitute(`${__dirname}/dallol-web/build/index.html`, metas))
        .then((htmlStr) => res.send(htmlStr))
        .catch(next);
});
app.get(articlePath, (req, res, next) => {
    PostsController.getArticleMetas(req.params.id)
        .then((metas) => metaSubstitute(`${__dirname}/dallol-web/build/index.html`, metas))
        .then((htmlStr) => res.send(htmlStr))
        .catch(next);
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dallol-web/build', 'index.html'));
});
app.use((err, req, res) => {
    res.status(422).send({ error: err.message });
});


module.exports = app;
