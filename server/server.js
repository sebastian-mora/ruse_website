const express = require('express');
var cors = require('cors');
const rateLimit = require("express-rate-limit");
const path = require('path');

//set up CORS whitelist
var whitelist = ['http://localhost:3000']
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
const port = process.env.PORT || 5000;



// add CORS
app.use(cors(corsOptionsDelegate));
//  apply ratelimit to all requests
app.use(limiter);

//routes
const blog = require('./routes/blog.js')
const login = require('./routes/login.js')
const admin = require('./routes/admin.js')
const api = require('./routes/api.js')
app.use('/blog', blog)
app.use('/login', login)
app.use('/admin', admin)
app.use('/api', api)


app.use(express.static(path.join(__dirname, '../', 'client', 'build')));

// Handles any requests that don't match the ones above
app.get('/*', (req,res) =>{
  console.log("CALLE");
  res.sendFile(path.join(__dirname, '../', 'client', 'build', 'index.html'));
});




// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
