import {EDITOR_FETCH_BLOG_FAILURE, EDITOR_FETCH_BLOG_SUCCESS, SELECT_BLOG, UPDATE_EDITOR_BLOG, 
  OPEN_NEW_BLOG, CLOSE_EDITOR_BLOG, TOGGLE_PREVIEW, 
  EDITOR_SAVE_SUCCESS, EDITOR_SAVE_FAIL,
  EDITOR_FETCH_IMAGES_SUCCUESS, EDITOR_FETCH_IMAGES_FAILURE, EDITOR_SAVE_IMAGES_SUCCUESS, EDITOR_SAVE_IMAGES_FAILURE, EDITOR_SAVE_IMAGES_REQUEST} from './types'
import {addBlog, updateBlogApi, deleteBlogApi, getBlogByID} from '../../api/blogsApi';
import {getImages, uploadImage} from '../../api/adminApi';

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
    addBlog(blog).then((res) => {
      dispatchEvent({type: EDITOR_SAVE_SUCCESS})
    })
    .catch((err) => {
      dispatch({type: EDITOR_SAVE_FAIL, payload: err})
    })
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

    getBlogByID(blogid).then((res) =>{
      dispatch({type: UPDATE_EDITOR_BLOG, payload: res.data})
      dispatch({type: EDITOR_FETCH_BLOG_SUCCESS})
    })
    .catch((err) => {
      dispatch({type: EDITOR_FETCH_BLOG_FAILURE, payload:err })
    })
  }
}

export const fetchBlogImages = (blogid) =>{
  return(dispatch) => {
    getImages(blogid).then((res) =>{
      dispatch({type: EDITOR_FETCH_IMAGES_SUCCUESS, payload: res.data })
    })

    .catch((err) =>{
      dispatch({type: EDITOR_FETCH_IMAGES_FAILURE})
    })
  }
}

export const saveBlogImage = (blogid, file) => {
  return (dispatch) => {
    dispatch({type: EDITOR_SAVE_IMAGES_REQUEST})
    uploadImage(blogid, file).then(() =>{
      dispatch({type: EDITOR_SAVE_IMAGES_SUCCUESS})
    })
    .catch( (err) =>{ 
      dispatch({type: EDITOR_SAVE_IMAGES_FAILURE})
    })
  }
  }

