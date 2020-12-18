var express = require('express')
var router = express.Router()

const verifyToken = require('../middleware/Auth')
const {getAllBlogs, getBlogByID, getCategories, addBlog, updateBlog, deleteBlog}  = require('../../database/blogInterface')
const jwt = require('jsonwebtoken');


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

  addBlog(req.body).then( () =>{
    res.sendStatus(200)
  })
  .catch((err) => {
    console.log(err);
    res.status(400).send("Missing some data")
  });
  
});

router.post('/update',verifyToken ,(req,res) =>{
  console.log(req.body);
  updateBlog(req.body).then(()=>{
    res.sendStatus(200);
  }).catch( (err) => {
    console.log(err);
    res.sendStatus(500)
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
