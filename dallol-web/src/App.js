import React, { Component } from 'react';
import customPropTypes from 'material-ui/utils/customPropTypes';
import { createStyleSheet } from 'jss-theme-reactor';
import Nav from './components/Nav';
import ArticleCard from './components/ArticleCard';
import YoutubeCard from './components/YoutubeCard';
import YoutubeModal from './components/YoutubeModal';
import Masonry from 'react-masonry-component';
import InfiniteScroll from 'react-infinite-scroller';
import { CircularProgress } from 'material-ui/Progress';
import Alert from 'react-s-alert';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/scale.css';

const styleSheet = createStyleSheet('App', (theme) => {
  return {
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
        color: theme.palette.accent.A400,
        textDecoration: 'none',
      },
      'a:hover': {
        textDecoration: 'underline',
      },
      img: {
        maxWidth: '100%',
        height: 'auto',
        width: 'auto',
      },
    },
    content: {
      padding: '80px 8px 8px',
      maxWidth: '1280px',
      margin: '0 auto',
    },
    gridItem: {
      width: '100%',
      paddingBottom: '16px',
      '@media (min-width: 600px)': {
        width: '48%'
      },
      '@media (min-width: 960px)': {
        width: '32%'
      }
    },
    spinnerContainer: {
      width: '100%',
    },
    loadingSpinner: {
      display: 'block',
      margin: '0 auto'
    }
  }
});

function getJSON(url) {
  return fetch(url)
    .then((response) => {
      if(!response.ok) {
        throw new Error('Problem fetching posts')
      }
      return response.json();
    });
}

function getPosts(offset = 0) {
  return getJSON(`/api/posts?offset=${offset}`)
    .then((postsResponse) => {
      if(postsResponse.error){
        throw new Error(postsResponse.error);
      }
      return postsResponse;
    })
}

function getSources() {
  return getJSON(`/api/sources`)
    .then((srcRes) => {
      if(srcRes.error){
        throw new Error(srcRes.error);
      }
      return srcRes;
    })
}

class App extends Component {
  static contextTypes = {
    styleManager: customPropTypes.muiRequired,
  };

  constructor(props) {
    super(props);

    this.state = { 
      hasMore: false, 
      sources: [], 
      posts: [], 
      nextOffset: 0, 
      curYoutubeVideoId: '',
    };
    this.openYoutubeVideo = this.openYoutubeVideo.bind(this);
    this.setPosts = this.setPosts.bind(this);
    this.setSources = this.setSources.bind(this);
    this.setNextOffset = this.setNextOffset.bind(this);
    this.getSource = this.getSource.bind(this);
    this.renderPost = this.renderPost.bind(this);
    this.wrapGridItem = this.wrapGridItem.bind(this);
    this.loadMorePosts = this.loadMorePosts.bind(this);
    this.clearCurrentVideoId = this.clearCurrentVideoId.bind(this);
    this.handleFetchError = this.handleFetchError.bind(this);
  }

  handleFetchError(error) {
    Alert.error('Problem occurred fetching from server. Please try again later.', {
      position: 'bottom',
      effect: 'scale',
      timeout: 'none'
    });
    this.setState({
      hasMore: false,
    });
  }

  clearCurrentVideoId() {
    this.setState({
      currentVideoId: '',
    });
  }

  setPosts(posts) {
    this.setState({
      posts: posts,
    });
  }

  addPosts(posts) {
    this.setState(prevState => ({ posts: prevState.posts.concat(posts)}));
  }

  setNextOffset(offset) {
    this.setState({
      nextOffset: offset,
      hasMore: true,
    });
  }

  setSources(sources) {
    this.setState({
      sources: sources,
    });
  }

  componentDidMount() {
    getSources()
      .then(this.setSources)
      .then(() => getPosts())
      .then((postsResponse) => {
        this.setPosts(postsResponse.posts);
        this.setNextOffset(postsResponse.nextOffset);
      })
      .catch(this.handleFetchError);
  }

  openYoutubeVideo(videoId) {
    this.setState({
      currentVideoId: videoId,
    });
  }

  getSource(post) {
    return this.state.sources.find(source => source._id === post.source);
  }

  wrapGridItem(card, key) {
    const classes = this.context.styleManager.getClasses(styleSheet);
    return (
      <div className={classes.gridItem} key={key}>
        {card}
      </div>
    );
  }

  loadMorePosts() {
    getPosts(this.state.nextOffset)
      .then((postsResponse) => {
        if(this.state.nextOffset !== postsResponse.nextOffset) {
          this.addPosts(postsResponse.posts);
          this.setNextOffset(postsResponse.nextOffset);
        }
        else {
          this.setState({
            hasMore: false,
          });
        }
      })
      .catch(this.handleFetchError);

  }

  renderPost(post) {
    const source = this.getSource(post);
    const key = post._id;
    if(post.kind === 'article'){
      return this.wrapGridItem(<ArticleCard article={post} source={source}/>, key);
    }
    else if(post.kind === 'youtubeVideo'){
      return this.wrapGridItem(<YoutubeCard video={post} source={source} onVideoClick={this.openYoutubeVideo} />, key);
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
        <Nav />
        <div className={classes.content}>
          <InfiniteScroll
              pageStart={0}
              hasMore={this.state.hasMore}
              loadMore={this.loadMorePosts}
              loader={
                <div className={classes.spinnerContainer}>
                  <CircularProgress className={classes.loadingSpinner} size={50} />
                </div>}>
            <Masonry
              options={masonryOptions}
              updateOnEachImageLoad={true}>
              {this.state.posts.map(this.renderPost)}
            </Masonry>
          </InfiniteScroll>
        </div>
        <Alert stack={{limit: 3}} />
        <YoutubeModal 
          videoId={this.state.currentVideoId}
          onDialogClose={this.clearCurrentVideoId} />
      </div>
    );
  }
}

export default App;