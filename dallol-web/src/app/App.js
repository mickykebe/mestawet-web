import React, { Component } from 'react';
import { createStyleSheet } from 'jss-theme-reactor';
import customPropTypes from 'material-ui/utils/customPropTypes';
import Nav from './components/Nav';
import HomeContainer from 'home/containers/HomeContainer';
import {
  Route,
  Switch,
  matchPath
} from 'react-router-dom';
import { connect } from 'react-redux';
import { homePath, articlePath, videoPath, videoStandalonePath } from 'app/routes';
import AsyncArticle from 'article/containers/AsyncArticle';
import Modal from 'app/components/Modal';
import AsyncVideo from 'video/containers/AsyncVideo';
import Video from 'video/components/Video';
import VideoStandalone from 'video/containers/VideoStandalone';
import { fetchSources, fetchHomePosts } from 'home/actions';
import { withRouter } from 'react-router';

const stylesheet = createStyleSheet('Content', theme => ({
  'content': {
    padding: '80px 8px 8px',
    maxWidth: '1280px',
    margin: '0 auto',
  }
}));

class Content extends Component {
  static contextTypes = {
    styleManager: customPropTypes.muiRequired,
  };

  previousLocation = null;

  componentWillUpdate(nextProps) {
    const { location } = this.props;

    if(nextProps.history.action !== 'POP' &&
      (!location.state || !location.state.modal)) {
        this.previousLocation = this.props.location;
      }
  }

  isModalLocation() {
    return matchPath(this.props.location.pathname, { path: videoPath, exact: true }) !== null;
  }
 
  render() {
    const classes = this.context.styleManager.render(stylesheet);
    const prevLocOrHome = this.previousLocation || { pathname: homePath };

    return (
      <div>
        <Route component={Nav} />
        <div className={classes.content}>
          <Switch location={ this.isModalLocation() ? prevLocOrHome : this.props.location }>
            <Route path={articlePath} render={({match, history}) => 
              <AsyncArticle
                match={match}
                history={history}
                prevLocation={this.previousLocation} />
            }/>
            <Route exact path={videoStandalonePath} render={({match, history}) => {
              return (
                <AsyncVideo id={match.params.id}>
                  <VideoStandalone />
                </AsyncVideo>
              ); }
            }/>
            <Route path={homePath} component={HomeContainer} />
          </Switch>
          <Route path={videoPath} exact render={({match, history}) =>
            <Modal 
              history={history}
              prevLocation={prevLocOrHome}>
                <AsyncVideo id={match.params.id}>
                  <Video />
                </AsyncVideo>
            </Modal>} />
        </div>
      </div>
    );
  }
}

class App extends Component {

  componentWillMount() {
    this.props.getPosts();
  }

  render() {
    return (
      <Route component={Content} />
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
     getPosts: () => dispatch(fetchSources(() => fetchHomePosts())) 
    };
};

export default withRouter(connect(null, mapDispatchToProps)(App));