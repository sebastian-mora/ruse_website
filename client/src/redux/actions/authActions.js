import axios from 'axios'

import {
  LOGIN_FAIL,
  USER_LOADED,
  LOGIN_SUCCESS
} from '../actions/types'



export const loginFailed = () =>{
  return{
    type: LOGIN_FAIL
  }
}


export const loginUser = (user) =>{

  // Store the JWT in the session
  sessionStorage.setItem('jwt', user.jwt)

  return {
    type: LOGIN_SUCCESS,
    payload: user
  }
}

export const checkToken = () => {

  const token = sessionStorage.getItem('jwt');
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  }

  if(token){
    config.headers["fuckyou-key"] = token
  }


  return (dispatch) =>{
    axios.get('/api/auth/user', config)
    .then(res => {
      const data = res.data
      dispatch({type: USER_LOADED,
      payload: data})
    })
  }
}
