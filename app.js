var express = require('express')
var app = express()
var path = require('path')

app.set('view engine', 'ejs')

app.use('/public', express.static('public'))



app.get('/', function (req, res) {
    res.render('pages/index')
})

app.get('/about', function (req, res) {
    res.render('pages/about')
})

app.get('/blog', function (req, res) {
    res.render('pages/blog')
})



app.listen(3000)
