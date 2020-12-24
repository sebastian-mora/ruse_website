import React, {useState, useEffect} from 'react';
import { connect, useDispatch } from 'react-redux';
import {fetchUsers, removeUser}
 from '../../../../redux/actions/userManageActions'
import style from './style.module.css'

import UserList from './UserList';
import EditUser from './EditUser';
import AddUser from './AddUser'

const Users = ({users}) => {

  const [editUser, setEdit] = useState(false);
  const [addUser, setAddUser]  = useState(false);
  const [userId, setuserId] = useState();
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(fetchUsers())
  },[]);


  const editClick = (e) =>{
    setEdit(true)
    setuserId(Number(e.target.value))
  }

  const onClick = (e) =>{
    setEdit(false)
    setuserId()
  }

  const onAdd = () =>{
    setAddUser(!addUser)
  }

  const getUser = (userid) => {
    let x = {}
    users.forEach(user => {
      if(user.userid === userid){
        x = user
      }
    });

    return x
  }

  const deleteUser = (e) => {
    let userid = e.target.value
    dispatch(removeUser(userid))
    setEdit(false)
  }

  const renderUserView = () =>{
    if(editUser){
      return( 
        <>
        <EditUser user = {getUser(userId)} deleteUser={deleteUser}/> 
        <button onClick={onClick}>Back</button>
        </>
      )
    }

    else if(addUser){
      return (
        <AddUser onAdd={onAdd} ></AddUser>
      )
    }

    else{
      return <UserList users = {users} onClick={editClick}/>
    }
  }

  return (
    <div className={style.container}>
      {renderUserView()}
      <button onClick={onAdd}>Add User</button>
    </div>
  )
}

const mapStateToProps = (state) => {
  return state.userManage
}

export default connect(mapStateToProps)(Users);