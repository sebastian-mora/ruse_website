var express = require('express')
var router = express.Router()

const verifyToken = require('./middleware/Auth')
const {getAllBlogs, getBlogByID, addBlog, updateBlog, deleteBlog}  = require('../database/blogInterface')
const jwt = require('jsonwebtoken');

router.use(express.json())


// create a GET route
router.get('/', async (req, res) => {

  // Get auth header value
  const bearerHeader = req.headers['fuckyou-key'];
  var isAdmin  = false

  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {

    jwt.verify(bearerHeader, 'accessTokenSecret', (err, authData) => {
      if (err){        
        
      }
      else {
        res.authData = authData
        console.log("Token validated");
        isAdmin = true
      }
    })
  }

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


router.post('/create', (req,res) =>{

  const {title, date, post, isPosted} = req.body;

  const blog = {
    title,
    date,
    post, 
    isPosted
  }

  addBlog(blog).then( () =>{
    res.send(200)
  })
  
});

router.post('/update',verifyToken ,(req,res) =>{

  const {id, title, date, post, isPosted} = req.body;

  const blog = {
    id,
    title,
    date,
    post, 
    isPosted
  }

  updateBlog(blog).then(()=>{
    res.sendStatus(200);
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



module.exports = router;
