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
    const { posts } = mongoose.connection.collections;
    posts.drop()
        .then(() => posts.createIndex({ url: 1 }, { unique: true, sparse: true }))
        .then(() => posts.createIndex({ videoId: 1 }, { unique: true, sparse: true }))
        .then(() => done());
});
