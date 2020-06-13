import {LOAD_BLOGS, SELECT_BLOG, UPDATE_EDITOR_BLOG, OPEN_NEW_BLOG, CLOSE_EDITOR_BLOG} from './types'
import {getBlogs, addBlog, updateBlogApi, deleteBlogApi} from '../../api/blogsApi';

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

export const updateEditorBlog = (blog) => {

  return (dispatch) =>{
    dispatch({type: UPDATE_EDITOR_BLOG, payload: blog})
  }
}

export const postBlog = (blog) =>{
  return (dispatch) => {
    addBlog(blog)
  }
}

export const updateBlog = (blog) => {
  return (dispatch) =>{ 
    updateBlogApi(blog)
  }
}

export const deleteBlog = (blog) =>{
  
  const id = blog.id;

  return (dispatch) =>{
    deleteBlogApi(id)
  }
}

export const closeEditorBlog = () =>{
  return (dispatch) =>{
    dispatch({
      type: CLOSE_EDITOR_BLOG
    })
  }
}


export const openNewBlog = () =>{
  return (dispatch) =>{
    dispatch({
      type: OPEN_NEW_BLOG
    })
  }
}


