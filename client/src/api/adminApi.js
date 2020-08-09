import axios from 'axios';
import {API_ENDPOINT} from '../config'

export function getImages(blog_id){

  return axios.get(`${API_ENDPOINT}/admin/${blog_id}/images`).then(res => {
    return res.data
  })
  .catch(() => {
    return false
  });
}