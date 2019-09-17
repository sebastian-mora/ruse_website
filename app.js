var express = require('express')
const https = require('https');
const http = require('http');
const fs = require('fs');
var app = express()
var path = require('path')

app.set('view engine', 'ejs')
app.use('/public', express.static('public'))


//expose to renew certs
//app.use(express.static(__dirname, { dotfiles: 'allow' } ));


const options = {
    cert: fs.readFileSync('./sslcert/fullchain.pem'),
    key: fs.readFileSync('./sslcert/privkey.pem')
};

app.use (function (req, res, next) {
        if (req.secure) {
                // request was via https, so do no special handling
                next();
        } else {
                // request was via http, so redirect to https
                res.redirect('https://' + req.headers.host + req.url);
        }      
});


app.get('/', function (req, res) {
    res.render('pages/main/index')
})

app.get('/about', function (req, res) {
    res.render('pages/main/about')
})

app.get('/blog', function (req, res) {
    res.render('pages/main/blog')
})

app.get('/blog/:path/:id' , function (req, res) {
      res.render('pages/blogs/'+ req.params.path+ '/' + req.params.id)
})

app.get('*' , function (req, res) {
    res.status(404).render('pages/main/404')
})

// global error handler
app.use(function(err, req, res, next) {
    console.dir(err);

    if(err) {
        // Your Error Status code and message here.
        res.status(404).render('pages/main/404')
    }

    // Send Some valid Response
});
// Create an HTTP service.
http.createServer(app).listen(8080);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(8443);
console.log("Started the servers");
