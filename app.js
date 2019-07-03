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

app.get('/', function (req, res) {
    res.render('pages/index')
})

app.get('/about', function (req, res) {
    res.render('pages/about')
})

app.get('/blog', function (req, res) {
    res.render('pages/blog')
})


// Create an HTTP service.
http.createServer(app).listen(8080);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(8443);
console.log("Started the servers");
console.log(options.cert);
