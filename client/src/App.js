import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import './App.css';

import Nav from './components/Nav/Nav'

import Index from './components/Index/index'
import About from './components/About/About'
import Blog from './components/Blog/Blog'
import BlogPage from './components/Blog/BlogPage'
import Login from './components/Login/Login'


function App() {
  return (
    <Router>
      <div >
        <Nav />
        <Switch>
          <Route path ="/" exact component={Index} />
          <Route path ="/about" exact component={About} />
          <Route exact path = "/blog"  component={Blog} />
          <Route  path={"/blog/:id"} component={BlogPage}/>
          <Route  path={"/login"} component={Login}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
