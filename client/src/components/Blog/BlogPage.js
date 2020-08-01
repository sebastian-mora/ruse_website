import React, { useState, useEffect } from 'react';

import style from './BlogPage.module.css'

import {getBlog} from '../../api/blogsApi';



const BlogPage = (props) => {

  const [blog, setBlog] = useState({});
  const id = props.match.params.id;

  useEffect(() => {

    getBlog(id).then(res => {
      setBlog(res)
      
    })
    .catch(err => { 
    });
  }, [id]);
  
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
