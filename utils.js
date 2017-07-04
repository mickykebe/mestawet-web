const fs = require('fs');
const he = require('he');
const config = require('./config');
const xml = require('xml');

const baseClientUrl = `https://${config.clientHostName}`;
const htmlPlaceholders = {
  ogTitle: '__OG_TITLE__',
  ogType: '__OG_TYPE__',
  ogUrl: '__OG_URL__',
  ogImage: '__OG_IMAGE__',
  ogDescription: '__OG_DESCRIPTION__',
  ogImageWidth: '__OG_IMAGE_WIDTH__',
  ogImageHeight: '__OG_IMAGE_HEIGHT__',
};

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

function metaReplace(htmlStr, metas) {
  let newHtml = htmlStr;
  for(const placeholder in htmlPlaceholders) {
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

function genericMetas() {
  return {
    [htmlPlaceholders.ogType]: 'website',
    [htmlPlaceholders.ogTitle]: 'Mestawet - Ethiopian news and videos',
    [htmlPlaceholders.ogUrl]: 'https://mestawet.com/',
    [htmlPlaceholders.ogImage]: 'https://mestawet.com/img/logo.png',
    [htmlPlaceholders.ogDescription]: 'Get the latest Ethiopian news and videos as they break',
    [htmlPlaceholders.ogImageWidth]: 480,
    [htmlPlaceholders.ogImageHeight]: 360,
  };
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
module.exports.metaSubstitute = metaSubstitute;
module.exports.htmlPlaceholders = htmlPlaceholders;
module.exports.genericMetas = genericMetas;
module.exports.fbRss = fbRss;
