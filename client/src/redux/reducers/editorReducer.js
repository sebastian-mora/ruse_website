import { EDITOR_FETCH_BLOG_FAILURE, EDITOR_FETCH_BLOG_REQUEST, EDITOR_FETCH_BLOG_SUCCESS, EDITOR_SAVE_FAIL, EDITOR_SAVE_SUCCESS, EDITOR_SAVE_ERROR_CLEAR,
  SELECT_BLOG, UPDATE_EDITOR_BLOG, CLOSE_EDITOR_BLOG, OPEN_NEW_BLOG, TOGGLE_PREVIEW, EDITOR_FETCH_IMAGES_REQUEST,
  EDITOR_SAVE_IMAGES_REQUEST, EDITOR_SAVE_IMAGES_SUCCUESS,EDITOR_SAVE_IMAGES_FAILURE,
  EDITOR_FETCH_IMAGES_SUCCUESS, EDITOR_FETCH_IMAGES_FAILURE} from '../actions/types'

const intialState = {
  images: [],
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
  loaded: false,
  loadingImages: false,
  savingImage: false,
  newUploadedImage: false,
  newBlogUploaded: false,
  editorShow: false,
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

        return intialState
    
    
    case OPEN_NEW_BLOG:
      return {
        ...state,
        editorShow: true,
        isNewPost: true,
        loaded: true
      }
    
    case EDITOR_FETCH_BLOG_SUCCESS:
      return {
        ...state,
        loaded: true,
        newBlogUploaded: false
      }
    
    case EDITOR_FETCH_BLOG_FAILURE:
      return {
        ...state,
        error: action.payload,
        loaded: true
      }

    case EDITOR_FETCH_BLOG_REQUEST:
      return {
        ...state,
        loaded: false
      }
    
    case EDITOR_SAVE_SUCCESS:
      return {
        ...state,
        didSave: true,
        newBlogUploaded: true
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
    
    case EDITOR_FETCH_IMAGES_REQUEST:
      return {
        ...state, 
        loadingImages: true
      }

    case EDITOR_FETCH_IMAGES_SUCCUESS:
      return {
        ...state,
        images: action.payload,
        loadingImages: false,
        newUploadedImage: false
      }

    case EDITOR_FETCH_IMAGES_FAILURE:
      return {
        ...state,
        loadingImages: false
      }

    case EDITOR_SAVE_IMAGES_REQUEST:
      return {
        ...state,
        savingImage: true
      }
    
    case EDITOR_SAVE_IMAGES_SUCCUESS:
      return {
        ...state,
        savingImage: false,
        newUploadedImage: true
      }
    
    case EDITOR_SAVE_IMAGES_FAILURE:
      return {
        ...state,
        savingImage: false
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

