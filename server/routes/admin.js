const express = require('express')
const router = express.Router()
const verifyToken = require('./middleware/Auth')

router.use(verifyToken)

router.get('/',  (req, res) =>{
  res.send("Welcome Admin")
})


module.exports = router;
