var pool  = require('../database/database');


function getAllUsers(){
  return new Promise((resolve, reject) => {
    pool.query('SELECT userid, username, isActive, create_time from website.users', (err, rows) => {
      if(err){ reject(err) }
      resolve(rows)
    })
  })
}

function deleteUser(userid){
  return new Promise((resolve, reject) =>{
    if(!userid){reject()}
    userid = Number(userid)
    pool.query('DELETE FROM users WHERE userid=?', userid ,(err, rows) =>{
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

// THIS COULD LEAD TO IDOR but this route is only for admin so it
//  should be okay
function changePassword(userid){
  return new Promise((resolve, reject) =>{ 
    if(!userid){reject()}
    pool.query('UPDATE users SET pw_hash=? WHERE userid=?', [pw_hash, userid], (err, rows) =>{ 
      if(err){reject(err)}
      resolve(rows)
    })
  })
}


module.exports = {
  getAllUsers,
  deleteUser, 
  changePassword,
  addUser
}