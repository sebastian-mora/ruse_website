var pool  = require('../database/database')

function getAllBlogs(isAdmin=false){
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.

    var query_str = 'select blogs.title, blogs.id, blogs.post, blogs.date, blogs.views, c1.name category from blogs left join catagories c1 on (blogs.category=c1.id) WHERE isPosted=true'

    //select title,id,post,date,views, c1.name catagory from blogs left join catagories c1 on (blogs.category_id=c1.id);


    if(isAdmin){
      var query_str = 'select blogs.title, blogs.id, blogs.post, blogs.date, blogs.views, c1.name category from blogs left join catagories c1 on (blogs.category=c1.id)'
    }

    pool.query(query_str, function (err, rows) {
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
    pool.query('select blogs.title, blogs.id, blogs.post, blogs.date, blogs.views, c1.name category from blogs left join catagories c1 on (blogs.category=c1.id) WHERE id=? AND isPosted=true', id, function (err, rows) {
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

    pool.query('UPDATE blogs SET ? WHERE id=?', [{title,date,post,isPosted,category}=blog, blog.id] , (err)=>{
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