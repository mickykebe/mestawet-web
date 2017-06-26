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
import { articlePath, videoPath } from 'app/routes';
import AsyncArticle from 'article/containers/AsyncArticle';
import VideoModal from 'video/containers/VideoModal';

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

  previousLocation = { pathname: '/' };

  componentWillUpdate(nextProps) {
    const { location } = this.props;

    if(nextProps.history.action !== 'POP' &&
      (!location.state || !location.state.modal)) {
        this.previousLocation = this.props.location;
      }
  }

  isModalLocation() {
    return matchPath(this.props.location.pathname, { path: videoPath }) !== null;
  }
 
  render() {
    const classes = this.context.styleManager.render(stylesheet);

    return (
      <div>
        <Nav />
        <div className={classes.content}>
          <Switch location={ this.isModalLocation() ? this.previousLocation : this.props.location }>
            <Route path={articlePath} component={AsyncArticle} />
            <Route component={HomeContainer} />
          </Switch>
          <Route path={videoPath} render={({match, history}) =>
            <VideoModal
              id={match.params.id}
              history={history} />}
              referrer={this.previousLocation} />
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <Route component={Content} />
  );
}

export default App;