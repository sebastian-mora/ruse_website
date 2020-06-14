var pool  = require('../database/database')

function getAllBlogs(isAdmin=false){
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.

    var query_str = 'SELECT title,id,post,date,views FROM  blogs WHERE isPosted=true'

    if(isAdmin){
      var query_str = 'SELECT * FROM  blogs'
    }

    pool.query(query_str, function (err, rows, fields) {
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
    pool.query('SELECT title,id,post,date,views FROM  blogs WHERE id=? AND isPosted=true', id, function (err, rows, fields) {
        if (err) {
            return reject(err);
        }
        resolve(rows);
    });
  }); 
}


function addBlog(blog){
  console.log(blog);
  return new Promise((resolve, reject) =>
    pool.query('INSERT INTO blogs SET ?', blog, (err) =>{
      if(err){
        return reject(err)
      }
      resolve()
    }))
}




function updateBlog(blog)
{
  return new Promise((resolve, reject) => {

    pool.query('UPDATE blogs SET ? WHERE id=?', [{title,date,post,isPosted}=blog, blog.id] , (err)=>{
      if(err)
        return reject(err);
  
      resolve();
    })
  })
}


function deleteBlog(id)
{
  return new Promise((resolve, reject) =>{ 
    pool.query('DELETE FROM blogs WHERE id=?', id, (err)=>{
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
  updateBlog,
  deleteBlog
}