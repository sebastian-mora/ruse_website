import React, { useState, useEffect } from 'react';

import ReactMarkdown from 'react-markdown'

import style from './BlogPage.module.css'

import {getBlogBySlug} from '../../api/blogsApi';

import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {darcula} from 'react-syntax-highlighter/dist/esm/styles/prism'



const BlogPage = (props) => {

  const [blog, setBlog] = useState({});
  const [errMessage, setError] = useState("")
  const slug = props.match.params.slug;

  useEffect(() => {

    getBlogBySlug(slug)
      .then((result) => {
        setBlog(result.data)
        setError("")
      })
      .catch((err) =>{
        if(err.response.status === 404){
          setError("Blog not Found")
        }
      })
  }, [slug])
  
  const renderers = {
    code: ({language, value}) => {
      return <SyntaxHighlighter style={darcula} language={language} children={value} />
    }
  }


  return(
    <div>
      {blog &&
        <>
          <div className={style.title}><h1>{blog.title}</h1></div>

          <div className={style.date}>{blog.date}</div>

          <ReactMarkdown className= {style.post} renderers={renderers} >{blog.post}</ReactMarkdown>
        </>
        }

      <div className={style.title}><h1>{errMessage}</h1></div>

    </div>
  )
}

export default BlogPage;
