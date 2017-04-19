const assert = require('assert');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const config = require('../../config');
const jwt = require('jsonwebtoken');

const Article = mongoose.model('article');

describe('Posts controller', () => {
    const articles = [
        {
            title: 'የከንቲባው ጽሕፈት ቤትና የካቢኔ ጉዳዮች ጽሕፈት ቤት ምክትል ኃላፊ በይግባኝ ተከላከሉ ተባሉ',
            url: 'http://ethiopianreporter.com/content/%E1%8B%A8%E1%8A%A8%E1%8A%95%E1%89%B2%E1%89%A3%E1%8B%8D-%E1%8C%BD%E1%88%95%E1%8D%88%E1%89%B5-%E1%89%A4%E1%89%B5%E1%8A%93-%E1%8B%A8%E1%8A%AB%E1%89%A2%E1%8A%94-%E1%8C%89%E1%8B%B3%E1%8B%AE%E1%89%BD-%E1%8C%BD%E1%88%95%E1%8D%88%E1%89%B5-%E1%89%A4%E1%89%B5-%E1%88%9D%E1%8A%AD%E1%89%B5%E1%88%8D-%E1%8A%83%E1%88%8B%E1%8D%8A-%E1%89%A0%E1%8B%AD%E1%8C%8D%E1%89%A3%E1%8A%9D-%E1%89%B0%E1%8A%A8%E1%88%8B%E1%8A%A8%E1%88%89-%E1%89%B0%E1%89%A3%E1%88%89',
            thumbnailUrl: 'http://ethiopianreporter.com/sites/default/files/styles/medium/public/logo_373_272.jpg?itok=2bgWjGDP',
            type: 'article',
        },
        {
            title: 'ዓለም አቀፍ የሲቪል አቪዬሽን ድርጅት ለኢትዮጵያ ሲቪል አቪዬሽን ባለሥልጣን ልዩ ዕውቅና ሰጠ',
            url: 'http://ethiopianreporter.com/content/%E1%8B%93%E1%88%88%E1%88%9D-%E1%8A%A0%E1%89%80%E1%8D%8D-%E1%8B%A8%E1%88%B2%E1%89%AA%E1%88%8D-%E1%8A%A0%E1%89%AA%E1%8B%AC%E1%88%BD%E1%8A%95-%E1%8B%B5%E1%88%AD%E1%8C%85%E1%89%B5-%E1%88%88%E1%8A%A2%E1%89%B5%E1%8B%AE%E1%8C%B5%E1%8B%AB-%E1%88%B2%E1%89%AA%E1%88%8D-%E1%8A%A0%E1%89%AA%E1%8B%AC%E1%88%BD%E1%8A%95-%E1%89%A3%E1%88%88%E1%88%A5%E1%88%8D%E1%8C%A3%E1%8A%95-%E1%88%8D%E1%8B%A9-%E1%8B%95%E1%8B%8D%E1%89%85%E1%8A%93-%E1%88%B0%E1%8C%A0',
            thumbnailUrl: 'http://ethiopianreporter.com/sites/default/files/styles/medium/public/news3_9.jpg?itok=PQEPFFdj',
            type: 'article',
        },
        {
            title: '\n\t  \t\tበአቃቂ ክፍለ ከተማ በሚገኝ ገበያ ማእከል ላይ በደረሰ የእሳት አደጋ 750 ሺህ ብር የሚገመት ንብረት ወደመ\t  \t',
            url: 'http://www.fanabc.com/index.php/news/item/23725-በአቃቂ-ክፍለ-ከተማ-በሚገኝ-ገበያ-ማእከል-ላይ-በደረሰ-የእሳት-አደጋ-750-ሺህ-ብር-የሚገመት-ንብረት-ወደመ.html',
            description: '\n\t  \tአዲስ አበባ፣ ሚያዚያ 9፣ 2009 (ኤፍ.ቢ.ሲ) በአቃቂ ክፍለ ከተማ ወረዳ 3 ልዩ ስሙ ቄራ ተብሎ የሚጠራ አካባቢ በሚገኝ በገበያ ማእከል ላይ የእሳት አደጋ ደርሷል።\r\n\t  ',
            thumbnailUrl: 'http://www.fanabc.com/media/k2/items/cache/2f82fe7c5f8a44646c463aeb9d9c5bc8_L.jpg?t=-62169984000',
            type: 'article',
        },
    ];
    it('requires token', (done) => {
        request(app)
            .post('/posts')
            .send(articles)
            .end((err, response) => {
                assert(response.statusCode === 403);
                assert(response.body.message === 'Token not sent');
                done();
            });
    });
    it('validates token', (done) => {
        request(app)
            .post('/posts')
            .set('x-access-token', 'asdf')
            .send(articles)
            .end((err, response) => {
                assert(response.statusCode === 403);
                assert(response.body.message === 'Failed to authenticate token');
                done();
            });
    });
    it('Post posts to /posts', (done) => {
        Article.count()
            .then((count) => {
                request(app)
                    .post('/posts')
                    .set('x-access-token', jwt.sign(config.jwtPayload, config.tokenSecret))
                    .send(articles)
                    .end(() => {
                        Article.count().then((newCount) => {
                            assert(count + 3 === newCount);
                            done();
                        });
                    });
            });
    });
});
