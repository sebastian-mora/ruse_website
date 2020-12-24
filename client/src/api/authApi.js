import axios from 'axios';
import {API_ENDPOINT} from '../config'

export function loginApi(username, password){
  return axios.post(`${API_ENDPOINT}/login`, {username, password})
}

export function checkTokenApi(token){

  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  }
  config.headers["fuckyou-key"] = token
  axios.defaults.headers.common['fuckyou-key'] = token

  return axios.get(`${API_ENDPOINT}/api/auth/user`)
}
