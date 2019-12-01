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

router.post('/challenge2', function (req, res) {
  res.render('../views/pages/blogs/general/labxss.ejs', {image: req.body.image})
})

router.post('/challenge3', function (req, res) {
  console.log("HIT");
  console.log(req.body);
  res.render('../views/pages/blogs/general/labxss.ejs', {chal3: req.body.chal3})
})

module.exports = router;
