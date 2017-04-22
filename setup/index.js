const mongoose = require('mongoose');
const sources = require('./sources');

mongoose.Promise = global.Promise;

const Source = require('../models/source');

function populateSources() {
    return sources.reduce((sequence, source) => sequence.then(() =>
            Source.update({ crawlerId: source.crawlerId }, source, { upsert: true })),
        Promise.resolve());
}

if (process.env.NODE_ENV !== 'test') {
    mongoose.connect('mongodb://localhost/dallol');
    mongoose.connection
        .once('open', () => {
            populateSources()
                .then(() => {
                    console.log('Sources populated successfully');
                    mongoose.disconnect();
                });
        });
}
