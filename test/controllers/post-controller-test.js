const assert = require('assert');
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const config = require('../../config');
const jwt = require('jsonwebtoken');

const Article = mongoose.model('article');
const YoutubeVideo = mongoose.model('youtubeVideo');
const Source = mongoose.model('source');

describe('Posts controller', () => {
    function assertSourceFields(source) {
        assert(source.crawlerId !== '');
        assert(source.title !== '');
    }
    describe('POST', () => {
        const posts = [
            {
                title: 'የከንቲባው ጽሕፈት ቤትና የካቢኔ ጉዳዮች ጽሕፈት ቤት ምክትል ኃላፊ በይግባኝ ተከላከሉ ተባሉ',
                url: 'http://ethiopianreporter.com/content/%E1%8B%A8%E1%8A%A8%E1%8A%95%E1%89%B2%E1%89%A3%E1%8B%8D-%E1%8C%BD%E1%88%95%E1%8D%88%E1%89%B5-%E1%89%A4%E1%89%B5%E1%8A%93-%E1%8B%A8%E1%8A%AB%E1%89%A2%E1%8A%94-%E1%8C%89%E1%8B%B3%E1%8B%AE%E1%89%BD-%E1%8C%BD%E1%88%95%E1%8D%88%E1%89%B5-%E1%89%A4%E1%89%B5-%E1%88%9D%E1%8A%AD%E1%89%B5%E1%88%8D-%E1%8A%83%E1%88%8B%E1%8D%8A-%E1%89%A0%E1%8B%AD%E1%8C%8D%E1%89%A3%E1%8A%9D-%E1%89%B0%E1%8A%A8%E1%88%8B%E1%8A%A8%E1%88%89-%E1%89%B0%E1%89%A3%E1%88%89',
                thumbnailUrl: 'http://ethiopianreporter.com/sites/default/files/styles/medium/public/logo_373_272.jpg?itok=2bgWjGDP',
                type: 'article',
                sourceId: 'ethiopianreporter',
            },
            {
                title: 'ዓለም አቀፍ የሲቪል አቪዬሽን ድርጅት ለኢትዮጵያ ሲቪል አቪዬሽን ባለሥልጣን ልዩ ዕውቅና ሰጠ',
                url: 'http://ethiopianreporter.com/content/%E1%8B%93%E1%88%88%E1%88%9D-%E1%8A%A0%E1%89%80%E1%8D%8D-%E1%8B%A8%E1%88%B2%E1%89%AA%E1%88%8D-%E1%8A%A0%E1%89%AA%E1%8B%AC%E1%88%BD%E1%8A%95-%E1%8B%B5%E1%88%AD%E1%8C%85%E1%89%B5-%E1%88%88%E1%8A%A2%E1%89%B5%E1%8B%AE%E1%8C%B5%E1%8B%AB-%E1%88%B2%E1%89%AA%E1%88%8D-%E1%8A%A0%E1%89%AA%E1%8B%AC%E1%88%BD%E1%8A%95-%E1%89%A3%E1%88%88%E1%88%A5%E1%88%8D%E1%8C%A3%E1%8A%95-%E1%88%8D%E1%8B%A9-%E1%8B%95%E1%8B%8D%E1%89%85%E1%8A%93-%E1%88%B0%E1%8C%A0',
                thumbnailUrl: 'http://ethiopianreporter.com/sites/default/files/styles/medium/public/news3_9.jpg?itok=PQEPFFdj',
                type: 'article',
                sourceId: 'ethiopianreporter',
            },
            {
                title: '\n\t  \t\tበአቃቂ ክፍለ ከተማ በሚገኝ ገበያ ማእከል ላይ በደረሰ የእሳት አደጋ 750 ሺህ ብር የሚገመት ንብረት ወደመ\t  \t',
                url: 'http://www.fanabc.com/index.php/news/item/23725-በአቃቂ-ክፍለ-ከተማ-በሚገኝ-ገበያ-ማእከል-ላይ-በደረሰ-የእሳት-አደጋ-750-ሺህ-ብር-የሚገመት-ንብረት-ወደመ.html',
                description: '\n\t  \tአዲስ አበባ፣ ሚያዚያ 9፣ 2009 (ኤፍ.ቢ.ሲ) በአቃቂ ክፍለ ከተማ ወረዳ 3 ልዩ ስሙ ቄራ ተብሎ የሚጠራ አካባቢ በሚገኝ በገበያ ማእከል ላይ የእሳት አደጋ ደርሷል።\r\n\t  ',
                thumbnailUrl: 'http://www.fanabc.com/media/k2/items/cache/2f82fe7c5f8a44646c463aeb9d9c5bc8_L.jpg?t=-62169984000',
                type: 'article',
                sourceId: 'fanabc',
            },
            {
                videoId: 'dXNNNk_0HpI',
                title: 'Ep. 242: Crowd Beginning To Exit Long Dollar Trade',
                thumbnailUrl: 'https://i.ytimg.com/vi/dXNNNk_0HpI/hqdefault.jpg',
                type: 'video',
                sourceId: 'peterschiff',
            },
            {
                videoId: 'O8wAFa-TbM4',
                title: 'Looks like neither Obamacare nor Yellen will be replaced',
                thumbnailUrl: 'https://i.ytimg.com/vi/O8wAFa-TbM4/hqdefault.jpg',
                type: 'video',
                sourceId: 'peterschiff',
            },
        ];

        const sources = [
            {
                crawlerId: 'ethiopianreporter',
                title: 'Ethiopian Reporter',
            },
            {
                crawlerId: 'fanabc',
                title: 'Fana',
            },
        ];

        beforeEach((done) => {
            Source.create(sources)
                .then(() => done());
        });

        it('requires token', (done) => {
            request(app)
                .post('/posts')
                .send(posts)
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
                .send(posts)
                .end((err, response) => {
                    assert(response.statusCode === 403);
                    assert(response.body.message === 'Failed to authenticate token');
                    done();
                });
        });
        it('to /posts', (done) => {
            const token = jwt.sign(config.jwtPayload, config.tokenSecret);

            YoutubeVideo.count()
                .then((videoCount) => {
                    Article.count()
                        .then((articleCount) => {
                            request(app)
                                .post('/posts')
                                .set('x-access-token', token)
                                .send(posts)
                                .end(() => {
                                    YoutubeVideo.count().then((newVideoCount) => {
                                        Article.count().then((newArticleCount) => {
                                            assert(articleCount + 3 === newArticleCount);
                                            assert(videoCount + 2 === newVideoCount);
                                            done();
                                        });
                                    });
                                });
                        });
                });
        });

        it('to /posts [verify sources]', (done) => {
            const token = jwt.sign(config.jwtPayload, config.tokenSecret);

            request(app)
                .post('/posts')
                .set('x-access-token', token)
                .send(posts)
                .end(() => {
                    Article.find()
                        .populate('source')
                        .sort({ _id: -1 })
                        .then((articles) => {
                            assertSourceFields(articles[0].source);
                            assertSourceFields(articles[1].source);
                            assertSourceFields(articles[2].source);
                            YoutubeVideo.find()
                                .populate('source')
                                .then((videos) => {
                                    assert(!videos[0].source);
                                    assert(!videos[1].source);
                                    done();
                                });
                        });
                });
        });
    });

    describe('GET', () => {
        const video = {
            videoId: 'p76PDBi4WkI',
            title: 'የጋሽ ጥላሁን ገሰሰ አምስት አነጋጋሪ እውነታዎች ከሁሉ አዲስ',
            thumbnailUrl: 'https://i.ytimg.com/vi/p76PDBi4WkI/hqdefault.jpg',
        };
        const article = {
            title: 'በኦሮሚያ ክልል ከሚገኙ 10 ሺህ ባለሃብቶች መካከል ወደ ስራ የገቡት 46 በመቶዎቹ ብቻ ናቸው',
            url: 'http://www.fanabc.com/index.php/news/item/23823-በኦሮሚያ-ክልል-ከሚገኙ-10-ሺህ-ባለሃብቶች-መካከል-ወደ-ስራ-የገቡት-46-በመቶዎቹ-ብቻ-ናቸው.html',
            thumbnailUrl: 'http://www.fanabc.com/media/k2/items/cache/1ac29a5e8ec9446c29398e73c76fdef9_L.jpg?t=-62169984000',
            description: 'አዲስ አበባ፣ ሚያዚያ 12፣ 2009 (ኤፍ.ቢ.ሲ) አብዛኞቹ ባለሃብቶች ለልማት የወሰዱትን መሬት ከሰባት እስከ ስምንት ዓመታት አጥረው ያስቀመጡ በመሆኑ፥ ክልሉ እርምጃ መውሰድ መጀመሩን የክልሉ ርዕሰ መስተዳድር አቶ ለማ መገርሳ ተናግረዋል።',
        };

        function assertVideoEquality(video1, video2) {
            assert(video1.videoId === video2.videoId);
            assert(video1.title === video2.title);
            assert(video1.thumbnailUrl === video2.thumbnailUrl);
            assert(video1.created !== null);
        }
        function assertArticleEquality(article1, article2) {
            assert(article1.title === article2.title);
            assert(article1.url === article2.url);
            assert(article1.thumbnailUrl === article2.thumbnailUrl);
            assert(article1.description === article2.description);
            assert(article1.created !== null);
        }

        beforeEach((done) => {
            YoutubeVideo.create(video)
                .then(() => {
                    Article.create(article)
                        .then(() => done());
                });
        });

        it('from /posts', (done) => {
            request(app)
                .get('/posts')
                .end((err, res) => {
                    const { posts: fetchedPosts } = res.body;
                    assert(fetchedPosts.length === 2);
                    assertVideoEquality(fetchedPosts[1], video);
                    assertArticleEquality(fetchedPosts[0], article);
                    done();
                });
        });

        it('from /posts?offset=1', (done) => {
            request(app)
                .get('/posts?offset=1')
                .end((err, res) => {
                    const { posts: fetchedPosts } = res.body;
                    assert(fetchedPosts.length === 1);
                    assertVideoEquality(fetchedPosts[0], video);
                    done();
                });
        });
    });
});
