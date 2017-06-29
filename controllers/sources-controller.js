const mongoose = require('mongoose');

const Source = mongoose.model('source');

module.exports = {
  get(req, res, next) {
    Source.find({}, { title: 1, thumbnailUrl: 1, embedPages: 1 })
      .then(sources => res.send(sources))
      .catch(next);
  },
};
