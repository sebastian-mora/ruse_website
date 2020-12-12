var express = require('express')
var router = express.Router()

const verifyToken = require('../middleware/Auth')
const {getAllBlogs, getBlogByID, getCategories, addBlog, updateBlog, deleteBlog}  = require('../../database/blogInterface')
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const {uploadBlogFile, deleteBlogFile} = require('../../s3/S3Interface')



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


  getBlogByID(id)
  .then( (results) => {

    // check out why this uses a zero
    res.send(results[0])
  })
  .catch((err) => {
    console.log(err);
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
  let id = uuidv4();
  var postURL;   
  
  uploadBlogFile(id, post).then((url) => {
    postURL = url;

    addBlog({id, title, postURL, date, category, isPosted}).then( () =>{
      res.sendStatus(200)
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("Missing some data")
    });
  });
  
});

router.post('/update',verifyToken ,(req,res) =>{

  const id  = req.body.id;
  const post  = req.body.post;
  var postURL;  

  // Update the blog file
  uploadBlogFile(id, post).then((url) => {
    var postURL = url;

    // Update the database metadata
    updateBlog(req.body).then(()=>{
      res.sendStatus(200);
    }).catch( (err) => {
      console.log(err);
      res.sendStatus(500)
    })

  })


});

router.post('/delete', verifyToken, (req, res) => {

  const id = req.body.id;
  
  deleteBlog(id).then(() =>{
    res.sendStatus(200);
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500);
  })
});


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
