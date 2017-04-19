const Article = require('../models/article');

function withArticleFields(article) {
    return {
        title: article.title,
        url: article.url,
        thumbnailUrl: article.thumbnailUrl,
        description: article.description,
    };
}

function getArticles(posts) {
    return posts.filter(post => post.type === 'article').map(withArticleFields);
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

module.exports = {
    create(req, res, next) {
        const posts = req.body;
        const articles = getArticles(posts);

        Promise.all(articles.map(saveArticle))
            .then(() => res.send({ success: true, message: 'Posts saved successfully' }))
            .catch(next);
    },
};
