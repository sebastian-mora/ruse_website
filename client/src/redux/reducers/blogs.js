import {getBlogs} from '../../api/blogsApi'

const blogReducer = (state = {}, action) => {
  switch(action.type){
    case 'GET_BLOGS':
      return {...state,
              blogs: getBlogs()
              }
    default:
      return state
  }
}

export default loggedReducer;