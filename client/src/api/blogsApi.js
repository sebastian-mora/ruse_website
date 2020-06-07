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


  return axios.post(`blog/create`, blog).then(res => {
    return res.data
  })
  .catch(err => {
    return err
  });
}


export function updateBlogApi(blog){
  return axios.post(`blog/update`, blog).then(res => {
    return res.data
  })
  .catch(err => {
    return err
  });
}



