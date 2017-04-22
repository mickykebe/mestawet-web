const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
require('./initModels');
const routes = require('./routes');

mongoose.Promise = global.Promise;

const app = express();

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect('mongodb://localhost/dallol');
}

app.use(bodyParser.json({ limit: '1mb' }));
routes(app);
app.use((err, req, res) => {
    res.status(422).send({ error: err.message });
});


module.exports = app;
