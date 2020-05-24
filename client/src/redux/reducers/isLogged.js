import {LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCESSS, USER_LOADED} from '../actions/types'


const intialState = {
  "username": "BEFORE",
  "login_time": null,
  "isAuthd": false
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
