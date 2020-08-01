const express = require('express')
const router = express.Router()
const verifyToken = require('./middleware/Auth')

router.use(verifyToken)

router.get('/', (req, res) =>{
  res.status(200)
})


router.get('/authd', (req, res) =>{
  res.sendStatus(200)
})


module.exports = router;
