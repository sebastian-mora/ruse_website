const router = require('express').Router();
const AWS = require('aws-sdk')
const fileUpload = require('express-fileupload');

const s3 = new AWS.S3()
router.use(fileUpload({
}));

// upload/image
router.post('/image', function(req, res) {

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let image_file = req.files.image;
  let blog_id = req.body.blog_id;
  
  // set up s3 upload 

  var params = {
    Body: image_file.data,
    Bucket: process.env.S3_BUCKET,
    Key: `imgs/${blog_id}/` + image_file.name
  }

  s3.putObject(params, function(err, data) {
    if (err){
      console.log(err);
      res.sendStatus(500)
    }
       // an error occurred
    else {
      res.sendStatus(200)
      console.log(data);
    }              
 
  });
});

module.exports = router;
