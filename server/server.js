const express = require('express');
var cors = require('cors');

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


const app = express();
const port = process.env.PORT || 5000;



// add CORS
app.use(cors(corsOptionsDelegate));

//routes
const blog = require('./routes/blog.js')
const login = require('./routes/login.js')
const admin = require('./routes/admin.js')
const api = require('./routes/api.js')
app.use('/blog', blog)
app.use('/login', login)
app.use('/admin', admin)
app.use('/api', api)





// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
