import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import Nav from './components/Nav';
import HomeContainer from 'home/containers/HomeContainer';
import {
  Route,
  Switch,
  matchPath
} from 'react-router-dom';
import { articlePath, videoPath } from 'app/routes';
import Article from 'article/containers/Article';
import VideoModal from 'video/containers/VideoModal';

class Content extends Component {

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
    return (
      <div>
        <Nav />
        <Switch location={ this.isModalLocation() ? this.previousLocation : this.props.location }>
          <Route component={HomeContainer} />
        </Switch>
        <Route path={videoPath} render={({match, history}) => 
          <VideoModal 
            id={match.params.id}
            history={history} />}
            referrer={this.previousLocation} />
      </div>
    );
  }
}

function App() {
  return (
    <Provider store={store}>
      <Switch>
        <Route path={articlePath} component={Article} />
        <Route component={Content} />
      </Switch>
    </Provider>
  );
}

export default App;