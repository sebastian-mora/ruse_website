import {LOAD_BLOGS, SELECT_BLOG, UPDATE_NEW_BLOG, SAVE_NEW_BLOG} from './types'
import {getBlogs, addBlog} from '../../api/blogsApi';

export const loadBlogs = () => {
  return (dispatch) =>{
    getBlogs()
    .then(data => {
      dispatch({type: LOAD_BLOGS,
      payload: data})
    })
  }
}

export const selectBlog = (id) => {
  return (dispatch) =>{
    dispatch({type: SELECT_BLOG, payload: id})
  }
}

export const updateNewBlog = (blog) => {

  return (dispatch) =>{
    dispatch({type: UPDATE_NEW_BLOG, payload: blog})
  }
}

export const postBlog = (blog) =>{
  return (dispatch) => {
    addBlog(blog)
  }
  
}


