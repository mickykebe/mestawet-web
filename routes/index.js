const config = require('../config');
const jwt = require('jsonwebtoken');
const PostsController = require('../controllers/posts-controller');

module.exports = (app) => {
    app.use((req, res, next) => {
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
    app.post('/posts', PostsController.create);
};
