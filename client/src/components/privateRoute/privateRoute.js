import React from 'react';
import {BrowserRouter as Route, Redirect} from 'react-router-dom';


const PrivateRoute = ({ component: Component, ...rest }) => {

  return(
    <Route
    {...rest}
    render={props =>
      called() === true ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />

  )

}

const called = () =>{
  console.log("CALLED");
  return true
  
}


export default PrivateRoute;