import React, {useState, useEffect} from 'react';
import {getUsers, deleteUser} from '../../../../api/adminApi'

import style from './style.module.css'

import UserList from './UserList';
import EditUser from './EditUser';
import AddUser from './AddUser'

const Users = () => {

  const [editUser, setEdit] = useState(false);
  const [addUser, setAddUser]  = useState(false);
  const [userId, setuserId] = useState();
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    getUsers().then(res => {
      setUsers(res);  
    })
    .catch(err => {
      console.log(err);
    });
  }, []);


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

  const removeUser = (e) => {
    deleteUser(e.target.value)
    setEdit(false)
  }

  const renderUserView = () =>{
    if(editUser){
      return( 
        <>
        <EditUser user = {getUser(userId)} deleteUser={removeUser}/> 
        <button onClick={onClick}>Back</button>
        </>
      )
    }

    else if(addUser){
      return (
        <AddUser></AddUser>
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

export default Users;