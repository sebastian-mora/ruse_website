var express = require('express')
var router = express.Router()

var bodyParser = require('body-parser');
// for parsing application/json
router.use(bodyParser.json());

router.use(bodyParser.urlencoded({ extended: true }));


router.get('/', function (req, res){
    res.render('../views/pages/blogs/general/labxss.ejs', {welcome: "Welcome to the XSS Lab!"})
})


router.post('/challenge1', function (req, res) {
  res.render('../views/pages/blogs/general/labxss.ejs', {welcome: req.body.welcome})
})


router.post('/challenge3', function (req, res) {

  var text = req.body.chal3

  text = text.replace(/script/i ,'');
  text = text.replace(/script/i ,'');
  text = text.replace(/script/i ,'');
  text = text.replace(/script/i ,'');
  text = text.replace(/script/i ,'');
  text = text.replace(/alert/i, 'Im_A_HaX0r')

  res.render('../views/pages/blogs/general/labxss.ejs', {chal3: text})
})

module.exports = router;
