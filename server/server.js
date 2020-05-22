const express = require('express');
var session = require('express-session');

const app = express();
const port = process.env.PORT || 5000;

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
