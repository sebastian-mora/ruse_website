import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import {getAllBlogs} from '../../api/blogsApi';
import style from './Blog.module.css'




const Blog = () => {

  // store the blogs from the api in blogs
  const [blogs, setBlogs] = useState([]);

 
  useEffect(() => {
    getAllBlogs()
      .then(res => {
        setBlogs(res.data)
      })
  }, []);


  

  return (
    <div className={style.center}>

      <h1 className={style.pageTitle}>Blogs:</h1>
  
      <ul className={style.root}>
        {blogs.map(blog => {
          return <Link key={blog} to={`blogs/${blog}`}><li className={style.post}>{blog}</li></Link>
        })}
      </ul>
    </div>
  )
}

export default Blog;
