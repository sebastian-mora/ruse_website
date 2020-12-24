import {FETCH_USERS_SUCCESS, FETCH_USERS_REQUEST, FETCH_USERS_FAILURE, DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAILURE} from './types'
import {getUsers, deleteUser} from '../../api/adminApi' 


export const fetchUsers = () => {

  return (dispatch) =>{
    dispatch({type:FETCH_USERS_REQUEST})
    getUsers().then((res) => {
      dispatch({type: FETCH_USERS_SUCCESS, payload: res.data})
    })
    .catch((err) => ({type: FETCH_USERS_FAILURE}))
  }
}

export const removeUser = (userid) => {

  return (dispatch) =>{
    dispatch({type:DELETE_USER_REQUEST})
    deleteUser(userid).then((res) => {
      dispatch({type: DELETE_USER_SUCCESS})
    })
    .catch((err) => ({type: DELETE_USER_FAILURE}))
  }
}


