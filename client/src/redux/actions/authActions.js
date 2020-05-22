import axios from 'axios'

import {
  LOGIN_FAIL,
  USER_LOADED,
  LOGIN_SUCCESS
} from '../actions/types'




export const fetchData = () => {

  const token = sessionStorage.getItem('jwt');
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  }

  if(token){
    config.headers["fuckyou-key"] = token
  }

  console.log(config);
  

  return (dispatch) =>{
    axios.get('/api/auth/user', config)
    .then(res => {
      const data = res.data
      dispatch({type: LOGIN_SUCCESS,
      payload: data})
    })
  }
}
