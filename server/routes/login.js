const express = require('express')
const router = express.Router()
const db = require('../database/database')
const jwt = require('jsonwebtoken');
const verifyToken = require('./middleware/Auth')
var cookieParser = require('cookie-parser');


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
    db.query('SELECT userid FROM accounts WHERE email = ? AND password = ?', [username, password], function(err, results, fields) {

        if(err){
          console.log(err);
          res.send(401)
        }
        
        if (results.length > 0){
          const accessToken = jwt.sign({results}, 'accessTokenSecret', {expiresIn: '1h'});
          res.json({
              status: true,
              accessToken
          });
          
        } 
        else {
          res.status(401).send("Wrong username or password")
        }
        res.end()
    });
  }
  else{
    res.status(401).send("No info provided")
    res.end();
  }
});


router.post('/check', verifyToken, (req, res) =>{

  res.json(res.authData.username)

});


module.exports = router;