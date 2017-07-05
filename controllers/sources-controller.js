const mongoose = require('mongoose');

const Source = mongoose.model('source');

module.exports = {
  get() {
    return Source.find({}, { title: 1, thumbnailUrl: 1, embedPages: 1 });
  },
};
