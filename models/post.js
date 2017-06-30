const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: String,
    thumbnailUrl: String,
    source: {
        type: Schema.Types.ObjectId,
        ref: 'source',
    },
    description: String,
}, { id: false, discriminatorKey: 'kind' });

PostSchema.virtual('date').get(function () {
    return this._id.getTimestamp();
});
PostSchema.set('toObject', { getters: true });
PostSchema.set('toJSON', { getters: true });

const ArticleSchema = new Schema({
    url: {
        type: String,
        required: [true, 'Url is required'],
    },
    textContent: String,
}, { discriminatorKey: 'kind', id: false, _id: false });
ArticleSchema.index({ url: 1 }, { unique: true, sparse: true });

const YoutubeVideoSchema = new Schema({
    videoId: {
        type: String,
        required: [true, 'VideoId is required'],
    },
}, { discriminatorKey: 'kind', id: false, _id: false });
YoutubeVideoSchema.index({ videoId: 1 }, { unique: true, sparse: true });

const Post = mongoose.model('post', PostSchema);
const Article = Post.discriminator('article', ArticleSchema);
const YoutubeVideo = Post.discriminator('youtubeVideo', YoutubeVideoSchema);

module.exports = {
    Post,
    Article,
    YoutubeVideo,
};
