const mongoose = require('mongoose');
const sendPostsToTelegram = require('../post-processors/telegram');
const sendPostsToFacebook = require('../post-processors/facebook');
const { trimText } = require('../utils');

const Post = mongoose.model('post');
const Article = mongoose.model('article');
const YoutubeVideo = mongoose.model('youtubeVideo');
const Source = mongoose.model('source');

function articles(posts) {
  return posts.filter(post => post.type === 'article');
}

function youtubeVideos(posts) {
  return posts.filter(post => post.type === 'video');
}

function saveArticle(crawledArticle) {
  return Source.findOne({ crawlerId: crawledArticle.sourceId })
        .then((source) => {
          if (source == null) {
            console.log('Article dropped because no corresponding source', crawledArticle);
            return null;
          }

          const article = new Article({
            title: crawledArticle.title,
            url: crawledArticle.url,
            thumbnailUrl: crawledArticle.thumbnailUrl,
            description: trimText(crawledArticle.description),
            textContent: crawledArticle.textContent,
          });

          article.source = source;
          return article.save();
        }).catch((err) => {
          if (err.code === 11000) {
            return null;
          }
          throw err;
        });
}

function saveVideo(crawledYoutubeVideo) {
  return Source.findOne({ crawlerId: crawledYoutubeVideo.sourceId })
        .then((source) => {
          if (source == null) {
            console.log('Video dropped because no corresponding source', crawledYoutubeVideo);
            return null;
          }

          const video = new YoutubeVideo({
            videoId: crawledYoutubeVideo.videoId,
            title: crawledYoutubeVideo.title,
            description: crawledYoutubeVideo.description,
            thumbnailUrl: crawledYoutubeVideo.thumbnailUrl,
          });

          video.source = source;
          return video.save();
        }).catch((err) => {
          if (err.code === 11000) {
            return null;
          }
          throw err;
        });
}

function getVideo(postId) {
  return YoutubeVideo.findById(postId)
        .then((post) => {
          if (!post) {
            throw new Error('Unable to retreive video');
          }
          return post;
        });
}

function getArticle(postId) {
  return Article.findById(postId)
        .then((post) => {
          if (!post) {
            throw new Error('Unable to retreive article');
          }
          return post;
        });
}

function getPosts({ limit = 30, offset = 0, populate = '' } = {}) {
  return Post.find({},
    {
      title: 1,
      url: 1,
      videoId: 1,
      thumbnailUrl: 1,
      description: 1,
      source: 1,
      date: 1,
      textContent: 1,
    })
    .sort({ _id: -1 })
    .skip(offset)
    .limit(limit)
    .populate(populate);
}

module.exports = {
  create(req, res, next) {
    const posts = req.body;
    const savedArticles = articles(posts).map(saveArticle);
    const savedVids = youtubeVideos(posts).map(saveVideo);

    Promise.all([...savedArticles, ...savedVids])
            .then((savedPosts) => {
              res.send({ success: true, message: 'Posts saved successfully' });
              sendPostsToFacebook(savedPosts);
              sendPostsToTelegram(savedPosts);
            })
            .catch(next);
  },
  getPosts,
  getVideo,
  getArticle,
};
