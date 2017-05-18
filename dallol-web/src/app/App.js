import React, { Component } from 'react';
import Nav from './components/Nav';
import Home from 'home/Home';
import Article from 'article/Article';
import { 
  Route,
  Switch,
  matchPath
} from 'react-router-dom';
import YoutubeModal from './components/YoutubeModal';

class Content extends Component {

  previousLocation = '/'

  componentWillUpdate(nextProps) {
    const { location } = this.props;

    if(nextProps.history.action !== 'POP' &&
      (!location.state || !location.state.modal)) {
        this.previousLocation = this.props.location;
      }
  }

  isModalLocation() {
    return matchPath(this.props.location.pathname, {path: '/youtube/:id'}) !== null;
  }
 
  render() {
    return (
      <div>
        <Nav />
        <Switch location={ this.isModalLocation() ? this.previousLocation : this.props.location }>
          <Route component={Home} />
        </Switch>
        <Route path='/youtube/:id' render={({match, history}) => 
          <YoutubeModal 
            videoId={match.params.id}
            history={history} />}
            referrr={this.previousLocation} />
      </div>
    );
  }
}

function App() {
  return (
    <Switch>
      <Route path='/article/:id' component={Article} />
      <Route component={Content} />
    </Switch>
  );
}

export default App;