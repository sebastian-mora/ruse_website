const express = require('express')
const router = express.Router()
const verifyToken = require('./middleware/Auth')

router.use(verifyToken)

router.get('/', (req, res) =>{
  res.sendStatus(200).statusMessage("Authd");
})


module.exports = router;
