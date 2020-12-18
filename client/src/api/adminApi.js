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

export function uploadImage(blog_id, image){

  var form = new FormData();
  form.append('image', image);
  form.append('blog_id', blog_id);

  console.log(form);


  return axios.post(`${API_ENDPOINT}/admin/upload/image`, form, { headers: {'content-type': "form-data"} }).then(res => {
    return res.data
  })
  .catch(err => {
    throw err.request.response
  });
}


export function getUsers(){
  return axios.get(`${API_ENDPOINT}/admin/user/list`).then(res => {
    return res.data
  })
  .catch(() => {
    return false
  });
}

export function deleteUser(userid){
  return axios.post(`${API_ENDPOINT}/admin/user/delete`, {userid}).then(res => {
    return res.data
  })
  .catch(err => {
    throw err.request.response
  });
}

export function addUser(username, email, password){
  return axios.post(`${API_ENDPOINT}/admin/user/add`, username, email, password).then(res => {
    return res.data
  })
  .catch(err => {
    throw err.request.response
  });
}

export function resetPassword(userid, pass){
  return axios.post(`${API_ENDPOINT}/admin/user/reset`, {userid, pass}).then(res => {
    return res.data
  })
  .catch(err => {
    throw err.request.response
  });
}