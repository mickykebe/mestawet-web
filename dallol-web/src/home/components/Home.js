import React, { Component } from 'react';
import customPropTypes from 'material-ui/utils/customPropTypes';
import { createStyleSheet } from 'jss-theme-reactor';
import ArticleCard from 'home/components/ArticleCard';
import VideoCard from 'home/components/VideoCard';
import Masonry from 'react-masonry-component';
import InfiniteScroll from 'react-infinite-scroller';
import { CircularProgress } from 'material-ui/Progress';
import Alert from 'react-s-alert';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/scale.css';

const styleSheet = createStyleSheet('Home', theme => ({
  '@global': {
    html: {
      boxSizing: 'border-box',
    },
    '*, *:before, *:after': {
      boxSizing: 'inherit',
    },
    body: {
      margin: 0,
      background: theme.palette.background.default,
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.text.primary,
      lineHeight: '1.2',
      overflowX: 'hidden',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
    a: {
      textDecoration: 'none',
    },
    img: {
      maxWidth: '100%',
      height: 'auto',
      width: 'auto',
    },
  },
  gridItem: {
    width: '100%',
    paddingBottom: '16px',
    '@media (min-width: 600px)': {
      width: '48%',
    },
    '@media (min-width: 960px)': {
      width: '32%',
    },
  },
  spinnerContainer: {
    width: '100%',
  },
  loadingSpinner: {
    display: 'block',
    margin: '0 auto',
  },
}));


class Home extends Component {
  static contextTypes = {
    styleManager: customPropTypes.muiRequired,
  };

  constructor(props) {
    super(props);
    this.renderPost = this.renderPost.bind(this);
    this.wrapGridItem = this.wrapGridItem.bind(this);
  }

  componentWillMount() {
    this.props.getPosts();
  }

  componentDidUpdate() {
    if(this.props.fetchError){
      Alert.error('Problem occurred fetching from server. Please try again later.', {
        position: 'bottom',
        effect: 'scale',
        timeout: 'none'
      });
    }
  }

  wrapGridItem(card, key) {
    const classes = this.context.styleManager.getClasses(styleSheet);
    return (
      <div className={classes.gridItem} key={key}>
        {card}
      </div>
    );
  }

  renderPost(post) {
    const source = this.props.sources[post.source];
    const key = post._id;
    if(post.kind === 'article'){
      return this.wrapGridItem(<ArticleCard article={post} source={source}/>, key);
    }
    else if(post.kind === 'youtubeVideo'){
      return this.wrapGridItem(<VideoCard video={post} source={source} />, key);
    }
  }

  render() {
    const classes = this.context.styleManager.render(styleSheet);

    const masonryOptions = {
      itemSelector: `.${classes.gridItem}`,
      gutter: 16,
      percentPosition: true,
    }

    return (
      <div>
        <InfiniteScroll
            pageStart={0}
            hasMore={this.props.hasMore}
            loadMore={this.props.loadMore}
            loader={
              <div className={classes.spinnerContainer}>
                <CircularProgress className={classes.loadingSpinner} size={50} />
              </div>}>
          <Masonry
            options={masonryOptions}
            updateOnEachImageLoad={true}>
            {this.props.posts.map(this.renderPost)}
          </Masonry>
        </InfiniteScroll>
        <Alert stack={{limit: 3}} />
      </div>
    );
  }
}

export default Home;