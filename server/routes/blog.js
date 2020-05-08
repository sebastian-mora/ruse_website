var express = require('express')
var router = express.Router()
var db  = require('../database/database')
const verifyToken = require('./middleware/Auth')

router.use(express.json())

const sanitize_hash = (input) =>{
  return input.replace('\b[A-Fa-f0-9]{64}\b', '')
}



function getAllBlogs(){
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.


    var query_str = 'SELECT * FROM  blogs'

    db.query(query_str, function (err, rows, fields) {
        // Call reject on error states,
        // call resolve with results
        if (err) {
            return reject(err);
        }
        resolve(rows);
    });
  }); 
}

function getBlogByID(id){
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.


    var query_str = `SELECT * FROM  blogs WHERE id=${id}`

    db.query(query_str, function (err, rows, fields) {
        // Call reject on error states,
        // call resolve with results
        if (err) {
            return reject(err);
        }
        resolve(rows);
    });
  }); 
}


function addBlog(blog){
  return new Promise((resolve, reject) => {
    var query_str = `INSERT INTO blogs (title, date_created, post) VALUES('${blog.title}', '1/1/1', '${blog.post}');`

    db.query(query_str, (err)=>{
      if(err)
        return reject(err);
      
      resolve();
    })
  })
}



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


router.post('/create', verifyToken, (req,res) =>{

  const title = req.body.blog.title
  const date = req.body.blog.date
  const post = req.body.blog.post

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
