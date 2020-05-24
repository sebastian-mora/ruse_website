var db  = require('../database/database')

function getAllBlogs(){
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.


    var query_str = 'SELECT * FROM  blogs WHERE isPosted=1'

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


    var query_str = `SELECT * FROM  blogs WHERE id=${id} AND isPosted=1`

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

module.exports = {
  addBlog,
  getAllBlogs,
  getBlogByID
}