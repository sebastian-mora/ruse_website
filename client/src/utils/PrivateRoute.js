import React, { useState, useEffect } from 'react';
import {Route, Redirect} from 'react-router-dom';
import axios from 'axios';


const PrivateRoute = ({ component: Component, ...rest }) => {

  const [authd, setAuthd] = useState(false);

  function checkAuth(){
    axios.get("/admin").then((result) => {
        if(result.status === 200){
          setAuthd(true)
        }
    })
  }

  useEffect(() => {
    checkAuth()
    console.log(`CHECKED AUTH ${authd}`);
    
  });

  
  return (
    <div>
      <Route {...rest} render={(props) => (
          authd === true
            ? <Component {...props} />
            : <Redirect to='/login' />
        )} />
    </div>
  )
}

export default PrivateRoute;