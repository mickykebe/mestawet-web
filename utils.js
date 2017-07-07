const fs = require('fs');
const he = require('he');
const config = require('./config');
const xml = require('xml');
const glob = require('glob');
const path = require('path');

const baseClientUrl = `https://${config.clientHostName}`;

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
    return `${baseClientUrl}/video/standalone/${post._id}`;
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

function buildOGMetas({
  ogTitle = 'Mestawet - Ethiopian news and videos',
  ogType = 'website',
  ogUrl = 'https://mestawet.com/',
  ogImage = 'https://mestawet.com/img/logo.png',
  ogDescription = 'The latest Ethiopian news and videos as they break',
  ogImageWidth = '480',
  ogImageHeight = '360',
} = {}) {
  return `<meta property="og:title" content="${ogTitle}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:url" content="${ogUrl}">
  <meta property="og:description" content="${ogDescription}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="${ogImageWidth}" />
  <meta property="og:image:height" content="${ogImageHeight}" />`;
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

function fbRss(posts) {
  const getItemXmlObj = post => ({
    item: [
      {
        title: [post.title],
      },
      {
        description: [post.description],
      },
      {
        guid: [post._id.toString()],
      },
      {
        link: [fetchClientPostUrl(post)],
      },
      {
        'content:encoded': {
          _cdata: post.textContent || post.description,
        },
      },
      {
        pubDate: [post.date.toString()],
      },
      {
        author: [post.source.title],
      },
    ],
  });
  const channel = {
    channel: [
      {
        title: [
          'Mestawet - Ethiopian news and video',
        ],
      },
      {
        description: [
          'Mestawet aggregates breaking Ethiopian news and videos',
        ],
      },
      {
        link: [
          'https://mestawet.com',
        ],
      },
    ],
  };
  const rss = {
    rss: [
      {
        _attr: {
          'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
          'xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
          'xmlns:atom': 'http://www.w3.org/2005/Atom',
          version: '2.0',
        },
      },
    ],
  };
  posts.forEach((post) => {
    channel.channel.push(getItemXmlObj(post));
  });
  rss.rss.push(channel);
  return xml(rss, { declaration: true, indent: '\t' });
}

module.exports.fetchClientPostUrl = fetchClientPostUrl;
module.exports.trimText = (text = '') => text.slice(0, 250).concat('...');
module.exports.fbRss = fbRss;
module.exports.buildOGMetas = buildOGMetas;
module.exports.getBuiltJsFileName = getBuiltJsFileName;
module.exports.getBuiltCssFileName = getBuiltCssFileName;
