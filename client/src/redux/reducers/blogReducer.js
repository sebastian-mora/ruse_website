import {LOAD_BLOGS, SELECT_BLOG, UPDATE_NEW_BLOG} from '../actions/types'

const intialState = {
  "blogs": [],
  "selectedBlog": null,
  "editorShow": false,
  "newBlog": {}
}



export default function(state=intialState, action){

  switch(action.type){
    case LOAD_BLOGS:
      return {
        ...state,
        blogs: action.payload,
      }

    case SELECT_BLOG:
      return {
        ...state,
        selectedBlog: action.payload,
        editorShow: true,
        newBlog: state.blogs.find(blog => blog.id === parseInt(action.payload))
      }
    
    case UPDATE_NEW_BLOG:
      return {
        ...state,
        newBlog: action.payload
      }
    
    default:
      return state

  }

}
