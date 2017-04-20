const mongoose = require('mongoose');
const utils = require('./utils');

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: String,
    url: {
        type: String,
        required: [true, 'Url is required'],
    },
    thumbnailUrl: String,
    description: String,
    created_at: Date,
});
ArticleSchema.index({ url: 1 }, { unique: true });
utils.middlewareAddCreatedAtField(ArticleSchema);

const Article = mongoose.model('article', ArticleSchema);

module.exports = Article;
