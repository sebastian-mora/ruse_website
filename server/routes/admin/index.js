const express = require('express')
const router = express.Router()
const AWS = require('aws-sdk')

const verifyToken = require('../middleware/Auth')
const s3 = new AWS.S3()

router.use(verifyToken)
router.use('/upload', require('./upload.js'))

router.get('/', (req, res) =>{
  res.status(200)
})


router.get('/authd', (req, res) =>{
  res.sendStatus(200)
})


router.get('/:id/images', (req, res) => {
  let id = req.params.id;
  
  var params = {
    Bucket: process.env.S3_BUCKET,
    Delimiter: '/',
    Prefix: `imgs/${id}/`
  }

  s3.listObjects(params, (err, data) => {
    if(err){
      console.log(err);
      res.sendStatus(500)
    }
    else{
      res.send(processS3Results(data.Contents))
    }
  })
})


function processS3Results(data) {

  return data.map( (file) =>{
    let filename = file.Key.split('/')
    return {filename : filename[filename.length-1], url: 'https://s3-us-west-2.amazonaws.com/ruse.tech/' + file.Key}
  })
  

}


module.exports = router;
