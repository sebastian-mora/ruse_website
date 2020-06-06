const express = require('express')
const router = express.Router()
const db = require('../database/database')
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');


router.use(express.json())

router.post('/',  (req, res) =>{

  const username = req.body.username
  const password = req.body.password
  
  if (username && password){
    db.query('SELECT userid FROM users WHERE email = ? AND password = ?', [username, password], function(err, results, fields) {

        if(err){
          console.log(err);
          res.send(401)
        }
        
        if (results){
          const accessToken = jwt.sign({results}, 'accessTokenSecret', {expiresIn: '1h'});
          res.json({
              status: true,
              username: username,
              login_time: Date.now(),
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

module.exports = router;