import {LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCESSS, USER_LOADED} from '../actions/types'

const initialState = {
  jwt: localStorage.getItem('jwt'),
  isAuthd: null,
  user: null
}


export default function(state=initialState, action){

  switch(action.type){

    case LOGIN_SUCCESS:
  
      return {
        isAuthd: true,
        user: action.payload
      }
    
      case USER_LOADED:
        return {
          ...state,
          isAuthd: true,
          user: action.payload
        }

    case LOGIN_FAIL:
      localStorage.removeItem('jwt');
      return {
        ...state,
        token: null,
        isAuthd: false,
        user:null
      }

    case LOGOUT_SUCESSS:
      localStorage.removeItem('jwt');
      return {
        ...state,
        token: null,
        isAuthd: false,
        user:null
      }

    default:
      return state
  }
}
