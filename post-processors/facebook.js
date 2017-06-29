const rp = require('request-promise-native');
const { fetchClientPostUrl } = require('../utils');
const { throttle } = require('lodash');

function send(post) {
  return rp({
    url: 'https://graph.facebook.com/v2.9/mestawetapp/feed',
    method: 'POST',
    qs: {
      access_token: 'EAADNqE90KmgBAGwVkKpa2DH4k4Ve9jKG2ZBQVH0EES0t6YS85k61cfejdhLhxtEQrUuBa1YUBorAsJEQtYHZCbuBBRC0e7ZCaPtIczJxC4k0eZC3VOdMvnv0OiH0cyIyybcx2xnBMCPrPXolKwST6gHZADt9AZBMLrO7t30TF42QZDZD',
      message: `${post.title}
      - from ${post.source.title}`,
      link: fetchClientPostUrl(post),
    },
  }).catch(console.log);
}

module.exports = (posts) => {
  if (process.env.NODE_ENV !== 'development') {
    posts.reduce((seq, post) =>
      seq.then(() => {
        if (post) {
          return throttle(() => send(post), 3000)();
        }
      }),
    Promise.resolve());
  }
}