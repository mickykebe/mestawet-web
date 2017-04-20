const Article = require('../models/article');
const YoutubeVideo = require('../models/youtubeVideo');

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

        Promise.all(articles.map(saveArticle).concat(youtubeVideos.map(saveVideo)))
            .then(() => res.send({ success: true, message: 'Posts saved successfully' }))
            .catch(next);
    },
    get(req, res, next) {
        
    },
};
