const { Post, Article, YoutubeVideo } = require('../models/post');

function withArticleFields(article) {
    return {
        title: article.title,
        url: article.url,
        thumbnailUrl: article.thumbnailUrl,
        description: article.description,
    };
}

function withYoutubeFields(video) {
    return {
        videoId: video.videoId,
        title: video.title,
        thumbnailUrl: video.thumbnailUrl,
    };
}

function parsedArticles(posts) {
    return posts.filter(post => post.type === 'article').map(withArticleFields);
}

function parsedYoutubeVideos(posts) {
    return posts.filter(post => post.type === 'video').map(withYoutubeFields);
}

function saveArticle(articlePost) {
    return Article.create(articlePost)
        .catch((err) => {
            if (err.code === 11000) {
                return null;
            }
            throw err;
        });
}

function saveVideo(youtubeVideo) {
    return YoutubeVideo.create(youtubeVideo)
        .catch((err) => {
            if (err.code === 11000) {
                return null;
            }
            throw err;
        });
}

module.exports = {
    create(req, res, next) {
        const posts = req.body;
        const articles = parsedArticles(posts);
        const youtubeVideos = parsedYoutubeVideos(posts);

        const savedArticles = articles.map(saveArticle);
        const savedVids = youtubeVideos.map(saveVideo);

        Promise.all([...savedArticles, ...savedVids])
            .then(() => res.send({ success: true, message: 'Posts saved successfully' }))
            .catch(next);
    },
    get(req, res, next) {
        const postsPerPage = 30;
        const offset = Number(req.query.offset) || 0;

        Post.find({})
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
