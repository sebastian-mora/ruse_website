import React, {useEffect, useState} from 'react';
import style from './style.module.css'

import {getUsers, deleteUser} from '../../../../api/adminApi'

const EditUsers = () => {


  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    getUsers().then(res => {
      setUsers(res);  
    })
    .catch(err => {
      console.log(err);
    });
  }, []);

  const deleteClick = (e) =>{
    console.log(e);
    deleteUser(e.target.value)
  }

  return (
    <div className={style.container}>
      <table className={style.userTable}>
        <thead>
          <tr>
            <th>username</th>
            <th>Email</th>
            <th>Date Created</th>
            <td>Delete</td>
          </tr>
        </thead>

        <tbody>
          {users.map(({userid, username, create_time }) =>{
            return( 
              <tr key={userid}>
                <td>{username}</td>
                <td>abc</td>
                <td>{create_time}</td>
                <td><button value={userid} onClick={deleteClick}>X</button></td>
              </tr>
            )
          })}
        </tbody>


      </table>

    </div>
  )
}

export default EditUsers;