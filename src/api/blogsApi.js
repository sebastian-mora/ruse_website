import axios from 'axios';

import {API_ENDPOINT} from '../config'

export const api = axios.create()

export function getBlogBySlug(slug){
  return api.get(`${API_ENDPOINT}/blogs/${slug}`)
}

export function getAllBlogs(){
  return api.get(`${API_ENDPOINT}/blogs`)
}

export function postBlog(formData, token){
  const config = {
    headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `${token}`
    }
  }
  return api.post(`${API_ENDPOINT}/blogs/add`, formData, config)
}

export function deleteBlog(id, token){
  const config = {
    headers: {
        'Authorization': `${token}`
    }
  }
  return api.post(`${API_ENDPOINT}/blogs/delete`, {id}, config)
}




