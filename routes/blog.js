var express = require('express')
var router = express.Router()


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

// create a GET route
router.get('/', (req, res) => {
  console.log("CALLED BLOG");
  res.send(data);
});



router.get('/:id', (req, res) =>{

  const id = req.params.id;

  console.log(id);
    console.log("CALLED BLOG post");

  blog = {
    "title": "Blog title",
    "date": "4/18/20",
    "post": "This is my first blog"
  }

  //lookup hash in
  //return the blog HTML

  res.send(blog)
});





module.exports = router;
