const assert = require('assert');
const mongoose = require('mongoose');

const YoutubeVideo = mongoose.model('youtubeVideo');

describe('YoutubeVideo Model', () => {
  const video = {
    videoId: 'HwCaFyglAgQ',
    title: 'Yellen\'s Fed Bad For America but will be Good For My Investments',
    thumbnailUrl: 'https://i.ytimg.com/vi/HwCaFyglAgQ/hqdefault.jpg',
  };
  it('Unique video index validation', (done) => {
    new YoutubeVideo(video).save()
      .then(() => {
        YoutubeVideo.create({ videoId: 'HwCaFyglAgQ' })
        .catch(() => {
          assert(true);
          done();
        });
      });
  });
});
