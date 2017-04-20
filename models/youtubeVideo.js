const mongoose = require('mongoose');
const utils = require('./utils');

const Schema = mongoose.Schema;

const YoutubeVideoSchema = new Schema({
    videoId: {
        type: String,
        required: [true, 'VideoId is required'],
    },
    title: String,
    thumbnailUrl: String,
    created_at: Date,
});

YoutubeVideoSchema.index({ videoId: 1 }, { unique: true });
utils.middlewareAddCreatedAtField(YoutubeVideoSchema);

const YoutubeVideo = mongoose.model('youtubeVideo', YoutubeVideoSchema);

module.exports = YoutubeVideo;
