const componentOptimization = require('react-ssr-optimization');

const componentOptimizationRef = componentOptimization({
  components: {
    Article: props => props.id,
    VideoStandalone: props => props.video._id,
    ArticleCard: props => props.article._id,
    VideoCard: props => props.video._id,
    Nav: {},
  },
  lruCacheSettings: {
    max: 500,
  },
});

module.exports = componentOptimizationRef;
