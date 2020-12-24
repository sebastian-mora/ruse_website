import { FETCH_BLOG_SUCCESS, FETCH_BLOG_REQUEST, LOAD_CATEGORIES} from '../actions/types'


const intialState = {
  "blogs": [],
  loading:false,
  "categories":[]
}



export default function(state=intialState, action){

  switch(action.type){
    
    case FETCH_BLOG_SUCCESS:
      return {
        ...state,
        blogs: action.payload,
        loading: false
      }
    
    case FETCH_BLOG_REQUEST:
      return {
        ...state,
        loading: true
      }
    
    case LOAD_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      }
    
    default:
      return state

  }

}
