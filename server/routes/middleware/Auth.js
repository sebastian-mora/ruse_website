const jwt = require('jsonwebtoken');

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;

    jwt.verify(req.token, 'accessTokenSecret', (err, authData) => {
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
