const mongoose = require('mongoose');

before('Connect to mongo', (done) => {
    mongoose.connect('mongodb://localhost/dallol_test');
    mongoose.connection
        .once('open', () => done())
        .once('error', (error) => {
            console.warn('Error connecting to mongo ', error);
        });
});

beforeEach((done) => {
    const { articles, youtubevideos } = mongoose.connection.collections;
    articles.drop()
        .then(() => articles.createIndex({ url: 1 }, { unique: true }))
        .then(() => youtubevideos.drop())
        .then(() => youtubevideos.createIndex({ videoId: 1 }, { unique: true }))
        .then(() => done());
});
