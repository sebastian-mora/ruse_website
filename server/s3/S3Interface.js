const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const s3_path = 'blogs/'
const blog_filename = 'index.md'


uploadBlogFile = (id, post) => {

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${s3_path}${id}/` + blog_filename,
    Body: post
  }
  return new Promise((resolve, reject) =>{ 
    s3.upload(params, function(err, data) {
      if(err) { 
        console.err(err)
        reject()
      }
      resolve(data.Location)
    })
  })

}


deleteBlogFile = (id) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${s3_path}${id}/` + blog_filename
  }
  return new Promise((resolve, reject) =>{ 
    s3.deleteObject(params, function(err, data) {
      if(err) { 
        console.err(err)
        reject()
      }
    })
    resolve()
  })
}



module.exports = {
  uploadBlogFile,
  deleteBlogFile
}



