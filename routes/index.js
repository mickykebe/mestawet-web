const PostsController = require('../controllers/posts-controller');

module.exports = (app) => {
    app.post('/posts', PostsController.create);
};
