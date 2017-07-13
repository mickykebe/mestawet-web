const he = require('he');
const config = require('./config');
const glob = require('glob');

const baseClientUrl = `https://${config.clientHostName}`;

// https://gist.github.com/mathewbyrne/1280286
function slug(text) {
  return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/--+/g, '-')           // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
}

function videoUrlPath(post) {
  if (post.videoId) {
    return `/video/standalone/${post._id}`;
  }
  return null;
}

function articleUrlPath(post) {
  if (post.url) {
    return `/article/${post._id}/${he.escape(slug(post.title))}`;
  }
  return null;
}

function postUrlPath(post) {
  let path;
  if (post.kind === 'article') {
    path = articleUrlPath(post);
  } else {
    path = videoUrlPath(post);
  }
  return decodeURIComponent(path);
}

function fetchClientPostUrl(post) {
  return `${baseClientUrl}${postUrlPath(post)}`;
}

function buildHtmlHeaders({
  ogTitle = 'Mestawet - Ethiopian news and videos',
  ogType = 'website',
  ogUrl = 'https://mestawet.com/',
  ogImage = 'https://mestawet.com/img/logo.png',
  ogDescription = 'The latest Ethiopian news and videos as they break',
  ogImageWidth = '480',
  ogImageHeight = '360',
  canonicalUrl = '',
} = {}) {
  return `<meta property="og:title" content="${ogTitle}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:url" content="${ogUrl}">
  ${ogDescription ? `<meta property="og:description" content="${ogDescription}">` : ``}
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="${ogImageWidth}" />
  <meta property="og:image:height" content="${ogImageHeight}" />
  ${canonicalUrl ? `<link rel="canonical" href="${canonicalUrl}">` : ``}
  `;
}

function getFileNameFromPath(file) {
  return file && file.replace(/^.*[\\/]/, '');
}

function getBuiltJsFileName() {
  return new Promise((resolve, reject) => {
    glob('./dallol-web/build/static/js/*.js', (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(getFileNameFromPath(files[0]));
      }
    });
  });
}

function getBuiltCssFileName() {
  return new Promise((resolve, reject) => {
    glob('./dallol-web/build/static/css/*.css', (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(getFileNameFromPath(files[0]));
      }
    });
  });
}

module.exports.fetchClientPostUrl = fetchClientPostUrl;
module.exports.postUrlPath = postUrlPath;
module.exports.trimText = (text = '') => text.slice(0, 250).concat('...');
module.exports.buildHtmlHeaders = buildHtmlHeaders;
module.exports.getBuiltJsFileName = getBuiltJsFileName;
module.exports.getBuiltCssFileName = getBuiltCssFileName;
