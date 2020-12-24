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
      const data = res.data;
      const user =  {
        jwt: data.accessToken,
        username: data.username,
        login_time: data.login_time
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
        payload: err.data
      })
    })
  }
}


export const checkToken = () => {

  return (dispatch) =>{

    const token = sessionStorage.getItem('jwt');

    if(token){

      checkTokenApi(token) 
      .then( (res) => {
        const status = res.status;
        const data = res.data;

        if(status === 200){

          const user =  {
            jwt: data.accessToken,
            username: data.username,
            login_time: data.login_time
          }

          dispatch({type: USER_LOADED, payload: user})
        }
        else{
          dispatch({type: FAILED_AUTH_CHECK})
        }
      })
      .catch( () => {
        dispatch({type: FAILED_AUTH_CHECK})
      })
      
    }
    // If no token
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
