import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import {getBlogs} from '../../api/blogsApi';
import style from './Blog.module.css'




const Blog = () => {

  // store the blogs from the api in blogs
  const [blogs, setBlogs] = useState({});
  const [loadErr, setErr] = useState(false);
  const NEW_POST_THRESHOLD = 30;

 
  useEffect(() => {
      getBlogs().then(res => {
        // When the blogs are loaded sort them into their catagories 
        setBlogs(processCategories(res));  
      })
      .catch(err => {
        setErr(err)
      });
  }, []);


  const processCategories = (blogs) => {

    // The new category is initalized bc it is a constant catagory.
    // Other keys added dynamicly 

    let sortedBlogs = {
      "New":[]
    }
    var current_date = new Date()
    
    // Generate an organized Blogs Object
    blogs.forEach(({category, title, id, date}) => {

      var blog_date = new Date(date)
      var post_delta = (current_date - blog_date)/(1000*60*60*24.0)

      // If the blog is less than 30 days add it to the new category
      if(post_delta <= NEW_POST_THRESHOLD)
      {
        sortedBlogs.New.push({id,title})
      }
  
      // If category does not exist create it and add it
      if (!(category in sortedBlogs))
      {
        sortedBlogs = {...sortedBlogs,
          [category]:[{title,id}]
        }
      }

      // else the catagoie does exist. Add it to the category 
      else 
      {
        sortedBlogs[category].push({id,title})
      }
    })
 
    return sortedBlogs
  }

  return (
    <div className={style.center}>

      <h1>Blogs:</h1>

  
      <ul className={style.root}>

      {/* 
      
        Loop through the sorted blog object keys.
        For each key create a new catagory then iterate over the blogs
        in that catagoire and create a link
      
      */}
      {Object.keys(blogs).map((keyName, i) => (
        <React.Fragment key={keyName}>
          <li>{keyName}</li>
          <ul className={style.sub}> 
            {blogs[keyName].map((blog) => {
              return <Link key={blog.id + i} to={`blog/${blog.id}`}><li>{blog.title}</li></Link>
            })}
          </ul>
        </React.Fragment>
      ))}
      
      {/* If the client fails to load the blogs display this  */}
        {loadErr&& <p>Error Fetching Blogs</p>}

      </ul>
    </div>
  )
}

export default Blog;
