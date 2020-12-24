import { FETCH_USERS_REQUEST, FETCH_USERS_SUCCESS, FETCH_USERS_FAILURE, DELETE_USER_SUCCESS} from '../actions/types'

const intialState = {
  users: [], 
  loadingUsers: false,
  refreshList: false
}

export default function(state=intialState, action){
  switch(action.type){

    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
        loadingUsers: false,
        refreshList: false
      }
    
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loadingUsers: true
      }
    
    case FETCH_USERS_FAILURE:
      return {
        ...state,
        loadingUsers: false
      }

    case DELETE_USER_SUCCESS:
      return {
        ...state,
        refreshList: true
      }
  
    default:
      return state
  }

}

