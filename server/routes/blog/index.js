var express = require('express')
var router = express.Router()

const verifyToken = require('../middleware/Auth')
const {getAllBlogs, getBlogByID, getCategories, addBlog, updateBlog, deleteBlog}  = require('../../database/blogInterface')
const jwt = require('jsonwebtoken');
const uuid = require('short-uuid');

const {uploadBlogFile, deleteBlogFile, getBlogFileContents} = require('../../s3/S3Interface')


//TODO: Add input validation on body params. 
//      Input is only submited and edited by admin risk is reduced but not great


// create a GET route
router.get('/', async (req, res) => {

  // Get auth header value
  const bearerHeader = req.headers['fuckyou-key'];
  var isAdmin  = checkJwt(bearerHeader)

  getAllBlogs(isAdmin) 
  .then( (results) => {
    // Convert DateTime to Date for HTML
    // Convert 1/0 to boolean
    results.map((blog) =>{
      blog.date = blog.date.getFullYear() + '-' + ('0' + ( blog.date.getMonth()+1)).slice(-2) + '-' + ('0' +  blog.date.getDate()).slice(-2);
      
      if(blog.isPosted != null){
        blog.isPosted = Boolean(blog.isPosted)     
      }
    })
    res.send(results)
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500)
  })

});


router.get('/categories', (req, res) => {
  getCategories().then( (result) => {
    res.send(result)
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500)
  })
});


router.get('/:id', (req, res) =>{

  const id = req.params.id;

  // Get blog metadata from DB 
  getBlogByID(id)
    .then( (results) => {

      if(results.length <= 0){
        res.sendStatus(404)
        return
      }
      
      var {id, title, date, views, category} = results[0];

      // convert time stamp to date string 
      date = date.toDateString()
      
      
      getBlogFileContents(id).then((post) => { 
        res.send({id, title, date, views, category, post})
      })
      
      // If s3 fetch fails 
      .catch((err) => {
        
        if (err.code == 'NoSuchKey') {
          
          res.sendStatus(404)
        }
        else {
          console.error(err);
          res.sendStatus(500)
        }   
      })
    })

    // If get Blog meta fails
    .catch((err) => {
      
      console.error(err);
      res.sendStatus(500)
    })

});


router.post('/create', verifyToken, (req,res) =>{

  const post = req.body.post;
  const title = req.body.title;
  const date = req.body.date;
  const category = req.body.category;
  const isPosted = req.body.isPosted;

  if(!post){
    res.sendStatus(400)
  }

  // Upload file to s3 bucket
  let id = uuid.generate();
  var postURL;   
  
  uploadBlogFile(id, post).then((url) => {
    postURL = url;

    addBlog({id, title, postURL, date, category, isPosted}).then( () =>{
      res.sendStatus(200)
    })
    .catch((err) => {
      res.status(400).send("Missing some data")
    });
  });
  
});

router.post('/update', verifyToken, (req,res) =>{

  const id  = req.body.id;
  const post  = req.body.post;
 
  // Update the blog file
  uploadBlogFile(id, post).then((url) => {

    // TODO: Fix this code here
    
    const blog = {
      id: req.body.id,
      title: req.body.title,
      date: req.body.date,
      category: req.body.category,
      isPosted: req.body.isPosted
    }


    // Update the database metadata
    updateBlog(blog).then(()=>{
      res.sendStatus(200);
    }).catch( (err) => {
      console.log(err);
      res.sendStatus(500)
    })
  })
});

router.post('/delete', verifyToken, (req, res) => {

  const id = req.body.id;
  
  // Delete blog meta data
  deleteBlog(id).then(() =>{

    // Delete from s3
    deleteBlogFile(id).then(() =>{
      res.sendStatus(200);
    })
    .catch((err) => {
      res.sendStatus(500);
    })
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  })
});

// TODO: Is this needed here? 
function checkJwt(token){
  
  return jwt.verify(token, process.env.JWT_SECERT, (err, data) => {
    
    if (err){
      
      return false
    }
    else {
      return true
    }
  })
}



module.exports = router;
