const mongoose = require('mongoose');

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

ArticleSchema.pre('save', function (next) {
    const now = new Date();
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

const Article = mongoose.model('article', ArticleSchema);

module.exports = Article;
