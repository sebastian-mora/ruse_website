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

    console.log("before");
    


    jwt.verify(req.token, 'accessTokenSecret', (err, authData) => {
      if (err){
        res.sendStatus(403);
      }
      else {
        res.authData = authData
        next();
      }
    })


    // Next middleware
    
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

module.exports = verifyToken;
