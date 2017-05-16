const mongoose = require('mongoose');
const sendPostsToTelegram = require('../post-processors/telegram');

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
            if (source == null) {
                console.log('Article dropped because no corresponding source', crawledArticle);
                return null;
            }

            const article = new Article({
                title: crawledArticle.title,
                url: crawledArticle.url,
                thumbnailUrl: crawledArticle.thumbnailUrl,
                description: crawledArticle.description,
            });

            article.source = source;
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
            if (source == null) {
                console.log('Video dropped because no corresponding source', crawledYoutubeVideo);
                return null;
            }

            const video = new YoutubeVideo({
                videoId: crawledYoutubeVideo.videoId,
                title: crawledYoutubeVideo.title,
                thumbnailUrl: crawledYoutubeVideo.thumbnailUrl,
            });

            video.source = source;
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
            .then((savedPosts) => {
                res.send({ success: true, message: 'Posts saved successfully' });
                sendPostsToTelegram(savedPosts);
            })
            .catch(next);
    },
    getPosts(req, res, next) {
        const postsPerPage = 30;
        const offset = Number(req.query.offset) || 0;

        Post.find({},
            {
                title: 1,
                url: 1,
                videoId: 1,
                thumbnailUrl: 1,
                description: 1,
                source: 1,
                date: 1,
            })
            .sort({ _id: -1 })
            .skip(offset)
            .limit(postsPerPage)
            .then((posts) => {
                const nextOffset = (posts.length < postsPerPage) ?
                    offset + posts.length :
                    offset + postsPerPage;
                res.send({ posts, nextOffset });
            })
            .catch(next);
    },
    getArticle(req, res, next) {
        const postId = req.params.id;
        if (!postId) {
            next(new Error('No article id provided'));
            return;
        }

        Article.findById(postId)
            .then((post) => {
                if (!post) {
                    throw new Error('Unable to retreive article');
                }
                res.send(post);
            })
            .catch(next);
    },
};
