const express = require('express');
const http = require('http');
const cors = require('cors');
const rateLimit = require("express-rate-limit");
const bodyParser = require('body-parser');
require('custom-env').env()


const app = express();
const http_port = process.env.HTTP_PORT || 8080;



//set up CORS whitelist
var whitelist = [process.env.CORS]
// var corsOptionsDelegate = function (req, callback) {
//   var corsOptions;
//   if (whitelist.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false } // disable CORS for this request
//   }
//   callback(null, corsOptions) // callback expects two parameters: error and options
// }


//set up ratelimit
const limiter = rateLimit({
  windowMs: 15*60*1000, //15 mins
  max: 100, // limit each IP to 100 requests per windowMs
  headers: false
})


//set up body-parser
app.use(bodyParser.json());


// add CORS
app.use(cors());
//  apply ratelimit to all requests
// app.use(limiter);


//routes
const blog = require('./routes/blog')
const login = require('./routes/login.js')
const admin = require('./routes/admin')
const api = require('./routes/api.js');

app.use('/blog', blog)
app.use('/login', limiter, login)
app.use('/admin',limiter, admin)
app.use('/api',  api)


// Starting both http & https servers
const httpServer = http.createServer(app);

var env = process.env.NODE_ENV || 'development';


httpServer.listen(http_port, () => {
	console.log(`HTTP Server on port ${http_port}`)
});

