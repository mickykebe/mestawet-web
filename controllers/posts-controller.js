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

module.exports = {
    create(req, res, next) {
        const posts = req.body;
        const articles = getArticles(posts);
        Article.create(articles)
            .then(() => res.send('Posts saved successfully'))
            .catch(next);
    },
};
