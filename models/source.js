const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SourceSchema = new Schema({
  crawlerId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  thumbnailUrl: String,
  embedPages: {
    type: Boolean,
    default: false,
  },
});
SourceSchema.index({ crawlerId: 1 }, { unique: true });

const Source = mongoose.model('source', SourceSchema);
module.exports = Source;
