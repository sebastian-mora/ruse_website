import axios from 'axios';
import {API_ENDPOINT} from '../config'

export function getBlogs(){
  return axios.get(`${API_ENDPOINT}/blog`).then(res => {
    return res.data
  })
  .catch(err => {
    throw err
  });
}

export function getBlog(id){
  return axios.get(`${API_ENDPOINT}/blog/${id}`).then(res => {
    return res.data
  })
  .catch(err => {
    throw err
  });
}


export function addBlog(blog){


  return axios.post(`${API_ENDPOINT}/blog/create`, blog).then(res => {
    return res.data
  })
  .catch(err => {
    throw err
  });
}


export function updateBlogApi(blog){
  return axios.post(`${API_ENDPOINT}/blog/update`, blog).then(res => {
    return res.data
  })
  .catch(err => {
    throw err
  });
}

export function deleteBlogApi(id){
 
  return axios.post(`${API_ENDPOINT}/blog/delete`, {id}).then(res => {
    return res.data
  })
  .catch( err=> {
    throw err;
  })
}



