import React from 'react';
import Nav from './components/Nav';
import Home from 'home/Home';
import Article from 'article/Article';
import { 
  Route,
  Switch
} from 'react-router-dom';

function Content() {
  return (
    <div>
      <Nav />
      <Switch>
        <Route component={Home} />
      </Switch>
    </div>
  );
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