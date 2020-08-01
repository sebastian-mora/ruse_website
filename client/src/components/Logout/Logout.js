import React from 'react';
import {Redirect} from 'react-router-dom';



const Logout = () => {

  sessionStorage.clear();
  
  

  return (

    <div>
      <Redirect to="/"></Redirect>
    </div>

  )

}

export default Logout;