const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('./initModels');
const apiRoute = require('./routes');

mongoose.Promise = global.Promise;

const app = express();

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect('mongodb://localhost/dallol');
}

app.use(express.static(path.join(__dirname, 'dallol-web', 'build')));
app.use(bodyParser.json({ limit: '1mb' }));
app.use('/api', apiRoute);
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dallol-web/build', 'index.html'));
});
app.use((err, req, res) => {
    res.status(422).send({ error: err.message });
});


module.exports = app;
