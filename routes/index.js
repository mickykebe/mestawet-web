const express = require('express');
const config = require('../config');
const jwt = require('jsonwebtoken');
const PostsController = require('../controllers/posts-controller');
const SourcesController = require('../controllers/sources-controller');
const { fbRss } = require('../utils');

const router = express.Router();

router.get('/posts', (req, res, next) => {
  const offset = Number(req.query.offset) || 0;
  const limit = 30;
  PostsController.getPosts({ offset, limit })
    .then((posts) => {
      const nextOffset = (posts.length < limit) ?
            offset + posts.length :
            offset + limit;
      res.send({ posts, nextOffset });
    })
    .catch(next);
});
router.get('/articles/:id', (req, res, next) => {
  PostsController.getArticle(req.params.id)
    .then((post) => {
      res.send(post);
    })
    .catch(next);
});
router.get('/videos/:id', (req, res, next) => {
  PostsController.getVideo(req.params.id)
    .then((post) => {
      res.send(post);
    })
    .catch(next);
});
router.get('/sources', SourcesController.get);
router.get('/feed', (req, res, next) => {
  PostsController.getPosts({ populate: 'source' })
    .then((posts) => {
      res.send(fbRss(posts));
    })
    .catch(next);
});
router.use((req, res, next) => {
  const token = req.headers['x-access-token'] || req.query.token || req.body.token;

  if (token) {
    jwt.verify(token, config.tokenSecret, (err, decoded) => {
      if (err || decoded !== config.jwtPayload) {
        res.status(403).send({
          success: false,
          message: 'Failed to authenticate token',
        });
      } else {
        next();
      }
    });
  } else {
    res.status(403).send({
      success: false,
      message: 'Token not sent',
    });
  }
});

router.post('/posts', PostsController.create);

module.exports = router;
