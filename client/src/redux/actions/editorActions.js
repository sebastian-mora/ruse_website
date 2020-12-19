import {EDITOR_FETCH_BLOG_FAILURE, EDITOR_FETCH_BLOG_SUCCESS, SELECT_BLOG, UPDATE_EDITOR_BLOG, OPEN_NEW_BLOG, CLOSE_EDITOR_BLOG, TOGGLE_PREVIEW, EDITOR_SAVE_SUCCESS, EDITOR_SAVE_FAIL} from './types'
import {addBlog, updateBlogApi, deleteBlogApi, getBlog} from '../../api/blogsApi';

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

export const togglePreview = () => {
  return (dispatch => {
    dispatch({type: TOGGLE_PREVIEW})
  })
}

export const selectBlog = (id) => {
  return (dispatch) =>{
    dispatch({type: SELECT_BLOG, payload: id})
  }
}

// Update the local blog instance
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

// Send editor blog to api
export const updateBlog = (blog) => {
  return (dispatch) =>{ 
    updateBlogApi(blog).then( (res) =>{
      dispatch({type: EDITOR_SAVE_SUCCESS})
    })
    .catch((err) =>{
      dispatch({type: EDITOR_SAVE_FAIL, payload: err})
    })
  }
}

export const deleteBlog = (blog) =>{
  
  const id = blog.id;

  return (dispatch) =>{
    deleteBlogApi(id)
  }
}

export const fetchBlog = (blogid) =>{
  return(dispatch) => {

    getBlog(blogid).then((res) =>{
      dispatch({type: UPDATE_EDITOR_BLOG, payload: res.data})
      dispatch({type: EDITOR_FETCH_BLOG_SUCCESS})
    })
    .catch((err) => {
      dispatch({type: EDITOR_FETCH_BLOG_FAILURE, payload:err })
    })
  }
}
