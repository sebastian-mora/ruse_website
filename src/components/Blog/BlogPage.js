import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import style from './BlogPage.module.css'

import { useParams } from "react-router-dom";

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { cb } from 'react-syntax-highlighter/dist/esm/styles/prism';


import { getBlogBySlug } from '../../api/blogsApi';


const BlogPage = () => {

  const [blog, setBlog] = useState();
  const [errMessage, setError] = useState("")

  // pull slug from route
  let { slug } = useParams();

  useEffect(() => {
    getBlogBySlug(slug)
      .then((result) => {
        setBlog(result.data)
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setError("Blog not Found")
        }
      })
  }, [slug])

  const Noderender = {


    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <SyntaxHighlighter
          children={String(children).replace(/\n$/, '')}
          style={cb}
          language={match[1]}
          PreTag="div"
          {...props}
        />
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },

    img({ node, inline, className, children, ...props }) {
      console.log(props.src)
      return (
        <a href={props.src} target="_blank" rel="noreferrer" ><img alt="" src={props.src} /></a>
      )
    }

  }


  return (
    <div>

      {blog &&
        <>
          <Helmet>
            <title>{blog.metadata.title}</title>
            <meta name="description" content={blog.metadata.title} />
            <meta name="keywords" content={blog.metadata.tags} />
            <link rel="canonical" href={window.location.href} />
          </Helmet>
          <div className={style.titleContainer}>
            <div className={style.title}><h1>{blog.metadata.title}</h1></div>
            <div className={style.date}>{blog.metadata.datePosted}</div>
          </div>
          <ReactMarkdown
            children={blog.blog}
            components={Noderender}
            className={style.post}
            remarkPlugins={[remarkGfm]}
          />
        </>
      }

      <div className={style.title}><h1>{errMessage}</h1></div>

    </div>
  )
}

export default BlogPage;
