const jwt = require('jsonwebtoken');

// Verify Token
function verifyToken(req, res, next) {

  
  // Get auth header value
  const bearerHeader = req.headers['fuckyou-key'];

  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {

    jwt.verify(bearerHeader, 'accessTokenSecret', (err, authData) => {
      if (err){        
        res.send(403);
      }
      else {
        res.authData = authData
        console.log("Token validated");
        next();
      }
    })


    // Next middleware
    
  } else {
    // Forbidden
    res.send(403);
  }
}

module.exports = verifyToken;
