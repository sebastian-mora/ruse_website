import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import './App.css';

// configs
import PrivateRoute from './utils/PrivateRoute';
import setAuthToken from './utils/setAuthToken';


// Add comps
import Nav from './components/Nav/Nav'
import Index from './components/Index/index'
import About from './components/About/About'
import Blog from './components/Blog/Blog'
import BlogPage from './components/Blog/BlogPage'
import Login from './components/Login/Login'
import Admin from './components/Admin/Admin'


function App() {

  setAuthToken(localStorage.jwt)
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

          <PrivateRoute path={"/admin"} component={Admin}/>

        </Switch>
      </div>
    </Router>
  );
}

export default App;
