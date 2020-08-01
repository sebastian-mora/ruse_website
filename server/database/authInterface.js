var pool  = require('../database/database');
const bcrypt = require('bcrypt');

function authenticate_user(username, password){ 
  
  return new Promise((resolve, reject) => {
    get_pw_hash(username).then( (pw_hash) => {
      bcrypt.compare(password, pw_hash, function(err, isMatch) {
        if(isMatch) resolve(true);
        return resolve(false)
      })
    })
    .catch((err) => {resolve(false)})
  })
}


function get_pw_hash(username){
  return new Promise((resolve, reject) => {
    pool.query('SELECT pw_hash FROM users WHERE username = ?', [username], (err, rows) => {
      if(err){ reject(err) }
     
      if(rows.length > 0){
        resolve(rows[0].pw_hash)
      }
      reject(undefined)
    })
  })
}




module.exports = {
  authenticate_user
}