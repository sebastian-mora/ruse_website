const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');
const cors = require('cors');
const rateLimit = require("express-rate-limit");
const path = require('path');
require('custom-env').env()

//set up CORS whitelist
var whitelist = [process.env.CORS]
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}


//set up ratelimit
const limiter = rateLimit({
  windowMs: 15*60*1000, //15 mins
  max: 100 // limit each IP to 100 requests per windowMs
})


const app = express();
const http_port = process.env.HTTP_PORT || 8080;
const https_port = process.env.HTTPS_PORT || 8080


// add CORS
app.use(cors(corsOptionsDelegate));
//  apply ratelimit to all requests
app.use(limiter);

// certbot 
// app.use(express.static(__dirname, { dotfiles: 'allow' } ));

//routes
const blog = require('./routes/blog')
const login = require('./routes/login.js')
const admin = require('./routes/admin')
const api = require('./routes/api.js')
app.use('/blog', blog)
app.use('/login', login)
app.use('/admin', admin)
app.use('/api', api)


// Starting both http & https servers
const httpServer = http.createServer(app);

var env = process.env.NODE_ENV || 'development';


if(env == "prod"){
  // Load certs
  const privateKey = fs.readFileSync(process.env.PRIVATE_KEY, 'utf8');
  const certificate = fs.readFileSync(process.env.CERT, 'utf8');
  const ca = fs.readFileSync(process.env.CA, 'utf8');

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };

  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(https_port, () => {
    console.log(`HTTPS Server running on port ${https_port}`);
  });

}


httpServer.listen(http_port, () => {
	console.log(`HTTP Server on port ${http_port}`)
});

