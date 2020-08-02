import axios from 'axios'
import {loginApi, checkTokenApi} from '../../api/authApi'

import {
  LOGIN_FAIL,
  USER_LOADED,
  LOGIN_SUCCESS,
  FAILED_AUTH_CHECK
} from '../actions/types'



export const loginFailed = () =>{
  return{
    type: LOGIN_FAIL
  }
}


export const loginUser = (username, password) =>{

  // Store the JWT in the session
  

  return (dispatch) => {

    loginApi(username, password).then( (response) => {

      if(response){ 
        const user =  {
          jwt: response.accessToken,
          username: response.username,
          login_time: response.login_time
        }

        sessionStorage.setItem('jwt', user.jwt)
 
        dispatch({
          type: LOGIN_SUCCESS,
          payload: user
        });

      }
      
        else {
          dispatch({
            type: FAILED_AUTH_CHECK
        });
      }

    });
}
}

  


export const checkToken = () => {

  return (dispatch) =>{

    checkTokenApi().then( (result) => {
      if(result){
        dispatch({type: USER_LOADED,
          payload: result})
      }

      else{
        dispatch({
          type: FAILED_AUTH_CHECK
        })
      }
    } )

    .catch( () => {
      dispatch({
        type: FAILED_AUTH_CHECK
      })
    })
  }
}
