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

  const title = req.body.title
  const date = req.body.date
  const post = req.body.post

  console.log(req.body);
  

  const command = `INSERT INTO blogs (title, date_created, post) VALUES('${title}', '1/1/1', '${post}');`
  db.query(command, (error, results, fields) => {
      if(error){
        console.log(error);
        res.sendStatus(500)
      }

      else{
        console.log(results);
      }
  })

  res.sendStatus(200)
  
});

router.post('/update',verifyToken ,(req,res) =>{

  const title = req.body.blog.title
  const date = req.body.blog.date
  const post = req.body.blog.post

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
