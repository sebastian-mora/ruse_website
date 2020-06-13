import React, {Component} from 'react';
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
import Logout from './components/Logout/Logout';


import {connect} from 'react-redux';
import {checkToken} from './redux/actions/authActions'




class App extends Component{

  componentDidMount(){
    this.props.dispatch(checkToken())
  }

  render(){

    const isAuthd = this.props.user.isAuthd

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
              <Route  path={"/logout"} component={Logout}/>
              <PrivateRoute  component={Admin} isAuthd={isAuthd} path={"/admin"}/>
            </Switch>
          </div>
        </Router>
    );
  }
}

function mapStateToProps(state){
  return {
    user: state.user
  }
}

const PrivateRoute = ({ component: Component,  isAuthd, ...rest }) => {  
  return(
    <Route
    {...rest}
    render={props =>
      isAuthd? (
        <Component {...props} />
      ) : (
        <Route to="/login" component={Login} />
      )
    }
  />
);
  
}







export default connect(mapStateToProps)(App);
