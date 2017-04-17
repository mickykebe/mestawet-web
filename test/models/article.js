const assert = require('assert');
const mongoose = require('mongoose');

const Article = mongoose.model('article');

describe('Article', () => {
    it('Unique article validation', (done) => {
        const article = new Article({
            url: 'http://asdf.com',
            title: 'asdf',
            description: 'fdsa',
        });
        article.save()
            .then(() => {
                Article.create({ url: 'http://asdf.com' })
                .catch(() => {
                    assert(true);
                    done();
                });
            });
    });
});
