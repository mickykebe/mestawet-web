const fs = require('fs');
const he = require('he');
const config = require('./config');

const baseClientUrl = `https://${config.clientHostName}`;
const htmlPlaceholders = {
  ogTitle: '__OG_TITLE__',
  ogType: '__OG_TYPE__',
  ogUrl: '__OG_URL__',
  ogImage: '__OG_IMAGE__',
  ogDescription: '__OG_DESCRIPTION__',
  ogImageWidth: '__OG_IMAGE_WIDTH__',
  ogImageHeight: '__OG_IMAGE_HEIGHT__',
}

// https://gist.github.com/mathewbyrne/1280286
function slug(text) {
  return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/--+/g, '-')           // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
}

function videoUrl(post) {
  if (post.videoId) {
    return `${baseClientUrl}/video/${post._id}`;
  }
  return null;
}

function articleUrl(post) {
  if (post.url) {
    return `${baseClientUrl}/article/${post._id}/${he.escape(slug(post.title))}`;
  }
  return null;
}

function fetchClientPostUrl(post) {
  let url;
  if (post.kind === 'youtubeVideo') {
    url = videoUrl(post);
  } else if (post.kind === 'article') {
    url = articleUrl(post);
  }
  return decodeURI(url);
}

function metaReplace(htmlStr, metas) {
  let newHtml = htmlStr;
  for (const placeholder in htmlPlaceholders) {
    newHtml = newHtml.replace(htmlPlaceholders[placeholder], metas[htmlPlaceholders[placeholder]] || '');
  }
  return newHtml;
}

function metaSubstitute(htmlPath, metas) {
  return new Promise((resolve, reject) => {
    const readable = fs.createReadStream(htmlPath);
    let htmlStr = '';

    readable.on('data', (data) => {
      htmlStr += data;
    });
    readable.on('end', () => {
      resolve(metaReplace(htmlStr, metas));
    });
    readable.on('error', (e) => {
      reject(e);
    });
  });
}

module.exports.fetchClientPostUrl = fetchClientPostUrl;
module.exports.trimText = (text = '') => text.slice(0, 250).concat('...');
module.exports.metaSubstitute = metaSubstitute;
module.exports.htmlPlaceholders = htmlPlaceholders;
