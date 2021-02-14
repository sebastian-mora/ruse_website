import React, { useState, useEffect } from 'react';

import ReactMarkdown from 'react-markdown'

import style from './BlogPage.module.css'

import {getBlogBySlug} from '../../api/blogsApi';

import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {materialDark} from 'react-syntax-highlighter/dist/esm/styles/prism'



const BlogPage = (props) => {

  const [blog, setBlog] = useState();
  const [errMessage, setError] = useState("")
  const slug = props.match.params.slug;

  useEffect(() => {
    getBlogBySlug(slug)
      .then((result) => {
        setBlog(result.data)
      })
      .catch((err) =>{
        if(err.response.status === 404){
          setError("Blog not Found")
        }
      })
  }, [slug])
  
  const renderers = {
    code: ({language, value}) => {
      return <SyntaxHighlighter style={materialDark} language={language} children={value} />
    }
  }

  return(
    <div>

      {blog &&
        <>
          <div className={style.title}><h1>{blog.metadata.title}</h1></div>

          <div className={style.date}>{blog.metadata.date}</div>

          <ReactMarkdown className= {style.post} renderers={renderers} >{blog.blog}</ReactMarkdown>
        </>
        }

      <div className={style.title}><h1>{errMessage}</h1></div>

    </div>
  )
}

export default BlogPage;
