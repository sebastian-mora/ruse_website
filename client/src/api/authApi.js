import axios from 'axios';
import {API_ENDPOINT} from '../config'

export function loginApi(username, password){

  return axios.post(`${API_ENDPOINT}/login`, {username, password}).then(res => {
    return res.data
  })
  .catch(err => {
    console.log(err.request);
  });
}


export function checkTokenApi(){

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


  return axios.get(`${API_ENDPOINT}/api/auth/user`).then(res => {
    return res.data
  })
  .catch(err => {
    console.log(err.request);
    return false
  });

}