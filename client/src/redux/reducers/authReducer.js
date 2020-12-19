import {LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCESSS, USER_LOADED, FAILED_AUTH_CHECK} from '../actions/types'


const intialState = {
  "isAuthd": false,
  "loginMessage": ""
}

export default function(state=intialState, action){

  switch(action.type){

    case LOGIN_SUCCESS:
  
      return {
        ...state,
        isAuthd: true,
        user: action.payload.user,
        login_time: action.payload.login_time,
        username: action.payload.username
      }
    
      case USER_LOADED:
        return {
          ...state,
          isAuthd: true
        }

    case LOGIN_FAIL:

      return {
        ...state,
        token: null,
        isAuthd: false,
        user:null,
        loginMessage: action.payload
      }

    case LOGOUT_SUCESSS:
      return {
        ...state,
        token: null,
        isAuthd: false,
        user:null
      }
    
    case FAILED_AUTH_CHECK:
      return {
        ...state,
        token: null,
        isAuthd: false,
        user: null
      }

    default:
      return state
  }
}
