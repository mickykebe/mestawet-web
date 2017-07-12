import { articlePath, videoStandalonePath } from './dallol-web/src/app/routes';

const xml = require('xml');
const articlePage = require('./pages/article-page');
const videoPage = require('./pages/video-page');
const { fetchClientPostUrl, postUrlPath } = require('./utils');

function pageHtml(post) {
  if (post.kind === 'article') {
    return articlePage(post._id, postUrlPath(post), articlePath);
  }
  return videoPage(post._id, postUrlPath(post), videoStandalonePath);
}

function fbRss(posts) {
  function getItemXml(post) {
    return pageHtml(post)
      .then(html => ({
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
              _cdata: html,
            },
          },
          {
            pubDate: [post.date.toString()],
          },
          {
            author: [post.source.title],
          },
        ],
      }))
      .catch(console.error);
  }
  return Promise.all(posts.map(getItemXml))
    .then((itemsXml) => {
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
      itemsXml.forEach((itemXml) => {
        if (itemXml) {
          channel.channel.push(itemXml);
        }
      });
      rss.rss.push(channel);
      return xml(rss, { declaration: true, indent: '\t' });
    });
}

module.exports.fbRss = fbRss;
