const express = require('express')
var router = express.Router()

const jwt = require('jsonwebtoken');
const {authenticate_user} = require("../database/authInterface")

router.use(express.json())


router.post('/',  (req, res) =>{

  const username = req.body.username
  const password = req.body.password
  
  if (username && password){

    authenticate_user(username, password).then( (isAuthd) =>{
        if(isAuthd){
          const accessToken = jwt.sign({username}, 'accessTokenSecret', {expiresIn: '1h'});
          res.json({
              status: true,
              username: username,
              login_time: Date.now(),
              accessToken
          });
        }

        else {
          res.status(401).send("Incorrect  username/password")
        }
    })

         
  }

  else
  {
    res.status(401).send("No info provided")
    res.end();
  }


  });

module.exports = router;