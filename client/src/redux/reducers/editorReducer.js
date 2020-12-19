import { EDITOR_FETCH_BLOG_FAILURE, EDITOR_FETCH_BLOG_REQUEST, EDITOR_FETCH_BLOG_SUCCESS, EDITOR_SAVE_FAIL, EDITOR_SAVE_SUCCESS, EDITOR_SAVE_ERROR_CLEAR,
  SELECT_BLOG, UPDATE_EDITOR_BLOG, CLOSE_EDITOR_BLOG, OPEN_NEW_BLOG, TOGGLE_PREVIEW} from '../actions/types'

const intialState = {
  editorShow: false,
  loaded: false,
  editorBlog: {
    id: null,
    title: "",
    date: "",
    post: "",
    isPosted: false,
    category: "",
    views: 0
  },
  isNewPost: false,
  preview: false,
  error: "",
  saveError: "",
  didSave: null
}

export default function(state=intialState, action){
  switch(action.type){

    case SELECT_BLOG:

      return {
        ...state,
        "editorBlog":{
          ...state.editorBlog,
          id: action.payload
        },
        editorShow: true,
        isNewPost: false
      }
    
      // update all blog editor attriubutes
    case UPDATE_EDITOR_BLOG:
      return {
        ...state,
        editorBlog: action.payload
      }
    
    case CLOSE_EDITOR_BLOG:
      return {
        intialState
      }
    
    case OPEN_NEW_BLOG:
      return {
        ...state,
        editorShow: true,
        isNewPost: true
      }
    
    case EDITOR_FETCH_BLOG_SUCCESS:
      return {
        ...state,
        loaded: true
      }
    
    case EDITOR_FETCH_BLOG_FAILURE:
      return {
        ...state,
        error: action.payload
      }

    case EDITOR_FETCH_BLOG_REQUEST:
      return {
        ...state,
        loaded: false
      }
    
    case EDITOR_SAVE_SUCCESS:
      return {
        ...state,
        didSave: true
      }
    
    case EDITOR_SAVE_FAIL:
      return {
        ...state, 
        didSave: false,
        saveError: action.payload
      }
    
    case EDITOR_SAVE_ERROR_CLEAR:
      return {
        ...state,
        didSave: null,
        saveError: ""
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

