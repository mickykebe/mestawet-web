import React, { Component } from 'react';
import Nav from './components/Nav';
import Home from 'home/Home';
import { 
  Route
} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div>
        <Nav />
        <Route component={Home} />
      </div>
    );
  }
}

export default App;