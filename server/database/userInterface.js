var pool  = require('../database/database');


function getAllUsers(){
  return new Promise((resolve, reject) => {
    pool.query('SELECT userid, username, isActive, create_time from website.users', (err, rows) => {
      if(err){ reject(err) }
      resolve(rows)
    })
  })
}

function deleteUser(user_id){
  return new Promise((resolve, reject) =>{
    if(!user_id){reject()}
    user_id = Number(user_id)
    pool.query('DELETE FROM users WHERE userid=?', user_id ,(err, rows) =>{
      if(err){reject(err)}
      resolve(rows)
    })
  })
}

function addUser(user_data){
  return new Promise((resolve, reject) =>{
    if(!user_data){reject()}
    pool.query('INSERT INTO users SET ?', user_data ,(err, rows) =>{
      if(err){reject(err)}
      resolve(rows)
    })
  })
}


module.exports = {
  getAllUsers,
  deleteUser, 
  addUser
}