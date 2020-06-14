import axios from 'axios';

export function getBlogs(){
  return axios.get('/blog').then(res => {
    return res.data
  })
  .catch(err => {
    throw err
  });
}

export function getBlog(id){
  return axios.get(`/blog/${id}`).then(res => {
    return res.data
  })
  .catch(err => {
    throw err
  });
}


export function addBlog(blog){


  return axios.post(`blog/create`, blog).then(res => {
    return res.data
  })
  .catch(err => {
    throw err
  });
}


export function updateBlogApi(blog){
  return axios.post(`blog/update`, blog).then(res => {
    return res.data
  })
  .catch(err => {
    throw err
  });
}

export function deleteBlogApi(id){
 
  return axios.post(`blog/delete`, {id}).then(res => {
    return res.data
  })
  .catch( err=> {
    throw err;
  })
}



