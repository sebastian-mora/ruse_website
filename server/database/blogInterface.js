var pool  = require('../database/database');


function getAllBlogs(isAdmin=false){
  return new Promise(function(resolve, reject) {
    // The Promise constructor should catch any errors thrown on
    // this tick. Alternately, try/catch and reject(err) on catch.

    var query_str = 'select blogs.title, blogs.id, blogs.post, blogs.date, blogs.views, c1.name category from blogs left join categories c1 on (blogs.category=c1.id) WHERE isPosted=true'

    //select title,id,post,date,views, c1.name catagory from blogs left join catagories c1 on (blogs.category_id=c1.id);


    if(isAdmin){
      var query_str = 'select blogs.title, blogs.id, blogs.post, blogs.isPosted, blogs.date, blogs.views, c1.name category from blogs left join categories c1 on (blogs.category=c1.id)'
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

function getCategories(){
  return new Promise((resolve, reject) => {
    pool.query('SELECT name from categories', (err, rows) => {
      if(err){ reject(err) }
      rows = rows.map( (row) => {return row.name})
      resolve(rows)
    })
  })
}

function getBlogByID(id){
  return new Promise(function(resolve, reject) {
    pool.query('select blogs.title, blogs.id, blogs.post, blogs.date, blogs.views, c1.name category from blogs left join categories c1 on (blogs.category=c1.id) WHERE blogs.id=? AND isPosted=true', id, function (err, rows) {
        if (err) {
            return reject(err);
        }
        resolve(rows);
    });
  }); 
}


function addBlog(blog){
  
  return new Promise((resolve, reject) =>

  find_or_create_category(blog.category).then((result)=>{
    let category_id = result[0].id

    blog = {...blog,
      category: category_id
    }
    delete blog.id

    pool.query('INSERT INTO blogs SET ?', blog, (err) =>{
      if(err){
        return reject(err)
      }
      resolve()
    })
  }))
    
}




function updateBlog(blog)
{
  return new Promise((resolve, reject) => {

    find_or_create_category(blog.category).then((result)=>{
      let category_id = result[0].id

      console.log(category_id);

      blog = {...blog,
        category: category_id
      }

      pool.query('UPDATE blogs SET ? WHERE id=?', [{title,date,post,isPosted,category_id}=blog, blog.id] , (err)=>{
        if(err)
          return reject(err);
        resolve();
    })

    })
    .catch((err) => {
      console.log(err);
      reject()
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


function find_or_create_category(category_name){
  return new Promise((resolve, reject) =>{ 
    console.log(category_name);
    pool.query('INSERT IGNORE INTO categories SET name=? ', category_name, (err)=>{
      if(err)
        reject()
      pool.query('SELECT id from categories WHERE name=?', category_name, (err, rows) => {
        resolve(rows)
      })
    })
  })
}

module.exports = {
  addBlog,
  getAllBlogs,
  getBlogByID,
  getCategories,
  updateBlog,
  deleteBlog
}