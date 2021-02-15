import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ReactMarkdown from 'react-markdown'
import style from './BlogPage.module.css'

import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {materialDark} from 'react-syntax-highlighter/dist/esm/styles/prism'

import {getBlogBySlug} from '../../api/blogsApi';

<<<<<<< HEAD:src/components/Blog/BlogPage.js
=======
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {materialDark} from 'react-syntax-highlighter/dist/esm/styles/prism'
>>>>>>> cb9fee3b4e286ed1f248c6217ac64d2c15a1b575:src/components/Blog/BlogPage.js



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
<<<<<<< HEAD:src/components/Blog/BlogPage.js
            <Helmet>
              <title>{blog.metadata.title}</title>
              <meta name="description" content={blog.metadata.title}/>
              <meta name="keywords" content={blog.metadata.tags}/>
              <link rel="canonical" href={window.location.href} />
            </Helmet>
=======
>>>>>>> cb9fee3b4e286ed1f248c6217ac64d2c15a1b575:src/components/Blog/BlogPage.js
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
