const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

//routes
const blog = require('./routes/blog.js')
app.use('/blog', blog)



// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
