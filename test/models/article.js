const assert = require('assert');
const mongoose = require('mongoose');

const Article = mongoose.model('article');

describe('Article Model', () => {
    const article = {
        url: 'http://asdf.com',
        title: 'asdf',
        description: 'fdsa',
    };
    it('Unique article index validation', (done) => {
        new Article(article).save()
            .then(() => {
                Article.create({ url: 'http://asdf.com' })
                .catch(() => {
                    assert(true);
                    done();
                });
            });
    });
});
