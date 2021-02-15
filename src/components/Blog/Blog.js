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
        res.data.sort((a, b) => {
          return  convertStringToDate(b.metadata.datePosted) - convertStringToDate(a.metadata.datePosted) 
        })
        setBlogs(res.data)
      })
  }, []);


  // DATE FORMAT IS MM/DD/YYYY
  const convertStringToDate = (dateString) => {
    const date  = dateString.split('/')
    return new Date(date[2], date[0], date[1])
  }

  return (
    <div className={style.center}>

      <h1 className={style.pageTitle}>Blogs:</h1>
  
      <ul className={style.root}>

        {blogs.map((blog, index) => {
          return( 
                <div className={style.linkContainer}> 
                  <Link key={index} to={`blogs/${blog.path}`}> <li className={style.link}>{blog.metadata.title}</li></Link>
                  <p className={style.postDate}>Date: {blog.metadata.datePosted}</p>
                  <p>Tags: {blog.metadata.tags.join(', ')}</p>
                </div>
          ) 
        })}
        
      </ul>
    </div>
  )
}

export default Blog;
