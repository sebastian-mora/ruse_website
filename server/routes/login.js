const express = require('express')
const router = express.Router()
const db = require('../database/database')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


router.use(express.json())



router.post('/',  (req, res) =>{

  const username = req.body.username
  const password = req.body.password
  
  if (username && password){

    // Get password hash from DB
    db.query('SELECT pw_hash FROM users WHERE username = ?', [username], function(err, results) {

        if(err){
          console.log(err);
          res.send(401)
        }

        // Prob not the best way to do this 
        const pw_hash = results[0].pw_hash;
        
        // Compare the hash vs plain text 
        bcrypt.compare(password, pw_hash, function(err, isMatch) {
       
          if (err) 
          {
            throw err
          } 
          
          else if (!isMatch) 
          {
            res.status(401).send("Wrong username or password")
          } 
          
          // If is correct generate and send a JWT
          else 
          {
            const accessToken = jwt.sign({results}, 'accessTokenSecret', {expiresIn: '1h'});
            res.json({
                status: true,
                username: username,
                login_time: Date.now(),
                accessToken
            });
          }
        }) 
    });
  }

  else
  {
    res.status(401).send("No info provided")
    res.end();
  }
  
});

module.exports = router;