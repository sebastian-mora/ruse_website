import {loginApi, checkTokenApi} from '../../api/authApi'

import {
  LOGIN_FAIL,
  USER_LOADED,
  LOGIN_SUCCESS,
  FAILED_AUTH_CHECK, 
  LOGOUT_SUCESSS
} from '../actions/types'


export const loginUser = (username, password) =>{

  // Store the JWT in the session
  return (dispatch) => {

    loginApi(username, password).then( (res) => {
      const user =  {
        jwt: res.accessToken,
        username: res.username,
        login_time: res.login_time
      }

      sessionStorage.setItem('jwt', user.jwt)
 
      dispatch({
        type: LOGIN_SUCCESS,
        payload: user
      });

    })
    .catch ((err) =>{
      dispatch({
        type: LOGIN_FAIL,
        payload: err
      })
    })
  }
}


export const checkToken = () => {

  return (dispatch) =>{

    const token = sessionStorage.getItem('jwt');

    if(token){

      checkTokenApi(token) 
      .then( (result) => {
        if (result){
          dispatch({type: USER_LOADED,
            payload: result})
        }

        else{
          dispatch({
            type: FAILED_AUTH_CHECK
          })
        }
      })
      .catch( () => {
        dispatch({
          type: FAILED_AUTH_CHECK
        })
      })
      
    }
    else{
      dispatch({
        type: FAILED_AUTH_CHECK
      })
    }
  }
}

export const removeSession = () =>{
  return (dispatch) => {
    sessionStorage.clear('jwt')
    dispatch({type: LOGOUT_SUCESSS})
  }
}
