import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import {Helmet} from 'react-helmet'

import './App.css';


// Add comps
import Nav from './components/Nav/Nav'
import Index from './components/Index/index'
import About from './components/About/About'
import Blog from './components/Blog/Blog'
import BlogPage from './components/Blog/BlogPage'
import Projects from './components/Projects'
import Login from './components/Login/Login';
import Logout from './components/Logout/Logout';
import Dashboard from './components/Dashboard/Dashboard';

// Routing 

import ProtectedRoute from './components/Auth/ProtectedRoute'

class App extends Component{

  render(){

    return (
          <div >
          <Helmet>
            <title>Ruse</title>
            <meta name="description" content="An indirect means to gain an end. Ruse may imply deception,
                  illusion, and either an evil or harmless end." />
          </Helmet>
          <Nav />
            <Switch>
              <Route path ="/" exact component={Index} />
              <Route path ="/about" exact component={About} />
              {/* <Route path ="/projects" exact component={Projects} /> */}
              <Route exact path = "/blogs"  component={Blog} />
              <Route  path={"/blogs/:slug"} component={BlogPage}/>
              <Route exact path = "/login"  component={Login} />
              <Route exact path = "/logout"  component={Logout} />
              <ProtectedRoute  path="/dashboard" component={Dashboard} />
            </Switch>
          </div>
    );
  }
}



export default App;
