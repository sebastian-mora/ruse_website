import React, { useState, useEffect } from 'react';

import style from './BlogPage.module.css'

import axios from 'axios';



const BlogPage = (props) => {

  const [blog, setBlog] = useState({});
  const id = props.match.params.id;

  useEffect(() => {
    axios
      .get(`/blog/${id}`)
      .then(result => setBlog(result.data));
  }, []);

  console.log(blog);
  
  return(
    <div>
      <div className={style.title}><h1>{blog.title}</h1></div>

      <div className={style.date}>{blog.date}</div>

      <div className={style.post}   dangerouslySetInnerHTML={{__html: blog.post}}>

      </div>

    </div>
  )
}

export default BlogPage;
