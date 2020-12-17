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


getBlogFileContents = (id) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${s3_path}${id}/` + blog_filename
  }

  

  return new Promise((resolve, reject) => {
    s3.getObject(params, (err, data) =>{ 
      
      if(err){
        reject(err)
      }

      if(data.Body){
        resolve(data.Body.toString())
      }

      reject()
      
    })
  })
}


module.exports = {
  uploadBlogFile,
  deleteBlogFile,
  getBlogFileContents
}



