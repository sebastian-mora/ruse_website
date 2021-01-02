import axios from 'axios';

import {API_ENDPOINT} from '../config'


export function getBlogByID(id){
  return axios.get(`${API_ENDPOINT}/blog/id/${id}`)
}

export function getBlogBySlug(slug){
  return axios.get(`${API_ENDPOINT}/blog/${slug}`)
}

export function getAllBlogs(){
  return axios.get(`${API_ENDPOINT}/blog`)
}

export function getCategoriesApi(){
  return axios.get(`${API_ENDPOINT}/blog/categories`).then(res => {
    return res.data
  })
  .catch(err => {
    console.log(err);
  });
}

export function addBlog(blog){
  return axios.post(`${API_ENDPOINT}/blog/create`, blog);
}


export function updateBlogApi(blog){
  return axios.post(`${API_ENDPOINT}/blog/update`, blog);
}

export function deleteBlogApi(id){
 
  return axios.post(`${API_ENDPOINT}/blog/delete`, {id}).then(res => {
    return res.data
  })
  .catch( err=> {
    console.log(err.request);
  })
}



