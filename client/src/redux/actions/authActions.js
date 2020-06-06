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


export const loginUser = (username, password) =>{

  // Store the JWT in the session
  

  return (dispatch) => {
    axios.post('/login', {
      username,
      password
    })
    .then(function (response) {
      if(response.data.status){ 
        const user =  {
          jwt: response.data.accessToken,
          username: response.data.username,
          login_time: response.data.login_time
        }

        sessionStorage.setItem('jwt', user.jwt)
 
        dispatch({
          type: LOGIN_SUCCESS,
          payload: user
        });

      }
      
    })
    .catch(function () {
      dispatch({
          type: LOGIN_FAIL
      });

    });
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
    axios.defaults.headers.common['fuckyou-key'] = token
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
