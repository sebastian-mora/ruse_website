import {FETCH_BLOG_FAILURE, FETCH_BLOG_SUCCESS, FETCH_BLOG_REQUEST, LOAD_CATEGORIES} from './types'
import {getBlogs,  getCategoriesApi} from '../../api/blogsApi';


// FETCH STATE FUCTIONS

// PENDING REQUEST
export const fetchBlogsRequest = () => {
  return {
    type: FETCH_BLOG_REQUEST
  }
}

// request sucess
export const fetchBlogsSuccess = (blogs) => {
  return {
    type: FETCH_BLOG_SUCCESS,
    payload: blogs
  }
}

//request fail
export const fetchBlogsFailure = () => {
  return {
    type: FETCH_BLOG_FAILURE
  }
}

export const loadBlogs = () => {
  return (dispatch) =>{
    dispatch(fetchBlogsRequest())
    getBlogs()
    .then(data => {
      dispatch(fetchBlogsSuccess(data))
    })
    .catch( err => {
      dispatch(fetchBlogsFailure())
    })
  }
}

export const loadCategories = () =>{
  return (dispatch) =>{
    getCategoriesApi()
    .then(data => {
      dispatch({type: LOAD_CATEGORIES, payload: data})
    })
  }
}






