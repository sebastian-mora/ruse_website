const express = require('express')
const router = express.Router()
const db = require('../database/database')
const jwt = require('jsonwebtoken');
const verifyToken = require('./middleware/Auth')


router.use(express.json())

const checkToken = async (token) =>{
  // const authHeader = req.headers.authorization;

  if (true) {
      // const token = authHeader.split(' ')[1];
      console.log(token);
      
      jwt.verify(token, "accessTokenSecret", (err) => {
          if (err) {
              console.log(err);
              return false
          }

          return true;
          
      });
  } 
}

router.post('/',  (req, res) =>{

  const username = req.body.username
  const password = req.body.password
  
  if (username && password){
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
      
        if (results.length > 0){
          const accessToken = jwt.sign({username}, 'accessTokenSecret', {expiresIn: '1h'});
          res.json({
              status: true,
              accessToken
          });
        } 
        else {
          res.send("Wrong username or password")
        }
        res.end()
    });
  }
  else{
    res.send("No add data provided")
    res.end();
  }
});


router.post('/check', verifyToken, (req, res) =>{

  res.json(res.authData.username)

});


module.exports = router;