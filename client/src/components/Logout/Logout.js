import React from 'react';
import {Redirect} from 'react-router-dom';



const Logout = () => {

  sessionStorage.clear();
  console.log("HERE");
  

  return (

    <div>

    </div>

  )

}

export default Logout;