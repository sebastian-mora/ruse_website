import React from 'react';
import style from './UserList.module.css'

const UserList = ({users, onClick}) => {
  if(!users){
    users = []
  }
  return (
    <div className={style.container}>

      <table className={style.userTable}>
        <thead>
          <tr>
            <th>username</th>
            <th>Email</th>
            <th>Date Created</th>
            <td>Edit</td>
          </tr>
        </thead>

        <tbody>
          {users.map(({userid, username, create_time }) =>{
            return( 
              <tr key={userid}>
                <td>{username}</td>
                <td>abc</td>
                <td>{create_time}</td>
                <td><button onClick={onClick} value={userid}>...</button></td>
              </tr>
            )
          })}
        </tbody>
      </table>

    </div>
  )
}

export default UserList;