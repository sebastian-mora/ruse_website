import axios from 'axios';

import {API_ENDPOINT} from '../config'


export function getBlogBySlug(slug){
  return axios.get(`${API_ENDPOINT}/blogs/${slug}`)
}


export function getAllBlogs(){
  return axios.get(`${API_ENDPOINT}/blogs`)
}




