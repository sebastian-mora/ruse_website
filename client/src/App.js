import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';


import './App.css';


// Add comps
import Nav from './components/Nav/Nav'
import Index from './components/Index/index'
import About from './components/About/About'
import Blog from './components/Blog/Blog'
import BlogPage from './components/Blog/BlogPage'
import Login from './components/Login/Login'
import Admin from './components/Admin/Admin'

//redux 
import {createStore} from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './redux/reducers'
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(rootReducer, composeWithDevTools());


function App() {

  return (
    <Provider store={store}>
      <Router>
        <div >
          <Nav />
          <Switch>
            <Route path ="/" exact component={Index} />
            <Route path ="/about" exact component={About} />
            <Route exact path = "/blog"  component={Blog} />
            <Route  path={"/blog/:id"} component={BlogPage}/>
            <Route  path={"/login"} component={Login}/>
            <Route path={"/admin"} component={Admin}/>

          </Switch>
        </div>
      </Router>
      </Provider>
  );
}

export default App;
