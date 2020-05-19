import axios from 'axios';

export function getBlogs(){
  return axios.get('/blog').then(res => {
    return res.data
  })
  .catch(err => {
    return err
  });
}

export function getBlog(id){
  return axios.get(`/blog/${id}`).then(res => {
    return res.data
  })
  .catch(err => {
    return err
  });
}


export function addBlog(blog){
  return axios.get(`/blog`).then(res => {
    return res.data
  })
  .catch(err => {
    return err
  });
}


export function updateBlog(blog){
  return axios.get(`/blog`).then(res => {
    return res.data
  })
  .catch(err => {
    return err
  });
}



