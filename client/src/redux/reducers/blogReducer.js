import {LOAD_BLOGS, SELECT_BLOG, UPDATE_EDITOR_BLOG, CLOSE_EDITOR_BLOG, OPEN_NEW_BLOG, LOAD_CATEGORIES, TOGGLE_PREVIEW} from '../actions/types'

const intialState = {
  "blogs": [],
  "categories":[],
  "selectedBlog": null,
  "editorShow": false,
  "editorBlog": {
    id: null,
    title: "",
    date: "",
    isPosted: false,
    category: "",
    views: 0
  },
  "isNewPost": false,
  "preview": false
}



export default function(state=intialState, action){

  switch(action.type){
    
    case LOAD_BLOGS:
      return {
        ...state,
        blogs: action.payload
      }
    
    case LOAD_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      }

    case SELECT_BLOG:
      return {
        ...state,
        selectedBlog: action.payload,
        editorShow: true,
        isNewPost: false,
        editorBlog: state.blogs.find(blog => blog.id === parseInt(action.payload))
      }
    
    case UPDATE_EDITOR_BLOG:
      return {
        ...state,
        editorBlog: action.payload
      }

    case CLOSE_EDITOR_BLOG:
      return {
        ...state,
        "selectedBlog": null,
        "editorShow": false,
        "editorBlog": {
          id: null,
          title: "",
          date: "",
          isPosted: false,
          views: 0
        },
        "isNewPost": false
      }
    
    case OPEN_NEW_BLOG:
      return {
        ...state,
        editorShow: true,
        isNewPost: true
      }

    case TOGGLE_PREVIEW:
      return {
        ...state,
        preview: !state.preview
      }
    
    default:
      return state

  }

}
