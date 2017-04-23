const mongoose = require('mongoose');

const Post = mongoose.model('post');
const Article = mongoose.model('article');
const YoutubeVideo = mongoose.model('youtubeVideo');
const Source = mongoose.model('source');

function articles(posts) {
    return posts.filter(post => post.type === 'article');
}

function youtubeVideos(posts) {
    return posts.filter(post => post.type === 'video');
}

function saveArticle(crawledArticle) {
    return Source.findOne({ crawlerId: crawledArticle.sourceId })
        .then((source) => {
            const article = new Article({
                title: crawledArticle.title,
                url: crawledArticle.url,
                thumbnailUrl: crawledArticle.thumbnailUrl,
                description: crawledArticle.description,
            });

            if (source !== null) {
                article.source = source;
            }

            return article.save();
        }).catch((err) => {
            if (err.code === 11000) {
                return null;
            }
            throw err;
        });
}

function saveVideo(crawledYoutubeVideo) {
    return Source.findOne({ crawlerId: crawledYoutubeVideo.sourceId })
        .then((source) => {
            const video = new YoutubeVideo({
                videoId: crawledYoutubeVideo.videoId,
                title: crawledYoutubeVideo.title,
                thumbnailUrl: crawledYoutubeVideo.thumbnailUrl,
            });

            if (source !== null) {
                video.source = source;
            }

            return video.save();
        }).catch((err) => {
            if (err.code === 11000) {
                return null;
            }
            throw err;
        });
}

module.exports = {
    create(req, res, next) {
        const posts = req.body;
        const savedArticles = articles(posts).map(saveArticle);
        const savedVids = youtubeVideos(posts).map(saveVideo);

        Promise.all([...savedArticles, ...savedVids])
            .then(() => res.send({ success: true, message: 'Posts saved successfully' }))
            .catch(next);
    },
    get(req, res, next) {
        const postsPerPage = 30;
        const offset = Number(req.query.offset) || 0;

        Post.find({}, { title: 1, url: 1, videoId: 1, thumbnailUrl: 1, description: 1, source: 1 })
            .sort({ _id: -1 })
            .skip(offset)
            .then((posts) => {
                const nextOffset = (posts.length < postsPerPage) ?
                    offset + posts.length :
                    offset + postsPerPage;
                res.send({ posts, nextOffset });
            })
            .catch(next);
    },
};
