import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import style from './BlogPage.module.css'

import ReactMarkdown from 'react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {cb} from 'react-syntax-highlighter/dist/esm/styles/prism'

import {getBlogBySlug} from '../../api/blogsApi';


const BlogPage = (props) => {

  const [blog, setBlog] = useState();
  const [errMessage, setError] = useState("")
  const slug = props.match.params.slug;
  const gfm = require('remark-gfm')

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
      console.log(language);
      return <SyntaxHighlighter style={cb} language={language} children={value} />
    }
  }

  return(
    <div>

      {blog &&
        <>
            <Helmet>
              <title>{blog.metadata.title}</title>
              <meta name="description" content={blog.metadata.title}/>
              <meta name="keywords" content={blog.metadata.tags}/>
              <link rel="canonical" href={window.location.href} />
            </Helmet>
          <div className={style.title}><h1>{blog.metadata.title}</h1></div>

          <div className={style.date}>{blog.metadata.datePosted}</div>

          <ReactMarkdown className={style.post} plugins={[gfm]} renderers={renderers} >{blog.blog}</ReactMarkdown>
        </>
        }

      <div className={style.title}><h1>{errMessage}</h1></div>

    </div>
  )
}

export default BlogPage;
