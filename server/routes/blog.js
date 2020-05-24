var express = require('express')
var router = express.Router()

const verifyToken = require('./middleware/Auth')
const {getAllBlogs, getBlogByID, addBlog}  = require('../database/blogInterface')

router.use(express.json())


// create a GET route
router.get('/', async (req, res) => {

  getAllBlogs() 
  .then( (results) => {
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

  const {title, date, post} = req.body;

  const blog = {
    title,
    date,
    post
  }

  addBlog(blog).then( () =>{
    res.send(200)
  })
  
});

router.post('/update',verifyToken ,(req,res) =>{

  const {title, date, post} = req.body;

  const blog = {
    title,
    date,
    post
  }

  addBlog(blog).then(()=>{
    res.sendStatus(200);
  })
  .err((err) =>{
    console.log(err);
    res.send(500)
  })


});



module.exports = router;
