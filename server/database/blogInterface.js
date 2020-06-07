var db  = require('../database/database')

function getAllBlogs(isAdmin=false){
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.

    var query_str = 'SELECT * FROM  blogs WHERE isPosted=true'

    if(isAdmin){
      var query_str = 'SELECT * FROM  blogs'
    }

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


    var query_str = `SELECT * FROM  blogs WHERE id=${id} AND isPosted=true`

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
  const {title, date, post, isPosted} = blog;
  return new Promise((resolve, reject) => {
    var query_str = `INSERT INTO blogs (title, date, post, isPosted) VALUES('${title}', '${date}', '${post}', '${isPosted}');`

    db.query(query_str, (err)=>{
      if(err)
        return reject(err);
  
      resolve();
    })
  })
}



function updateBlog(blog)
{
  const {id, title, date, post, isPosted} = blog;

  console.log(id, title, date, post, isPosted);
  

  return new Promise((resolve, reject) => {
    var query_str = `UPDATE blogs SET title='${title}', post='${post}', date= '${date}', isPosted=${isPosted} WHERE id=${id};`

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
  getBlogByID,
  updateBlog
}