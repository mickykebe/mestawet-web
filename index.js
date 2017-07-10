const componentOptimizationRef = require('./ssr-cache');
const mongoose = require('mongoose');
const sources = require('./sources');
const app = require('./app');

mongoose.Promise = global.Promise;

const Source = require('./models/source');

function populateSources() {
  return sources.reduce((sequence, source) => sequence.then(() =>
        Source.update({ crawlerId: source.crawlerId }, source, { upsert: true })),
    Promise.resolve());
}

function startServer() {
  app.listen(3050, () => {
    console.log('Mestawet server listening on 3050');
  });
}

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/dallol');
  mongoose.connection
    .once('open', () => {
      populateSources()
        .then(() => {
          console.log('Sources populated successfully');
          startServer();
        });
    });
} else {
  startServer();
}
