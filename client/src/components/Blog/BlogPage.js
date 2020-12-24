import React, { useState, useEffect } from 'react';

import ReactMarkdown from 'react-markdown'

import style from './BlogPage.module.css'

import {getBlog} from '../../api/blogsApi';



const BlogPage = (props) => {

  const [blog, setBlog] = useState({});
  const [errMessage, setError] = useState("")
  const id = props.match.params.id;

  useEffect(() => {

    getBlog(id)
      .then((result) => {
        setBlog(result.data)
        setError("")
      })
      .catch((err) =>{
        if(err.response.status === 404){
          setError("Blog not Found")
        }
      })
  }, [id])
  
  return(
    <div>
      {blog &&
        <>
          <div className={style.title}><h1>{blog.title}</h1></div>

          <div className={style.date}>{blog.date}</div>

          <ReactMarkdown className= {style.post} >{blog.post}</ReactMarkdown>
        </>
        }

      <div className={style.title}><h1>{errMessage}</h1></div>

    </div>
  )
}

export default BlogPage;
