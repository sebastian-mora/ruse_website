var express = require('express')
var router = express.Router()
var db  = require('../database/database')

router.use(express.json())

const sanitize_hash = (input) =>{
  return input.replace('\b[A-Fa-f0-9]{64}\b', '')
}

data = [
  {
    "id": 0,
    "title": "Blog 1"
  },
  {
    "id": 1,
    "title": "Blog 2"
  }

]


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
    console.log(results);
    
    res.send(results[0])
  })
  .catch((err) => {
    console.log(err);
    res.sendStatus(500)
  })

});


router.post('/', (req,res) =>{

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

module.exports = router;
