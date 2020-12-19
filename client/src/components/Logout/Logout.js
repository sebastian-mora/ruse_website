import React from 'react';
import {removeSession} from '../../redux/actions/authActions'
import { useDispatch } from 'react-redux';
import {Redirect} from 'react-router-dom';



const Logout = () => {
  const dispatch = useDispatch()
  dispatch(removeSession())
  
  return (

    <div>
      <Redirect to="/"></Redirect>
    </div>

  )

}

export default Logout;