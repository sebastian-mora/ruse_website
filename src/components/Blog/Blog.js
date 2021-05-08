import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import {getAllBlogs} from '../../api/blogsApi';
import style from './Blog.module.css'

import Card from './Card'

const Blog = () => {

  // store the blogs from the api in blogs
  const [blogs, setBlogs] = useState([]);


  useEffect(() => {
    getAllBlogs()
      .then(res => {
        res.data.sort((a, b) => {
          return  convertStringToDate(b.datePosted) - convertStringToDate(a.datePosted) 
        })
        setBlogs(res.data)
      })
  }, []);


  // DATE FORMAT IS MM/DD/YYYY
  const convertStringToDate = (dateString) => {
    const date  = dateString.split('-')
    return new Date(date[2], date[0], date[1])
  }

  return (
    <div className={style.center}>

      <Helmet>
        <title>Blogs</title>
        <meta name="description" content="Ruse.tech blog posts."/>
        <meta name="keywords" content="hacking, blog, security, cloud, pentesting"/>
        <link rel="canonical" href="http://ruse.tech/blogs" />
      </Helmet>

      <h1 className={style.pageTitle}>Blogs</h1>

        <div className={style.pinnedBlogs}>
         
          {// eslint-disable-next-line
            blogs.map((blog, _) => {
              if (blog.pinned)
              return( 
                    <Card blog={blog}></Card>
              )
              
          })}
        </div>
        <div>
          { // eslint-disable-next-line
            blogs.map((blog, _) => {
              if (!blog.pinned)
                return <Card blog={blog}></Card> 
            
            })}
        </div>
    </div>
  )
}

export default Blog;
