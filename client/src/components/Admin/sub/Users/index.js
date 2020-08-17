import React, {useState, useEffect} from 'react';
import {getUsers} from '../../../../api/adminApi'

import style from './style.module.css'

import UserList from './UserList';
import EditUser from './EditUser';

const Users = () => {

  const [editUser, setEdit] = useState(false);
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

  const getUser = (user_id) => {
    let x = {}
    users.forEach(user => {
      if(user.userid === user_id){
        x = user
      }
    });

    return x
  }

  const renderUserView = () =>{
    if(editUser){
      return( 
        <>
        <EditUser user = {getUser(userId)}/> 
        <button onClick={onClick}>Back</button>
        </>
      )
    }

    else{
      return <UserList users = {users} onClick={editClick}/>
    }
  }

  return (
    <div className={style.container}>
      {renderUserView()}

    </div>
  )
}

export default Users;